/**
 * DB-backed collection store with in-memory Map view.
 *
 * This file exposes the same helper functions used across the codebase
 * (`getCollectionSchemaStore`, `getCollectionItemStore`, `getItemsForCollection`),
 * but the returned Maps are write-through: calling `.set()` or `.delete()` will
 * also persist the changes into the SQLite database (using synchronous
 * `better-sqlite3` `db` instance). This keeps existing API usage unchanged while
 * making collections durable.
 */

export interface CollectionFieldDef {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  accept?: string;
  of?: CollectionFieldDef[];
  fields?: CollectionFieldDef[];
  showInList?: boolean;
}

export interface CollectionSchema {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  fields: CollectionFieldDef[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  id: string;
  collectionSlug: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

type SchemaStore = Map<string, CollectionSchema>;
type ItemStore = Map<string, Map<string, CollectionItem>>;

import db from '../db/client';

/**
 * Returns a Map view of collection schemas loaded from the DB.
 * The returned Map is NOT cached globally; its `.set()`/.delete()` methods
 * are write-through and persist changes immediately to the DB.
 */
export const getCollectionSchemaStore = (): SchemaStore => {
  const store: SchemaStore = new Map();

  try {
    // lazy require to avoid circular imports
    // eslint-disable-next-line @typescript-eslint/no-var-requires

    const exists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
      .get('collections');

    if (exists) {
      const rows = db
        .prepare(
          'SELECT slug, name, icon, description, schema, created_at, updated_at FROM collections',
        )
        .all() as Array<any>;

      for (const r of rows) {
        const parsed = r.schema ? JSON.parse(r.schema) : { fields: [] };
        const item: CollectionSchema = {
          id: r.slug,
          name: r.name || r.slug,
          slug: r.slug,
          icon: r.icon || 'pi pi-list',
          description: r.description || '',
          fields: parsed.fields || [],
          createdAt: r.created_at || new Date().toISOString(),
          updatedAt: r.updated_at || new Date().toISOString(),
        };
        store.set(r.slug, item);
      }

      // override set/delete to persist changes
      const originalSet = store.set.bind(store);
      const originalDelete = store.delete.bind(store);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store as any).set = (slug: string, schema: CollectionSchema) => {
        try {
          const now = new Date().toISOString();
          const existing = db
            .prepare('SELECT created_at FROM collections WHERE slug = ?')
            .get(slug) as { created_at?: string } | undefined;
          const createdAt = existing?.created_at ?? now;
          const schemaJson = JSON.stringify({ fields: schema.fields ?? [] });
          db.prepare(
            `INSERT OR REPLACE INTO collections (slug, name, icon, description, schema, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          ).run(
            slug,
            schema.name || slug,
            schema.icon || '',
            schema.description || '',
            schemaJson,
            createdAt,
            now,
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to persist collection schema:', err);
        }

        return originalSet(slug, schema);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store as any).delete = (slug: string) => {
        try {
          db.prepare('DELETE FROM collections WHERE slug = ?').run(slug);
          db.prepare(
            'DELETE FROM collection_items WHERE collection_slug = ?',
          ).run(slug);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to delete collection schema from DB:', err);
        }

        return originalDelete(slug);
      };
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getCollectionSchemaStore DB error:', err);
  }

  // If DB unavailable or table missing, return an empty store (no global caching)
  return store;
};

/**
 * Returns a Map-of-Maps for collection items loaded from the DB.
 * Each returned per-collection Map has `.set()` and `.delete()` overridden
 * to persist into the `collection_items` table. No global caching is used.
 */
export const getCollectionItemStore = (): ItemStore => {
  const store: ItemStore = new Map();

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires

    const exists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
      .get('collection_items');

    if (exists) {
      const rows = db
        .prepare(
          'SELECT id, collection_slug, data, created_at, updated_at FROM collection_items',
        )
        .all() as Array<any> | undefined;

      if (rows && rows.length > 0) {
        for (const r of rows) {
          if (!store.has(r.collection_slug))
            store.set(r.collection_slug, new Map());
          const map = store.get(r.collection_slug)!;
          map.set(r.id, {
            id: r.id,
            collectionSlug: r.collection_slug,
            data: r.data ? JSON.parse(r.data) : {},
            createdAt: r.created_at || new Date().toISOString(),
            updatedAt: r.updated_at || new Date().toISOString(),
          });
        }
      }

      // Wrap each per-collection map with persisting set/delete
      for (const [collectionSlug, map] of Array.from(store.entries())) {
        const originalSet = map.set.bind(map);
        const originalDelete = map.delete.bind(map);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (map as any).set = (id: string, item: CollectionItem) => {
          try {
            const now = new Date().toISOString();
            const existing = db
              .prepare('SELECT created_at FROM collection_items WHERE id = ?')
              .get(id) as { created_at?: string } | undefined;
            const createdAt = existing?.created_at ?? now;
            const dataStr = JSON.stringify(item.data ?? {});
            db.prepare(
              `INSERT OR REPLACE INTO collection_items (id, collection_slug, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
            ).run(id, collectionSlug, dataStr, createdAt, now);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to persist collection item:', err);
          }

          return originalSet(id, item);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (map as any).delete = (id: string) => {
          try {
            db.prepare('DELETE FROM collection_items WHERE id = ?').run(id);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to delete collection item from DB:', err);
          }

          return originalDelete(id);
        };
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getCollectionItemStore DB error:', err);
  }

  return store;
};

/**
 * Returns a Map of items for a given collection slug (ensuring a persisted map exists).
 */
export const getItemsForCollection = (
  collectionSlug: string,
): Map<string, CollectionItem> => {
  try {
    // use imported `db` from module scope
    const exists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
      .get('collection_items');

    const map = new Map<string, CollectionItem>();

    if (exists) {
      const rows = db
        .prepare(
          'SELECT id, data, created_at, updated_at FROM collection_items WHERE collection_slug = ?',
        )
        .all(collectionSlug) as Array<any>;

      for (const r of rows) {
        map.set(r.id, {
          id: r.id,
          collectionSlug,
          data: r.data ? JSON.parse(r.data) : {},
          createdAt: r.created_at || new Date().toISOString(),
          updatedAt: r.updated_at || new Date().toISOString(),
        });
      }

      const originalSet = map.set.bind(map);
      const originalDelete = map.delete.bind(map);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any).set = (id: string, item: CollectionItem) => {
        try {
          const now = new Date().toISOString();
          const existing = db
            .prepare('SELECT created_at FROM collection_items WHERE id = ?')
            .get(id) as { created_at?: string } | undefined;
          const createdAt = existing?.created_at ?? now;
          const dataStr = JSON.stringify(item.data ?? {});
          db.prepare(
            `INSERT OR REPLACE INTO collection_items (id, collection_slug, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
          ).run(id, collectionSlug, dataStr, createdAt, now);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to persist collection item:', err);
        }

        return originalSet(id, item);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any).delete = (id: string) => {
        try {
          db.prepare('DELETE FROM collection_items WHERE id = ?').run(id);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to delete collection item from DB:', err);
        }

        return originalDelete(id);
      };
    }

    return map;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getItemsForCollection DB error:', err);
    return new Map();
  }
};

export const generateId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const cloneValue = <T>(value: T): T => {
  if (value === undefined || value === null) return value as T;
  try {
    return structuredClone(value) as T;
  } catch {
    return JSON.parse(JSON.stringify(value)) as T;
  }
};

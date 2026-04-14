/**
 * In-memory collection store (demo mode)
 * Mirrors the __demoPageStore pattern used in server/api/pages/
 *
 * Two stores:
 *  - schemaStore: Map<slug, CollectionSchema>
 *  - itemStore:   Map<collectionSlug, Map<itemId, CollectionItem>>
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

const getGlobal = () =>
  globalThis as typeof globalThis & {
    __demoCollectionSchemas?: SchemaStore;
    __demoCollectionItems?: ItemStore;
  };

export const getCollectionSchemaStore = (): SchemaStore => {
  const g = getGlobal();

  if (!g.__demoCollectionSchemas) {
    g.__demoCollectionSchemas = new Map();

    // Seed a default "posts" collection
    const now = new Date().toISOString();
    const postsSchema: CollectionSchema = {
      id: 'posts',
      name: 'Posts',
      slug: 'posts',
      icon: 'pi pi-book',
      description: 'Blog posts and articles',
      fields: [
        {
          key: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          showInList: true,
        },
        {
          key: 'slug',
          label: 'Slug',
          type: 'text',
          required: true,
          showInList: true,
        },
        { key: 'body', label: 'Body', type: 'richtext' },
        {
          key: 'coverImage',
          label: 'Cover Image',
          type: 'file',
          accept: 'image/*',
        },
        {
          key: 'publishedAt',
          label: 'Published At',
          type: 'date',
          showInList: true,
        },
        {
          key: 'featured',
          label: 'Featured',
          type: 'toggle',
          showInList: true,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    g.__demoCollectionSchemas.set('posts', postsSchema);
  }

  return g.__demoCollectionSchemas;
};

export const getCollectionItemStore = (): ItemStore => {
  const g = getGlobal();

  if (!g.__demoCollectionItems) {
    g.__demoCollectionItems = new Map();
  }

  return g.__demoCollectionItems;
};

export const getItemsForCollection = (
  collectionSlug: string,
): Map<string, CollectionItem> => {
  const store = getCollectionItemStore();

  if (!store.has(collectionSlug)) {
    store.set(collectionSlug, new Map());
  }

  return store.get(collectionSlug)!;
};

export const generateId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
};

export const cloneValue = <T>(value: T): T => {
  if (value === undefined || value === null) return value;
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value)) as T;
  }
};

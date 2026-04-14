import { readBody, createError } from 'h3';
import {
  getCollectionSchemaStore,
  generateId,
  cloneValue,
  type CollectionSchema,
  type CollectionFieldDef,
} from '~~/server/utils/collectionStore';

const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

// POST /api/collections — create a new schema
export default defineEventHandler(async (event) => {
  const schemaStore = getCollectionSchemaStore();

  const body = await readBody<{
    name: string;
    slug?: string;
    icon?: string;
    description?: string;
    fields?: CollectionFieldDef[];
  }>(event);

  if (!body?.name?.trim()) {
    throw createError({ statusCode: 400, message: 'Name is required' });
  }

  const slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.name);

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Invalid slug' });
  }

  if (schemaStore.has(slug)) {
    throw createError({
      statusCode: 409,
      message: `Collection with slug "${slug}" already exists`,
    });
  }

  const now = new Date().toISOString();
  const schema: CollectionSchema = {
    id: generateId(),
    name: body.name.trim(),
    slug,
    icon: body.icon?.trim() || 'pi pi-database',
    description: body.description?.trim() || '',
    fields: Array.isArray(body.fields) ? cloneValue(body.fields) : [],
    createdAt: now,
    updatedAt: now,
  };

  schemaStore.set(slug, schema);

  return { success: true, data: cloneValue(schema) };
});

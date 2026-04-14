import { getRouterParam, readBody, createError } from 'h3';
import {
  getCollectionSchemaStore,
  cloneValue,
  type CollectionFieldDef,
} from '~~/server/utils/collectionStore';

// PUT /api/collections/:slug — update schema
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!;
  const schemaStore = getCollectionSchemaStore();
  const schema = schemaStore.get(slug);

  if (!schema) {
    throw createError({
      statusCode: 404,
      message: `Collection not found: ${slug}`,
    });
  }

  const body = await readBody<{
    name?: string;
    icon?: string;
    description?: string;
    fields?: CollectionFieldDef[];
  }>(event);

  const updated = {
    ...schema,
    name: body.name?.trim() || schema.name,
    icon: body.icon?.trim() || schema.icon,
    description:
      body.description !== undefined ? body.description : schema.description,
    fields: Array.isArray(body.fields)
      ? cloneValue(body.fields)
      : schema.fields,
    updatedAt: new Date().toISOString(),
  };

  schemaStore.set(slug, updated);

  return { success: true, data: cloneValue(updated) };
});

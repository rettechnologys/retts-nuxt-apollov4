import { getRouterParam, createError } from 'h3';
import {
  getCollectionSchemaStore,
  cloneValue,
} from '~~/server/utils/collectionStore';

// GET /api/collections/:slug — get single schema
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')!;
  const schema = getCollectionSchemaStore().get(slug);

  if (!schema) {
    throw createError({
      statusCode: 404,
      message: `Collection not found: ${slug}`,
    });
  }

  return cloneValue(schema);
});

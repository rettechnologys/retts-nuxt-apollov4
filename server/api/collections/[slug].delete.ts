import { getRouterParam, createError } from 'h3';
import {
  getCollectionSchemaStore,
  getCollectionItemStore,
} from '~~/server/utils/collectionStore';

// DELETE /api/collections/:slug — delete schema + all its items
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')!;
  const schemaStore = getCollectionSchemaStore();

  if (!schemaStore.get(slug)) {
    throw createError({
      statusCode: 404,
      message: `Collection not found: ${slug}`,
    });
  }

  schemaStore.delete(slug);
  getCollectionItemStore().delete(slug);

  return { success: true };
});

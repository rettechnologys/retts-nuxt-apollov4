import { getRouterParam, createError } from 'h3';
import {
  getCollectionSchemaStore,
  getItemsForCollection,
} from '~~/server/utils/collectionStore';

// DELETE /api/collections/:slug/items/:id — delete item
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')!;
  const id = getRouterParam(event, 'id')!;

  if (!getCollectionSchemaStore().has(slug)) {
    throw createError({
      statusCode: 404,
      message: `Collection not found: ${slug}`,
    });
  }

  const itemMap = getItemsForCollection(slug);

  if (!itemMap.has(id)) {
    throw createError({ statusCode: 404, message: `Item not found: ${id}` });
  }

  itemMap.delete(id);

  return { success: true };
});

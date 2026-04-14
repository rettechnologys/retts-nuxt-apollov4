import { getRouterParam, createError } from 'h3';
import {
  getCollectionSchemaStore,
  getItemsForCollection,
  cloneValue,
} from '~~/server/utils/collectionStore';

// GET /api/collections/:slug/items/:id — get single item
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')!;
  const id = getRouterParam(event, 'id')!;

  if (!getCollectionSchemaStore().has(slug)) {
    throw createError({
      statusCode: 404,
      message: `Collection not found: ${slug}`,
    });
  }

  const item = getItemsForCollection(slug).get(id);

  if (!item) {
    throw createError({ statusCode: 404, message: `Item not found: ${id}` });
  }

  return cloneValue(item);
});

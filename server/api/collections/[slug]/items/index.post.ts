import { getRouterParam, createError } from 'h3';
import {
  getCollectionSchemaStore,
  getItemsForCollection,
  generateId,
  cloneValue,
  type CollectionItem,
} from '~~/server/utils/collectionStore';
import { parseFormData } from '~~/server/utils/parseFormData';

// POST /api/collections/:slug/items — create item
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!;

  if (!getCollectionSchemaStore().has(slug)) {
    throw createError({
      statusCode: 404,
      message: `Collection not found: ${slug}`,
    });
  }

  const data = await parseFormData(event);

  if (!Object.keys(data).length) {
    throw createError({ statusCode: 400, message: 'Form data is required' });
  }

  const now = new Date().toISOString();
  const item: CollectionItem = {
    id: generateId(),
    collectionSlug: slug,
    data: cloneValue(data),
    createdAt: now,
    updatedAt: now,
  };

  getItemsForCollection(slug).set(item.id, item);

  return { success: true, data: cloneValue(item) };
});

import { getRouterParam, createError } from 'h3';
import {
  getCollectionSchemaStore,
  getItemsForCollection,
  cloneValue,
} from '~~/server/utils/collectionStore';
import { parseFormData } from '~~/server/utils/parseFormData';

// PUT /api/collections/:slug/items/:id — update item
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!;
  const id = getRouterParam(event, 'id')!;

  if (!getCollectionSchemaStore().has(slug)) {
    throw createError({
      statusCode: 404,
      message: `Collection not found: ${slug}`,
    });
  }

  const itemMap = getItemsForCollection(slug);
  const item = itemMap.get(id);

  if (!item) {
    throw createError({ statusCode: 404, message: `Item not found: ${id}` });
  }

  const data = await parseFormData(event);

  if (!Object.keys(data).length) {
    throw createError({ statusCode: 400, message: 'Form data is required' });
  }

  const updated = {
    ...item,
    data: cloneValue(data),
    updatedAt: new Date().toISOString(),
  };

  itemMap.set(id, updated);

  return { success: true, data: cloneValue(updated) };
});

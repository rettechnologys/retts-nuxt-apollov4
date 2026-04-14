import {
  getCollectionSchemaStore,
  getItemsForCollection,
  cloneValue,
} from '~~/server/utils/collectionStore';

// GET /api/collections — list all schemas with item counts
export default defineEventHandler(() => {
  const schemaStore = getCollectionSchemaStore();

  return Array.from(schemaStore.values()).map((s) => ({
    ...cloneValue(s),
    itemCount: getItemsForCollection(s.slug).size,
  }));
});

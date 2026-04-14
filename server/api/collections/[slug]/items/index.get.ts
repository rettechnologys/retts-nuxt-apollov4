import { getRouterParam, getQuery, createError } from 'h3';
import {
  getCollectionSchemaStore,
  getItemsForCollection,
  cloneValue,
} from '~~/server/utils/collectionStore';

// GET /api/collections/:slug/items — list items (paginated + searchable)
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')!;

  if (!getCollectionSchemaStore().has(slug)) {
    throw createError({
      statusCode: 404,
      message: `Collection not found: ${slug}`,
    });
  }

  const query = getQuery(event);
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 20));
  const search = String(query.search || '')
    .toLowerCase()
    .trim();

  let items = Array.from(getItemsForCollection(slug).values());

  if (search) {
    items = items.filter((item) =>
      Object.values(item.data).some((val) =>
        String(val ?? '')
          .toLowerCase()
          .includes(search),
      ),
    );
  }

  items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const total = items.length;
  const paginated = items.slice((page - 1) * perPage, page * perPage);

  return { items: cloneValue(paginated), total, page, perPage };
});

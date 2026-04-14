// DELETE /api/admin/pages/:slug — remove a page from the in-memory store
import { getRouterParam, createError } from 'h3';

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')!;
  const g = globalThis as typeof globalThis & {
    __demoPageStore?: Map<string, any>;
  };
  const store = g.__demoPageStore ?? new Map();

  if (!store.has(slug)) {
    throw createError({ statusCode: 404, message: `Page not found: ${slug}` });
  }

  store.delete(slug);
  return { deleted: true };
});

// GET /api/admin/pages/:slug — return full stored entry (payload + pageConfig + savedAt)
import { getRouterParam, createError } from 'h3';
import { db } from '../../../db/client';

export default defineEventHandler((event) => {
  const rawSlug = getRouterParam(event, 'slug');
  const slug = Array.isArray(rawSlug) ? rawSlug.join('/') : (rawSlug ?? '');

  const row = db
    .prepare('SELECT payload, page_config, saved_at FROM pages WHERE slug = ?')
    .get(slug);
  if (!row) {
    throw createError({ statusCode: 404, message: `Page not found: ${slug}` });
  }

  return {
    payload: row.payload ? JSON.parse(row.payload) : {},
    pageConfig: row.page_config ? JSON.parse(row.page_config) : {},
    savedAt: row.saved_at,
  };
});

// DELETE /api/admin/pages/:slug — remove a page from the in-memory store
import { getRouterParam, createError } from 'h3';
import { db } from '../../../db/client';

export default defineEventHandler((event) => {
  const rawSlug = getRouterParam(event, 'slug');
  const slug = Array.isArray(rawSlug) ? rawSlug.join('/') : (rawSlug ?? '');

  const row = db.prepare('SELECT slug FROM pages WHERE slug = ?').get(slug);
  if (!row) {
    throw createError({ statusCode: 404, message: `Page not found: ${slug}` });
  }

  db.prepare('DELETE FROM pages WHERE slug = ?').run(slug);
  return { deleted: true };
});

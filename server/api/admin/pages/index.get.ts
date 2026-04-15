import { db } from '../../../db/client';

// GET /api/admin/pages — list all pages persisted in SQLite
export default defineEventHandler(() => {
  const rows = db
    .prepare('SELECT slug, payload, page_config, saved_at FROM pages')
    .all() as Array<any>;

  return rows.map((row: any) => {
    const payload = row.payload ? JSON.parse(row.payload) : {};
    const pageConfig = row.page_config ? JSON.parse(row.page_config) : {};

    return {
      slug: row.slug,
      id: payload.id ?? row.slug,
      title: payload.title,
      status: payload.status,
      type: payload.type,
      path: pageConfig.path ?? `/${row.slug}`,
      blockCount: Array.isArray(payload.blocks) ? payload.blocks.length : 0,
      savedAt: row.saved_at,
    };
  });
});

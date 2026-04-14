// GET /api/admin/pages — list all pages in the in-memory store
export default defineEventHandler(() => {
  const g = globalThis as typeof globalThis & {
    __demoPageStore?: Map<string, any>;
  };
  const store = g.__demoPageStore ?? new Map();

  return Array.from(store.entries()).map(([slug, entry]) => ({
    slug,
    id: entry.payload.id ?? slug,
    title: entry.payload.title,
    status: entry.payload.status,
    type: entry.payload.type,
    path: entry.pageConfig.path,
    blockCount: (entry.payload.blocks ?? []).length,
    savedAt: entry.savedAt,
  }));
});

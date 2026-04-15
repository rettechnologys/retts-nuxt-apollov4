import {
  getSiteConfig,
  setSiteConfig,
  type StoredSiteConfig,
} from '../utils/siteConfigStore';

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<StoredSiteConfig>>(event);

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, message: 'Invalid request body' });
  }

  // Merge deeply: allow partial updates (e.g. footer only, site only)
  const current = await getSiteConfig();
  const merged: StoredSiteConfig = {
    site: body.site ? { ...current.site, ...body.site } : current.site,
    footer: body.footer
      ? { ...current.footer, ...body.footer }
      : current.footer,
  };

  return await setSiteConfig(merged);
});

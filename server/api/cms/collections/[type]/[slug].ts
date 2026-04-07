import { defineEventHandler, createError, getRouterParams } from 'h3';

/**
 * GET /api/cms/collections/:type/:slug
 * Fetch a single collection item by type and slug from external backend
 */
export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const type = params.type;
  const slug = params.slug;

  console.log('[CMS API] Fetching collection item:', type, slug);

  try {
    const config = useRuntimeConfig();
    const apiBaseUrl = config.apiBaseUrl || config.public.apiBaseUrl;
    const apiKeyName = config.apiKeyName || config.public.apiKeyName;
    const apiKeyValue = config.apiKeyValue || config.public.apiKeyValue;

    // Forward request to external backend
    const item = await $fetch<any>(`${apiBaseUrl}/api/cms/collections/${type}/${slug}`, {
      headers: {
        [apiKeyName]: apiKeyValue,
      },
    });

    return item;

  } catch (error: any) {
    console.error('[CMS API] Error fetching collection item:', error);

    throw createError({
      statusCode: error.statusCode || error.response?.status || 404,
      message: error.message || error.data?.message || `${type} not found: ${slug}`
    });
  }
});

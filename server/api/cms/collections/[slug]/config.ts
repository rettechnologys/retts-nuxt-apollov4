import { defineEventHandler, createError, getRouterParams } from 'h3';

/**
 * GET /api/cms/collections/:slug/config
 * Fetch collection configuration from external backend
 */
export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const slug = params.slug;

  console.log('[CMS API] Fetching collection config:', slug);

  try {
    const config = useRuntimeConfig();
    const apiBaseUrl = config.apiBaseUrl || config.public.apiBaseUrl;
    const apiKeyName = config.apiKeyName || config.public.apiKeyName;
    const apiKeyValue = config.apiKeyValue || config.public.apiKeyValue;

    // Forward request to external backend
    const collectionConfig = await $fetch<any>(`${apiBaseUrl}/api/cms/collections/${slug}/config`, {
      headers: {
        [apiKeyName]: apiKeyValue,
      },
    });

    return collectionConfig;

  } catch (error: any) {
    console.error('[CMS API] Error fetching collection config:', error);
    
    throw createError({
      statusCode: error.statusCode || error.response?.status || 404,
      message: error.message || error.data?.message || `Collection config not found: ${slug}`
    });
  }
});

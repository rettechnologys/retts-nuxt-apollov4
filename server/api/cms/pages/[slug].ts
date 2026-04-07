import { defineEventHandler, createError, getRouterParams } from 'h3';
import type { PageConfig } from '#shared/types';

/**
 * GET /api/cms/pages/:slug
 * Fetch a page configuration from the external CMS backend
 * This is called by the main pages API to get page data
 */
export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const slug = params.slug;

  console.log('[CMS API] Fetching page:', slug);

  try {
    const config = useRuntimeConfig();
    const apiBaseUrl = config.apiBaseUrl || config.public.apiBaseUrl;
    const apiKeyName = config.apiKeyName || config.public.apiKeyName;
    const apiKeyValue = config.apiKeyValue || config.public.apiKeyValue;

    // Forward request to external backend
    const page = await $fetch<PageConfig>(`${apiBaseUrl}/api/cms/pages/${slug}`, {
      headers: {
        [apiKeyName]: apiKeyValue,
      },
    });

    return page;

  } catch (error: any) {
    console.error('[CMS API] Error fetching page:', error);

    throw createError({
      statusCode: error.statusCode || error.response?.status || 500,
      message: error.message || error.data?.message || 'Failed to fetch page'
    });
  }
});
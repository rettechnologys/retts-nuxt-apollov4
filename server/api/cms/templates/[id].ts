import { defineEventHandler, createError, getRouterParams } from 'h3';

/**
 * GET /api/cms/templates/:id
 * Fetch a page template configuration from external backend
 * Templates define the structure of pages with variable placeholders
 */
export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const id = params.id;

  console.log('[CMS API] Fetching template:', id);

  try {
    const config = useRuntimeConfig();
    const apiBaseUrl = config.apiBaseUrl || config.public.apiBaseUrl;
    const apiKeyName = config.apiKeyName || config.public.apiKeyName;
    const apiKeyValue = config.apiKeyValue || config.public.apiKeyValue;

    // Forward request to external backend
    const template = await $fetch<any>(`${apiBaseUrl}/api/cms/templates/${id}`, {
      headers: {
        [apiKeyName]: apiKeyValue,
      },
    });

    return template;

  } catch (error: any) {
    console.error('[CMS API] Error fetching template:', error);
    
    throw createError({
      statusCode: error.statusCode || error.response?.status || 404,
      message: error.message || error.data?.message || `Template not found: ${id}`
    });
  }
});

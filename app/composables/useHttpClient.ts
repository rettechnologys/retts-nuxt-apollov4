/**
 * Composable to provide configured Axios HttpClient instance
 * This ensures interceptors are properly set up for all API calls
 */
export const useHttpClient = () => {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();

  // Get base configuration from runtime config
  const baseURL = config.public.apiBaseUrl as string;
  const timeout = 30000; // 30 seconds

  return {
    /**
     * Create a new HttpClient instance with interceptors
     * @param additionalConfig - Additional axios configuration
     */
    createClient: <T = unknown>(additionalConfig?: any) => {
      // Import HttpClient dynamically to avoid circular dependencies
      const { HttpClient } = require('~/modules/data/internal/data-source/http-client');

      return new HttpClient<T>({
        baseURL,
        timeout,
        withCredentials: true,
        ...additionalConfig,
      });
    },

    /**
     * Get base URL from config
     */
    getBaseURL: () => baseURL,

    /**
     * Get setup interceptors function from plugin
     */
    getInterceptorsSetup: () => {
      return nuxtApp.$setupAxiosInterceptors;
    },
  };
};

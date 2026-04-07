import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axios from 'axios';
import {
  useConfirmationService,
  useDynamicDialogService,
} from '@/composables/prime';

// Define the structure of a retry queue item
interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = [];

// Flag to prevent multiple token refresh requests
let isRefreshing = false;

export default defineNuxtPlugin({
  name: 'axios-interceptors',
  parallel: false,
  enforce: 'post',
  async setup(nuxtApp) {
    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiBaseUrl as string;
    const API_KEY_NAME = config.public.apiKeyName as string;
    const API_KEY_VALUE = config.public.apiKeyValue as string;
    const REFRESH_TOKEN_ENDPOINT = 'api/auth/refresh-token';
    const REFRESH_TOKEN_MAX_RETRY = 3;
    const REQUEST_TIMEOUT = 30000;

    const confirmation = useConfirmationService();
    // const dialog = useDynamicDialogService(); // TODO: Implement dialog for login

    const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
      if (config.headers) {
        const headers = JSON.parse(JSON.stringify(config.headers));
        console.log('[Axios] onRequest.headers:', headers, config.url);

        if (headers['Require-Token'] && headers['Require-Token'] !== false) {
          config.withCredentials = true;
        }

        if (headers['Accept-Language'] === undefined) {
          // Get language from locale
          const locale = 'en'; // TODO: Get from i18n when available
          config.headers['Accept-Language'] = locale;
        }
      }

      console.log('[Axios] onRequest.config:', config?.headers);
      return config;
    };

    const onRequestError = async (error: AxiosError): Promise<AxiosError> => {
      console.log('[Axios] onRequestError:', error);
      return Promise.reject(error);
    };

    const onResponse = (response: AxiosResponse): AxiosResponse => {
      console.log('[Axios] onResponse:', response);
      return response;
    };

    const onResponseError = async (
      error: AxiosError | any
    ): Promise<AxiosError | AxiosResponse> => {
      const originalRequest = error.config as AxiosRequestConfig;
      const headers = JSON.stringify(originalRequest?.headers)
        ? JSON.parse(JSON.stringify(originalRequest?.headers))
        : null;

      if (!headers) {
        console.log('[Axios] onResponseError.ForceLogout:', '1');
        forceLogout();
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && headers['Require-Token']) {
        console.log(
          '[Axios] onResponseError.Require-Token:',
          headers['Require-Token'],
          error.response.data?.meta?.path,
          refreshAndRetryQueue.length,
          isRefreshing
        );

        if (originalRequest && originalRequest.headers) {
          console.log(
            '[Axios] onResponseError.Retry-Count:',
            headers['Retry-Count']
          );

          if (headers['Retry-Count'] == REFRESH_TOKEN_MAX_RETRY) {
            console.log('[Axios] onResponseError.ForceLogout:', '2');
            console.log(
              '[Axios] onResponseError.Retry-Count-Max:',
              REFRESH_TOKEN_MAX_RETRY
            );

            forceLogout();
            return Promise.reject(error);
          }

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const resRefreshToken = await getRefreshToken();

              console.info(
                '[Axios] onResponseError.resRefreshToken:',
                resRefreshToken
              );

              if (resRefreshToken.status === 200) {
                const remoteResponse = resRefreshToken.data;
                const newData = remoteResponse.data;

                await setAppADState(newData);

                console.info(
                  '[Axios] onResponseError.setNewAppADState:',
                  newData
                );

                let retryCount = 1;
                if (originalRequest.headers['Retry-Count']) {
                  retryCount += originalRequest.headers['Retry-Count'] as number;
                }

                originalRequest.headers['Authorization'] =
                  `Bearer ${newData.accessToken}`;
                originalRequest.headers['Require-Token'] = true;
                originalRequest.headers['Retry-Count'] = retryCount;

                console.log('[Axios] onResponseError.Retry-Count:', retryCount);
                console.log(
                  '[Axios] onResponseError.refreshAndRetryQueue:',
                  refreshAndRetryQueue.length
                );

                // Retry all requests in the queue with the new token
                refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                  config.headers = {
                    ...config.headers,
                    'Require-Token': true,
                    'Retry-Count': retryCount,
                    Authorization: `Bearer ${newData.accessToken}`,
                  };

                  axios
                    .request(config)
                    .then((response) => resolve(response))
                    .catch((err) => reject(err));
                });

                // Clear the queue
                refreshAndRetryQueue.length = 0;

                return Promise.resolve(
                  axios(originalRequest)
                    .then((res: AxiosResponse) => {
                      return res;
                    })
                    .catch((error: AxiosError) => {
                      return Promise.reject(error);
                    })
                );
              } else {
                return Promise.reject(error);
              }
            } catch (e) {
              return Promise.reject(e);
            } finally {
              isRefreshing = false;
            }
          } else {
            // Add the original request to the queue
            console.log('refreshAndRetryQueue', refreshAndRetryQueue);

            return new Promise((resolve, reject) => {
              refreshAndRetryQueue.push({
                config: originalRequest,
                resolve,
                reject,
              });
            });
          }
        } else {
          console.log('[Axios] onResponseError.ForceLogout:', '3');
          forceLogout();
        }
      } else {
        console.log('[Axios] onResponseError.Beside401:', '-');
      }

      return Promise.reject(error);
    };

    //#region Methods
    const _getAppADState = () => {
      // Get from Nuxt store
      const appADStore = useAppADStore();
      const appADState = appADStore.getState;

      console.log('[Axios] getAppADState', appADState);
      return appADState;
    };

    const setAppADState = async (newAppADState: any) => {
      const appADStore = useAppADStore();
      await appADStore.setState(newAppADState);

      console.info('[Axios] setAppADState:', newAppADState);
    };

    const forceLogout = () => {
      const appADStore = useAppADStore();
      appADStore.logout();
      appADStore.resetState();

      console.log('[Axios] forceLogout:currentRoute:', window.location.pathname);

      if (window.location.pathname.includes('/auth/login')) {
        console.log('[Axios] forceLogout:already on login page');
        return;
      }

      confirmation.require({
        header: 'Session Expired',
        message: 'Your session has expired. Please login again.',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
          // Navigate to login or show login dialog
          navigateTo('/auth/login');
        },
        reject: () => {
          window.location.reload();
        },
        onHide: () => {
          window.location.reload();
        },
      });

      console.log('[Axios] forceLogout:');
    };

    const getRefreshToken = async () => {
      const locale = 'en'; // TODO: Get from i18n when available

      const options: AxiosRequestConfig = {
        headers: {
          [API_KEY_NAME]: API_KEY_VALUE,
          'Require-Token': false,
          'Accept-Language': locale,
        },
        withCredentials: true,
      };

      return Promise.resolve(
        axios
          .get(`${BASE_URL}/${REFRESH_TOKEN_ENDPOINT}`, options)
          .then((res: AxiosResponse) => res)
          .catch((error: AxiosError) => {
            if (axios.isAxiosError(error)) {
              const axiosResponse = error.response;
              const remoteResponse = axiosResponse?.data as any;

              console.log(
                `[Axios] getRefreshToken.catch.error.remote:`,
                `${error.message} - ${JSON.stringify(remoteResponse)}`
              );

              if (remoteResponse?.meta?.statusCode === 401) {
                console.log(
                  '[Axios] getRefreshToken.catch.error.401:',
                  remoteResponse.meta.statusCode
                );
                forceLogout();
              }
            } else {
              console.info(
                `[Axios] getRefreshToken.catch.error.internal:`,
                `${error}`
              );
              forceLogout();
            }

            return Promise.reject(error);
          })
      );
    };
    //#endregion Methods

    // Setup interceptors function
    const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
      axiosInstance.interceptors.request.use(onRequest as any, onRequestError);
      axiosInstance.interceptors.response.use(onResponse, onResponseError);

      axiosInstance.defaults.headers.common[API_KEY_NAME] = API_KEY_VALUE;
      axiosInstance.defaults.headers.common['Require-Token'] = true;
      axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
      axiosInstance.defaults.headers.put['Content-Type'] = 'application/json';
      axiosInstance.defaults.headers.patch['Content-Type'] = 'application/json';
      axiosInstance.defaults.timeout = REQUEST_TIMEOUT;
      axiosInstance.defaults.baseURL = BASE_URL;

      console.log('[Axios] Interceptors set up with config:', {
        axiosInstance: {
          defaults: axiosInstance.defaults.headers.common,
        },
      })

      return axiosInstance;
    };

    // Provide setupInterceptorsTo to be used by HttpClient
    return {
      provide: {
        setupAxiosInterceptors: setupInterceptorsTo,
      },
    };
  },
});

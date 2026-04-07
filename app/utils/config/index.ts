import { PrimeIcons } from '@primevue/core/api';
import { name as packageName, version as packageVer } from '../../../package.json';
// const buildNumber = (await import(`../../build.info?raw`)).default;
// import buildNumber from '../../build.info?raw';

export const getAppConfig = () => {
  try {
    const config = useRuntimeConfig();
    console.log('runtimeConfig', config);
    return {
      APP_ENV: config.public.appEnv,
      UPLOAD_MAX_SIZE: config.public.uploadMaxSizeGlobal,
      PHONE_COUNTRY_CODE: config.public.phoneCountryCode,
      ENABLE_WHATSAPP: config.public.enableWhatsapp === 'true',
      SHORTLINK_DOMAIN: config.public.shortlinkDomain,
      SHORTLINK_API_URL: config.public.shortlinkApiUrl,
      SHORTLINK_API_KEY: config.public.shortlinkApiKey,
    };
  } catch {
    // Fallback ke import.meta.env jika useRuntimeConfig tidak tersedia
    return {
      APP_ENV: import.meta.env.VITE_APP_ENV,
      UPLOAD_MAX_SIZE: parseInt(import.meta.env.VITE_UPLOAD_MAX_SIZE_GLOBAL || '0'),
      PHONE_COUNTRY_CODE: import.meta.env.VITE_APP_PHONE_COUNTRY_CODE,
      ENABLE_WHATSAPP: import.meta.env.VITE_APP_ENABLE_WHATSAPP === 'true',
      SHORTLINK_DOMAIN: import.meta.env.VITE_SHORTLINK_DOMAIN,
      SHORTLINK_API_URL: import.meta.env.VITE_SHORTLINK_API_URL,
      SHORTLINK_API_KEY: import.meta.env.VITE_SHORTLINK_API_KEY,
    };
  }
}
const envConfig = getAppConfig();
export const APP = {
  PACKAGE_NAME: packageName,
  PACKAGE_VER: packageVer,
  //TODO: fix 
  // BUILD_NUMBER: buildNumber,
  BUILD_NUMBER: 2,
  API_CONTENT_TYPE: 'application/json',
  API_CONTENT_EVENT_STREAM_TYPE: 'text/event-stream',
  FONT_SCALE: 13,
  LOCALE_BROWSER_MODE: false,
  UPLOAD_MAX_SIZE_GLOBAL: parseInt(import.meta.env.VITE_UPLOAD_MAX_SIZE_GLOBAL),
  NAME: 'RETTS WebApp UI Apollo',
  OFFICE_WEB_VIEWER_URL: 'https://view.officeapps.live.com/op/embed.aspx?src=',
  PHONE_COUNTRY_CODE: import.meta.env.VITE_APP_PHONE_COUNTRY_CODE,
  REFRESH_TOKEN_ENDPOINT: 'api/auth/refresh-token',
  REFRESH_TOKEN_MAX_RETRY: 2,
  REQUEST_TIMEOUT: 40000,
  MAX_RETRIES_SSE: 5,
  RETRY_INTERVAL: 800,
  MAX_STEPS: 5,
  BE_DATE_FORMAT: 'yyyy-MM-DD',
  DATE_FORMAT: 'DD-MM-yyyy',
  DATETIME_FORMAT: 'DD-MM-yyyy HH:mm:ss',
  STORAGE_KEY: 'RETTS-WEBAPP_',
  RNS: '__', //*route name splitter
  DEF_AUTH_PATH: '/',
  ENABLE_WHATSAPP:
    import.meta.env.VITE_APP_ENABLE_WHATSAPP === 'true' ? true : false,
  SHORTLINK_DOMAIN: import.meta.env.VITE_SHORTLINK_DOMAIN,
  SHORTLINK_API_URL: import.meta.env.VITE_SHORTLINK_API_URL,
  SHORTLINK_API_KEY: import.meta.env.VITE_SHORTLINK_API_KEY,
  URL_REGEX: /https?:\/\/[^\s/$.?#*]*\.[^\s*]*/gi,
  NOTIF_STORAGE_KEY: 'AppNotifications',
  ALLOWED_MIME_TYPES: {
    IMAGE: [
      'image/jpeg',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/tiff',
      'image/bmp',
      'image/svg+xml',
    ],
    AUDIO: [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/flac',
      'audio/aac',
      'audio/x-ms-wma',
    ],
    VIDEO: [
      'video/mp4',
      'video/x-matroska',
      'video/avi',
      'video/mpeg',
      'video/webm',
      'video/quicktime',
      'video/3gpp',
    ],
    DOCUMENT: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet, application/rtf',
    ],
    TEXT: ['text/plain', 'text/markdown', 'text/csv'],
    ARCHIVE: [
      'application/zip',
      'application/gzip',
      'application/x-bzip2',
      'application/x-tar',
      'application/x-7z-compressed',
    ],
  },
};



export const getAllowedMimeTypes = () => {
  return Object.values(APP.ALLOWED_MIME_TYPES)
    .flatMap((v) => v)
    .join(', ');
};

export const PRIME = {
  TOAST_LIFE: 3000,
  DATE_FORMAT: 'dd-mm-yy',
  PRIME_ICONS_OPTIONS: Object.entries(PrimeIcons).map(([key, value]) => ({
    text: value,
    value,
  })),
};

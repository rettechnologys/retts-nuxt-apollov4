// Global type definitions for environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // App configuration
      NUXT_PUBLIC_APP_ENV: string
      NUXT_PUBLIC_API_BASE_URL: string
      NUXT_PUBLIC_API_KEY_NAME: string
      NUXT_PUBLIC_API_KEY_VALUE: string
      NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN: string
      NUXT_PUBLIC_LOGGING: string
      NUXT_PUBLIC_PHONE_COUNTRY_CODE: string
      NUXT_PUBLIC_ENABLE_WHATSAPP: string

      // OneSignal configuration
      NUXT_PUBLIC_ONESIGNAL_APP_ID: string
      NUXT_PUBLIC_ONESIGNAL_SERVICE: string

      // Azure AD configuration
      NUXT_PUBLIC_AZ_REDIRECT_URI: string
      NUXT_PUBLIC_AZ_CLIENT_ID: string
      NUXT_PUBLIC_AZ_TENANT_ID: string

      // Upload configuration
      NUXT_PUBLIC_UPLOAD_MAX_SIZE_GLOBAL: string
      NUXT_PUBLIC_UPLOAD_MAX_SIZE_DOC: string
      NUXT_PUBLIC_UPLOAD_MAX_SIZE_IMAGE: string

      // Shortlink configuration
      NUXT_PUBLIC_SHORTLINK_BASE_URL: string
      NUXT_PUBLIC_SHORTLINK_TOKEN: string
      NUXT_PUBLIC_SHORTLINK_API_URL: string

      // OpenAI configuration
      NUXT_PUBLIC_OPENAI_API_KEY: string
      NUXT_PUBLIC_OPENAI_BASE_URL: string
      NUXT_PUBLIC_OPENROUTER_API_KEY: string
      NUXT_PUBLIC_OPENROUTER_BASE_URL: string
      NUXT_PUBLIC_OPENROUTER_SITE_URL: string
      NUXT_PUBLIC_OPENROUTER_SITE_NAME: string

      // Puter configuration
      NUXT_PUBLIC_PUTER_APPID: string
      NUXT_PUBLIC_PUTER_DOMAIN: string
    }
  }
}

export {}

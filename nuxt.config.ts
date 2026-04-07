// https://nuxt.com/docs/api/configuration/nuxt-config

import { FilterMatchMode } from '@primevue/core/api';
import Aura from '@primeuix/themes/aura';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  dir: {
    modules: './app/nuxt_modules',
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  runtimeConfig: {
    apiBaseUrl:
      process.env.NUXT_PUBLIC_API_BASE_URL ||
      'https://retts-webapp-api-dev.retts.cloud',
    apiKeyName: process.env.NUXT_PUBLIC_API_KEY_NAME || 'Retts-Api-Key',
    apiKeyValue:
      process.env.NUXT_PUBLIC_API_KEY_VALUE ||
      '941faf76-hqao-6956-kcjv-dbd30350cb40',
    cryptoAlgorithm: process.env.NUXT_PUBLIC_CRYPTO_ALGORITHM || 'aes-256-cbc',
    cryptoSecretKey:
      process.env.NUXT_PUBLIC_CRYPTO_SECRET_KEY ||
      'ed023713af7c856366d37171b84f7be2',
    cryptoCipherIv:
      process.env.NUXT_PUBLIC_CRYPTO_CIPHER_IV || 'ed023713af7c8563',
    //
    public: {
      appEnv: process.env.NUXT_PUBLIC_APP_ENV || 'development',
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL ||
        'https://retts-webapp-api-dev.retts.cloud',
      apiKeyName: process.env.NUXT_PUBLIC_API_KEY_NAME || 'Retts-Api-Key',
      apiKeyValue:
        process.env.NUXT_PUBLIC_API_KEY_VALUE ||
        '941faf76-hqao-6956-kcjv-dbd30350cb40',
    },
  },
  //Nitro configuration
  nitro: {
    hooks: {
      'rollup:before': (nitro) => {
        nitro.options.moduleSideEffects.push('reflect-metadata');
      },
    },
    rollupConfig: {
      output: {
        banner: 'import "reflect-metadata";',
      },
    },
    // externals: {
    //   inline: ['tslib']
    // },
  },
  // Vite
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
      watch: {
        usePolling: true,
      },
    },
  },
  // PrimeVue module configuration
  primevue: {
    components: {
      include: '*',
    },
    directives: {
      include: '*',
    },
    options: {
      filterMatchModeOptions: {
        text: [
          FilterMatchMode.STARTS_WITH,
          FilterMatchMode.CONTAINS,
          FilterMatchMode.NOT_CONTAINS,
          FilterMatchMode.ENDS_WITH,
          FilterMatchMode.EQUALS,
          FilterMatchMode.NOT_EQUALS,
        ],
        numeric: [
          FilterMatchMode.EQUALS,
          FilterMatchMode.NOT_EQUALS,
          FilterMatchMode.LESS_THAN,
          FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
          FilterMatchMode.GREATER_THAN,
          FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
        ],
        date: [
          FilterMatchMode.DATE_IS,
          FilterMatchMode.DATE_IS_NOT,
          FilterMatchMode.DATE_BEFORE,
          FilterMatchMode.DATE_AFTER,
          FilterMatchMode.LESS_THAN,
          FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
          FilterMatchMode.GREATER_THAN,
          FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
        ],
      },
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primevue',
            order: 'theme, base, primevue',
          },
        },
      },
    },
  },
  // CSS configuration
  css: ['primeicons/primeicons.css', './app/assets/theme/tailwind.css'],
  //Typescript configuration
  typescript: {
    tsConfig: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        verbatimModuleSyntax: false,
        strictPropertyInitialization: false,
        noUncheckedIndexedAccess: false,
        noImplicitAny: true,
        isolatedModules: true,
        resolveJsonModule: true,
        noEmit: true,
      },
    },
  },
  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'id', iso: 'id-ID', file: 'id.json', name: 'Indonesia' },
      // { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
      // { code: 'de', iso: 'de-DE', file: 'de.json', name: 'Deutsch' },
    ],
    defaultLocale: 'en',
    // URL strategy: /en/about, /fr/about, /about (default)
    strategy: 'prefix_except_default',
    // Detect user's browser language
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root', // Only redirect on homepage
      alwaysRedirect: false,
    },
  },
});

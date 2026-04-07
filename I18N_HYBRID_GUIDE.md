# Hybrid i18n Architecture Guide

## Static UI + Dynamic CMS Content

---

## 🎯 The Problem

Your content is **dynamically managed through admin panel** and stored in the backend database. Traditional static JSON locale files won't work because:

- ❌ Menus are added/edited by admin
- ❌ Pages are created dynamically
- ❌ Content changes without code deployment
- ❌ Translations need to be managed in admin panel, not code

## ✅ The Solution: Hybrid Approach

Use **two different systems** for two different needs:

```
┌─────────────────────────────────────────────────────────────┐
│                  Hybrid i18n Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │   Static UI Texts    │      │  Dynamic Content     │   │
│  │   (JSON files)       │      │  (Backend/Database)  │   │
│  ├──────────────────────┤      ├──────────────────────┤   │
│  │ - Button labels      │      │ - Menu items         │   │
│  │ - Form placeholders  │      │ - Page content       │   │
│  │ - Error messages     │      │ - Block text         │   │
│  │ - Validation texts   │      │ - SEO meta           │   │
│  │ - Common UI strings  │      │ - Product info       │   │
│  │ - Navigation helpers │      │ - Blog posts         │   │
│  └──────────────────────┘      └──────────────────────┘   │
│           ↓                              ↓                  │
│    Use: $t('key')              Use: getLocalizedText()     │
│    Loaded at build time        Fetched from API at runtime │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation & Setup

### **Step 1: Install Nuxt i18n**

```bash
npm install @nuxtjs/i18n
```

### **Step 2: Configure Nuxt**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'id', iso: 'id-ID', file: 'id.json', name: 'Indonesia' },
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'de', iso: 'de-DE', file: 'de.json', name: 'Deutsch' },
    ],

    defaultLocale: 'en',

    // URL strategy: /en/about, /fr/about, /about (default)
    strategy: 'prefix_except_default',

    // Lazy load locale files
    lazy: true,
    langDir: 'locales/',

    // Detect user's browser language
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root', // Only redirect on homepage
      alwaysRedirect: false,
    },
  },
});
```

---

## 📝 Part 1: Static UI Translations (JSON Files)

These files contain **only UI elements** that don't change through admin panel.

### **Create Locale Files**

```json
// locales/en.json
{
  "common": {
    "search": "Search",
    "loading": "Loading...",
    "error": "Something went wrong",
    "success": "Success!",
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "viewAll": "View All",
    "readMore": "Read More"
  },

  "nav": {
    "skipToContent": "Skip to content",
    "menu": "Menu",
    "login": "Sign In",
    "logout": "Sign Out",
    "profile": "Profile",
    "settings": "Settings"
  },

  "form": {
    "name": "Name",
    "email": "Email address",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "phone": "Phone number",
    "message": "Message",
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email",
    "passwordMismatch": "Passwords do not match",
    "minLength": "Minimum {count} characters required"
  },

  "search": {
    "placeholder": "Search...",
    "noResults": "No results found",
    "resultsFor": "Results for \"{query}\"",
    "showing": "Showing {from}-{to} of {total}"
  },

  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "forgotPassword": "Forgot password?",
    "resetPassword": "Reset Password",
    "rememberMe": "Remember me",
    "createAccount": "Create an account",
    "alreadyHaveAccount": "Already have an account?",
    "dontHaveAccount": "Don't have an account?"
  },

  "error": {
    "pageNotFound": "Page not found",
    "unauthorized": "You are not authorized",
    "serverError": "Server error occurred",
    "networkError": "Network connection error",
    "tryAgain": "Please try again"
  },

  "time": {
    "justNow": "Just now",
    "minutesAgo": "{count} minute ago | {count} minutes ago",
    "hoursAgo": "{count} hour ago | {count} hours ago",
    "daysAgo": "{count} day ago | {count} days ago",
    "monthsAgo": "{count} month ago | {count} months ago",
    "yearsAgo": "{count} year ago | {count} years ago"
  }
}
```

```json
// locales/id.json
{
  "common": {
    "search": "Cari",
    "loading": "Memuat...",
    "error": "Terjadi kesalahan",
    "success": "Berhasil!",
    "submit": "Kirim",
    "cancel": "Batal",
    "save": "Simpan",
    "delete": "Hapus",
    "edit": "Ubah",
    "close": "Tutup",
    "back": "Kembali",
    "next": "Selanjutnya",
    "previous": "Sebelumnya",
    "viewAll": "Lihat Semua",
    "readMore": "Baca Selengkapnya"
  },

  "nav": {
    "skipToContent": "Lewati ke konten",
    "menu": "Menu",
    "login": "Masuk",
    "logout": "Keluar",
    "profile": "Profil",
    "settings": "Pengaturan"
  },

  "form": {
    "name": "Nama",
    "email": "Alamat email",
    "password": "Kata sandi",
    "confirmPassword": "Konfirmasi kata sandi",
    "phone": "Nomor telepon",
    "message": "Pesan",
    "required": "Kolom ini wajib diisi",
    "invalidEmail": "Masukkan email yang valid",
    "passwordMismatch": "Kata sandi tidak cocok",
    "minLength": "Minimal {count} karakter diperlukan"
  },

  "search": {
    "placeholder": "Cari...",
    "noResults": "Tidak ada hasil",
    "resultsFor": "Hasil untuk \"{query}\"",
    "showing": "Menampilkan {from}-{to} dari {total}"
  },

  "auth": {
    "signIn": "Masuk",
    "signUp": "Daftar",
    "forgotPassword": "Lupa kata sandi?",
    "resetPassword": "Atur Ulang Kata Sandi",
    "rememberMe": "Ingat saya",
    "createAccount": "Buat akun",
    "alreadyHaveAccount": "Sudah punya akun?",
    "dontHaveAccount": "Belum punya akun?"
  },

  "error": {
    "pageNotFound": "Halaman tidak ditemukan",
    "unauthorized": "Anda tidak diizinkan",
    "serverError": "Terjadi kesalahan server",
    "networkError": "Kesalahan koneksi jaringan",
    "tryAgain": "Silakan coba lagi"
  },

  "time": {
    "justNow": "Baru saja",
    "minutesAgo": "{count} menit yang lalu",
    "hoursAgo": "{count} jam yang lalu",
    "daysAgo": "{count} hari yang lalu",
    "monthsAgo": "{count} bulan yang lalu",
    "yearsAgo": "{count} tahun yang lalu"
  }
}
```

### **Usage in Components**

```vue
<template>
  <div>
    <!-- Static UI texts -->
    <Button :label="$t('common.submit')" />
    <InputText :placeholder="$t('form.email')" />

    <!-- With interpolation -->
    <p>{{ $t('search.resultsFor', { query: searchQuery }) }}</p>

    <!-- Pluralization -->
    <span>{{ $t('time.minutesAgo', { count: 5 }) }}</span>
  </div>
</template>

<script setup>
const { t } = useI18n();

// You can also use t() in script
const errorMessage = t('form.required');
</script>
```

---

## 🗄️ Part 2: Dynamic Content from Backend

Your existing backend structure with `sysMenuLangs` is **already perfect**! Just ensure consistency.

### **Database Schema**

```typescript
// Menu with translations (already in your backend!)
interface Menu {
  id: string;
  name: string; // Internal identifier (not shown to users)
  link?: string;
  icon?: string;
  order: number;
  parentId?: string;

  // Multi-language translations (already exists!)
  sysMenuLangs: Array<{
    code: string; // 'en', 'id', 'fr', 'de'
    description: string; // Translated menu label
    slug?: string; // Optional: language-specific slug
  }>;

  children?: Menu[];
}

// Page with translations
interface PageContent {
  id: string;
  name: string; // Internal identifier
  status: 'draft' | 'published';

  // Multi-language content
  translations: {
    [langCode: string]: {
      slug: string; // /about, /tentang, /a-propos
      title: string;
      description: string;

      // Blocks can also be translated
      blocks: Array<{
        blockId: string;
        component: string;
        props: Record<string, any>;
        content: {
          title?: string;
          description?: string;
          buttonText?: string;
          // ... other translatable fields
        };
      }>;

      // SEO per language
      meta: {
        title: string;
        description: string;
        keywords: string[];
        ogImage?: string;
      };
    };
  };
}

// Blog post example
interface BlogPost {
  id: string;
  slug: string;
  author: string;
  publishedAt: Date;

  translations: {
    en: {
      title: 'How to Build a Website';
      excerpt: 'Learn the basics...';
      content: '<p>Full content...</p>';
    };
    id: {
      title: 'Cara Membuat Website';
      excerpt: 'Pelajari dasar-dasar...';
      content: '<p>Konten lengkap...</p>';
    };
  };
}
```

### **Backend API Endpoints**

```typescript
// NestJS Backend

// Get menus with all languages
@Get('menus')
async getMenus() {
  return this.menusService.findAll() // Returns all sysMenuLangs
}

// Get page by slug with specific language
@Get('pages/:slug')
async getPage(@Param('slug') slug: string, @Query('lang') lang: string) {
  const page = await this.pagesService.findBySlug(slug)

  // Return translation for specific language
  return {
    ...page,
    content: page.translations[lang] || page.translations['en']
  }
}

// Get global configs
@Get('configs/global')
async getGlobalConfig(@Query('lang') lang: string) {
  return this.configsService.getGlobal(lang)
}
```

---

## 🔧 Part 3: Nuxt Implementation

### **Composable for Global Config with i18n**

```typescript
// composables/useGlobalConfig.ts
export const useGlobalConfig = () => {
  const { locale } = useI18n();

  const { data: config, refresh } = useFetch('/api/global-configs', {
    query: { lang: locale },
    // Cache for 5 minutes
    getCachedData: (key) => {
      return useNuxtData(key).data.value;
    },
  });

  // Auto-refresh when language changes
  watch(locale, () => {
    refresh();
  });

  return { config, refresh };
};
```

### **Composable for Smart Translations**

```typescript
// composables/useSmartI18n.ts
export const useSmartI18n = () => {
  const { locale, defaultLocale } = useI18n();

  /**
   * Get localized text from sysMenuLangs array
   * With automatic fallback to default locale
   */
  const getLocalizedText = (
    translations: Array<{ code: string; description: string }> | undefined,
    fallback = '',
  ): string => {
    if (!translations || translations.length === 0) return fallback;

    // 1. Try current locale
    const current = translations.find((t) => t.code === locale.value);
    if (current?.description) return current.description;

    // 2. Try default locale (en)
    const defaultLang = translations.find((t) => t.code === defaultLocale);
    if (defaultLang?.description) return defaultLang.description;

    // 3. Return first available
    return translations[0]?.description || fallback;
  };

  /**
   * Get localized object (for pages with translation structure)
   */
  const getLocalizedContent = <T>(
    translationsMap: Record<string, T> | undefined,
    fallback?: T,
  ): T | undefined => {
    if (!translationsMap) return fallback;

    // 1. Try current locale
    if (translationsMap[locale.value]) {
      return translationsMap[locale.value];
    }

    // 2. Try default locale
    if (translationsMap[defaultLocale]) {
      return translationsMap[defaultLocale];
    }

    // 3. Return first available
    const firstKey = Object.keys(translationsMap)[0];
    return translationsMap[firstKey] || fallback;
  };

  return {
    getLocalizedText,
    getLocalizedContent,
  };
};
```

### **Usage in Components**

```vue
<template>
  <header>
    <!-- Logo -->
    <img :src="config?.header.logo" alt="Logo" />

    <!-- Navigation Menu (dynamic from backend) -->
    <nav>
      <NuxtLink
        v-for="menu in config?.header.menus"
        :key="menu.id"
        :to="menu.link"
      >
        {{ getLocalizedText(menu.sysMenuLangs, menu.name) }}
      </NuxtLink>
    </nav>

    <!-- CTA Button (static UI text) -->
    <Button :label="$t('nav.login')" @click="handleLogin" />

    <!-- Language Switcher -->
    <LanguageSwitcher />
  </header>
</template>

<script setup>
const { config } = useGlobalConfig();
const { getLocalizedText } = useSmartI18n();

const handleLogin = () => {
  // Use static translation
  console.log('Navigate to login');
};
</script>
```

### **Dynamic Pages with Locale**

```typescript
// server/api/pages/[...slug].ts
export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug || '';
  const lang = getQuery(event).lang || 'en';

  const backendUrl = useRuntimeConfig().public.backendUrl;

  // Fetch page with specific language
  const pageConfig = await $fetch(
    `${backendUrl}/api/pages/${slug}?lang=${lang}`,
  );

  return pageConfig;
});
```

```vue
<!-- pages/[...slugs].vue -->
<template>
  <div>
    <DynamicRenderer v-if="pageData" :page-config="pageData" />

    <div v-else class="error">
      <h1>{{ $t('error.pageNotFound') }}</h1>
      <Button :label="$t('common.back')" @click="$router.back()" />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { locale } = useI18n();

const slug = Array.isArray(route.params.slugs)
  ? route.params.slugs.join('/')
  : route.params.slugs || '';

// Fetch page based on current locale
const { data: pageData, refresh } = await useFetch(`/api/pages/${slug}`, {
  query: { lang: locale },
});

// Refetch when language changes
watch(locale, () => {
  refresh();
});
</script>
```

---

## 🔀 Language Switcher Component

```vue
<!-- components/LanguageSwitcher.vue -->
<template>
  <Dropdown
    v-model="currentLocale"
    :options="availableLocales"
    optionLabel="name"
    optionValue="code"
    @change="handleLanguageChange"
    class="language-switcher"
  >
    <template #value="{ value }">
      <div class="flex items-center gap-2">
        <i :class="`fi fi-${getFlagCode(value)}`"></i>
        <span>{{ getLanguageName(value) }}</span>
      </div>
    </template>

    <template #option="{ option }">
      <div class="flex items-center gap-2">
        <i :class="`fi fi-${getFlagCode(option.code)}`"></i>
        <span>{{ option.name }}</span>
      </div>
    </template>
  </Dropdown>
</template>

<script setup>
const { locale, locales, setLocale } = useI18n();
const router = useRouter();
const route = useRoute();

const availableLocales = computed(() => locales.value);
const currentLocale = ref(locale.value);

const handleLanguageChange = async (event) => {
  const newLocale = event.value;

  // 1. Update i18n locale (for static UI texts)
  await setLocale(newLocale);

  // 2. Refresh all data (for dynamic content from backend)
  await refreshNuxtData();

  // 3. Update URL if using prefix strategy
  const currentPath = route.path;
  const pathWithoutLocale = currentPath.replace(/^\/(en|id|fr|de)/, '');

  if (newLocale === 'en') {
    // Default locale, no prefix
    router.push(pathWithoutLocale || '/');
  } else {
    // Add locale prefix
    router.push(`/${newLocale}${pathWithoutLocale}`);
  }
};

const getFlagCode = (code) => {
  const flagMap = {
    en: 'us',
    id: 'id',
    fr: 'fr',
    de: 'de',
  };
  return flagMap[code] || 'us';
};

const getLanguageName = (code) => {
  return locales.value.find((l) => l.code === code)?.name || code.toUpperCase();
};
</script>

<style>
/* Optional: Use flag-icons CSS library */
@import 'flag-icons/css/flag-icons.min.css';
</style>
```

---

## 🎨 Admin Panel Integration

### **Menu Translation Editor**

```vue
<!-- Admin: components/MenuTranslationEditor.vue -->
<template>
  <Dialog v-model:visible="visible" header="Edit Menu Translations" modal>
    <div class="menu-editor">
      <!-- Basic Info -->
      <div class="field">
        <label>Internal Name (code identifier)</label>
        <InputText v-model="menu.name" placeholder="home" disabled />
        <small>This is used in code, not shown to users</small>
      </div>

      <div class="field">
        <label>Link/URL</label>
        <InputText v-model="menu.link" placeholder="/" />
      </div>

      <Divider />

      <!-- Multi-language Translations -->
      <h3>Translations</h3>
      <TabView>
        <TabPanel
          v-for="lang in supportedLanguages"
          :key="lang.code"
          :header="lang.name"
        >
          <div class="translation-panel">
            <div class="field">
              <label>Menu Label ({{ lang.name }})</label>
              <InputText
                v-model="getTranslation(lang.code).description"
                :placeholder="`What users see in ${lang.name}`"
              />
              <small>Example: "Home", "Beranda", "Accueil"</small>
            </div>

            <div class="field">
              <label>Custom Slug (Optional)</label>
              <InputText
                v-model="getTranslation(lang.code).slug"
                :placeholder="`Custom URL for ${lang.name}`"
              />
              <small>Leave empty to use default link</small>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>

    <template #footer>
      <Button label="Cancel" severity="secondary" @click="visible = false" />
      <Button label="Save" @click="saveMenu" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
interface Props {
  menuItem: Menu;
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:visible', 'save']);

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Indonesia' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

const menu = ref({ ...props.menuItem });

// Ensure all languages exist in sysMenuLangs
watchEffect(() => {
  supportedLanguages.forEach((lang) => {
    if (!menu.value.sysMenuLangs.find((l) => l.code === lang.code)) {
      menu.value.sysMenuLangs.push({
        code: lang.code,
        description: '',
        slug: '',
      });
    }
  });
});

const getTranslation = (langCode: string) => {
  let trans = menu.value.sysMenuLangs.find((l) => l.code === langCode);
  if (!trans) {
    trans = { code: langCode, description: '', slug: '' };
    menu.value.sysMenuLangs.push(trans);
  }
  return trans;
};

const saveMenu = async () => {
  try {
    await $fetch('/api/menus', {
      method: 'PUT',
      body: menu.value,
    });

    emit('save', menu.value);
    emit('update:visible', false);
  } catch (error) {
    console.error('Failed to save menu:', error);
  }
};
</script>
```

### **Page Content Translation Editor**

```vue
<!-- Admin: components/PageTranslationEditor.vue -->
<template>
  <div class="page-editor">
    <!-- Language Selector -->
    <div class="flex justify-between mb-4">
      <h2>Edit Page Content</h2>

      <Dropdown
        v-model="editingLang"
        :options="supportedLanguages"
        optionLabel="name"
        optionValue="code"
        placeholder="Select language to edit"
      />
    </div>

    <!-- Content Editor for Selected Language -->
    <Card v-if="currentTranslation">
      <template #title>
        Content in {{ getLanguageName(editingLang) }}
      </template>

      <template #content>
        <div class="field">
          <label>Page Slug (URL)</label>
          <InputText v-model="currentTranslation.slug" />
          <small>Example: /about, /tentang, /a-propos</small>
        </div>

        <div class="field">
          <label>Page Title</label>
          <InputText v-model="currentTranslation.title" />
        </div>

        <div class="field">
          <label>Description</label>
          <Textarea v-model="currentTranslation.description" rows="5" />
        </div>

        <Divider />

        <!-- Blocks Content -->
        <h3>Content Blocks</h3>
        <div
          v-for="(block, idx) in currentTranslation.blocks"
          :key="idx"
          class="block-editor mb-4"
        >
          <Panel :header="`${block.component} Block`">
            <div class="field">
              <label>Title</label>
              <InputText v-model="block.content.title" />
            </div>

            <div class="field">
              <label>Description</label>
              <Textarea v-model="block.content.description" />
            </div>

            <div class="field" v-if="block.content.buttonText">
              <label>Button Text</label>
              <InputText v-model="block.content.buttonText" />
            </div>
          </Panel>
        </div>

        <Divider />

        <!-- SEO Meta -->
        <h3>SEO Meta Tags</h3>
        <div class="field">
          <label>Meta Title</label>
          <InputText v-model="currentTranslation.meta.title" />
        </div>

        <div class="field">
          <label>Meta Description</label>
          <Textarea v-model="currentTranslation.meta.description" rows="3" />
        </div>
      </template>

      <template #footer>
        <Button label="Save Translation" @click="savePage" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Indonesia' },
  { code: 'fr', name: 'Français' },
];

const editingLang = ref('en');

const page = ref({
  id: 'page-1',
  name: 'about',
  translations: {
    en: {
      slug: '/about',
      title: 'About Us',
      description: 'Learn more about our company',
      blocks: [],
      meta: { title: '', description: '' },
    },
    id: {
      slug: '/tentang',
      title: 'Tentang Kami',
      description: 'Pelajari lebih lanjut tentang perusahaan kami',
      blocks: [],
      meta: { title: '', description: '' },
    },
  },
});

const currentTranslation = computed(() => {
  return page.value.translations[editingLang.value];
});

const getLanguageName = (code: string) => {
  return supportedLanguages.find((l) => l.code === code)?.name || code;
};

const savePage = async () => {
  await $fetch('/api/pages', {
    method: 'PUT',
    body: page.value,
  });
};
</script>
```

---

## 📊 Complete Example

### **Real-world Usage**

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <!-- Header -->
    <header class="site-header">
      <div class="container">
        <!-- Logo -->
        <NuxtLink to="/">
          <img :src="globalConfig?.header.logo" alt="Logo" />
        </NuxtLink>

        <!-- Dynamic Menu (from backend) -->
        <nav class="main-nav">
          <NuxtLink
            v-for="item in globalConfig?.header.menus"
            :key="item.id"
            :to="item.link"
          >
            {{ getLocalizedText(item.sysMenuLangs, item.name) }}
          </NuxtLink>
        </nav>

        <!-- Static UI buttons -->
        <div class="actions">
          <Button
            v-if="!isAuthenticated"
            :label="$t('nav.login')"
            @click="login"
          />
          <Button v-else :label="$t('nav.logout')" @click="logout" />

          <LanguageSwitcher />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer (dynamic from backend) -->
    <footer>
      <div class="container">
        <div class="footer-columns">
          <div
            v-for="column in globalConfig?.footer.columns"
            :key="column.id"
            class="footer-column"
          >
            <h4>{{ getLocalizedText(column.titleLangs) }}</h4>
            <ul>
              <li v-for="link in column.links" :key="link.id">
                <NuxtLink :to="link.url">
                  {{ getLocalizedText(link.textLangs) }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Static copyright text -->
        <p class="copyright">
          © {{ new Date().getFullYear() }} {{ $t('common.allRightsReserved') }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { globalConfig } = useGlobalConfig();
const { getLocalizedText } = useSmartI18n();
const { t } = useI18n();
</script>
```

---

## ✅ Summary: When to Use What

| Use Case              | Method                  | Example                               |
| --------------------- | ----------------------- | ------------------------------------- |
| **Button labels**     | `$t('key')`             | `$t('common.submit')`                 |
| **Form placeholders** | `$t('key')`             | `$t('form.email')`                    |
| **Error messages**    | `$t('key')`             | `$t('form.required')`                 |
| **Menu labels**       | `getLocalizedText()`    | `getLocalizedText(menu.sysMenuLangs)` |
| **Page titles**       | `getLocalizedContent()` | `page.translations[locale].title`     |
| **Block content**     | `getLocalizedContent()` | Backend returns translated content    |
| **SEO meta**          | `getLocalizedContent()` | `page.translations[locale].meta`      |

---

## 🎯 Key Takeaways

✅ **Two-layer system**: Static UI (JSON) + Dynamic content (Backend)  
✅ **Admin manages all content** through the panel, no code changes  
✅ **Automatic fallbacks** to default language  
✅ **SEO-friendly** with proper URL structure  
✅ **Type-safe** with full TypeScript support  
✅ **Scalable** - easily add new languages from admin

This is exactly how modern headless CMS platforms (Strapi, Contentful, Prismic) handle internationalization! 🚀

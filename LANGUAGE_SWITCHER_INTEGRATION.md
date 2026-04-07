# Language Switcher Integration

## ✅ Completed

The language switcher has been successfully created and integrated with:

1. **@nuxtjs/i18n module** - For UI translations
2. **Backend languages** - Fetched from `useAppGCStore().getLangs`
3. **TopbarWidget** - Added to the header navigation

## 📦 Created Components

### 1. LanguageSwitcher.vue

Location: `app/components/landing/LanguageSwitcher.vue`

Features:

- Fetches available languages from backend (`useAppGCStore().getLangs`)
- Integrates with Nuxt i18n module
- Dropdown with language selection
- Shows current language with flag icon
- Smooth transitions and animations
- Click-outside to close
- Stores language preference in localStorage

### 2. useSmartI18n Composable

Location: `app/composables/useSmartI18n.ts`

Utilities:

- `getLocalizedText(sysMenuLangs, field)` - For backend menu translations
- `getLocalizedContent(translations, field)` - For page/block content
- `getLocalizedObject(translations)` - Get all fields at once
- `hasTranslation(translations)` - Check if translation exists

## 🚀 Usage Examples

### Using Static UI Translations

```vue
<template>
  <button>{{ $t('common.submit') }}</button>
  <p>{{ $t('home.welcome') }}</p>
</template>
```

### Using Dynamic Backend Translations

```vue
<script setup lang="ts">
const { getLocalizedText } = useSmartI18n();

// For menu items with sysMenuLangs
const menu = {
  sysMenuLangs: [
    { langId: 'en', title: 'Home', description: 'Home page' },
    { langId: 'id', title: 'Beranda', description: 'Halaman beranda' },
  ],
};

const menuTitle = getLocalizedText(menu.sysMenuLangs, 'title');
const menuDesc = getLocalizedText(menu.sysMenuLangs, 'description');
</script>

<template>
  <h1>{{ menuTitle }}</h1>
  <p>{{ menuDesc }}</p>
</template>
```

### Using in Menu Navigation

```vue
<script setup lang="ts">
import type { Menu } from '~~/shared';

const props = defineProps<{
  menus: Menu[];
}>();

const { getLocalizedText } = useSmartI18n();

const items = computed(() => {
  return props.menus.map((menu) => ({
    label: getLocalizedText(menu.sysMenuLangs, 'title'),
    url: menu.url,
    items: menu.children?.map((child) => ({
      label: getLocalizedText(child.sysMenuLangs, 'title'),
      url: child.url,
    })),
  }));
});
</script>

<template>
  <Menubar :model="items" />
</template>
```

## 🎨 Styling

The LanguageSwitcher uses:

- Tailwind CSS for styling
- PrimeIcons for icons
- Dark mode support
- Responsive design

You can customize colors by modifying:

- Border colors: `border-gray-300 dark:border-gray-600`
- Background: `bg-white dark:bg-gray-900`
- Hover states: `hover:bg-gray-100 dark:hover:bg-gray-800`

## 🔧 Backend Structure Expected

The component expects languages from backend with this structure:

```typescript
interface RSysLangDto {
  id: string; // Language code: 'en', 'id', 'fr', etc.
  name: string; // Display name: 'English', 'Indonesia', etc.
  iconName: string; // Icon class: 'pi pi-flag', 'fi fi-us', etc.
}
```

## 📝 i18n Configuration

Your `nuxt.config.ts` is already configured with:

```typescript
i18n: {
  locales: [
    { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
    { code: 'id', iso: 'id-ID', file: 'id.json', name: 'Indonesia' },
  ],
  defaultLocale: 'en',
  strategy: 'prefix_except_default',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_locale',
  },
}
```

## 🌐 Adding More Languages

To add more languages:

1. **Backend**: Add language to database (already handled by admin)
2. **Frontend**: Add locale files:
   - Create `i18n/locales/fr.json`
   - Create `i18n/locales/de.json`
3. **Config**: Update `nuxt.config.ts` locales array

The LanguageSwitcher will automatically show all languages from backend!

## ✨ Features

- ✅ Fetches languages from backend dynamically
- ✅ Syncs with @nuxtjs/i18n module
- ✅ Stores user preference
- ✅ Smooth transitions
- ✅ Dark mode support
- ✅ Mobile responsive
- ✅ Accessible (ARIA labels)
- ✅ Click-outside to close
- ✅ Active language indicator

## 🚨 Next Steps

1. **Test the switcher**: Visit your site and change languages
2. **Add UI translations**: Fill in `i18n/locales/en.json` and `id.json`
3. **Update menus**: Use `useSmartI18n()` in components that show dynamic content
4. **Test with backend**: Ensure `useAppGCStore().getLangs` has data

## 📚 Related Documentation

- See `I18N_HYBRID_GUIDE.md` for complete i18n architecture
- See `IMPLEMENTATION_ROADMAP.md` Phase 2 for i18n tasks

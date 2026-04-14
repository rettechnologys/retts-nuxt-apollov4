<template>
  <div class="bg-surface-0 dark:bg-surface-900">
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <p class="text-lg">{{ t('action.loading') }}</p>
    </div>

    <DynamicRenderer
      v-else-if="pageConfig"
      :page-config="pageConfig"
      :collection-cache="collectionCache"
      :collection-loading="collectionLoading"
    />
  </div>
</template>

<script setup lang="ts">
import type { PageConfig } from '#shared/types';

const route = useRoute();
const { locale, t } = useI18n();

// Normalize slugs to always be an array for consistent rendering
const slugsArray = computed(() => {
  const slugs = route.params.slugs;
  if (Array.isArray(slugs)) return slugs;
  return slugs ? [slugs] : [];
});

// Fetch page data based on the slug path
const slugsPath = computed(() =>
  slugsArray.value.length > 0 ? slugsArray.value.join('/') : 'home',
);

const { data: pageConfig, pending } = await useFetch<PageConfig>(
  () => `/api/pages/${slugsPath.value}`,
  {
    key: () => `page-${slugsPath.value}`,
    watch: [slugsPath],
  },
);

// ── Client-side collection cache ─────────────────────────────────────────────
// Keyed by collection slug → fresh items fetched after page config is available.
// Overwrites the server-embedded collectionItems so new items are always visible.
const collectionCache = ref<Record<string, any[]>>({});
// Per-slug loading flag — starts empty ({}) on both SSR and client (hydration safe).
const collectionLoading = ref<Record<string, boolean>>({});

const fetchPageCollections = async (config: PageConfig | null) => {
  if (!config?.blocks?.length) return;

  // Deduplicate slugs across all blocks
  const slugs = [
    ...new Set(
      config.blocks
        .map((b) => b.dataSource?.collection)
        .filter((s): s is string => !!s),
    ),
  ];

  if (!slugs.length) return;

  await Promise.all(
    slugs.map(async (slug) => {
      collectionLoading.value = { ...collectionLoading.value, [slug]: true };
      try {
        const res = await $fetch<{ items: any[] }>(
          `/api/collections/${slug}/items?perPage=100`,
        );
        collectionCache.value = {
          ...collectionCache.value,
          [slug]: res.items ?? [],
        };
      } catch (e) {
        console.warn(`[page] Failed to fetch collection "${slug}":`, e);
      } finally {
        collectionLoading.value = { ...collectionLoading.value, [slug]: false };
      }
    }),
  );
  console.log('[page] Collection cache updated:', collectionCache.value);
};

onMounted(() => {
  if (pageConfig.value && import.meta.client)
    fetchPageCollections(pageConfig.value);
});

// Fetch on initial load and whenever the page config changes (route change)
watch(pageConfig, (config) => {
  if (config && import.meta.client) fetchPageCollections(config);
});
</script>

<style scoped></style>

<template>
  <BaseLayout
    container="section"
    padding="section"
    class="text-center relative overflow-hidden"
  >
    <!-- Optional Decorative Image -->
    <div
      v-if="decorativeImage"
      class="hidden lg:block absolute top-0 right-0 size-full transform translate-x-[60%] pointer-events-none"
    >
      <img
        :src="decorativeImage"
        :alt="decorativeImageAlt"
        class="w-full h-full object-contain"
      />
    </div>

    <!-- Title Section -->
    <div class="mb-4">
      <h2
        class="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4"
      >
        {{ title }}
      </h2>
      <p
        class="text-surface-600 dark:text-surface-400 text-lg max-w-3xl mx-auto"
      >
        {{ description }}
      </p>
    </div>

    <!-- Collection binding badge -->
    <div v-if="dataSource?.collection" class="mb-6 flex justify-center">
      <span
        class="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-full text-sm text-primary-700 dark:text-primary-300"
      >
        <i class="pi pi-database text-xs" />
        <span
          >Collection: <strong>{{ dataSource.collection }}</strong></span
        >
        <span class="text-xs opacity-60">({{ dataSource.mode }})</span>
      </span>
    </div>

    <!-- ── Collection-sourced grid ──────────────────────────── -->
    <template v-if="dataSource?.collection">
      <!-- Mapped collection cards -->
      <BaseLayout
        v-if="collectionItems.length > 0"
        layout="grid"
        :cols="columns"
        gap="lg"
        class="max-w-7xl mx-auto"
        :full-height="false"
      >
        <GridCard v-for="(item, index) in mappedItems" :key="index">
          <template v-if="item.image" #header>
            <img
              :src="item.image"
              :alt="item.title || ''"
              class="w-full h-40 object-cover rounded-t-lg"
            />
          </template>
          <template #content>
            <h3
              v-if="item.title"
              class="font-semibold text-surface-900 dark:text-surface-0 mb-1 text-left"
            >
              {{ item.title }}
            </h3>
            <p
              v-if="item.description"
              class="text-sm text-surface-500 dark:text-surface-400 line-clamp-3 text-left"
            >
              {{ item.description }}
            </p>
            <div v-if="item.tag" class="mt-2 text-left">
              <span
                class="inline-block px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300"
              >
                {{ item.tag }}
              </span>
            </div>
          </template>
        </GridCard>
      </BaseLayout>

      <!-- Empty collection state -->
      <div v-else class="py-16 text-center text-surface-400">
        <i class="pi pi-inbox text-4xl mb-3 block" />
        <p class="text-sm font-medium">
          No items in "{{ dataSource.collection }}"
        </p>
        <p class="text-xs mt-1 opacity-70">
          Add items to this collection to see them here.
        </p>
      </div>
    </template>

    <!-- ── Static / manual items (original behaviour) ─────── -->
    <BaseLayout
      v-else
      layout="grid"
      :cols="columns"
      gap="lg"
      class="max-w-7xl mx-auto mt-12"
      :full-height="false"
    >
      <GridCard
        v-for="(item, index) in items"
        :key="index"
        :highlight="item.highlight"
        :highlight-label="item.highlightLabel"
      >
        <template v-if="item.badgeComponents" #badge>
          <DynamicComponentRenderer
            v-for="(component, i) in item.badgeComponents"
            :key="`badge-${index}-${i}`"
            :component-config="component"
          />
        </template>

        <template #header>
          <DynamicComponentRenderer
            v-for="(component, i) in item.headerComponents"
            :key="`header-${index}-${i}`"
            :component-config="component"
          />
        </template>

        <template #content>
          <DynamicComponentRenderer
            v-for="(component, i) in item.contentComponents"
            :key="`content-${index}-${i}`"
            :component-config="component"
          />
        </template>

        <template #footer>
          <DynamicComponentRenderer
            v-for="(component, i) in item.footerComponents"
            :key="`footer-${index}-${i}`"
            :component-config="component"
          />
        </template>
      </GridCard>
    </BaseLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import type { ComponentConfig } from '#shared/types';
import { useCollectionDataSource } from '~/composables/admin/useCollectionDataSource';
import GridCard from './GridCard.vue';

interface GridItem {
  highlight?: boolean;
  highlightLabel?: string;
  badgeComponents?: ComponentConfig[];
  headerComponents?: ComponentConfig[];
  contentComponents?: ComponentConfig[];
  footerComponents?: ComponentConfig[];
}

interface CollectionDataSource {
  collection: string;
  mode: 'list' | 'single';
  /** Maps collection field keys → rendered prop keys (e.g. { "cover": "image", "body": "description" }) */
  fieldMappings: Record<string, string>;
}

interface Props {
  title?: string;
  description?: string;
  items?: GridItem[];
  columns?: '1' | '2' | '3' | '4';
  decorativeImage?: string;
  decorativeImageAlt?: string;
  dataSource?: CollectionDataSource;
  /** Pre-fetched raw items passed down from create.vue via PageDesign */
  collectionItems?: Array<Record<string, any>>;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Grid View',
  description: 'Dynamic grid layout with flexible content',
  items: () => [],
  columns: '3',
  decorativeImageAlt: 'Decorative element',
  collectionItems: () => [],
});

/** Apply fieldMappings to raw items; fall back to raw fields when no mappings set */
const { mappedItems } = useCollectionDataSource(
  () => props.collectionItems,
  () => props.dataSource,
);
// const mappedItems = computed<Record<string, any>[]>(() => {
//   const mappings = props.dataSource?.fieldMappings ?? {};
//   const hasMappings = Object.keys(mappings).length > 0;
//   const data = props.collectionItems.map((item) => {
//     if (hasMappings) {
//       const mapped: Record<string, any> = {};
//       for (const [colField, blockKey] of Object.entries(mappings)) {
//         // Strip "parentArray." prefix — "items.title" → "title"
//         const targetKey = blockKey.includes('.')
//           ? blockKey.split('.').slice(1).join('.')
//           : blockKey;
//         mapped[targetKey] = item.data?.[colField] ?? item[colField];
//       }
//       return mapped;
//     }
//     return item.data ? { ...item.data } : { ...item };
//   });
//   console.log('Mapped items for GridViewBlock:', data);
//   return data;
// });
</script>

<style scoped></style>

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

    <!-- Dynamic Grid -->
    <BaseLayout
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
import GridCard from './GridCard.vue';

interface GridItem {
  highlight?: boolean;
  highlightLabel?: string;
  badgeComponents?: ComponentConfig[];
  headerComponents?: ComponentConfig[];
  contentComponents?: ComponentConfig[];
  footerComponents?: ComponentConfig[];
}

interface Props {
  title?: string;
  description?: string;
  items?: GridItem[];
  columns?: '1' | '2' | '3' | '4';
  decorativeImage?: string;
  decorativeImageAlt?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Grid View',
  description: 'Dynamic grid layout with flexible content',
  items: () => [],
  columns: '3',
  decorativeImageAlt: 'Decorative element',
});
</script>

<style scoped></style>

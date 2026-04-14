<template>
  <div class="page-design-preview">
    <div
      v-if="blocks.length === 0"
      class="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-surface-300 bg-surface-50 px-6 py-12 text-center text-surface-500"
    >
      <i class="pi pi-desktop mb-4 text-4xl" />
      <h3 class="text-lg font-semibold text-surface-700">Nothing to preview</h3>
      <p class="mt-2 max-w-xl text-sm">
        Add blocks in the Page Design tab to render a full-page preview here.
      </p>
    </div>

    <div
      v-else
      class="overflow-hidden rounded-[2rem] border border-surface-200 bg-white shadow-sm"
    >
      <component
        v-for="block in blocks"
        :key="block.id"
        :is="getBlockComponent(block.type)"
        :called-from-preview="true"
        v-bind="getPreviewBindings(block)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { BlockDefinition } from './pageDesign.types';
import {
  createBlockValues,
  mergeBlockValues,
  resolveBlockValues,
} from './pageDesignSchema';

const props = defineProps<{
  blocks: BlockDefinition[];
  collectionCache?: Record<string, any[]>;
}>();

console.log('PageDesignPreview received blocks:', props.blocks);

const blockComponentMap: Record<
  string,
  ReturnType<typeof defineAsyncComponent>
> = {
  hero: defineAsyncComponent(
    () => import('~/components/blocks/HeroSection_2.vue'),
  ),
  text: defineAsyncComponent(() => import('~/components/blocks/TextBlock.vue')),
  heading: defineAsyncComponent(
    () => import('~/components/blocks/HeadingBlock.vue'),
  ),
  image: defineAsyncComponent(
    () => import('~/components/blocks/ImageBlock.vue'),
  ),
  button: defineAsyncComponent(
    () => import('~/components/blocks/ButtonBlock.vue'),
  ),
  grid: defineAsyncComponent(() => import('~/components/blocks/GridBlock.vue')),
  card: defineAsyncComponent(() => import('~/components/blocks/CardBlock.vue')),
  columns: defineAsyncComponent(
    () => import('~/components/blocks/ColumnsBlock.vue'),
  ),
  cta: defineAsyncComponent(() => import('~/components/blocks/CTABlock.vue')),
  feature: defineAsyncComponent(
    () => import('~/components/blocks/FeatureBlock.vue'),
  ),
  video: defineAsyncComponent(
    () => import('~/components/blocks/VideoBlock.vue'),
  ),
  testimonial: defineAsyncComponent(
    () => import('~/components/blocks/TestimonialBlock.vue'),
  ),
  testimonials: defineAsyncComponent(
    () => import('~/components/blocks/TestimonialsBlock.vue'),
  ),
  form: defineAsyncComponent(() => import('~/components/blocks/FormBlock.vue')),
  'content-listing': defineAsyncComponent(
    () => import('~/components/blocks/ContentListingBlock.vue'),
  ),
  'grid-view': defineAsyncComponent(
    () => import('~/components/blocks/GridViewBlock.vue'),
  ),
};

const getBlockComponent = (type: string) => blockComponentMap[type] ?? null;

const getPreviewBindings = (block: BlockDefinition): Record<string, any> => {
  const merged = mergeBlockValues(
    resolveBlockValues(
      block.defaultConfig,
      createBlockValues(block.defaultConfig),
    ),
  );

  if (block.previewMode === 'config') {
    return { config: merged };
  }

  const dataSource = (block as any).dataSource;
  if (dataSource?.collection) {
    const allItems = props.collectionCache?.[dataSource.collection] ?? [];
    const collectionItems =
      dataSource.mode === 'single' ? allItems.slice(0, 1) : allItems;
    return { ...merged, dataSource, collectionItems };
  }

  return merged;
};
</script>

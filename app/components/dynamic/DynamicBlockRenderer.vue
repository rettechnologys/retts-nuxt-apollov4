<template>
  <!-- Collection loading skeleton -->
  <BlocksSkeleton v-if="showSkeleton" :type="blockConfig.component" />

  <!-- Predefined Widget Block -->
  <component
    :is="resolvedWidget"
    v-else-if="isPredefin"
    v-bind="resolvedProps"
  />

  <!-- Custom Field-Based Block -->
  <div v-else v-bind="blockConfig.props">
    <DynamicComponentRenderer
      v-for="(component, index) in blockConfig.components"
      :key="`${component.name}-${index}`"
      :component-config="component"
    />
  </div>
</template>

<script setup lang="ts">
import type { BlockConfig } from '#shared/types';
import BlocksSkeleton from '~/components/blocks/BlockSkeleton.vue';
import {
  getBlockClasses,
  isPredefinedBlock,
  resolveWidget,
} from '~/utils/helpers/ComponentResolvers';

interface Props {
  blockConfig: BlockConfig;
  collectionCache?: Record<string, any[]>;
  collectionLoading?: Record<string, boolean>;
}

const props = defineProps<Props>();

const simulatedLoading = ref(!!props.blockConfig.dataSource?.collection);
if (import.meta.client && props.blockConfig.dataSource?.collection) {
  setTimeout(() => {
    simulatedLoading.value = false;
  }, 1000);
}

const isPredefin = computed(() => isPredefinedBlock(props.blockConfig));
const resolvedWidget = computed(() => resolveWidget(props.blockConfig));

// Merge static props with collection data.
// Client cache takes priority over server-embedded items so new items are always fresh.
const resolvedProps = computed(() => {
  const slug = props.blockConfig.dataSource?.collection;
  const mode = props.blockConfig.dataSource?.mode;
  const liveItems = slug ? props.collectionCache?.[slug] : undefined;
  const allItems = liveItems ?? props.blockConfig.collectionItems ?? [];
  const collectionItems = mode === 'single' ? allItems.slice(0, 1) : allItems;
  return {
    ...props.blockConfig.props,
    ...(props.blockConfig.dataSource && {
      dataSource: props.blockConfig.dataSource,
    }),
    collectionItems,
  };
});

// Show skeleton when the block has a dataSource, is actively loading,
// AND neither the live cache nor the server-embedded items are available yet.
// This avoids a skeleton flash when SSR already embedded items.
const showSkeleton = computed(() => {
  const slug = props.blockConfig.dataSource?.collection;
  if (!slug) return false;
  const isLoading =
    (props.collectionLoading?.[slug] ?? false) || simulatedLoading.value;
  const hasItems =
    (props.collectionCache?.[slug]?.length ?? 0) > 0 ||
    (props.blockConfig.collectionItems?.length ?? 0) > 0;

  // return isLoading && !hasItems;
  return isLoading;
});

const blockClasses = computed(() => getBlockClasses(props.blockConfig.name));
</script>

<template>
  <!-- Predefined Widget Block -->
  <component
    :is="resolvedWidget"
    v-if="isPredefinedBlock"
    v-bind="blockConfig.props"
  />
  
  <!-- Custom Field-Based Block -->
  <div v-else :class="blockClasses" v-bind="blockConfig.props">
    <DynamicComponentRenderer
      v-for="(component, index) in blockConfig.components"
      :key="`${component.name}-${index}`"
      :component-config="component"
    />
  </div>
</template>

<script setup lang="ts">
import type { BlockConfig } from '#shared/types';
import { defineAsyncComponent } from 'vue';

interface Props {
  blockConfig: BlockConfig;
}

const props = defineProps<Props>();

// Predefined widget mapping
const widgetMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  HeroWidget: defineAsyncComponent(() => import('@/components/landing/HeroWidget.vue')),
  FeaturesWidget: defineAsyncComponent(() => import('@/components/landing/FeaturesWidget.vue')),
  HighlightsWidget: defineAsyncComponent(() => import('@/components/landing/HighlightsWidget.vue')),
  PricingWidget: defineAsyncComponent(() => import('@/components/landing/PricingWidget.vue')),
  FooterWidget: defineAsyncComponent(() => import('@/components/landing/FooterWidget.vue')),
  TopbarWidget: defineAsyncComponent(() => import('@/components/landing/TopbarWidget.vue')),
  // Add more predefined widgets as needed
};

// Check if this is a predefined widget block
const isPredefinedBlock = computed(() => {
  // Explicit type check
  if (props.blockConfig.type === 'predefined') return true;
  // Implicit check: has component property but no components array
  if (props.blockConfig.component && !props.blockConfig.components) return true;
  return false;
});

// Resolve predefined widget component
const resolvedWidget = computed(() => {
  if (!isPredefinedBlock.value) return null;
  
  const widgetName = props.blockConfig.component || props.blockConfig.name;
  
  if (!widgetMap[widgetName]) {
    console.warn(`Predefined widget "${widgetName}" not found in widgetMap`);
    return 'div';
  }
  
  return widgetMap[widgetName];
});

// Block layout mapping for custom blocks
const blockLayoutClasses: Record<string, string> = {
  'grid-columns': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  'flex-row': 'flex flex-row gap-4 items-center',
  'flex-column': 'flex flex-col gap-4',
  'hero-section': 'flex flex-col items-center justify-center min-h-[500px] gap-8',
  'single-column': 'flex flex-col gap-6 max-w-4xl mx-auto',
  // Add more block layouts as needed
};

const blockClasses = computed(() => {
  return blockLayoutClasses[props.blockConfig.name] || 'flex flex-col gap-4';
});
</script>

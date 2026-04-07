<template>
  <!-- Predefined Widget Block -->
  <component
    :is="resolvedWidget"
    v-if="isPredefin"
    v-bind="blockConfig.props"
  />

  <!-- Custom Field-Based Block -->
  <div v-else v-bind="blockConfig.props">
    <DynamicComponentRenderer
      v-for="(component, index) in blockConfig.components"
      :key="`${component.name}-${index}`"
      :component-config="component"
    />
    <!-- <DynamicComponentRenderer
      :key="`${blockConfig.child.name}`"
      :component-config="blockConfig.child"
    /> -->
  </div>
</template>

<script setup lang="ts">
import type { BlockConfig } from '#shared/types';
import {
  isPredefinedBlock,
  resolveWidget,
  getBlockClasses,
} from '~/utils/helpers/ComponentResolvers';

interface Props {
  blockConfig: BlockConfig;
}

const props = defineProps<Props>();
// console.log('Rendering block with config:', props.blockConfig);

// Check if this is a predefined widget block
const isPredefin = computed(() => isPredefinedBlock(props.blockConfig));

// Resolve predefined widget component
const resolvedWidget = computed(() => resolveWidget(props.blockConfig));
console.log('Resolved widget component:', resolvedWidget.value);

// Get block layout classes
const blockClasses = computed(() => getBlockClasses(props.blockConfig.name));
</script>

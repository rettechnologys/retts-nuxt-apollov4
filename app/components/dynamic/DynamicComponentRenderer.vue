<template>
  <component
    :is="resolvedComponent"
    v-bind="{ ...componentConfig.props, ...componentConfig.content }"
  />
</template>

<script setup lang="ts">
import type { ComponentConfig } from '#shared/types';
import { defineAsyncComponent } from 'vue';

interface Props {
  componentConfig: ComponentConfig;
}

const props = defineProps<Props>();

// Component mapping - register your field components here
const componentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  ImageField: defineAsyncComponent(() => import('@/components/fields/ImageField.vue')),
  H1_TextField: defineAsyncComponent(() => import('@/components/fields/H1_TextField.vue')),
  ButtonField: defineAsyncComponent(() => import('@/components/fields/ButtonField.vue')),
  // Add more components as needed
};

const resolvedComponent = computed(() => {
  const componentName = props.componentConfig.component;
  if (!componentMap[componentName]) {
    console.warn(`Component "${componentName}" not found in componentMap`);
    return 'div';
  }
  return componentMap[componentName];
});
</script>

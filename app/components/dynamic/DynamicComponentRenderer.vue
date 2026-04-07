<template>
  <!-- <component
    :is="resolvedComponent"
    v-bind="{ ...componentConfig.props, ...componentConfig.content }"
  > -->
  <component
    :is="resolvedComponent"
    v-bind="{ ...componentConfig, ...componentConfig?.props }"
  >
    <!-- Render nested components if they exist -->
    <template
      v-if="componentConfig.children && componentConfig.children.length > 0"
    >
      <DynamicComponentRenderer
        v-for="(childComponent, index) in componentConfig.children"
        :key="`${childComponent.name}-${index}`"
        :component-config="{ ...childComponent }"
        v-bind="{ ...childComponent?.props }"
      />
    </template>
  </component>
</template>

<script setup lang="ts">
import type { ComponentConfig } from '#shared/types';
import { resolveFieldComponent } from '~/utils/helpers/ComponentResolvers';

interface Props {
  componentConfig: ComponentConfig;
}

const props = defineProps<Props>();
console.log('Rendering component with config:', props.componentConfig);

// Resolve the component from registry
const resolvedComponent = computed(() => {
  // const componentName = props.componentConfig.component;
  const componentName = props.componentConfig.name;
  console.log(
    `Resolving component "${componentName}" for config:`,
    props.componentConfig,
  );
  return resolveFieldComponent(componentName);
});
// console.log('Resolved component:', resolvedComponent.value);
</script>

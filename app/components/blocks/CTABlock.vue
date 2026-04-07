<template>
  <BaseLayout
    container="section"
    padding="section"
    class="relative overflow-hidden"
    bg="custom"
    custom-bg="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900"
    :class="[
      variant === 'naked'
        ? ''
        : 'border border-surface-200 dark:border-surface-700 rounded-2xl flex flex-col items-center',
    ]"
    :full-height="false"
  >
    <!-- Decorative Images -->
    <div v-if="showDecorations" class="hidden lg:block">
      <img
        v-if="decorationLeft"
        :src="decorationLeft"
        :alt="decorationLeftAlt"
        class="absolute left-10 -top-10 sm:top-0 h-full object-contain pointer-events-none"
      />
      <img
        v-if="decorationRight"
        :src="decorationRight"
        :alt="decorationRightAlt"
        class="absolute right-0 bottom-0 h-full object-contain pointer-events-none"
      />
    </div>

    <!-- Background Slot -->
    <div
      v-if="backgroundComponents && backgroundComponents.length > 0"
      class="absolute inset-0 z-0"
    >
      <DynamicComponentRenderer
        v-for="(component, index) in backgroundComponents"
        :key="`bg-${index}`"
        :component-config="component"
      />
    </div>

    <!-- Content Container -->
    <BaseLayout
      layout="flex"
      direction="column"
      align="center"
      justify="center"
      gap="lg"
      class="relative z-10 flex flex-col items-center"
      :full-height="false"
    >
      <!-- Title -->
      <div v-if="title" class="text-center max-w-4xl">
        <h2
          class="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-surface-0"
        >
          {{ title }}
        </h2>
      </div>

      <!-- Description -->
      <div v-if="description" class="text-center max-w-3xl">
        <p class="text-xl md:text-2xl text-surface-600 dark:text-surface-400">
          {{ description }}
        </p>
      </div>

      <!-- Dynamic Content Components -->
      <div
        v-if="contentComponents && contentComponents.length > 0"
        class="w-full"
      >
        <BaseLayout
          layout="flex"
          direction="column"
          align="center"
          gap="md"
          :full-height="false"
        >
          <DynamicComponentRenderer
            v-for="(component, index) in contentComponents"
            :key="`content-${index}`"
            :component-config="component"
          />
        </BaseLayout>
      </div>

      <!-- Action Buttons -->
      <div
        v-if="actions && actions.length > 0"
        class="flex flex-wrap gap-4 justify-center"
      >
        <Button
          v-for="(action, index) in actions"
          :key="index"
          :label="action.label"
          :class="[
            action.variant === 'primary'
              ? 'bg-primary-500 hover:bg-primary-600 text-white'
              : 'bg-surface-900 dark:bg-surface-0 hover:bg-surface-800 dark:hover:bg-surface-100',
            action.class,
          ]"
          :size="action.size || 'large'"
          @click="handleAction(action)"
        />
      </div>
    </BaseLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import type { ComponentConfig } from '#shared/types';

interface Action {
  label: string;
  url?: string;
  target?: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'large';
  class?: string;
}

interface Props {
  title?: string;
  description?: string;
  variant?: 'default' | 'naked';
  class?: string | string[];
  backgroundComponents?: ComponentConfig[];
  contentComponents?: ComponentConfig[];
  actions?: Action[];
  decorationLeft?: string;
  decorationRight?: string;
  decorationLeftAlt?: string;
  decorationRightAlt?: string;
  showDecorations?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Join With Us',
  description: 'Make a difference by becoming a part of our community today.',
  variant: 'default',
  backgroundComponents: () => [],
  contentComponents: () => [],
  actions: () => [],
  decorationLeftAlt: 'Decoration',
  decorationRightAlt: 'Decoration',
  showDecorations: true,
});

const handleAction = (action: Action) => {
  if (action.url) {
    navigateTo(action.url, {
      external: action.target === '_blank',
      ...(action.target && {
        open: {
          target: action.target,
        },
      }),
    });
  }
};
</script>

<style scoped></style>

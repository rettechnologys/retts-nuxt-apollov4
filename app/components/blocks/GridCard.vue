<template>
  <BaseLayout
    layout="flex"
    direction="column"
    padding="lg"
    :class="[
      'rounded-xl border transition-all duration-300 h-full',
      highlight
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 shadow-xl scale-105 relative z-10'
        : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 hover:shadow-lg',
    ]"
    :full-height="false"
  >
    <!-- Highlight Badge -->
    <div
      v-if="highlight && $slots.badge"
      class="absolute -top-4 left-1/2 -translate-x-1/2"
    >
      <slot name="badge">
        <span
          class="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold"
        >
          {{ highlightLabel }}
        </span>
      </slot>
    </div>

    <!-- Header Slot -->
    <div v-if="$slots.header" class="mb-4">
      <slot name="header" />
    </div>

    <!-- Content Slot (main body) -->
    <div class="flex-grow">
      <slot name="content" />
    </div>

    <!-- Footer Slot -->
    <div v-if="$slots.footer" class="mt-auto pt-4">
      <slot name="footer" />
    </div>

    <!-- Default Slot (fallback) -->
    <slot />
  </BaseLayout>
</template>

<script setup lang="ts">
interface Props {
  highlight?: boolean;
  highlightLabel?: string;
}

withDefaults(defineProps<Props>(), {
  highlight: false,
  highlightLabel: 'Popular',
});
</script>

<style scoped></style>

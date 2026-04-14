<template>
  <!-- grid-view skeleton: title + N card columns -->
  <BaseLayout
    v-if="type === 'grid-view'"
    container="section"
    padding="section"
    class="text-center"
  >
    <Skeleton height="2.5rem" width="40%" class="mx-auto mb-3 rounded-xl" />
    <Skeleton height="1rem" width="60%" class="mx-auto mb-8 rounded-lg" />
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="rounded-2xl overflow-hidden border border-surface-100 dark:border-surface-700"
      >
        <Skeleton height="180px" class="w-full" />
        <div class="p-4 space-y-2">
          <Skeleton height="1.1rem" width="75%" class="rounded" />
          <Skeleton height="0.85rem" width="90%" class="rounded" />
          <Skeleton height="0.85rem" width="60%" class="rounded" />
        </div>
      </div>
    </div>
  </BaseLayout>

  <!-- hero skeleton: full-width tall banner -->
  <BaseLayout
    v-else-if="type === 'hero'"
    container="section"
    padding="section"
    class="flex flex-col items-center text-center gap-6"
  >
    <Skeleton height="3rem" width="55%" class="mx-auto rounded-xl" />
    <Skeleton height="1rem" width="70%" class="mx-auto rounded-lg" />
    <Skeleton height="1rem" width="50%" class="mx-auto rounded-lg" />
    <div class="flex gap-3 justify-center mt-2">
      <Skeleton height="2.5rem" width="8rem" class="rounded-full" />
      <Skeleton height="2.5rem" width="8rem" class="rounded-full" />
    </div>
  </BaseLayout>

  <!-- testimonials skeleton: 3 quote cards in a row -->
  <BaseLayout
    v-else-if="type === 'testimonials'"
    container="section"
    padding="section"
  >
    <Skeleton height="2rem" width="35%" class="mx-auto mb-8 rounded-xl" />
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div
        v-for="i in 3"
        :key="i"
        class="rounded-2xl border border-surface-100 dark:border-surface-700 p-5 space-y-3"
      >
        <Skeleton height="0.85rem" class="rounded" />
        <Skeleton height="0.85rem" width="80%" class="rounded" />
        <Skeleton height="0.85rem" width="65%" class="rounded" />
        <div class="flex items-center gap-3 pt-2">
          <Skeleton shape="circle" size="2.5rem" />
          <div class="flex-1 space-y-1">
            <Skeleton height="0.85rem" width="60%" class="rounded" />
            <Skeleton height="0.75rem" width="40%" class="rounded" />
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>

  <!-- feature skeleton: 3 icon+text rows -->
  <BaseLayout
    v-else-if="type === 'feature'"
    container="section"
    padding="section"
  >
    <Skeleton height="2rem" width="40%" class="mx-auto mb-8 rounded-xl" />
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
    >
      <div v-for="i in 3" :key="i" class="flex gap-4 items-start p-4">
        <Skeleton shape="circle" size="3rem" class="flex-shrink-0" />
        <div class="flex-1 space-y-2">
          <Skeleton height="1rem" width="60%" class="rounded" />
          <Skeleton height="0.85rem" class="rounded" />
          <Skeleton height="0.85rem" width="75%" class="rounded" />
        </div>
      </div>
    </div>
  </BaseLayout>

  <!-- card skeleton: single card -->
  <BaseLayout v-else-if="type === 'card'" container="section" padding="section">
    <div
      class="max-w-sm mx-auto rounded-2xl overflow-hidden border border-surface-100 dark:border-surface-700"
    >
      <Skeleton height="200px" class="w-full" />
      <div class="p-5 space-y-3">
        <Skeleton height="1.2rem" width="70%" class="rounded" />
        <Skeleton height="0.85rem" class="rounded" />
        <Skeleton height="0.85rem" width="85%" class="rounded" />
      </div>
    </div>
  </BaseLayout>

  <!-- default fallback skeleton -->
  <BaseLayout v-else container="section" padding="section">
    <Skeleton height="2rem" width="45%" class="mx-auto mb-4 rounded-xl" />
    <Skeleton height="1rem" width="65%" class="mx-auto mb-2 rounded-lg" />
    <Skeleton height="1rem" width="50%" class="mx-auto rounded-lg" />
  </BaseLayout>
</template>

<script setup lang="ts">
defineProps<{
  /** Block component type — determines which skeleton layout to render */
  type?: string;
}>();
</script>

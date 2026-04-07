<template>
  <section class="grid-block py-12 px-6">
    <div class="grid gap-6" :class="gridClass">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="grid-item p-6 border rounded-lg"
      >
        <i
          v-if="item.icon"
          :class="item.icon"
          class="text-4xl text-primary mb-4"
        ></i>
        <h3 class="text-xl font-semibold mb-2">
          {{ item.title || `Item ${index + 1}` }}
        </h3>
        <p class="text-surface-600 dark:text-surface-400">
          {{ item.description || 'Description goes here' }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface GridItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface GridConfig {
  columns?: number;
  items?: GridItem[];
}

const props = defineProps<{
  config?: GridConfig;
}>();

const items = computed(
  () =>
    props.config?.items || [
      { title: 'Item 1', description: 'Description 1' },
      { title: 'Item 2', description: 'Description 2' },
      { title: 'Item 3', description: 'Description 3' },
    ],
);

const gridClass = computed(() => {
  const columns = props.config?.columns || 3;
  return {
    'grid-cols-1': columns === 1,
    'sm:grid-cols-2': columns >= 2,
    'lg:grid-cols-3': columns >= 3,
    'lg:grid-cols-4': columns >= 4,
  };
});
</script>

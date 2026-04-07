<template>
  <section class="columns-block py-12 px-6">
    <div class="grid gap-6" :class="columnsClass">
      <div v-for="(column, index) in columns" :key="index" class="column-item">
        <div
          v-html="column.content || `<p>Column ${index + 1} content</p>`"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Column {
  content?: string;
}

interface ColumnsConfig {
  columnCount?: number;
  columns?: Column[];
}

const props = defineProps<{
  config?: ColumnsConfig;
}>();

const columns = computed(() => {
  const count = props.config?.columnCount || 2;
  return props.config?.columns || Array(count).fill({ content: '' });
});

const columnsClass = computed(() => {
  const count = props.config?.columnCount || 2;
  return {
    'grid-cols-1': true,
    'md:grid-cols-2': count >= 2,
    'lg:grid-cols-3': count >= 3,
    'lg:grid-cols-4': count >= 4,
  };
});
</script>

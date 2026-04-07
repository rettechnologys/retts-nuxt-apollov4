<template>
  <div class="container mx-auto px-4 py-8" :class="maxWidthClass">
    <h2 v-if="title" class="text-2xl font-bold mb-6">{{ title }}</h2>

    <div :class="layoutClass">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex gap-4"
        :class="itemClass"
      >
        <div v-if="item.icon" class="flex-shrink-0">
          <Icon :name="item.icon" class="text-2xl text-primary-600" />
        </div>

        <div class="flex-1">
          <dt class="font-semibold text-gray-900 dark:text-gray-100">
            {{ item.label }}
          </dt>
          <dd class="text-gray-600 dark:text-gray-400 mt-1">
            <component
              :is="item.href ? 'a' : 'span'"
              :href="item.href"
              :target="item.href ? '_blank' : undefined"
              :class="item.href ? 'text-primary-600 hover:underline' : ''"
            >
              {{ item.value }}
            </component>
          </dd>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InfoItem {
  label: string;
  value: string;
  icon?: string;
  href?: string;
}

interface Props {
  title?: string;
  items: InfoItem[];
  layout?: 'list' | 'grid';
  columns?: number;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'list',
  columns: 2,
  maxWidth: '4xl',
});

const maxWidthClass = computed(() => {
  const widths: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };
  return widths[props.maxWidth];
});

const layoutClass = computed(() => {
  if (props.layout === 'grid') {
    const gridCols: Record<number, string> = {
      1: 'grid grid-cols-1 gap-6',
      2: 'grid md:grid-cols-2 gap-6',
      3: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6',
    };
    return gridCols[props.columns] || 'grid md:grid-cols-2 gap-6';
  }
  return 'space-y-4';
});

const itemClass = computed(() => {
  return props.layout === 'list'
    ? 'py-4 border-b border-gray-200 dark:border-gray-700 last:border-0'
    : '';
});
</script>

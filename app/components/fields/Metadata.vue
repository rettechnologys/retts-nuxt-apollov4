<template>
  <div class="container mx-auto px-4 py-6" :class="maxWidthClass">
    <div
      class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400"
    >
      <!-- Author/Creator -->
      <div v-if="author" class="flex items-center gap-2">
        <img
          v-if="author.avatar"
          :src="author.avatar"
          :alt="author.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <span class="font-medium">{{ author.name }}</span>
      </div>

      <!-- Date -->
      <span v-if="date" class="flex items-center gap-1">
        <Icon v-if="showDateIcon" name="mdi:calendar" />
        {{ formatDate(date) }}
      </span>

      <!-- Reading/Duration time -->
      <span v-if="duration" class="flex items-center gap-1">
        <Icon name="mdi:clock-outline" />
        {{ duration }} {{ durationUnit }}
      </span>

      <!-- Custom metadata items -->
      <span
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-1"
      >
        <Icon v-if="item.icon" :name="item.icon" />
        {{ item.label }}
      </span>

      <!-- Tags -->
      <div v-if="tags?.length" class="flex gap-2 ml-auto">
        <NuxtLink
          v-for="tag in tags"
          :key="tag"
          :to="tagLinkBase ? `${tagLinkBase}?tag=${tag}` : '#'"
          class="px-3 py-1 rounded-full text-xs transition-colors"
          :class="tagClass"
        >
          {{ tag }}
        </NuxtLink>
      </div>
    </div>

    <!-- Categories -->
    <div v-if="categories?.length" class="flex gap-2 mt-4">
      <span class="text-sm font-medium">Categories:</span>
      <NuxtLink
        v-for="category in categories"
        :key="category"
        :to="
          categoryLinkBase ? `${categoryLinkBase}?category=${category}` : '#'
        "
        class="text-sm text-primary-600 hover:underline"
      >
        {{ category }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MetadataItem {
  label: string;
  icon?: string;
}

interface Props {
  author?: {
    name: string;
    avatar?: string;
  };
  date?: string;
  showDateIcon?: boolean;
  duration?: number;
  durationUnit?: string;
  items?: MetadataItem[];
  tags?: string[];
  tagLinkBase?: string;
  tagClass?: string;
  categories?: string[];
  categoryLinkBase?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  showDateIcon: false,
  durationUnit: 'min read',
  tagClass:
    'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800',
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

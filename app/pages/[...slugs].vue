<template>
  <div class="bg-surface-0 dark:bg-surface-900">
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <p class="text-lg">Loading...</p>
    </div>
    
    <DynamicRenderer v-else-if="pageConfig" :page-config="pageConfig" />
  </div>
</template>

<script setup lang="ts">
import type { PageConfig } from '#shared/types';

const route = useRoute();

// Normalize slugs to always be an array for consistent rendering
const slugsArray = computed(() => {
  const slugs = route.params.slugs;
  if (Array.isArray(slugs)) {
    return slugs;
  }
  return slugs ? [slugs] : [];
});

// Fetch page data based on the slug path
const slugsPath = computed(() => slugsArray.value.join('/') || 'home');
console.log('slugpath', slugsPath.value)
const { data: pageConfig, pending,  } = await useFetch<PageConfig>(
  `/api/pages/${slugsPath.value}`,
  {
    key: `page-${slugsPath.value}`,
  }
);
</script>

<style scoped>

</style>
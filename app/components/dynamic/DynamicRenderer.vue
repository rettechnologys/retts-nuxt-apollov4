<template>
  <div class="dynamic-page-renderer">
    <DynamicBlockRenderer
      v-for="(block, index) in pageConfig.blocks"
      :key="`${block.name}-${index}`"
      :block-config="block"
    />
  </div>
</template>

<script setup lang="ts">
import type { PageConfig } from '#shared/types';

interface Props {
  pageConfig: PageConfig;
}

const props = defineProps<Props>();

// Set SEO meta tags if provided
if (props.pageConfig.seoMeta) {
  useHead({
    title: props.pageConfig.seoMeta.title,
    meta: [
      { name: 'description', content: props.pageConfig.seoMeta.description },
      { property: 'og:title', content: props.pageConfig.seoMeta.title },
      { property: 'og:description', content: props.pageConfig.seoMeta.description },
      { property: 'og:image', content: props.pageConfig.seoMeta.ogImage },
    ],
  });
}
</script>

<style scoped>
.dynamic-page-renderer {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
</style>

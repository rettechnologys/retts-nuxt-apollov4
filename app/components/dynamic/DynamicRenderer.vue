<template>
  <div
    class="dynamic-page-renderer"
    :class="pageTypeClass"
    :data-page-type="pageConfig.meta.type"
  >
    <!-- Main content blocks -->
    <DynamicBlockRenderer
      v-for="(block, index) in pageConfig.blocks"
      :key="`${block.name}-${index}`"
      :block-config="block"
      :page-meta="pageConfig.meta"
    />
  </div>
</template>

<script setup lang="ts">
import type { PageConfig } from '#shared/types';
import { getPageTypeClasses, buildSeoHead } from '~/utils/helpers/SeoHelpers';

interface Props {
  pageConfig: PageConfig;
}

const props = defineProps<Props>();
// console.log('Rendering page with config:', props.pageConfig);

// Computed properties based on page type
const pageTypeClass = computed(() => getPageTypeClasses(props.pageConfig));

// Enhanced SEO meta tags with structured data
if (props.pageConfig.seoMeta) {
  // useHead(buildSeoHead(props.pageConfig));
}
</script>

<style scoped>
.dynamic-page-renderer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>

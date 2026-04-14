<template>
  <div
    class="dynamic-page-renderer"
    :class="pageTypeClass"
    :data-page-type="pageConfig.meta.type"
  >
    <!-- Main content blocks -->
    <template v-if="pageConfig.blocks && pageConfig.blocks.length > 0">
      <DynamicBlockRenderer
        v-for="(block, index) in pageConfig.blocks"
        :key="`${block.name}-${index}`"
        :block-config="block"
        :page-meta="pageConfig.meta"
        :collection-cache="props.collectionCache"
        :collection-loading="props.collectionLoading"
      />
    </template>
    <div
      v-else
      class="h-screen flex items-center justify-center p-8 text-center"
    >
      <p class="text-lg text-gray-500">
        No content blocks defined for this page.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageConfig } from '#shared/types';
import { getPageTypeClasses, buildSeoHead } from '~/utils/helpers/SeoHelpers';

interface Props {
  pageConfig: PageConfig;
  collectionCache?: Record<string, any[]>;
  collectionLoading?: Record<string, boolean>;
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

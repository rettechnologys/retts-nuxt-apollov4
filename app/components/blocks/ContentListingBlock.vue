<template>
  <BaseLayout container="section" padding="section" :full-height="false">
    <!-- Filters/Search (if enabled) -->
    <div v-if="filters?.enabled" class="mb-8">
      <BaseLayout layout="flex" gap="md" wrap :full-height="false">
        <!-- Search input -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="px-4 py-2 border rounded-lg"
        />

        <!-- Category filters -->
        <select
          v-if="filters?.fields?.includes('category')"
          v-model="selectedCategory"
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </BaseLayout>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-surface-600 dark:text-surface-400">Loading...</p>
    </div>

    <!-- Content Grid -->
    <BaseLayout
      v-else-if="items.length > 0"
      :layout="layout"
      :cols="columns"
      :gap="gap"
      :full-height="false"
    >
      <component
        v-for="(item, index) in items"
        :key="item.id || index"
        :is="renderItemComponent(item)"
      />
    </BaseLayout>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <p class="text-surface-600 dark:text-surface-400">No items found.</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination?.enabled && totalPages > 1" class="mt-12">
      <BaseLayout layout="flex" justify="center" gap="sm" :full-height="false">
        <button
          v-for="page in totalPages"
          :key="page"
          :class="[
            'px-4 py-2 rounded-lg transition',
            currentPage === page
              ? 'bg-primary-500 text-white'
              : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300',
          ]"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </BaseLayout>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import type { ComponentConfig } from '#shared/types';
import { h } from 'vue';
import {
  normalizeItem,
  replaceTokens,
  extractUniqueValues,
  type FieldMapping,
} from '~/utils/helpers/DataTransformers';

interface DataSource {
  type: 'api' | 'cms' | 'static';
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any[];
}

interface Pagination {
  enabled: boolean;
  perPage?: number;
  type?: 'numbered' | 'load-more' | 'infinite-scroll';
}

interface Filters {
  enabled: boolean;
  fields?: string[];
}

interface Props {
  dataSource: DataSource;
  itemComponent: ComponentConfig;
  fieldMapping?: FieldMapping;
  layout?: 'flex' | 'grid';
  columns?: string;
  gap?: string;
  pagination?: Pagination;
  filters?: Filters;
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'grid',
  columns: '3',
  gap: 'lg',
});

// State
const currentPage = ref(1);
const searchQuery = ref('');
const selectedCategory = ref('');
const categories = ref<string[]>([]);

// Fetch data using useAsyncData
const {
  data: apiData,
  pending: loading,
  refresh,
} = await useAsyncData(
  `content-listing-${props.dataSource.endpoint}-${currentPage.value}`,
  async () => {
    if (props.dataSource.type === 'static' && props.dataSource.staticData) {
      // Use static data
      return {
        items: props.dataSource.staticData.map((item: any) =>
          normalizeItem(item, props.fieldMapping),
        ),
        totalPages: 1,
      };
    } else if (props.dataSource.type === 'api' && props.dataSource.endpoint) {
      // Fetch from API
      const params = {
        ...props.dataSource.params,
        page: currentPage.value,
        limit: props.pagination?.perPage || 12,
        search: searchQuery.value,
        category: selectedCategory.value,
      };

      const response: any = await $fetch(props.dataSource.endpoint, { params });
      const rawItems = response.data || response.items || response;

      return {
        items: rawItems.map((item: any) =>
          normalizeItem(item, props.fieldMapping),
        ),
        totalPages: response.totalPages || 1,
      };
    }

    return { items: [], totalPages: 1 };
  },
  {
    watch: [currentPage, searchQuery, selectedCategory],
  },
);

const items = computed(() => apiData.value?.items || []);
const totalPages = computed(() => apiData.value?.totalPages || 1);

// Extract categories when data changes
watch(items, (newItems) => {
  if (props.filters?.enabled && props.filters.fields?.includes('category')) {
    categories.value = extractUniqueValues(newItems, 'category') as string[];
  }
});

// Render item with replaced tokens
const renderItemComponent = (item: any) => {
  // Clone the component config and replace tokens
  const componentConfig = replaceTokens(props.itemComponent, item);
  console.log('componentConfig', componentConfig);
  // Return DynamicComponentRenderer with replaced config
  return h(resolveComponent('DynamicComponentRenderer'), {
    componentConfig,
  });
};

const changePage = (page: number) => {
  currentPage.value = page;
};
</script>

<style scoped></style>

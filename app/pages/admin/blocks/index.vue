<template>
  <div class="blocks-list-container">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Blocks</h1>
        <p class="text-surface-600 dark:text-surface-400">
          Manage reusable content blocks for your pages
        </p>
      </div>
      <Button
        label="Create Block"
        icon="pi pi-plus"
        @click="navigateTo('/admin/blocks/create')"
      />
    </div>

    <!-- Filters -->
    <Card class="mb-4">
      <template #content>
        <div class="flex gap-4 items-center">
          <IconField class="flex-1">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="searchQuery"
              placeholder="Search blocks..."
              class="w-full"
            />
          </IconField>

          <Select
            v-model="selectedCategory"
            :options="categoryOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All Categories"
            class="w-64"
          />

          <Select
            v-model="selectedStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All Status"
            class="w-48"
          />
        </div>
      </template>
    </Card>

    <!-- Blocks Grid -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <ProgressSpinner />
    </div>

    <div v-else-if="filteredBlocks.length === 0" class="text-center py-12">
      <i class="pi pi-inbox text-6xl text-surface-400 mb-4"></i>
      <p class="text-xl text-surface-600 dark:text-surface-400">
        No blocks found
      </p>
      <Button
        label="Create First Block"
        icon="pi pi-plus"
        class="mt-4"
        @click="navigateTo('/admin/blocks/create')"
      />
    </div>

    <div v-else class="blocks-grid">
      <Card
        v-for="block in filteredBlocks"
        :key="block.id"
        class="block-card"
        :class="{ 'opacity-60': !block.isActive }"
      >
        <template #header>
          <div class="block-preview">
            <img
              v-if="block.thumbnail"
              :src="block.thumbnail"
              :alt="block.name"
              class="w-full h-40 object-cover"
            />
            <div
              v-else
              class="w-full h-40 bg-surface-100 dark:bg-surface-800 flex items-center justify-center"
            >
              <i
                :class="getCategoryIcon(block.category)"
                class="text-4xl text-surface-400"
              ></i>
            </div>
          </div>
        </template>

        <template #title>
          <div class="flex items-center justify-between">
            <span>{{ block.name }}</span>
            <Badge
              :value="block.category"
              :severity="getCategorySeverity(block.category)"
            />
          </div>
        </template>

        <template #subtitle>
          <code class="text-xs">{{ block.component }}</code>
        </template>

        <template #content>
          <p
            class="text-sm text-surface-600 dark:text-surface-400 mb-4 line-clamp-2"
          >
            {{ block.description || 'No description provided' }}
          </p>

          <div class="flex gap-2 text-xs text-surface-500">
            <Tag
              :value="block.isActive ? 'Active' : 'Inactive'"
              :severity="block.isActive ? 'success' : 'secondary'"
            />
            <span>•</span>
            <span>{{ block.slug }}</span>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-between">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              text
              size="small"
              @click="navigateTo(`/admin/blocks/edit/${block.id}`)"
            />
            <div class="flex gap-2">
              <Button
                :icon="block.isActive ? 'pi pi-eye-slash' : 'pi pi-eye'"
                text
                size="small"
                :severity="block.isActive ? 'secondary' : 'success'"
                v-tooltip.top="block.isActive ? 'Deactivate' : 'Activate'"
                @click="toggleBlockStatus(block)"
              />
              <Button
                icon="pi pi-clone"
                text
                size="small"
                v-tooltip.top="'Duplicate'"
                @click="duplicateBlock(block)"
              />
              <Button
                icon="pi pi-trash"
                text
                size="small"
                severity="danger"
                v-tooltip.top="'Delete'"
                @click="confirmDelete(block)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      header="Delete Block"
      :style="{ width: '32rem' }"
    >
      <div class="flex items-center gap-4 mb-4">
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
        <div>
          <p class="font-semibold mb-2">
            Are you sure you want to delete this block?
          </p>
          <p class="text-sm text-surface-600 dark:text-surface-400">
            Block: <strong>{{ blockToDelete?.name }}</strong>
          </p>
          <p class="text-sm text-red-500 mt-2">
            This action cannot be undone. Pages using this block may break.
          </p>
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          text
          severity="secondary"
          @click="showDeleteDialog = false"
        />
        <Button
          label="Delete"
          severity="danger"
          :loading="isDeleting"
          @click="deleteBlock"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { BlockDefinition } from '#shared/types';
import { BLOCK_CATEGORIES } from '~/utils/types/admin/block.types';

definePageMeta({
  layout: 'admin',
});

// State
const searchQuery = ref('');
const selectedCategory = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);
const loading = ref(false);
const blocks = ref<BlockDefinition[]>([]);
const showDeleteDialog = ref(false);
const blockToDelete = ref<BlockDefinition | null>(null);
const isDeleting = ref(false);

// Options
const categoryOptions = computed(() => [
  { label: 'All Categories', value: null },
  ...BLOCK_CATEGORIES.map((cat) => ({ label: cat.label, value: cat.id })),
]);

const statusOptions = [
  { label: 'All Status', value: null },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

// Computed
const filteredBlocks = computed(() => {
  let filtered = blocks.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (block) =>
        block.name.toLowerCase().includes(query) ||
        block.slug.toLowerCase().includes(query) ||
        block.description?.toLowerCase().includes(query) ||
        block.component.toLowerCase().includes(query),
    );
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(
      (block) => block.category === selectedCategory.value,
    );
  }

  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((block) =>
      selectedStatus.value === 'active' ? block.isActive : !block.isActive,
    );
  }

  return filtered;
});

// Methods
const getCategoryIcon = (category: string) => {
  const cat = BLOCK_CATEGORIES.find((c) => c.id === category);
  return cat ? `pi ${cat.icon}` : 'pi pi-box';
};

const getCategorySeverity = (category: string): any => {
  const severityMap: Record<string, string> = {
    layout: 'info',
    content: 'success',
    media: 'warn',
    interactive: 'danger',
    custom: 'secondary',
  };
  return severityMap[category] || 'secondary';
};

const toggleBlockStatus = async (block: BlockDefinition) => {
  try {
    // TODO: API call to toggle status
    block.isActive = !block.isActive;

    // Show toast notification
    // toast.add({ severity: 'success', summary: 'Success', detail: `Block ${block.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    console.error('Toggle status error:', error);
  }
};

const duplicateBlock = async (block: BlockDefinition) => {
  try {
    const duplicated: BlockDefinition = {
      ...block,
      id: undefined,
      name: `${block.name} (Copy)`,
      slug: `${block.slug}-copy`,
    };

    // TODO: API call to create duplicate
    blocks.value.unshift(duplicated);

    // Show toast
    // toast.add({ severity: 'success', summary: 'Success', detail: 'Block duplicated' });
  } catch (error) {
    console.error('Duplicate error:', error);
  }
};

const confirmDelete = (block: BlockDefinition) => {
  blockToDelete.value = block;
  showDeleteDialog.value = true;
};

const deleteBlock = async () => {
  if (!blockToDelete.value) return;

  isDeleting.value = true;
  try {
    // TODO: API call to delete block
    blocks.value = blocks.value.filter((b) => b.id !== blockToDelete.value!.id);

    showDeleteDialog.value = false;
    blockToDelete.value = null;

    // Show toast
    // toast.add({ severity: 'success', summary: 'Success', detail: 'Block deleted' });
  } catch (error) {
    console.error('Delete error:', error);
  } finally {
    isDeleting.value = false;
  }
};

const fetchBlocks = async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API call
    // blocks.value = await $fetch('/api/admin/blocks');

    // Mock data for development
    blocks.value = [
      {
        id: '1',
        name: 'Hero Section',
        slug: 'hero-section',
        category: 'layout',
        description:
          'A hero section with title, subtitle, and call-to-action button',
        icon: 'pi-image',
        component: 'HeroBlock',
        defaultProps: {
          class: 'py-16',
          backgroundImage: '',
        },
        defaultContent: {
          title: 'Welcome',
          subtitle: 'Your subtitle here',
          buttonText: 'Get Started',
        },
        propsSchema: {},
        contentSchema: {},
        isActive: true,
      },
      {
        id: '2',
        name: 'Text Block',
        slug: 'text-block',
        category: 'content',
        description: 'Simple text content block',
        component: 'TextBlock',
        defaultProps: {},
        defaultContent: { text: 'Your text here' },
        propsSchema: {},
        contentSchema: {},
        isActive: true,
      },
    ];
  } catch (error) {
    console.error('Fetch blocks error:', error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchBlocks();
});
</script>

<style scoped>
.blocks-list-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.blocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.block-card {
  height: 100%;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.block-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.block-preview {
  position: relative;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

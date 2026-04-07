<template>
  <Dialog
    v-model:visible="visible"
    header="Add Block"
    :modal="true"
    :style="{ width: '800px' }"
    :closable="true"
  >
    <div class="block-selector">
      <!-- Search -->
      <div class="search-section mb-4">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Search blocks..."
            class="w-full"
          />
        </span>
      </div>

      <!-- Categories -->
      <div class="categories-tabs mb-4">
        <div class="flex gap-2 flex-wrap">
          <Button
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :outlined="selectedCategory !== category.id"
            :severity="
              selectedCategory === category.id ? 'primary' : 'secondary'
            "
            size="small"
            @click="selectedCategory = category.id"
          >
            <template #icon>
              <i :class="category.icon" class="mr-2"></i>
            </template>
          </Button>
        </div>
      </div>

      <!-- Blocks Grid -->
      <div class="blocks-grid">
        <div
          v-for="block in filteredBlocks"
          :key="block.id"
          class="block-card"
          @click="selectBlock(block)"
        >
          <div class="block-icon">
            <i :class="block.icon"></i>
          </div>
          <div class="block-info">
            <div class="block-name">{{ block.name }}</div>
            <div class="block-description">{{ block.description }}</div>
          </div>
        </div>
      </div>

      <div v-if="filteredBlocks.length === 0" class="no-results">
        <i class="pi pi-inbox text-4xl text-surface-400 mb-3"></i>
        <p class="text-surface-600">No blocks found matching your search</p>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

interface Block {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  category: string;
}

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  select: [block: Block];
}>();

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const searchQuery = ref('');
const selectedCategory = ref('all');

const categories = ref([
  { id: 'all', name: 'All', icon: 'pi pi-th-large' },
  { id: 'layout', name: 'Layout', icon: 'pi pi-table' },
  { id: 'content', name: 'Content', icon: 'pi pi-align-left' },
  { id: 'media', name: 'Media', icon: 'pi pi-image' },
  { id: 'interactive', name: 'Interactive', icon: 'pi pi-bolt' },
]);

const blocks = ref<Block[]>([
  // Layout Blocks
  {
    id: 'hero',
    name: 'Hero Section',
    type: 'hero',
    icon: 'pi pi-star',
    description: 'Large banner with heading and CTA',
    category: 'layout',
  },
  {
    id: 'grid',
    name: 'Grid Layout',
    type: 'grid',
    icon: 'pi pi-th-large',
    description: '2-4 column responsive grid',
    category: 'layout',
  },
  {
    id: 'columns',
    name: 'Columns',
    type: 'columns',
    icon: 'pi pi-table',
    description: 'Flexible column layout',
    category: 'layout',
  },
  {
    id: 'container',
    name: 'Container',
    type: 'container',
    icon: 'pi pi-box',
    description: 'Content container with padding',
    category: 'layout',
  },
  {
    id: 'divider',
    name: 'Divider',
    type: 'divider',
    icon: 'pi pi-minus',
    description: 'Horizontal line separator',
    category: 'layout',
  },
  // Content Blocks
  {
    id: 'text',
    name: 'Text Block',
    type: 'text',
    icon: 'pi pi-align-left',
    description: 'Rich text content',
    category: 'content',
  },
  {
    id: 'heading',
    name: 'Heading',
    type: 'heading',
    icon: 'pi pi-font',
    description: 'Heading element (H1-H6)',
    category: 'content',
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    type: 'paragraph',
    icon: 'pi pi-file-edit',
    description: 'Simple paragraph text',
    category: 'content',
  },
  {
    id: 'list',
    name: 'List',
    type: 'list',
    icon: 'pi pi-list',
    description: 'Bulleted or numbered list',
    category: 'content',
  },
  {
    id: 'quote',
    name: 'Quote',
    type: 'quote',
    icon: 'pi pi-comment',
    description: 'Blockquote or testimonial',
    category: 'content',
  },
  // Media Blocks
  {
    id: 'image',
    name: 'Image',
    type: 'image',
    icon: 'pi pi-image',
    description: 'Single image with caption',
    category: 'media',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    type: 'gallery',
    icon: 'pi pi-images',
    description: 'Image gallery grid',
    category: 'media',
  },
  {
    id: 'video',
    name: 'Video',
    type: 'video',
    icon: 'pi pi-video',
    description: 'Embedded video player',
    category: 'media',
  },
  {
    id: 'audio',
    name: 'Audio',
    type: 'audio',
    icon: 'pi pi-volume-up',
    description: 'Audio player',
    category: 'media',
  },
  // Interactive Blocks
  {
    id: 'button',
    name: 'Button',
    type: 'button',
    icon: 'pi pi-circle',
    description: 'Call-to-action button',
    category: 'interactive',
  },
  {
    id: 'form',
    name: 'Form',
    type: 'form',
    icon: 'pi pi-envelope',
    description: 'Contact or custom form',
    category: 'interactive',
  },
  {
    id: 'card',
    name: 'Card',
    type: 'card',
    icon: 'pi pi-id-card',
    description: 'Content card with image',
    category: 'interactive',
  },
  {
    id: 'accordion',
    name: 'Accordion',
    type: 'accordion',
    icon: 'pi pi-bars',
    description: 'Collapsible content sections',
    category: 'interactive',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    type: 'tabs',
    icon: 'pi pi-folder',
    description: 'Tabbed content sections',
    category: 'interactive',
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    type: 'testimonial',
    icon: 'pi pi-comments',
    description: 'Customer testimonial',
    category: 'interactive',
  },
]);

const filteredBlocks = computed(() => {
  let result = blocks.value;

  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter((b) => b.category === selectedCategory.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query),
    );
  }

  return result;
});

const selectBlock = (block: Block) => {
  emit('select', block);
  visible.value = false;
  searchQuery.value = '';
  selectedCategory.value = 'all';
};
</script>

<style scoped>
.block-selector {
  padding: 0.5rem;
}

.blocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

.block-card {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.block-card:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.block-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 12px;
  font-size: 1.75rem;
  color: #3b82f6;
}

.block-card:hover .block-icon {
  background: #3b82f6;
  color: white;
}

.block-info {
  text-align: center;
}

.block-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #111827;
}

.block-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.categories-tabs {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}
</style>

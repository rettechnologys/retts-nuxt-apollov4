<!-- Templates - Create/Edit with Visual Block Builder -->

<template>
  <div class="template-builder-page">
    <div class="page-header">
      <div class="header-left">
        <Button
          icon="pi pi-arrow-left"
          text
          @click="navigateTo('/admin/templates')"
        />
        <h1>{{ isEdit ? 'Edit Template' : 'Create Template' }}</h1>
      </div>
      <div class="header-actions">
        <Button
          label="Preview"
          icon="pi pi-eye"
          severity="secondary"
          outlined
          @click="previewMode = true"
        />
        <Button
          label="Save Draft"
          icon="pi pi-save"
          severity="secondary"
          outlined
          @click="saveDraft"
        />
        <Button
          label="Publish"
          icon="pi pi-check"
          @click="publishTemplate"
          :loading="saving"
        />
      </div>
    </div>

    <div class="builder-layout">
      <!-- Block Selector Sidebar -->
      <Card class="blocks-sidebar">
        <template #title>Available Blocks</template>
        <template #content>
          <div class="blocks-search">
            <InputText v-model="blockSearch" placeholder="Search blocks..." />
          </div>

          <div class="blocks-categories">
            <div
              v-for="category in filteredBlockCategories"
              :key="category.name"
              class="block-category"
            >
              <h3>{{ category.name }}</h3>
              <draggable
                v-model="category.blocks"
                :group="{ name: 'blocks', pull: 'clone', put: false }"
                :clone="cloneBlock"
                :sort="false"
                class="blocks-list"
              >
                <div
                  v-for="element in category.blocks"
                  :key="element.id"
                  class="block-item"
                >
                  <i :class="element.icon"></i>
                  <div class="block-info">
                    <span class="block-name">{{ element.name }}</span>
                    <small>{{ element.description }}</small>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </template>
      </Card>

      <!-- Canvas Area -->
      <div class="canvas-area">
        <!-- Template Info -->
        <Card class="template-info-card">
          <template #content>
            <div class="template-info-form">
              <div class="form-field">
                <label>Template Name</label>
                <InputText
                  v-model="template.name"
                  placeholder="Enter template name"
                />
              </div>
              <div class="form-field">
                <label>Template Type</label>
                <Select
                  v-model="template.type"
                  :options="templateTypes"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select type"
                />
              </div>
              <div class="form-field">
                <label>Description</label>
                <InputText
                  v-model="template.description"
                  placeholder="Optional description"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Canvas -->
        <Card class="canvas-card">
          <template #title>
            <div class="canvas-header">
              <span>Template Canvas</span>
              <div class="canvas-actions">
                <Button
                  icon="pi pi-mobile"
                  text
                  rounded
                  :class="{ active: viewport === 'mobile' }"
                  @click="viewport = 'mobile'"
                  v-tooltip.top="'Mobile View'"
                />
                <Button
                  icon="pi pi-tablet"
                  text
                  rounded
                  :class="{ active: viewport === 'tablet' }"
                  @click="viewport = 'tablet'"
                  v-tooltip.top="'Tablet View'"
                />
                <Button
                  icon="pi pi-desktop"
                  text
                  rounded
                  :class="{ active: viewport === 'desktop' }"
                  @click="viewport = 'desktop'"
                  v-tooltip.top="'Desktop View'"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div :class="['canvas-viewport', `viewport-${viewport}`]">
              <draggable
                v-model="template.blocks"
                group="blocks"
                class="canvas-drop-zone"
                :class="{ empty: template.blocks.length === 0 }"
                handle=".drag-handle"
              >
                <div
                  v-for="(element, index) in template.blocks"
                  :key="element.id"
                  class="canvas-block"
                  :class="{ active: selectedBlock?.id === element.id }"
                >
                  <div class="block-overlay">
                    <div class="block-controls">
                      <i class="pi pi-bars drag-handle"></i>
                      <span>{{ element.name }}</span>
                      <div class="block-actions">
                        <Button
                          icon="pi pi-cog"
                          text
                          rounded
                          size="small"
                          @click="configureBlock(element)"
                        />
                        <Button
                          icon="pi pi-copy"
                          text
                          rounded
                          size="small"
                          @click="duplicateBlock(index)"
                        />
                        <Button
                          icon="pi pi-trash"
                          text
                          rounded
                          size="small"
                          severity="danger"
                          @click="removeBlock(index)"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="block-preview">
                    <component
                      :is="getBlockComponent(element.type)"
                      :config="element.config"
                    />
                  </div>
                </div>
              </draggable>

              <div v-if="template.blocks.length === 0" class="empty-canvas">
                <i class="pi pi-plus-circle"></i>
                <p>Drag and drop blocks here to start building your template</p>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Block Configuration Panel -->
      <Card v-if="selectedBlock" class="config-panel">
        <template #title>
          <div class="panel-header">
            <span>Block Settings</span>
            <Button
              icon="pi pi-times"
              text
              rounded
              size="small"
              @click="selectedBlock = null"
            />
          </div>
        </template>
        <template #content>
          <div class="config-form">
            <div class="form-field">
              <label>Block Label</label>
              <InputText
                v-model="selectedBlock.label"
                placeholder="Internal label"
              />
            </div>

            <Divider />

            <!-- Dynamic configuration based on block type -->
            <div
              v-if="selectedBlock.type === 'hero'"
              class="block-specific-config"
            >
              <div class="form-field">
                <label>Heading</label>
                <InputText v-model="selectedBlock.config.heading" />
              </div>
              <div class="form-field">
                <label>Subheading</label>
                <Textarea v-model="selectedBlock.config.subheading" rows="3" />
              </div>
              <div class="form-field">
                <label>Button Text</label>
                <InputText v-model="selectedBlock.config.buttonText" />
              </div>
              <div class="form-field">
                <label>Button Link</label>
                <InputText v-model="selectedBlock.config.buttonLink" />
              </div>
              <div class="form-field">
                <label>Background Image</label>
                <InputText
                  v-model="selectedBlock.config.backgroundImage"
                  placeholder="Image URL"
                />
              </div>
            </div>

            <div
              v-else-if="selectedBlock.type === 'text'"
              class="block-specific-config"
            >
              <div class="form-field">
                <label>Content</label>
                <Textarea v-model="selectedBlock.config.content" rows="8" />
              </div>
              <div class="form-field">
                <label>Text Alignment</label>
                <Dropdown
                  v-model="selectedBlock.config.alignment"
                  :options="alignmentOptions"
                  optionLabel="label"
                  optionValue="value"
                />
              </div>
            </div>

            <div
              v-else-if="selectedBlock.type === 'image'"
              class="block-specific-config"
            >
              <div class="form-field">
                <label>Image URL</label>
                <InputText v-model="selectedBlock.config.imageUrl" />
              </div>
              <div class="form-field">
                <label>Alt Text</label>
                <InputText v-model="selectedBlock.config.altText" />
              </div>
              <div class="form-field">
                <label>Image Size</label>
                <Select
                  v-model="selectedBlock.config.size"
                  :options="imageSizeOptions"
                  optionLabel="label"
                  optionValue="value"
                />
              </div>
            </div>

            <Divider />

            <!-- Common styling options -->
            <h4>Styling</h4>
            <div class="form-field">
              <label>Background Color</label>
              <ColorPicker
                v-model="selectedBlock.config.backgroundColor"
                format="hex"
              />
            </div>
            <div class="form-field">
              <label>Padding</label>
              <Select
                v-model="selectedBlock.config.padding"
                :options="spacingOptions"
                optionLabel="label"
                optionValue="value"
              />
            </div>
            <div class="form-field">
              <label>Margin</label>
              <Select
                v-model="selectedBlock.config.margin"
                :options="spacingOptions"
                optionLabel="label"
                optionValue="value"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable as draggable } from 'vue-draggable-plus';
import HeroBlock from '~/components/blocks/HeroBlock.vue';
import GridBlock from '~/components/blocks/GridBlock.vue';
import ColumnsBlock from '~/components/blocks/ColumnsBlock.vue';
import TextBlock from '~/components/blocks/TextBlock.vue';
import HeadingBlock from '~/components/blocks/HeadingBlock.vue';
import ImageBlock from '~/components/blocks/ImageBlock.vue';
import VideoBlock from '~/components/blocks/VideoBlock.vue';
import ButtonBlock from '~/components/blocks/ButtonBlock.vue';
import FormBlock from '~/components/blocks/FormBlock.vue';
import CardBlock from '~/components/blocks/CardBlock.vue';
import TestimonialBlock from '~/components/blocks/TestimonialBlock.vue';

definePageMeta({
  layout: 'admin',
});

const route = useRoute();
const isEdit = computed(() => !!route.params.id);
const saving = ref(false);
const previewMode = ref(false);
const blockSearch = ref('');
const viewport = ref('desktop');
const selectedBlock = ref<any>(null);

const template = ref({
  name: '',
  type: '',
  description: '',
  blocks: [] as any[],
});

const templateTypes = ref([
  { label: 'Hero Section', value: 'hero' },
  { label: 'Full Page', value: 'page' },
  { label: 'Content Section', value: 'section' },
  { label: 'Blog Template', value: 'blog' },
  { label: 'Product Page', value: 'product' },
]);

const blockCategories = ref([
  {
    name: 'Layout',
    blocks: [
      {
        id: 'hero',
        name: 'Hero Section',
        icon: 'pi pi-image',
        description: 'Large banner with CTA',
        type: 'hero',
      },
      {
        id: 'grid',
        name: 'Grid Layout',
        icon: 'pi pi-th-large',
        description: '2-4 column grid',
        type: 'grid',
      },
      {
        id: 'columns',
        name: 'Columns',
        icon: 'pi pi-table',
        description: 'Flexible columns',
        type: 'columns',
      },
    ],
  },
  {
    name: 'Content',
    blocks: [
      {
        id: 'text',
        name: 'Text Block',
        icon: 'pi pi-align-left',
        description: 'Rich text content',
        type: 'text',
      },
      {
        id: 'heading',
        name: 'Heading',
        icon: 'pi pi-font',
        description: 'Heading element',
        type: 'heading',
      },
      {
        id: 'image',
        name: 'Image',
        icon: 'pi pi-image',
        description: 'Single image',
        type: 'image',
      },
      {
        id: 'video',
        name: 'Video',
        icon: 'pi pi-video',
        description: 'Embedded video',
        type: 'video',
      },
    ],
  },
  {
    name: 'Components',
    blocks: [
      {
        id: 'button',
        name: 'Button',
        icon: 'pi pi-circle',
        description: 'Call-to-action button',
        type: 'button',
      },
      {
        id: 'form',
        name: 'Form',
        icon: 'pi pi-envelope',
        description: 'Contact form',
        type: 'form',
      },
      {
        id: 'card',
        name: 'Card',
        icon: 'pi pi-id-card',
        description: 'Content card',
        type: 'card',
      },
      {
        id: 'testimonial',
        name: 'Testimonial',
        icon: 'pi pi-comments',
        description: 'Customer testimonial',
        type: 'testimonial',
      },
    ],
  },
]);

const alignmentOptions = ref([
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Justify', value: 'justify' },
]);

const imageSizeOptions = ref([
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Full Width', value: 'full' },
]);

const spacingOptions = ref([
  { label: 'None', value: '0' },
  { label: 'Small', value: '1rem' },
  { label: 'Medium', value: '2rem' },
  { label: 'Large', value: '3rem' },
]);

const filteredBlockCategories = computed(() => {
  if (!blockSearch.value) return blockCategories.value;
  const query = blockSearch.value.toLowerCase();
  return blockCategories.value
    .map((category) => ({
      ...category,
      blocks: category.blocks.filter(
        (block) =>
          block.name.toLowerCase().includes(query) ||
          block.description.toLowerCase().includes(query),
      ),
    }))
    .filter((category) => category.blocks.length > 0);
});

const cloneBlock = (block: any) => {
  const defaultConfigs: Record<string, any> = {
    hero: {
      heading: 'Hero Heading',
      subheading: 'Your compelling subheading goes here',
      buttonText: 'Get Started',
      showButton: true,
      backgroundColor: '#3b82f6',
    },
    grid: {
      columns: 3,
      items: [
        {
          title: 'Feature 1',
          description: 'Description for feature 1',
          icon: 'pi pi-star',
        },
        {
          title: 'Feature 2',
          description: 'Description for feature 2',
          icon: 'pi pi-heart',
        },
        {
          title: 'Feature 3',
          description: 'Description for feature 3',
          icon: 'pi pi-bolt',
        },
      ],
    },
    columns: {
      columnCount: 2,
      columns: [
        { content: '<p>Column 1 content goes here</p>' },
        { content: '<p>Column 2 content goes here</p>' },
      ],
    },
    text: {
      content: '<p>Enter your text content here...</p>',
      alignment: 'left',
    },
    heading: {
      text: 'Heading Text',
      level: 2,
      alignment: 'left',
    },
    image: {
      imageUrl: 'https://placehold.co/800x400',
      altText: 'Image',
      size: 'medium',
      alignment: 'center',
    },
    video: {
      videoUrl: '',
      title: 'Video',
      size: 'medium',
    },
    button: {
      text: 'Click Me',
      size: 'medium',
      variant: 'primary',
      alignment: 'center',
      raised: true,
    },
    form: {
      title: 'Contact Us',
      submitText: 'Submit',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'message', label: 'Message', type: 'textarea', required: true },
      ],
    },
    card: {
      title: 'Card Title',
      content: 'Card content goes here. Add your description and details.',
      showButton: true,
      buttonText: 'Learn More',
    },
    testimonial: {
      quote:
        'This is an amazing testimonial that will inspire trust and confidence in your visitors.',
      author: 'John Doe',
      role: 'Happy Customer',
    },
  };

  return {
    ...block,
    id: Date.now(),
    label: block.name,
    config: defaultConfigs[block.type] || {},
  };
};

const configureBlock = (block: any) => {
  selectedBlock.value = block;
};

const duplicateBlock = (index: number) => {
  const block = template.value.blocks[index];
  const duplicated = { ...block, id: Date.now() };
  template.value.blocks.splice(index + 1, 0, duplicated);
};

const removeBlock = (index: number) => {
  template.value.blocks.splice(index, 1);
  if (selectedBlock.value?.id === template.value.blocks[index]?.id) {
    selectedBlock.value = null;
  }
};

const getBlockComponent = (type: string) => {
  const components: Record<string, any> = {
    hero: HeroBlock,
    grid: GridBlock,
    columns: ColumnsBlock,
    text: TextBlock,
    heading: HeadingBlock,
    image: ImageBlock,
    video: VideoBlock,
    button: ButtonBlock,
    form: FormBlock,
    card: CardBlock,
    testimonial: TestimonialBlock,
  };

  return components[type] || 'div';
};

const saveDraft = async () => {
  // TODO: Save as draft
};

const publishTemplate = async () => {
  saving.value = true;
  try {
    // TODO: Call API to publish template
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigateTo('/admin/templates');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.template-builder-page {
  padding: 1rem;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.builder-layout {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 1rem;
  flex: 1;
  overflow: hidden;
}

.blocks-sidebar,
.config-panel {
  height: 100%;
  overflow-y: auto;
}

.blocks-search {
  margin-bottom: 1rem;
}

.blocks-categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.block-category h3 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.blocks-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.block-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: move;
  transition: all 0.2s;
}

.block-item:hover {
  background: #f3f4f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.block-item i {
  color: #3b82f6;
  font-size: 1.25rem;
}

.block-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.block-name {
  font-weight: 500;
  font-size: 0.875rem;
}

.block-info small {
  color: #6b7280;
  font-size: 0.75rem;
}

.canvas-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.template-info-form {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.canvas-actions {
  display: flex;
  gap: 0.25rem;
}

.canvas-actions .active {
  background: #3b82f6;
  color: white;
}

.canvas-viewport {
  margin: 0 auto;
  transition: all 0.3s;
  min-height: 400px;
}

.canvas-viewport.viewport-mobile {
  max-width: 375px;
}

.canvas-viewport.viewport-tablet {
  max-width: 768px;
}

.canvas-viewport.viewport-desktop {
  max-width: 100%;
}

.canvas-drop-zone {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 400px;
}

.canvas-drop-zone.empty {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
}

.canvas-block {
  position: relative;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.2s;
}

.canvas-block:hover,
.canvas-block.active {
  border-color: #3b82f6;
}

.block-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 0.5rem;
  border-radius: 6px 6px 0 0;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

.canvas-block:hover .block-overlay,
.canvas-block.active .block-overlay {
  opacity: 1;
}

.block-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.drag-handle {
  cursor: move;
}

.block-controls span {
  flex: 1;
  font-weight: 500;
  font-size: 0.875rem;
}

.block-actions {
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
}

.block-preview {
  padding: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  min-height: 100px;
}

.empty-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #9ca3af;
}

.empty-canvas i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 500;
  font-size: 0.875rem;
}

.block-specific-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 1400px) {
  .builder-layout {
    grid-template-columns: 240px 1fr;
  }

  .config-panel {
    display: none;
  }
}
</style>

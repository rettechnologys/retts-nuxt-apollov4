<template>
  <div class="page-design flex flex-col" style="height: calc(100vh - 64px)">
    <!-- Toolbar -->
    <div
      class="flex items-center gap-3 px-4 py-2 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 flex-shrink-0"
    >
      <i class="pi pi-palette text-primary-500" />
      <span class="font-semibold text-surface-800 dark:text-surface-200"
        >Page Design</span
      >
      <div class="ml-auto flex items-center gap-2">
        <span class="text-sm text-surface-400 mr-2">
          {{ canvasBlocks.length }} block(s)
        </span>
        <!-- <Button
          label="Clear"
          icon="pi pi-trash"
          outlined
          severity="danger"
          size="small"
          :disabled="canvasBlocks.length === 0"
          @click="clearCanvas"
        />
        <Button label="Preview" icon="pi pi-eye" outlined size="small" />
        <Button label="Save" icon="pi pi-save" size="small" /> -->
      </div>
    </div>

    <!-- Three Panel Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- ═══════════════ LEFT: Block Library ═══════════════ -->
      <div
        class="w-60 flex-shrink-0 border-r border-surface-200 dark:border-surface-700 flex flex-col overflow-hidden bg-surface-50 dark:bg-surface-800"
      >
        <!-- Search -->
        <div class="p-3 border-b border-surface-200 dark:border-surface-700">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Search blocks..."
              class="w-full text-sm pl-8"
              size="small"
            />
          </span>
        </div>

        <!-- Category Tabs -->
        <div
          class="flex gap-1 px-2 py-2 border-b border-surface-200 dark:border-surface-700 flex-wrap"
        >
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="px-2 py-0.5 rounded text-sm font-medium transition-colors"
            :class="
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white'
                : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-300 dark:hover:bg-surface-600'
            "
            @click="selectedCategory = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Draggable Block List -->
        <div class="flex-1 overflow-y-auto p-2">
          <VueDraggable
            :modelValue="filteredBlocks"
            @update:modelValue="() => {}"
            :group="{ name: 'canvas-blocks', pull: 'clone', put: false }"
            :sort="false"
            :clone="cloneBlock"
          >
            <div
              v-for="element in filteredBlocks"
              :key="element.id"
              class="flex items-center gap-2 p-2 mb-1 rounded-lg cursor-grab active:cursor-grabbing bg-surface-0 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors select-none"
            >
              <i
                :class="element.icon"
                class="text-primary-500 text-sm w-4 text-center flex-shrink-0"
              />
              <div class="min-w-0">
                <div
                  class="text-sm font-semibold text-surface-800 dark:text-surface-200 leading-tight"
                >
                  {{ element.name }}
                </div>
                <div class="text-sm text-surface-400 truncate leading-tight">
                  {{ element.description }}
                </div>
              </div>
            </div>
          </VueDraggable>

          <div
            v-if="filteredBlocks.length === 0"
            class="text-center py-8 text-surface-400"
          >
            <i class="pi pi-search text-2xl block mb-2" />
            <p class="text-sm">No blocks found</p>
          </div>
        </div>
      </div>

      <!-- ═══════════════ MIDDLE: Canvas ═══════════════ -->
      <div
        class="flex-1 flex flex-col overflow-hidden bg-surface-100 dark:bg-surface-950"
      >
        <div
          class="px-4 py-2 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 flex-shrink-0 flex items-center gap-2"
        >
          <i class="pi pi-desktop text-surface-400 text-sm" />
          <span
            class="text-sm font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider"
            >Canvas</span
          >
          <span class="text-sm text-surface-400 ml-auto"
            >Drag to reorder · Click to select</span
          >
        </div>

        <div class="flex-1 overflow-y-auto p-4 relative">
          <VueDraggable
            v-model="canvasBlocks"
            :group="{ name: 'canvas-blocks', pull: false, put: true }"
            handle=".drag-handle"
            ghost-class="ghost-block"
            chosen-class="ring-2 ring-primary-400 rounded-xl"
            drag-class="rotate-1"
            :animation="200"
            class="canvas-drop-zone"
            @add="onBlockAdded"
          >
            <div
              v-for="(element, index) in canvasBlocks"
              :key="element.instanceId"
              class="relative mb-3 rounded-xl border-2 transition-all group"
              :class="
                selectedBlockId === element.instanceId
                  ? 'border-primary-500 shadow-lg'
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-400 dark:hover:border-surface-500'
              "
              @click="selectBlock(element)"
            >
              <!-- Block header bar -->
              <div
                class="flex items-center gap-2 px-3 py-1.5 bg-surface-50 dark:bg-surface-800 rounded-t-xl border-b border-surface-200 dark:border-surface-700"
              >
                <i
                  class="drag-handle pi pi-bars text-surface-300 dark:text-surface-500 cursor-grab active:cursor-grabbing text-sm"
                />
                <i :class="element.icon" class="text-sm text-primary-500" />
                <span
                  class="text-sm font-medium text-surface-600 dark:text-surface-400 flex-1 select-none"
                  >{{ element.name }}</span
                >
                <span
                  v-if="selectedBlockId === element.instanceId"
                  class="text-sm text-primary-500 font-medium"
                  >Selected</span
                >
                <Button
                  icon="pi pi-angle-up"
                  text
                  size="small"
                  class="!p-1 !w-6 !h-6 opacity-0 group-hover:opacity-100"
                  :disabled="index === 0"
                  v-tooltip.top="'Move up'"
                  @click.stop="moveBlock(index, -1)"
                />
                <Button
                  icon="pi pi-angle-down"
                  text
                  size="small"
                  class="!p-1 !w-6 !h-6 opacity-0 group-hover:opacity-100"
                  :disabled="index === canvasBlocks.length - 1"
                  v-tooltip.top="'Move down'"
                  @click.stop="moveBlock(index, 1)"
                />
                <Button
                  icon="pi pi-copy"
                  text
                  size="small"
                  class="!p-1 !w-6 !h-6 opacity-0 group-hover:opacity-100"
                  v-tooltip.top="'Duplicate'"
                  @click.stop="duplicateBlock(index)"
                />
                <Button
                  icon="pi pi-trash"
                  text
                  size="small"
                  severity="danger"
                  class="!p-1 !w-6 !h-6 opacity-0 group-hover:opacity-100"
                  v-tooltip.top="'Remove'"
                  @click.stop="removeBlock(index)"
                />
              </div>

              <!-- Block preview — scale trick: inner rendered at desktop width then scaled down -->
              <div
                class="preview-clip bg-white dark:bg-surface-900 rounded-b-xl pointer-events-none"
                :style="getPreviewClipStyle(element.instanceId)"
              >
                <div
                  class="preview-scale"
                  :ref="(node) => setPreviewScaleRef(element.instanceId, node)"
                >
                  <component
                    :is="getBlockComponent(element.type)"
                    v-bind="getPreviewBindings(element)"
                  />
                </div>
              </div>
            </div>
          </VueDraggable>

          <!-- Empty state — absolute overlay so VueDraggable keeps full height as drop target -->
          <div
            v-if="canvasBlocks.length === 0"
            class="absolute inset-4 flex flex-col items-center justify-center text-surface-400 border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-xl pointer-events-none"
          >
            <i class="pi pi-inbox text-5xl mb-4" />
            <p class="text-base font-semibold">Drop blocks here</p>
            <p class="text-sm mt-1">
              Drag blocks from the left panel to start building
            </p>
          </div>
        </div>
      </div>

      <!-- ═══════════════ RIGHT: Properties ═══════════════ -->
      <div
        class="w-96 flex-shrink-0 border-l border-surface-200 dark:border-surface-700 flex flex-col overflow-hidden bg-surface-0 dark:bg-surface-900"
      >
        <div
          class="px-4 py-2 border-b border-surface-200 dark:border-surface-700 flex-shrink-0 flex items-center gap-2"
        >
          <i class="pi pi-sliders-h text-surface-400 text-sm" />
          <span
            class="text-sm font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider"
            >Properties</span
          >
        </div>

        <div class="flex-1 overflow-y-auto">
          <BlockPropertiesPanel
            v-if="selectedBlock"
            :block="selectedBlock"
            :collections="props.collections"
            :collections-loading="props.collectionsLoading"
            :schemas="props.schemas"
            @update:values="onBlockValuesUpdate"
            @update:dataSource="onBlockDataSourceUpdate"
            @fetch:collection="emit('fetch:collection', $event)"
          />
          <div
            v-else
            class="flex flex-col items-center justify-center h-full py-20 text-surface-400 px-4 text-center"
          >
            <i class="pi pi-mouse-pointer text-4xl mb-3" />
            <p class="text-sm font-semibold">No block selected</p>
            <p class="text-sm mt-1 text-surface-400">
              Click a block on the canvas to edit its properties
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// #region Imports
import { defineAsyncComponent, nextTick } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import BlockPropertiesPanel from './BlockPropertiesPanel.vue';
import heroImageDefault from '/demo/images/blocks/hero/hero-1.png';
import type { BlockDefinition, PreviewBindingMode } from './pageDesign.types';
import type {
  CollectionSchemaWithCount,
  CollectionSchema,
} from '~/utils/types/admin/collection.types';
import {
  applyBlockValuesToSchema,
  cloneBlockValues,
  createBlockValues,
  mergeBlockValues,
  resolveBlockValues,
  fieldBuilder,
  predefinedOptions,
  type PageDesignBlockSchema,
  type PageDesignBlockValues,
} from './pageDesignSchema';
// #endregion Imports

// #region Types
interface DataSource {
  collection: string;
  mode: 'list' | 'single';
  fieldMappings: Record<string, string>;
}

interface CanvasBlock {
  instanceId: string;
  id: string;
  type: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  schema: PageDesignBlockSchema;
  globalProps: Record<string, any>;
  content: Record<string, any>;
  previewMode: PreviewBindingMode;
  dataSource?: DataSource;
}
// #endregion Types

// #region Constants
const PREVIEW_SCALE = 0.62;

const {
  section,
  textField,
  textareaField,
  numberField,
  selectField,
  radioField,
  checkboxField,
  toggleField,
  urlField,
  imageField,
  richtextField,
  multiselectField,
  fileField,
  dateField,
  jsonField,
  arrayField,
  objectField,
} = fieldBuilder;
const { alignmentOptions, sizeOptions, buttonVariantOptions, columnOptions } =
  predefinedOptions;

const blockComponentMap: Record<
  string,
  ReturnType<typeof defineAsyncComponent>
> = {
  hero: defineAsyncComponent(
    () => import('~/components/blocks/HeroSection_2.vue'),
  ),
  text: defineAsyncComponent(() => import('~/components/blocks/TextBlock.vue')),
  heading: defineAsyncComponent(
    () => import('~/components/blocks/HeadingBlock.vue'),
  ),
  image: defineAsyncComponent(
    () => import('~/components/blocks/ImageBlock.vue'),
  ),
  button: defineAsyncComponent(
    () => import('~/components/blocks/ButtonBlock.vue'),
  ),
  grid: defineAsyncComponent(() => import('~/components/blocks/GridBlock.vue')),
  card: defineAsyncComponent(() => import('~/components/blocks/CardBlock.vue')),
  columns: defineAsyncComponent(
    () => import('~/components/blocks/ColumnsBlock.vue'),
  ),
  cta: defineAsyncComponent(() => import('~/components/blocks/CTABlock.vue')),
  feature: defineAsyncComponent(
    () => import('~/components/blocks/FeatureBlock.vue'),
  ),
  video: defineAsyncComponent(
    () => import('~/components/blocks/VideoBlock.vue'),
  ),
  testimonial: defineAsyncComponent(
    () => import('~/components/blocks/TestimonialBlock.vue'),
  ),
  testimonials: defineAsyncComponent(
    () => import('~/components/blocks/TestimonialsBlock.vue'),
  ),
  form: defineAsyncComponent(() => import('~/components/blocks/FormBlock.vue')),
  'content-listing': defineAsyncComponent(
    () => import('~/components/blocks/ContentListingBlock.vue'),
  ),
  'grid-view': defineAsyncComponent(
    () => import('~/components/blocks/GridViewBlock.vue'),
  ),
};

const categories = [
  { id: 'all', name: 'All' },
  { id: 'layout', name: 'Layout' },
  { id: 'content', name: 'Content' },
  { id: 'media', name: 'Media' },
  { id: 'interactive', name: 'Interactive' },
];
// #endregion Constants

// #region Props & Emits
const props = withDefaults(
  defineProps<{
    modelValue?: BlockDefinition[];
    collectionCache?: Record<string, any[]>;
    collections?: CollectionSchemaWithCount[];
    collectionsLoading?: boolean;
    schemas?: Record<string, CollectionSchema>;
  }>(),
  {
    modelValue: () => [],
    collectionCache: () => ({}),
    collections: () => [],
    collectionsLoading: false,
    schemas: () => ({}),
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: BlockDefinition[]];
  'fetch:collection': [slug: string];
}>();
// #endregion Props & Emits

// #region Composables
// #endregion Composables

// #region State / Ref
const availableBlocks = shallowRef<BlockDefinition[]>([
  {
    id: 'hero',
    name: 'Hero Section',
    type: 'hero',
    icon: 'pi pi-star',
    description: 'Large banner with heading and CTA',
    category: 'layout',
    previewMode: 'flat',
    defaultConfig: {
      global: [],
      content: [
        section('hero', 'Hero Content', [
          textField('title', 'Title', 'Create the screens', {
            rules: { required: true, minLength: 3 },
          }),
          textField('subtitle', 'Subtitle', 'your visitors deserve to see'),
          textareaField(
            'description',
            'Description',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          ),
          textField('primaryButtonLabel', 'Primary Button Label', 'Learn More'),
          urlField('primaryButtonLink', 'Primary Button Link', ''),
          textField(
            'secondaryButtonLabel',
            'Secondary Button Label',
            'Live Demo',
          ),
          urlField('secondaryButtonLink', 'Secondary Button Link', ''),
          // imageField('image', 'Image', '/demo/images/blocks/hero/hero-1.png'),
          fileField('image', 'Hero Image', {
            defaultValue: heroImageDefault,
            accept: 'image/*',
          }),
          textField('imageAlt', 'Image Alt Text', 'Hero Image'),
        ]),
      ],
    },
  },
  {
    id: 'columns',
    name: 'Columns',
    type: 'columns',
    icon: 'pi pi-table',
    description: 'Multi-column flexible layout',
    category: 'layout',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('columns', 'Column Content', [
          numberField('columnCount', 'Column Count', 2, {
            rules: { min: 1, max: 4 },
          }),
          arrayField(
            'columns',
            'Columns',
            [
              richtextField(
                'content',
                'Column Content',
                '<p>Column content</p>',
              ),
            ],
            [
              { content: '<p>Column 1 content</p>' },
              { content: '<p>Column 2 content</p>' },
            ],
          ),
        ]),
      ],
    },
  },
  {
    id: 'grid',
    name: 'Grid',
    type: 'grid',
    icon: 'pi pi-th-large',
    description: '2–4 column icon/card grid',
    category: 'layout',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('grid', 'Grid Items', [
          selectField(
            'columns',
            'Columns',
            [
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
              { label: '4', value: 4 },
            ],
            3,
          ),
          arrayField(
            'items',
            'Items',
            [
              textField('title', 'Title', 'Item'),
              textareaField('description', 'Description', 'Description'),
              textField('icon', 'Icon Class', 'pi pi-star'),
            ],
            [
              {
                title: 'Item 1',
                description: 'Description',
                icon: 'pi pi-star',
              },
              {
                title: 'Item 2',
                description: 'Description',
                icon: 'pi pi-check',
              },
            ],
          ),
        ]),
      ],
    },
  },
  {
    id: 'heading',
    name: 'Heading',
    type: 'heading',
    icon: 'pi pi-font',
    description: 'H1–H6 heading element',
    category: 'content',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('heading', 'Heading Content', [
          textField('text', 'Text', 'Section Heading', {
            rules: { required: true },
          }),
          radioField(
            'level',
            'Heading Level',
            [1, 2, 3, 4, 5, 6].map((level) => ({
              label: `H${level}`,
              value: level,
            })),
            2,
          ),
          radioField('alignment', 'Alignment', alignmentOptions, 'left'),
        ]),
      ],
    },
  },
  {
    id: 'text',
    name: 'Text Block',
    type: 'text',
    icon: 'pi pi-align-left',
    description: 'Rich paragraph content',
    category: 'content',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('text', 'Text Content', [
          richtextField(
            'content',
            'Content',
            '<p>Your text content goes here.</p>',
          ),
          radioField('alignment', 'Alignment', alignmentOptions, 'left'),
        ]),
      ],
    },
  },
  {
    id: 'button',
    name: 'Button',
    type: 'button',
    icon: 'pi pi-stop',
    description: 'CTA button element',
    category: 'content',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('button', 'Button Content', [
          textField('text', 'Label', 'Click Me', { rules: { required: true } }),
          urlField('action', 'Action URL', '#'),
          selectField('variant', 'Variant', buttonVariantOptions, 'primary'),
          selectField(
            'size',
            'Size',
            [
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' },
            ],
            'medium',
          ),
          checkboxField('outlined', 'Outlined', false),
          checkboxField('raised', 'Raised', false),
          radioField('alignment', 'Alignment', alignmentOptions, 'center'),
        ]),
      ],
    },
  },
  {
    id: 'cta',
    name: 'CTA Block',
    type: 'cta',
    icon: 'pi pi-megaphone',
    description: 'Call-to-action section',
    category: 'content',
    previewMode: 'flat',
    defaultConfig: {
      global: [
        section('presentation', 'Presentation', [
          selectField(
            'variant',
            'Variant',
            [
              { label: 'Default', value: 'default' },
              { label: 'Naked', value: 'naked' },
            ],
            'default',
          ),
          toggleField('showDecorations', 'Show Decorations', true),
        ]),
      ],
      content: [
        section('main', 'Main Content', [
          textField('title', 'Title', 'Ready to get started?'),
          textareaField(
            'description',
            'Description',
            'Join thousands of users today.',
          ),
          imageField('decorationLeft', 'Left Decoration', ''),
          imageField('decorationRight', 'Right Decoration', ''),
          textField('decorationLeftAlt', 'Left Decoration Alt', 'Decoration'),
          textField('decorationRightAlt', 'Right Decoration Alt', 'Decoration'),
          jsonField('backgroundComponents', 'Background Components JSON', []),
          jsonField('contentComponents', 'Content Components JSON', []),
          arrayField(
            'actions',
            'Actions',
            [
              textField('label', 'Label', 'Sign Up', {
                rules: { required: true },
              }),
              urlField('url', 'URL', '/signup'),
              selectField(
                'target',
                'Target',
                [
                  { label: 'Same Tab', value: '_self' },
                  { label: 'New Tab', value: '_blank' },
                ],
                '_self',
              ),
              selectField(
                'variant',
                'Variant',
                [
                  { label: 'Primary', value: 'primary' },
                  { label: 'Secondary', value: 'secondary' },
                ],
                'primary',
              ),
              selectField(
                'size',
                'Size',
                [
                  { label: 'Small', value: 'small' },
                  { label: 'Large', value: 'large' },
                ],
                'large',
              ),
              textField('class', 'Custom Class', ''),
            ],
            [
              {
                label: 'Sign Up',
                url: '/signup',
                target: '_self',
                variant: 'primary',
                size: 'large',
                class: '',
              },
            ],
          ),
        ]),
      ],
    },
  },
  {
    id: 'feature',
    name: 'Feature',
    type: 'feature',
    icon: 'pi pi-bolt',
    description: 'Feature showcase grid',
    category: 'content',
    previewMode: 'flat',
    defaultConfig: {
      global: [],
      content: [
        section('feature', 'Feature Content', [
          textField('title', 'Title', 'One Product,'),
          textField('titleHighlight', 'Title Highlight', 'Many Solutions'),
          textareaField(
            'subtitle',
            'Subtitle',
            'Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.',
          ),
          arrayField(
            'features',
            'Features',
            [
              textField('icon', 'Icon Class', 'pi pi-desktop'),
              textField('title', 'Title', 'Built for Developers'),
              textareaField(
                'description',
                'Description',
                'Feature description',
              ),
            ],
            [
              {
                icon: 'pi pi-desktop',
                title: 'Built for Developers',
                description:
                  'Ship faster with UI blocks tailored to modern teams.',
              },
              {
                icon: 'pi pi-lock',
                title: 'End-to-End Encryption',
                description: 'Protect user data across your full workflow.',
              },
              {
                icon: 'pi pi-check-circle',
                title: 'Easy to Use',
                description: 'Balance flexibility with fast authoring.',
              },
            ],
          ),
        ]),
      ],
    },
  },
  {
    id: 'image',
    name: 'Image',
    type: 'image',
    icon: 'pi pi-image',
    description: 'Single image with caption',
    category: 'media',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('image', 'Image Content', [
          imageField('imageUrl', 'Image URL', 'https://placehold.co/800x400'),
          fileField('imageFile', 'Image File', { accept: 'image/*' }),
          textField('altText', 'Alt Text', 'Image'),
          textareaField('caption', 'Caption', ''),
          selectField('size', 'Size', sizeOptions, 'medium'),
          radioField('alignment', 'Alignment', alignmentOptions, 'center'),
        ]),
      ],
    },
  },
  {
    id: 'video',
    name: 'Video',
    type: 'video',
    icon: 'pi pi-video',
    description: 'Embedded video player',
    category: 'media',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('video', 'Video Content', [
          urlField('videoUrl', 'Video URL', ''),
          textField('title', 'Title', ''),
          checkboxField('autoplay', 'Autoplay', false),
          dateField('publishDate', 'Publish Date', null),
        ]),
      ],
    },
  },
  {
    id: 'card',
    name: 'Card',
    type: 'card',
    icon: 'pi pi-id-card',
    description: 'Content card component',
    category: 'interactive',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('card', 'Card Content', [
          textField('title', 'Title', 'Card Title'),
          textareaField('content', 'Content', 'Card content goes here.'),
        ]),
      ],
    },
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    type: 'testimonial',
    icon: 'pi pi-comment',
    description: 'Single quote + author',
    category: 'interactive',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('testimonial', 'Testimonial Content', [
          textareaField('quote', 'Quote', '"This product is amazing!"'),
          textField('author', 'Author', 'John Doe'),
          textField('position', 'Position', 'CEO, Company'),
        ]),
      ],
    },
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    type: 'testimonials',
    icon: 'pi pi-comments',
    description: 'Multiple testimonials grid',
    category: 'interactive',
    previewMode: 'flat',
    defaultConfig: {
      global: [],
      content: [
        section('testimonials', 'Testimonials Content', [
          textField(
            'titlePrefix',
            'Title Prefix',
            'Join thousands of productive',
          ),
          textField('titleHighlight', 'Title Highlight', 'developers'),
          textareaField(
            'description',
            'Description',
            'See how developers are transforming their coding workflow and achieving more with our AI-powered platform.',
          ),
          selectField('columns', 'Columns', columnOptions, '3'),
          imageField('headlineImage', 'Headline Image', ''),
          textField(
            'headlineImageAlt',
            'Headline Image Alt',
            'Decorative element',
          ),
          arrayField(
            'testimonials',
            'Testimonials',
            [
              textareaField('quote', 'Quote', 'Great product'),
              objectField('user', 'User', [
                textField('name', 'Name', 'Sarah Moriceau'),
                textField('role', 'Role', 'Brand Designer'),
                imageField('avatar', 'Avatar', ''),
              ]),
            ],
            [
              {
                quote: 'Since using this tool, my productivity has doubled.',
                user: {
                  name: 'Sarah Moriceau',
                  role: 'Brand Designer',
                  avatar: '',
                },
              },
              {
                quote:
                  'Game-changer for our team. It reduced interruptions dramatically.',
                user: {
                  name: 'Sébastien Chopin',
                  role: 'Lead Software Engineer',
                  avatar: '',
                },
              },
            ],
          ),
        ]),
      ],
    },
  },
  {
    id: 'form',
    name: 'Form',
    type: 'form',
    icon: 'pi pi-envelope',
    description: 'Contact / lead capture form',
    category: 'interactive',
    previewMode: 'config',
    defaultConfig: {
      global: [],
      content: [
        section('form', 'Form Content', [
          textField('title', 'Title', 'Contact Us'),
          textField('submitText', 'Submit Button Label', 'Send Message'),
          arrayField(
            'fields',
            'Form Fields',
            [
              textField('name', 'Field Name', 'name'),
              textField('label', 'Label', 'Name'),
              selectField(
                'type',
                'Type',
                [
                  { label: 'Text', value: 'text' },
                  { label: 'Email', value: 'email' },
                  { label: 'Textarea', value: 'textarea' },
                ],
                'text',
              ),
              textField('placeholder', 'Placeholder', ''),
              checkboxField('required', 'Required', true),
            ],
            [
              {
                name: 'name',
                label: 'Name',
                type: 'text',
                placeholder: 'Your name',
                required: true,
              },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'Your email',
                required: true,
              },
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                placeholder: 'How can we help?',
                required: true,
              },
            ],
          ),
        ]),
      ],
    },
  },
  {
    id: 'content-listing',
    name: 'Content Listing',
    type: 'content-listing',
    icon: 'pi pi-list',
    description: 'Dynamic content feed',
    category: 'interactive',
    previewMode: 'flat',
    defaultConfig: {
      global: [],
      content: [
        section('listing', 'Listing Configuration', [
          objectField('dataSource', 'Data Source', [
            selectField(
              'type',
              'Source Type',
              [
                { label: 'Static', value: 'static' },
                { label: 'API', value: 'api' },
                { label: 'CMS', value: 'cms' },
              ],
              'static',
            ),
            textField('endpoint', 'Endpoint', ''),
            jsonField('params', 'Params JSON', {}),
            jsonField('staticData', 'Static Data JSON', [
              { id: 1, title: 'First Article', category: 'News' },
              { id: 2, title: 'Second Article', category: 'Guides' },
            ]),
          ]),
          jsonField('itemComponent', 'Item Component JSON', {
            name: 'Text Card',
            component: 'CardBlock',
            props: {
              title: '{{title}}',
              content: '{{category}}',
            },
          }),
          jsonField('fieldMapping', 'Field Mapping JSON', {}),
          selectField(
            'layout',
            'Layout',
            [
              { label: 'Grid', value: 'grid' },
              { label: 'Flex', value: 'flex' },
            ],
            'grid',
          ),
          selectField('columns', 'Columns', columnOptions, '3'),
          selectField(
            'gap',
            'Gap',
            [
              { label: 'Small', value: 'sm' },
              { label: 'Medium', value: 'md' },
              { label: 'Large', value: 'lg' },
            ],
            'lg',
          ),
          objectField('pagination', 'Pagination', [
            checkboxField('enabled', 'Enabled', false),
            numberField('perPage', 'Per Page', 12, { rules: { min: 1 } }),
            selectField(
              'type',
              'Pagination Type',
              [
                { label: 'Numbered', value: 'numbered' },
                { label: 'Load More', value: 'load-more' },
                { label: 'Infinite Scroll', value: 'infinite-scroll' },
              ],
              'numbered',
            ),
          ]),
          objectField('filters', 'Filters', [
            checkboxField('enabled', 'Enabled', false),
            multiselectField(
              'fields',
              'Filter Fields',
              [{ label: 'Category', value: 'category' }],
              [],
            ),
          ]),
        ]),
      ],
    },
  },
  {
    id: 'grid-view',
    name: 'Grid View',
    type: 'grid-view',
    icon: 'pi pi-objects-column',
    description: 'Responsive grid card view',
    category: 'interactive',
    previewMode: 'flat',
    defaultConfig: {
      global: [],
      content: [
        section('gridView', 'Grid View Content', [
          textField('title', 'Title', 'Grid View'),
          textareaField(
            'description',
            'Description',
            'Dynamic grid layout with flexible content',
          ),
          selectField('columns', 'Columns', columnOptions, '3'),
          imageField('decorativeImage', 'Decorative Image', ''),
          textField(
            'decorativeImageAlt',
            'Decorative Image Alt',
            'Decorative element',
          ),
          arrayField(
            'items',
            'Items',
            [
              // checkboxField('highlight', 'Highlight', false),
              // textField('highlightLabel', 'Highlight Label', ''),
              // jsonField('badgeComponents', 'Badge Components JSON', []),
              // jsonField('headerComponents', 'Header Components JSON', []),
              // jsonField('contentComponents', 'Content Components JSON', []),
              // jsonField('footerComponents', 'Footer Components JSON', []),
              textField('title', 'Card Title', 'Item Title'),
              textareaField(
                'description',
                'Card Description',
                'Item description',
              ),
              imageField('image', 'Card Image', ''),
              textField('imageAlt', 'Card Image Alt', 'Item image'),
            ],
            [
              {
                highlight: false,
                highlightLabel: '',
                badgeComponents: '[]',
                headerComponents: '[]',
                contentComponents: '[]',
                footerComponents: '[]',
              },
            ],
          ),
        ]),
      ],
    },
  },
]);
const selectedCategory = ref('all');
const searchQuery = ref('');
const canvasBlocks = ref<CanvasBlock[]>([]);
const selectedBlockId = ref<string | null>(null);
const previewHeights = ref<Record<string, number>>({});
const previewScaleElements = new Map<string, HTMLElement>();
const previewScaleObservers = new Map<string, ResizeObserver>();
let isHydratingFromModel = false;
let skipNextModelSync = false;
// #endregion State / Ref

//#region Computed
const selectedBlock = computed(
  () =>
    canvasBlocks.value.find((b) => b.instanceId === selectedBlockId.value) ??
    null,
);
const filteredBlocks = computed(() => {
  let list = availableBlocks.value;
  if (selectedCategory.value !== 'all') {
    list = list.filter((b) => b.category === selectedCategory.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q),
    );
  }
  return list;
});
//#endregion Computed

// #region Lifecycle Hooks
onBeforeUnmount(() => {
  Array.from(previewScaleObservers.keys()).forEach((instanceId) => {
    teardownPreviewScaleRef(instanceId);
  });
});
// #endregion Lifecycle Hooks

// #region Methods / Functions

const getBlockComponent = (type: string) => blockComponentMap[type] ?? null;

const findBlockDefinition = (
  block: Partial<BlockDefinition>,
): BlockDefinition | undefined => {
  return availableBlocks.value.find(
    (definition) =>
      definition.id === block.id ||
      definition.type === block.type ||
      definition.name === block.name,
  );
};

const createCanvasBlockFromDefinition = (
  definition: BlockDefinition,
  overrides: Partial<CanvasBlock> = {},
): CanvasBlock => {
  const initialValues = createBlockValues(definition.defaultConfig);

  return {
    instanceId:
      overrides.instanceId ||
      `${definition.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    id: definition.id,
    type: definition.type,
    name: definition.name,
    icon: definition.icon,
    description: definition.description,
    category: definition.category,
    schema: definition.defaultConfig,
    globalProps: {
      ...initialValues.globalProps,
      ...(overrides.globalProps ?? {}),
    },
    content: {
      ...initialValues.content,
      ...(overrides.content ?? {}),
    },
    previewMode: definition.previewMode,
    dataSource: overrides.dataSource,
  };
};

const serializeCanvasBlocks = (blocks: CanvasBlock[]): BlockDefinition[] => {
  return blocks.map((block) => {
    const values = cloneBlockValues({
      globalProps: block.globalProps,
      content: block.content,
    });

    return {
      id: block.id,
      name: block.name,
      type: block.type,
      description: block.description,
      category: block.category,
      icon: block.icon,
      defaultConfig: applyBlockValuesToSchema(block.schema, values),
      previewMode: block.previewMode,
      ...(block.dataSource ? { dataSource: block.dataSource } : {}),
    };
  });
};

const emitModelValue = () => {
  skipNextModelSync = true;
  emit('update:modelValue', serializeCanvasBlocks(canvasBlocks.value));
};

const syncCanvasBlocksFromModel = (blocks: BlockDefinition[]) => {
  isHydratingFromModel = true;

  canvasBlocks.value.forEach((block) =>
    teardownPreviewScaleRef(block.instanceId),
  );

  const nextBlocks = blocks
    .map((block, index) => {
      const definition = findBlockDefinition(block) ?? block;
      const blockValues = createBlockValues(block.defaultConfig);

      return createCanvasBlockFromDefinition(definition, {
        instanceId: `${definition.type}-${index}-${Math.random().toString(36).slice(2, 7)}`,
        globalProps: blockValues.globalProps,
        content: blockValues.content,
        dataSource: (block as any).dataSource,
      });
    })
    .filter(Boolean) as CanvasBlock[];

  canvasBlocks.value = nextBlocks;

  if (!nextBlocks.some((block) => block.instanceId === selectedBlockId.value)) {
    selectedBlockId.value = nextBlocks[0]?.instanceId ?? null;
  }

  nextTick(() => {
    nextBlocks.forEach((block) => updatePreviewHeight(block.instanceId));
    isHydratingFromModel = false;
  });
};

const updatePreviewHeight = (instanceId: string) => {
  const element = previewScaleElements.get(instanceId);
  if (!element) return;

  const measuredHeight = Math.ceil(element.scrollHeight * PREVIEW_SCALE);
  previewHeights.value = {
    ...previewHeights.value,
    [instanceId]: measuredHeight,
  };
};

const teardownPreviewScaleRef = (instanceId: string) => {
  const observer = previewScaleObservers.get(instanceId);
  if (observer) {
    observer.disconnect();
    previewScaleObservers.delete(instanceId);
  }

  previewScaleElements.delete(instanceId);

  const { [instanceId]: _removedHeight, ...remainingHeights } =
    previewHeights.value;
  previewHeights.value = remainingHeights;
};

const setPreviewScaleRef = (
  instanceId: string,
  node: Element | ComponentPublicInstance | null,
) => {
  const resolvedNode =
    node instanceof HTMLElement
      ? node
      : node && '$el' in node && node.$el instanceof HTMLElement
        ? node.$el
        : null;

  if (!resolvedNode) {
    teardownPreviewScaleRef(instanceId);
    return;
  }

  const currentElement = previewScaleElements.get(instanceId);
  if (currentElement === resolvedNode) return;

  teardownPreviewScaleRef(instanceId);
  previewScaleElements.set(instanceId, resolvedNode);

  const observer = new ResizeObserver(() => updatePreviewHeight(instanceId));
  observer.observe(resolvedNode);
  previewScaleObservers.set(instanceId, observer);

  nextTick(() => updatePreviewHeight(instanceId));
};

const getPreviewClipStyle = (instanceId: string) => {
  const height = previewHeights.value[instanceId];
  if (!height) return undefined;

  return {
    height: `${height}px`,
  };
};

const cloneBlock = (original: BlockDefinition): CanvasBlock => {
  return createCanvasBlockFromDefinition(original);
};

const onBlockAdded = (evt: any) => {
  const added = canvasBlocks.value[evt.newIndex];
  if (added) selectedBlockId.value = added.instanceId;
};

const selectBlock = (block: CanvasBlock) => {
  selectedBlockId.value = block.instanceId;
};

const removeBlock = (index: number) => {
  const removed = canvasBlocks.value[index];
  if (selectedBlockId.value === removed?.instanceId) {
    selectedBlockId.value = null;
  }
  if (removed) {
    teardownPreviewScaleRef(removed.instanceId);
  }
  canvasBlocks.value.splice(index, 1);
};

const moveBlock = (index: number, direction: -1 | 1) => {
  const target = index + direction;
  if (target < 0 || target >= canvasBlocks.value.length) return;
  const blocks = canvasBlocks.value;
  [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
};

const duplicateBlock = (index: number) => {
  const original = canvasBlocks.value[index];
  const duplicatedValues = cloneBlockValues({
    globalProps: original.globalProps,
    content: original.content,
  });
  const copy: CanvasBlock = {
    ...original,
    instanceId: `${original.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    globalProps: duplicatedValues.globalProps,
    content: duplicatedValues.content,
  };
  canvasBlocks.value.splice(index + 1, 0, copy);
  selectedBlockId.value = copy.instanceId;
};

const clearCanvas = () => {
  canvasBlocks.value.forEach((block) =>
    teardownPreviewScaleRef(block.instanceId),
  );
  canvasBlocks.value = [];
  selectedBlockId.value = null;
};

const getPreviewBindings = (block: CanvasBlock): Record<string, any> => {
  const merged = mergeBlockValues(
    resolveBlockValues(block.schema, {
      globalProps: block.globalProps,
      content: block.content,
    }),
  );

  if (block.previewMode === 'config') {
    return { config: merged };
  }

  if (block.dataSource?.collection) {
    const allItems = props.collectionCache[block.dataSource.collection] ?? [];
    const collectionItems =
      block.dataSource.mode === 'single' ? allItems.slice(0, 1) : allItems;
    return { ...merged, dataSource: block.dataSource, collectionItems };
    // return {
    //   ...merged,
    //   dataSource: block.dataSource,
    //   collectionItems: props.collectionCache[block.dataSource.collection] ?? [],
    // };
  }

  return merged;
};

const onBlockValuesUpdate = (newValues: PageDesignBlockValues) => {
  const block = canvasBlocks.value.find(
    (candidate) => candidate.instanceId === selectedBlockId.value,
  );

  if (!block) return;

  block.globalProps = cloneBlockValues(newValues).globalProps;
  block.content = cloneBlockValues(newValues).content;

  nextTick(() => updatePreviewHeight(block.instanceId));
};

const onBlockDataSourceUpdate = (dataSource: DataSource | undefined) => {
  const block = canvasBlocks.value.find(
    (candidate) => candidate.instanceId === selectedBlockId.value,
  );
  if (!block) return;
  block.dataSource = dataSource;
  // deep canvasBlocks watcher handles emitModelValue — no explicit call needed
};
// #endregion Methods / Functions

// #region Watcher
watch(
  () => props.modelValue,
  (blocks) => {
    if (skipNextModelSync) {
      skipNextModelSync = false;
      return;
    }

    syncCanvasBlocksFromModel(blocks ?? []);
  },
  { immediate: true, deep: true },
);

watch(
  canvasBlocks,
  () => {
    if (isHydratingFromModel) return;
    emitModelValue();
  },
  { deep: true },
);
// #endregion Watcher
</script>

<style scoped>
.canvas-drop-zone {
  min-height: 100%;
  display: block;
}

/*
 * Preview scale trick:
 * --preview-scale = faktor zoom (mis. 0.6)
 * .preview-scale  → diperlebar menjadi 100%/scale agar block merender
 *                   seolah-olah di viewport lebar (trigger breakpoint md/lg),
 *                   lalu di-scale-down secara visual oleh transform.
 * .preview-clip   → memotong overflow + menyesuaikan tinggi container agar
 *                   tidak menyisakan ruang kosong setelah scale.
 */
.preview-clip {
  --preview-scale: 0.62;
  overflow: hidden;
  display: flow-root;
}

.preview-scale {
  display: block;
  transform: scale(var(--preview-scale));
  transform-origin: top left;
  width: calc(100% / var(--preview-scale));
}

:deep(.ghost-block) {
  opacity: 0.4;
  background: var(--p-primary-100);
  border: 2px dashed var(--p-primary-400);
  border-radius: 0.75rem;
}
</style>

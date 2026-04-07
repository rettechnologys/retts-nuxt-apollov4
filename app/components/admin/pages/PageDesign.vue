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
        <Button
          label="Clear"
          icon="pi pi-trash"
          outlined
          severity="danger"
          size="small"
          :disabled="canvasBlocks.length === 0"
          @click="clearCanvas"
        />
        <Button label="Preview" icon="pi pi-eye" outlined size="small" />
        <Button label="Save" icon="pi pi-save" size="small" />
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
              >
                <div class="preview-scale">
                  <component
                    :is="getBlockComponent(element.type)"
                    v-bind="element.config"
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
        class="w-72 flex-shrink-0 border-l border-surface-200 dark:border-surface-700 flex flex-col overflow-hidden bg-surface-0 dark:bg-surface-900"
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
            :fieldMeta="selectedBlock.fieldMeta"
            @update:config="onConfigUpdate"
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
import { defineAsyncComponent } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import BlockPropertiesPanel from './BlockPropertiesPanel.vue';

// ─── Types ───────────────────────────────────────────────────────────────────

type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'url'
  | 'color'
  | 'array';

interface FieldMetaOverride {
  type?: FieldType;
  label?: string;
  placeholder?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
}

interface BlockDefinition {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  category: string;
  defaultConfig: Record<string, any>;
  /** Optional explicit field metadata — overrides auto-inference in BlockPropertiesPanel */
  fieldMeta?: Record<string, FieldMetaOverride>;
}

interface CanvasBlock {
  instanceId: string;
  id: string;
  type: string;
  name: string;
  icon: string;
  config: Record<string, any>;
  fieldMeta?: Record<string, FieldMetaOverride>;
}

// ─── Block Component Map ──────────────────────────────────────────────────────

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

const getBlockComponent = (type: string) => blockComponentMap[type] ?? null;

// ─── Available Blocks Library ─────────────────────────────────────────────────

const availableBlocks = ref<BlockDefinition[]>([
  // Layout
  {
    id: 'hero',
    name: 'Hero Section',
    type: 'hero',
    icon: 'pi pi-star',
    description: 'Large banner with heading and CTA',
    category: 'layout',
    defaultConfig: {
      title: 'Create the screens',
      subtitle: 'your visitors deserve to see',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      primaryButtonLabel: 'Learn More',
      secondaryButtonLabel: 'Live Demo',
      image: '/demo/images/blocks/hero/hero-1.png',
      imageAlt: 'Hero Image',
    },
  },
  {
    id: 'columns',
    name: 'Columns',
    type: 'columns',
    icon: 'pi pi-table',
    description: 'Multi-column flexible layout',
    category: 'layout',
    defaultConfig: { columnCount: 2, gap: '4' },
  },
  {
    id: 'grid',
    name: 'Grid',
    type: 'grid',
    icon: 'pi pi-th-large',
    description: '2–4 column icon/card grid',
    category: 'layout',
    defaultConfig: {
      columns: 3,
      items: [
        { title: 'Item 1', description: 'Description', icon: 'pi pi-star' },
        { title: 'Item 2', description: 'Description', icon: 'pi pi-check' },
      ],
    },
  },
  // Content
  {
    id: 'heading',
    name: 'Heading',
    type: 'heading',
    icon: 'pi pi-font',
    description: 'H1–H6 heading element',
    category: 'content',
    defaultConfig: { text: 'Section Heading', level: 2, alignment: 'left' },
  },
  {
    id: 'text',
    name: 'Text Block',
    type: 'text',
    icon: 'pi pi-align-left',
    description: 'Rich paragraph content',
    category: 'content',
    defaultConfig: {
      content: '<p>Your text content goes here.</p>',
      alignment: 'left',
    },
  },
  {
    id: 'button',
    name: 'Button',
    type: 'button',
    icon: 'pi pi-stop',
    description: 'CTA button element',
    category: 'content',
    defaultConfig: {
      text: 'Click Me',
      href: '#',
      variant: 'primary',
      size: 'medium',
    },
  },
  {
    id: 'cta',
    name: 'CTA Block',
    type: 'cta',
    icon: 'pi pi-megaphone',
    description: 'Call-to-action section',
    category: 'content',
    defaultConfig: {
      title: 'Ready to get started?',
      description: 'Join thousands of users today.',
      actions: [
        {
          label: 'Sign Up',
          variant: 'primary',
          size: 'large',
          class: '',
        },
      ],
    },
  },
  {
    id: 'feature',
    name: 'Feature',
    type: 'feature',
    icon: 'pi pi-bolt',
    description: 'Icon + title + description',
    category: 'content',
    defaultConfig: {
      title: 'Feature Title',
      description: 'Feature description here.',
      icon: 'pi pi-check-circle',
    },
  },
  // Media
  {
    id: 'image',
    name: 'Image',
    type: 'image',
    icon: 'pi pi-image',
    description: 'Single image with caption',
    category: 'media',
    defaultConfig: {
      imageUrl: '',
      altText: 'Image',
      caption: '',
      size: 'medium',
      alignment: 'center',
    },
  },
  {
    id: 'video',
    name: 'Video',
    type: 'video',
    icon: 'pi pi-video',
    description: 'Embedded video player',
    category: 'media',
    defaultConfig: { videoUrl: '', title: '', autoplay: false },
  },
  // Interactive
  {
    id: 'card',
    name: 'Card',
    type: 'card',
    icon: 'pi pi-id-card',
    description: 'Content card component',
    category: 'interactive',
    defaultConfig: { title: 'Card Title', content: 'Card content goes here.' },
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    type: 'testimonial',
    icon: 'pi pi-comment',
    description: 'Single quote + author',
    category: 'interactive',
    defaultConfig: {
      quote: '"This product is amazing!"',
      author: 'John Doe',
      position: 'CEO, Company',
    },
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    type: 'testimonials',
    icon: 'pi pi-comments',
    description: 'Multiple testimonials carousel',
    category: 'interactive',
    defaultConfig: {},
  },
  {
    id: 'form',
    name: 'Form',
    type: 'form',
    icon: 'pi pi-envelope',
    description: 'Contact / lead capture form',
    category: 'interactive',
    defaultConfig: { title: 'Contact Us', submitText: 'Send Message' },
  },
  {
    id: 'content-listing',
    name: 'Content Listing',
    type: 'content-listing',
    icon: 'pi pi-list',
    description: 'Dynamic content feed',
    category: 'interactive',
    defaultConfig: { title: 'Latest Articles', itemsPerRow: 3, maxItems: 6 },
  },
  {
    id: 'grid-view',
    name: 'Grid View',
    type: 'grid-view',
    icon: 'pi pi-objects-column',
    description: 'Responsive grid card view',
    category: 'interactive',
    defaultConfig: {
      title: 'Grid View',
      description: 'Dynamic grid layout with flexible content',
      columns: '3',
      decorativeImage: '',
      decorativeImageAlt: 'Decorative element',
      items: [
        {
          highlight: false,
          highlightLabel: '',
        },
      ],
    },
    fieldMeta: {
      columns: {
        type: 'select',
        options: [
          { label: '1 Column', value: '1' },
          { label: '2 Columns', value: '2' },
          { label: '3 Columns', value: '3' },
          { label: '4 Columns', value: '4' },
        ],
      },
      decorativeImage: {
        type: 'url',
        placeholder: 'https://example.com/image.png',
      },
      decorativeImageAlt: {
        type: 'text',
        placeholder: 'Alt text for decorative image',
      },
    },
  },
]);

// ─── Category Filter ──────────────────────────────────────────────────────────

const categories = [
  { id: 'all', name: 'All' },
  { id: 'layout', name: 'Layout' },
  { id: 'content', name: 'Content' },
  { id: 'media', name: 'Media' },
  { id: 'interactive', name: 'Interactive' },
];

const selectedCategory = ref('all');
const searchQuery = ref('');

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

// ─── Canvas State ─────────────────────────────────────────────────────────────

const canvasBlocks = ref<CanvasBlock[]>([]);
const selectedBlockId = ref<string | null>(null);

const selectedBlock = computed(
  () =>
    canvasBlocks.value.find((b) => b.instanceId === selectedBlockId.value) ??
    null,
);

// ─── Clone (left → canvas) ────────────────────────────────────────────────────

const cloneBlock = (original: BlockDefinition): CanvasBlock => ({
  instanceId: `${original.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  id: original.id,
  type: original.type,
  name: original.name,
  icon: original.icon,
  config: { ...original.defaultConfig },
  fieldMeta: original.fieldMeta,
});

const onBlockAdded = (evt: any) => {
  // Auto-select newly added block
  const added = canvasBlocks.value[evt.newIndex];
  if (added) selectedBlockId.value = added.instanceId;
};

// ─── Canvas Actions ───────────────────────────────────────────────────────────

const selectBlock = (block: CanvasBlock) => {
  selectedBlockId.value = block.instanceId;
};

const removeBlock = (index: number) => {
  const removed = canvasBlocks.value[index];
  if (selectedBlockId.value === removed?.instanceId) {
    selectedBlockId.value = null;
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
  const copy: CanvasBlock = {
    ...original,
    instanceId: `${original.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    config: { ...original.config },
  };
  canvasBlocks.value.splice(index + 1, 0, copy);
  selectedBlockId.value = copy.instanceId;
};

const clearCanvas = () => {
  canvasBlocks.value = [];
  selectedBlockId.value = null;
};

// ─── Property Update ──────────────────────────────────────────────────────────

const onConfigUpdate = (newConfig: Record<string, any>) => {
  const block = canvasBlocks.value.find(
    (b) => b.instanceId === selectedBlockId.value,
  );
  if (block) {
    block.config = { ...newConfig };
  }
};
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
  /* height menyusut sesuai scale sehingga card tidak terlalu tinggi */
  display: grid;
  grid-template-rows: 1fr;
}

.preview-scale {
  transform: scale(var(--preview-scale));
  transform-origin: top left;
  width: calc(100% / var(--preview-scale));
  height: 100%;
  /* kompensasi tinggi setelah di-scale agar tidak ada ruang putih bawah */
  margin-bottom: calc((var(--preview-scale) - 1) * 100%);
}

:deep(.ghost-block) {
  opacity: 0.4;
  background: var(--p-primary-100);
  border: 2px dashed var(--p-primary-400);
  border-radius: 0.75rem;
}
</style>

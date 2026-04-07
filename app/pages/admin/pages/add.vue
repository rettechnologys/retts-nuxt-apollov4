<!-- Page Content - Create/Edit with Visual Block Builder -->

<template>
  <div class="flex flex-col min-h-[calc(100vh-80px)] p-4 gap-4">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-4">
        <Button
          icon="pi pi-arrow-left"
          text
          @click="navigateTo('/admin/pages')"
        />
        <h1 class="text-2xl font-bold m-0">
          {{ isEdit ? 'Edit Page Content' : 'Add Page Content' }}
        </h1>
      </div>
      <div class="flex gap-3">
        <Button
          icon="pi pi-bars"
          text
          class="xl:hidden"
          @click="showBlocksSidebar = true"
          v-tooltip.bottom="'Show Blocks'"
        />
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

    <!-- Builder Layout -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 overflow-hidden">
      <!-- Block Selector Sidebar (Desktop) -->
      <Card class="h-full hidden xl:block xl:col-span-2 overflow-y-auto">
        <template #title>Available Blocks</template>
        <template #content>
          <div class="mb-4">
            <InputText
              v-model="blockSearch"
              placeholder="Search blocks..."
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-6">
            <div
              v-for="category in filteredBlockCategories"
              :key="category.name"
            >
              <h3 class="text-sm font-semibold uppercase text-gray-500 mb-3">
                {{ category.name }}
              </h3>
              <draggable
                v-model="category.blocks"
                :group="{ name: 'blocks', pull: 'clone', put: false }"
                :clone="cloneBlock"
                :sort="false"
                class="flex flex-col gap-2"
              >
                <div
                  v-for="element in category.blocks"
                  :key="element.id"
                  class="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md cursor-move transition-all hover:bg-gray-100 hover:shadow-sm"
                >
                  <i :class="element.icon" class="text-blue-500 text-xl"></i>
                  <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">{{ element.name }}</span>
                    <small class="text-gray-500 text-xs">{{
                      element.description
                    }}</small>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </template>
      </Card>

      <!-- Canvas Area -->
      <div
        class="flex flex-col col-span-12 xl:col-span-7 gap-4 overflow-y-auto order-first xl:order-2"
      >
        <!-- Canvas -->
        <Card class="h-full flex flex-col">
          <template #title>
            <div class="flex justify-between items-center w-full">
              <span>Blocks</span>
              <div class="flex gap-1">
                <Button
                  icon="pi pi-mobile"
                  text
                  rounded
                  :class="{ '!bg-blue-500 !text-white': viewport === 'mobile' }"
                  @click="viewport = 'mobile'"
                  v-tooltip.top="'Mobile View'"
                />
                <Button
                  icon="pi pi-tablet"
                  text
                  rounded
                  :class="{ '!bg-blue-500 !text-white': viewport === 'tablet' }"
                  @click="viewport = 'tablet'"
                  v-tooltip.top="'Tablet View'"
                />
                <Button
                  icon="pi pi-desktop"
                  text
                  rounded
                  :class="{
                    '!bg-blue-500 !text-white': viewport === 'desktop',
                  }"
                  @click="viewport = 'desktop'"
                  v-tooltip.top="'Desktop View'"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div
              class="@container"
              :class="[
                'mx-auto transition-all duration-300 min-h-[400px] w-full overflow-visible',
                viewport === 'mobile' &&
                  'max-w-[375px] w-[375px] border-2 border-gray-700 rounded-3xl p-2 shadow-lg bg-gray-800',
                viewport === 'tablet' &&
                  'max-w-[768px] w-[768px] border-2 border-gray-600 rounded-2xl p-3 shadow-lg bg-gray-700',
                viewport === 'desktop' && 'max-w-full w-full',
              ]"
              :data-viewport-width="viewportWidth"
            >
              <draggable
                v-model="template.blocks"
                group="blocks"
                :class="[
                  'flex flex-col gap-4 min-h-[400px]',
                  template.blocks.length === 0 &&
                    'border-2 border-dashed border-gray-300 rounded-lg',
                  viewport === 'mobile' &&
                    'rounded-2xl overflow-hidden bg-white',
                  viewport === 'tablet' &&
                    'rounded-lg overflow-hidden bg-white',
                ]"
                handle=".drag-handle"
              >
                <div
                  v-if="template.blocks.length === 0"
                  class="flex flex-col items-center justify-center h-[400px] text-gray-400"
                >
                  <i class="pi pi-plus-circle text-6xl mb-4"></i>
                  <p>Drag and drop blocks here to start building your page</p>
                </div>
                <template v-else>
                  <div
                    v-for="(element, index) in template.blocks"
                    :key="element.id"
                    :class="[
                      'relative border-2 border-transparent rounded-lg transition-all',
                      selectedBlock?.id === element.id
                        ? 'border-blue-500'
                        : 'hover:border-blue-500',
                    ]"
                  >
                    <div
                      :class="[
                        'absolute top-0 left-0 right-0 bg-blue-500/90 text-white px-2 py-2 rounded-t-md opacity-0 hover:opacity-100 transition-opacity z-10',
                        selectedBlock?.id === element.id && 'opacity-100',
                      ]"
                    >
                      <div class="flex items-center gap-3">
                        <i class="pi pi-bars drag-handle cursor-move"></i>
                        <span class="flex-1 font-medium text-sm">{{
                          element.name
                        }}</span>
                        <div class="flex gap-1 ml-auto">
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
                    <div
                      class="p-8 bg-white border border-gray-200 rounded-md min-h-[100px]"
                    >
                      <div :class="['w-full', `viewport-sim-${viewport}`]">
                        <component
                          :is="getBlockComponent(element.type)"
                          :config="element.config"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </template>
        </Card>
      </div>
      <!-- Page Settings Panel -->
      <Card
        class="h-full col-span-12 xl:col-span-3 overflow-y-auto xl:order-3 order-last"
      >
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-cog"></i>
            <span>Page Settings</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-4 mb-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">Page Name</label>
              <InputText
                v-model="template.name"
                placeholder="Enter page name"
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">Page Type</label>
              <Select
                v-model="template.type"
                :options="templateTypes"
                optionLabel="label"
                optionValue="value"
                placeholder="Select type"
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">Page Menu Url</label>
              <Select
                v-model="template.menuUrl"
                :options="pageMenuUrl"
                optionLabel="label"
                optionValue="value"
                placeholder="Select menu url"
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">Description</label>
              <InputText
                v-model="template.description"
                placeholder="Optional description"
                class="w-full"
              />
            </div>
          </div>

          <Divider />

          <div class="flex flex-col gap-4 mt-6">
            <h4 class="font-semibold text-base flex items-center gap-2">
              <i class="pi pi-search"></i>
              SEO Settings
            </h4>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">Meta Title</label>
              <InputText
                v-model="template.seo.metaTitle"
                placeholder="Page title for search engines"
                class="w-full"
              />
              <small class="text-xs text-gray-500">
                Recommended: 50-60 characters
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">Meta Description</label>
              <Textarea
                v-model="template.seo.metaDescription"
                rows="3"
                placeholder="Brief description for search results"
                class="w-full"
              />
              <small class="text-xs text-gray-500">
                Recommended: 150-160 characters
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">Keywords</label>
              <InputText
                v-model="template.seo.keywords"
                placeholder="keyword1, keyword2, keyword3"
                class="w-full"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">Canonical URL</label>
              <InputText
                v-model="template.seo.canonicalUrl"
                placeholder="https://example.com/page"
                class="w-full"
              />
            </div>

            <Divider />

            <h4 class="font-semibold text-base">Open Graph</h4>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">OG Title</label>
              <InputText
                v-model="template.seo.ogTitle"
                placeholder="Title for social media"
                class="w-full"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">OG Description</label>
              <Textarea
                v-model="template.seo.ogDescription"
                rows="2"
                placeholder="Social media description"
                class="w-full"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">OG Image</label>
              <InputText
                v-model="template.seo.ogImage"
                placeholder="https://example.com/image.jpg"
                class="w-full"
              />
              <small class="text-xs text-gray-500">
                1200x630px recommended
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">OG Type</label>
              <Select
                v-model="template.seo.ogType"
                :options="ogTypeOptions"
                placeholder="Select type"
                class="w-full"
              />
            </div>

            <Divider />

            <h4 class="font-semibold text-base">Advanced</h4>

            <div class="flex items-center gap-2">
              <Checkbox
                v-model="template.seo.noIndex"
                inputId="noIndex"
                :binary="true"
              />
              <label for="noIndex" class="font-medium text-sm mb-0">
                No Index
              </label>
            </div>

            <div class="flex items-center gap-2">
              <Checkbox
                v-model="template.seo.noFollow"
                inputId="noFollow"
                :binary="true"
              />
              <label for="noFollow" class="font-medium text-sm mb-0">
                No Follow
              </label>
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm">Structured Data</label>
              <Textarea
                v-model="template.seo.structuredData"
                rows="4"
                placeholder='{"@context": "https://schema.org"}'
                class="w-full font-mono text-xs"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Blocks Sidebar (Mobile) -->
    <Drawer
      v-model:visible="showBlocksSidebar"
      :header="'Available Blocks'"
      position="left"
      class="xl:hidden w-80"
      :modal="false"
    >
      <div class="mb-4">
        <InputText
          v-model="blockSearch"
          placeholder="Search blocks..."
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-6">
        <div v-for="category in filteredBlockCategories" :key="category.name">
          <h3 class="text-sm font-semibold uppercase text-gray-500 mb-3">
            {{ category.name }}
          </h3>
          <draggable
            v-model="category.blocks"
            :group="{ name: 'blocks', pull: 'clone', put: false }"
            :clone="cloneBlock"
            :sort="false"
            class="flex flex-col gap-2"
          >
            <div
              v-for="element in category.blocks"
              :key="element.id"
              class="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md cursor-move transition-all hover:bg-gray-100 hover:shadow-sm"
            >
              <i :class="element.icon" class="text-blue-500 text-xl"></i>
              <div class="flex flex-col gap-1">
                <span class="font-medium text-sm">{{ element.name }}</span>
                <small class="text-gray-500 text-xs">{{
                  element.description
                }}</small>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </Drawer>

    <!-- Block Configuration Dialog -->
    <Dialog
      v-model:visible="showConfigDialog"
      modal
      :header="
        selectedBlock ? `Configure ${selectedBlock.name}` : 'Block Settings'
      "
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '640px': '95vw' }"
    >
      <div v-if="selectedBlock" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-sm">Block Label</label>
          <InputText
            v-model="selectedBlock.label"
            placeholder="Internal label"
            class="w-full"
          />
        </div>

        <Divider />

        <div v-if="selectedBlock.type === 'hero'" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Heading</label>
            <InputText v-model="selectedBlock.config.heading" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Subheading</label>
            <Textarea
              v-model="selectedBlock.config.subheading"
              rows="3"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Button Text</label>
            <InputText
              v-model="selectedBlock.config.buttonText"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Button Link</label>
            <InputText
              v-model="selectedBlock.config.buttonLink"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Background Image</label>
            <InputText
              v-model="selectedBlock.config.backgroundImage"
              placeholder="Image URL"
              class="w-full"
            />
          </div>
        </div>

        <div
          v-else-if="selectedBlock.type === 'text'"
          class="flex flex-col gap-4"
        >
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Content</label>
            <Textarea
              v-model="selectedBlock.config.content"
              rows="8"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Text Alignment</label>
            <Dropdown
              v-model="selectedBlock.config.alignment"
              :options="alignmentOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            />
          </div>
        </div>

        <div
          v-else-if="selectedBlock.type === 'image'"
          class="flex flex-col gap-4"
        >
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Image URL</label>
            <InputText v-model="selectedBlock.config.imageUrl" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Alt Text</label>
            <InputText v-model="selectedBlock.config.altText" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">Image Size</label>
            <Select
              v-model="selectedBlock.config.size"
              :options="imageSizeOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            />
          </div>
        </div>

        <Divider />

        <h4 class="font-semibold text-base m-0">Styling</h4>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-sm">Background Color</label>
          <ColorPicker
            v-model="selectedBlock.config.backgroundColor"
            format="hex"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-sm">Padding</label>
          <Select
            v-model="selectedBlock.config.padding"
            :options="spacingOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-sm">Margin</label>
          <Select
            v-model="selectedBlock.config.margin"
            :options="spacingOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="Cancel" text @click="showConfigDialog = false" />
          <Button label="Apply" @click="showConfigDialog = false" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable as draggable } from 'vue-draggable-plus';
import HeroBlock from '~/components/blocks/HeroBlock.vue';
import HeroSection2 from '~/components/blocks/HeroSection_2.vue';
import GridBlock from '~/components/blocks/GridBlock.vue';
import GridViewBlock from '~/components/blocks/GridViewBlock.vue';
import ColumnsBlock from '~/components/blocks/ColumnsBlock.vue';
import TextBlock from '~/components/blocks/TextBlock.vue';
import HeadingBlock from '~/components/blocks/HeadingBlock.vue';
import ImageBlock from '~/components/blocks/ImageBlock.vue';
import VideoBlock from '~/components/blocks/VideoBlock.vue';
import ContentListingBlock from '~/components/blocks/ContentListingBlock.vue';
import CTABlock from '~/components/blocks/CTABlock.vue';
import ButtonBlock from '~/components/blocks/ButtonBlock.vue';
import FormBlock from '~/components/blocks/FormBlock.vue';
import CardBlock from '~/components/blocks/CardBlock.vue';
import FeatureBlock from '~/components/blocks/FeatureBlock.vue';
import TestimonialBlock from '~/components/blocks/TestimonialBlock.vue';
import TestimonialsBlock from '~/components/blocks/TestimonialsBlock.vue';

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
const showConfigDialog = ref(false);
const showBlocksSidebar = ref(false);

const viewportWidth = computed(() => {
  return viewport.value === 'mobile'
    ? 375
    : viewport.value === 'tablet'
      ? 768
      : 9999;
});

const template = ref({
  name: '',
  type: '',
  description: '',
  menuUrl: '',
  blocks: [] as any[],
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    noIndex: false,
    noFollow: false,
    structuredData: '',
  },
});

const pageMenuUrl = ref([
  {
    label: 'Home',
    value: '/',
  },
  {
    label: 'About Us',
    value: '/about',
  },
  {
    label: 'Services',
    value: '/services',
  },
  {
    label: 'Contact',
    value: '/contact',
  },
]);

const templateTypes = ref([
  { label: 'Hero Section', value: 'hero' },
  { label: 'Full Page', value: 'page' },
  { label: 'Content Section', value: 'section' },
  { label: 'Blog Template', value: 'blog' },
  { label: 'Product Page', value: 'product' },
]);

const ogTypeOptions = ref([
  'website',
  'article',
  'product',
  'profile',
  'video.movie',
  'video.episode',
  'music.song',
  'music.album',
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
        component: 'HeroBlock',
      },
      {
        id: 'hero-2',
        name: 'Hero Section 2',
        icon: 'pi pi-images',
        description: 'Hero with split layout',
        type: 'hero-2',
        component: 'HeroSection2',
      },
      {
        id: 'grid',
        name: 'Grid Layout',
        icon: 'pi pi-th-large',
        description: '2-4 column grid',
        type: 'grid',
        component: 'GridBlock',
      },
      {
        id: 'grid-view',
        name: 'Grid View',
        icon: 'pi pi-table',
        description: 'Advanced grid view',
        type: 'grid-view',
        component: 'GridViewBlock',
      },
      {
        id: 'columns',
        name: 'Columns',
        icon: 'pi pi-table',
        description: 'Flexible columns',
        type: 'columns',
        component: 'ColumnsBlock',
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
        component: 'TextBlock',
      },
      {
        id: 'heading',
        name: 'Heading',
        icon: 'pi pi-font',
        description: 'Heading element',
        type: 'heading',
        component: 'HeadingBlock',
      },
      {
        id: 'image',
        name: 'Image',
        icon: 'pi pi-image',
        description: 'Single image',
        type: 'image',
        component: 'ImageBlock',
      },
      {
        id: 'video',
        name: 'Video',
        icon: 'pi pi-video',
        description: 'Embedded video',
        type: 'video',
        component: 'VideoBlock',
      },
      {
        id: 'content-listing',
        name: 'Content Listing',
        icon: 'pi pi-list',
        description: 'List of content items',
        type: 'content-listing',
        component: 'ContentListingBlock',
      },
    ],
  },
  {
    name: 'Components',
    blocks: [
      {
        id: 'cta',
        name: 'Call to Action',
        icon: 'pi pi-megaphone',
        description: 'CTA section',
        type: 'cta',
        component: 'CTABlock',
      },
      {
        id: 'button',
        name: 'Button',
        icon: 'pi pi-circle',
        description: 'Call-to-action button',
        type: 'button',
        component: 'ButtonBlock',
      },
      {
        id: 'form',
        name: 'Form',
        icon: 'pi pi-envelope',
        description: 'Contact form',
        type: 'form',
        component: 'FormBlock',
      },
      {
        id: 'card',
        name: 'Card',
        icon: 'pi pi-id-card',
        description: 'Content card',
        type: 'card',
        component: 'CardBlock',
      },
      {
        id: 'feature',
        name: 'Feature',
        icon: 'pi pi-star',
        description: 'Feature showcase',
        type: 'feature',
        component: 'FeatureBlock',
      },
      {
        id: 'testimonial',
        name: 'Testimonial',
        icon: 'pi pi-comments',
        description: 'Single testimonial',
        type: 'testimonial',
        component: 'TestimonialBlock',
      },
      {
        id: 'testimonials',
        name: 'Testimonials',
        icon: 'pi pi-comments',
        description: 'Multiple testimonials',
        type: 'testimonials',
        component: 'TestimonialsBlock',
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
  console.log('Configuring block:', block);
  selectedBlock.value = block;
  showConfigDialog.value = true;
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
    'hero-2': HeroSection2,
    grid: GridBlock,
    'grid-view': GridViewBlock,
    columns: ColumnsBlock,
    text: TextBlock,
    heading: HeadingBlock,
    image: ImageBlock,
    video: VideoBlock,
    'content-listing': ContentListingBlock,
    cta: CTABlock,
    button: ButtonBlock,
    form: FormBlock,
    card: CardBlock,
    feature: FeatureBlock,
    testimonial: TestimonialBlock,
    testimonials: TestimonialsBlock,
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

<!-- Page Create/Edit View -->
<template>
  <div>
    <!-- <div
      class="flex justify-end items-start px-8 py-6 bg-white border-b border-gray-200 sticky top-0 z-10"
    >
      <div class="flex items-start gap-4">
              <Button icon="pi pi-arrow-left" text @click="handleBack" />
              <div>
                <h1 class="text-2xl font-bold m-0">
                  {{ isEdit ? 'Edit Page' : 'Create New Page' }}
                </h1>
                <div
                  v-if="formData.slug"
                  class="flex items-center gap-2 text-gray-500 text-sm mt-1"
                >
                  <i class="pi pi-link text-xs"></i>
                  <span>{{ pageUrlPreview }}</span>
                </div>
              </div>
            </div>
      <div class="flex gap-3">
        <Button
          label="Preview"
          icon="pi pi-eye"
          severity="secondary"
          outlined
          :disabled="!formData.title"
          @click="previewPage"
        />
        <Button
          label="Save Draft"
          icon="pi pi-save"
          severity="secondary"
          outlined
          :loading="isSaving"
          @click="saveDraft"
        />
        <Button
          v-if="formData.status === 'published'"
          label="Update"
          icon="pi pi-check"
          :loading="isSaving"
          @click="publishPage"
        />
        <Button
          v-else
          label="Publish"
          icon="pi pi-check"
          :loading="isSaving"
          @click="publishPage"
        />
      </div>
    </div> -->
    <Tabs :value="0">
      <TabList>
        <Tab :value="0">Basic Information</Tab>
        <Tab :value="1">Page Design</Tab>
      </TabList>
      <TabPanels>
        <TabPanel :value="0">
          <!-- Basic Information Form -->

          <!-- Main Content -->
          <div
            class="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 p-8 max-w-[1600px] mx-auto"
          >
            <!-- Left Column - Main Form -->
            <div class="min-w-0">
              <!-- Basic Info Card -->
              <Card>
                <template #title>Basic Information</template>
                <template #content>
                  <div class="space-y-4">
                    <!-- Title -->
                    <div class="field">
                      <label for="title" class="block font-medium mb-2">
                        Page Title <span class="text-red-500">*</span>
                      </label>
                      <InputText
                        id="title"
                        v-model="formData.title"
                        placeholder="Enter page title"
                        class="w-full"
                        :class="{ 'p-invalid': errors.title }"
                        @input="handleTitleChange"
                      />
                      <small v-if="errors.title" class="text-red-500">
                        {{ errors.title }}
                      </small>
                    </div>

                    <!-- Slug -->
                    <div class="field">
                      <label for="slug" class="block font-medium mb-2">
                        URL Slug <span class="text-red-500">*</span>
                      </label>
                      <div class="flex gap-2 items-center">
                        <span
                          class="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md font-medium"
                          >/</span
                        >
                        <InputText
                          id="slug"
                          v-model="formData.slug"
                          placeholder="page-url-slug"
                          class="flex-1"
                          :class="{ 'p-invalid': errors.slug }"
                          @input="handleSlugChange"
                        />
                        <Button
                          icon="pi pi-refresh"
                          outlined
                          size="small"
                          v-tooltip.top="'Generate from title'"
                          @click="regenerateSlug"
                        />
                      </div>
                      <small v-if="errors.slug" class="text-red-500">
                        {{ errors.slug }}
                      </small>
                      <small
                        v-else-if="slugStatus === 'checking'"
                        class="text-blue-500"
                      >
                        <i class="pi pi-spin pi-spinner"></i> Checking
                        availability...
                      </small>
                      <small
                        v-else-if="slugStatus === 'available'"
                        class="text-green-500"
                      >
                        <i class="pi pi-check"></i> URL is available
                      </small>
                      <small
                        v-else-if="slugStatus === 'taken'"
                        class="text-red-500"
                      >
                        <i class="pi pi-times"></i> This URL is already in use
                      </small>
                    </div>

                    <!-- Page Type -->
                    <div class="field">
                      <label for="pageType" class="block font-medium mb-2">
                        Page Type <span class="text-red-500">*</span>
                      </label>
                      <Select
                        inputId="pageType"
                        v-model="formData.type"
                        :options="pageTypes"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select page type"
                        class="w-full"
                        :class="{ 'p-invalid': errors.type }"
                        @change="hasChanges = true"
                      >
                        <template #option="{ option }">
                          <div class="flex items-center gap-2">
                            <i :class="option.icon"></i>
                            <div>
                              <div class="font-medium">{{ option.label }}</div>
                              <small class="text-surface-500">{{
                                option.description
                              }}</small>
                            </div>
                          </div>
                        </template>
                      </Select>
                      <small v-if="errors.type" class="text-red-500">
                        {{ errors.type }}
                      </small>
                    </div>

                    <!-- Template Selection -->
                    <!-- <div class="field">
                      <label for="template" class="block font-medium mb-2">
                        Template
                      </label>
                      <Select
                        inputId="template"
                        v-model="formData.templateId"
                        :options="availableTemplates"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select a template (optional)"
                        class="w-full"
                        :showClear="true"
                        @change="hasChanges = true"
                      >
                        <template #option="{ option }">
                          <div>
                            <div class="font-medium">{{ option.name }}</div>
                            <small class="text-surface-500">{{
                              option.description
                            }}</small>
                          </div>
                        </template>
                      </Select>
                      <small class="text-surface-500">
                        Choose a pre-built template or build from scratch
                      </small>
                    </div> -->
                  </div>
                </template>
              </Card>

              <!-- Content Editor Card -->
              <!-- <Card class="mt-4">
                <template #title>Page Content</template>
                <template #content>
                  <Tabs value="0">
                    <TabList>
                      <Tab value="0">Visual Editor</Tab>
                      <Tab value="1">HTML</Tab>
                      <Tab value="2">JSON</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel value="0">
                        <div class="min-h-[300px]">
                          <Message
                            severity="info"
                            :closable="false"
                            class="mb-4"
                          >
                            <div class="flex items-center gap-2">
                              <i class="pi pi-info-circle"></i>
                              <span
                                >Drag and drop blocks to build your page. Click
                                "Add Block" to get started.</span
                              >
                            </div>
                          </Message>
                          <Button
                            label="Add Block"
                            icon="pi pi-plus"
                            outlined
                            @click="showBlockSelector = true"
                          />
                          <div
                            v-if="
                              formData.content.blocks &&
                              formData.content.blocks.length > 0
                            "
                            class="flex flex-col gap-4 mt-4"
                          >
                            <div
                              v-for="(block, index) in formData.content.blocks"
                              :key="index"
                              class="p-4 border border-gray-200 rounded-md bg-gray-50"
                            >
                              <div class="flex justify-between items-center">
                                <span class="font-medium"
                                  >{{ block.name || block.type }} Block</span
                                >
                                <div class="flex gap-1">
                                  <Button
                                    icon="pi pi-pencil"
                                    text
                                    size="small"
                                    @click="editBlock(index)"
                                  />
                                  <Button
                                    icon="pi pi-trash"
                                    text
                                    size="small"
                                    severity="danger"
                                    @click="removeBlock(index)"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabPanel>

                      <TabPanel value="1">
                        <Textarea
                          v-model="formData.content.html"
                          rows="15"
                          class="w-full font-mono text-sm"
                          placeholder="<div>Your HTML content here...</div>"
                          @input="hasChanges = true"
                        />
                      </TabPanel>

                      <TabPanel value="2">
                        <Textarea
                          :modelValue="jsonContent"
                          rows="15"
                          class="w-full font-mono text-sm"
                          placeholder="{}"
                          @update:modelValue="updateJsonContent"
                        />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </template>
              </Card> -->
              <!-- SEO Settings -->
              <PageSEOFields
                v-model="formData.seo"
                :pageTitle="formData.title"
                :pageUrl="pageUrlPreview"
                class="mt-4"
              />

              <!-- Page Settings -->
              <PageSettingsPanel v-model="formData.settings" class="mt-4" />
            </div>

            <!-- Right Column - Settings -->
            <div class="xl:sticky xl:top-[100px] h-fit">
              <!-- Status Card -->
              <Card>
                <template #title>Publish</template>
                <template #content>
                  <div class="space-y-4">
                    <!-- Status -->
                    <div class="field">
                      <label for="status" class="block font-medium mb-2"
                        >Status</label
                      >
                      <Select
                        inputId="status"
                        v-model="formData.status"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full"
                        @change="hasChanges = true"
                      >
                        <template #option="{ option }">
                          <div class="flex items-center gap-2">
                            <Badge
                              :value="option.label"
                              :severity="option.severity"
                            />
                          </div>
                        </template>
                        <template #value="{ value }">
                          <Badge
                            :value="
                              statusOptions.find((s) => s.value === value)
                                ?.label
                            "
                            :severity="
                              statusOptions.find((s) => s.value === value)
                                ?.severity
                            "
                          />
                        </template>
                      </Select>
                    </div>

                    <!-- Schedule Publishing -->
                    <div v-if="formData.status === 'scheduled'" class="field">
                      <label for="scheduledAt" class="block font-medium mb-2">
                        Publish Date & Time
                      </label>
                      <DatePicker
                        inputId="scheduledAt"
                        v-model="formData.scheduledAt"
                        showTime
                        hourFormat="12"
                        class="w-full"
                        @update:modelValue="hasChanges = true"
                      />
                    </div>

                    <!-- Visibility Info -->
                    <div class="p-4 bg-gray-50 rounded-md">
                      <div class="flex items-center gap-2">
                        <i class="pi pi-eye text-surface-500"></i>
                        <span class="text-sm">
                          {{
                            formData.status === 'published'
                              ? 'Visible to public'
                              : 'Not visible to public'
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>

          <!-- Unsaved Changes Dialog -->
          <Dialog
            v-model:visible="showUnsavedDialog"
            header="Unsaved Changes"
            :modal="true"
            :closable="false"
          >
            <p>
              You have unsaved changes. Do you want to save them before leaving?
            </p>
            <template #footer>
              <Button label="Discard" severity="secondary" outlined />
              <Button label="Save Draft" @click="saveAndLeave" />
            </template>
          </Dialog>

          <!-- Block Selector Dialog -->
          <BlockSelector
            v-model:visible="showBlockSelector"
            @select="addBlock"
          />

          <!-- Block Editor Dialog -->
          <BlockEditor
            v-model:visible="showBlockEditor"
            :blockData="editingBlock"
            @save="saveBlockConfig"
          />
        </TabPanel>
        <TabPanel :value="1">
          <!-- Page Design Editor -->
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-4">Page Design</h2>
            <!-- Content editor, block editor, etc. -->
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Badge from 'primevue/badge';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import PageSEOFields from '~/components/admin/pages/PageSEOFields.vue';
import PageSettingsPanel from '~/components/admin/pages/PageSettingsPanel.vue';
import BlockSelector from '~/components/admin/pages/BlockSelector.vue';
import BlockEditor from '~/components/admin/pages/BlockEditor.vue';
import { usePageForm } from '~/composables/admin/usePageForm';
import type { PageFormData } from '~/utils/types/admin/page.types';

definePageMeta({
  layout: 'admin',
});

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);

// Form composable
const { errors, isSaving, hasChanges, generateSlug, savePage } = usePageForm();

// Form data
const formData = ref<PageFormData>({
  title: '',
  slug: '',
  type: 'page',
  status: 'draft',
  content: {
    blocks: [],
    html: '',
    json: {},
  },
  seo: {
    keywords: '',
    noIndex: false,
  },
  settings: {
    isHomepage: false,
    requireAuth: false,
    allowComments: false,
    showInMenu: false,
    menuOrder: 0,
  },
});

// Slug checking
const slugStatus = ref<'idle' | 'checking' | 'available' | 'taken'>('idle');
let slugCheckTimeout: NodeJS.Timeout;

// UI state
const showUnsavedDialog = ref(false);
const showBlockSelector = ref(false);
const showBlockEditor = ref(false);
const editingBlockIndex = ref<number | null>(null);
const editingBlock = ref<any>(null);
const pendingNavigation = ref('');

// Page types
const pageTypes = ref([
  {
    value: 'home',
    label: 'Homepage',
    icon: 'pi pi-home',
    description: 'Main landing page',
  },
  {
    value: 'page',
    label: 'Standard Page',
    icon: 'pi pi-file',
    description: 'Regular content page',
  },
  {
    value: 'landing',
    label: 'Landing Page',
    icon: 'pi pi-star',
    description: 'Marketing landing page',
  },
  {
    value: 'blog',
    label: 'Blog Post',
    icon: 'pi pi-book',
    description: 'Blog article',
  },
]);

// Status options
const statusOptions = ref([
  { value: 'draft', label: 'Draft', severity: 'warning' },
  { value: 'published', label: 'Published', severity: 'success' },
  { value: 'scheduled', label: 'Scheduled', severity: 'info' },
  { value: 'archived', label: 'Archived', severity: 'secondary' },
]);

// Available templates (mock data)
const availableTemplates = ref([
  { id: 1, name: 'Homepage Hero', description: 'Hero section with CTA' },
  { id: 2, name: 'About Page', description: 'About us layout' },
  { id: 3, name: 'Product Listing', description: 'Product grid layout' },
  { id: 4, name: 'Contact Form', description: 'Contact page with form' },
]);

// Computed
const pageUrlPreview = computed(() => {
  const baseUrl = 'https://example.com';
  return formData.value.slug ? `${baseUrl}/${formData.value.slug}` : baseUrl;
});

const jsonContent = computed(() => {
  return JSON.stringify(formData.value.content.json || {}, null, 2);
});

// Methods
const handleTitleChange = () => {
  hasChanges.value = true;
  // Auto-generate slug if it's empty or hasn't been manually edited
  if (!formData.value.slug || slugStatus.value === 'idle') {
    formData.value.slug = generateSlug(formData.value.title);
    checkSlugAvailability();
  }
};

const handleSlugChange = () => {
  hasChanges.value = true;
  formData.value.slug = generateSlug(formData.value.slug);
  checkSlugAvailability();
};

const regenerateSlug = () => {
  formData.value.slug = generateSlug(formData.value.title);
  checkSlugAvailability();
};

const checkSlugAvailability = () => {
  if (!formData.value.slug) return;

  slugStatus.value = 'checking';
  clearTimeout(slugCheckTimeout);

  slugCheckTimeout = setTimeout(async () => {
    // Mock check - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    slugStatus.value = 'available';
  }, 800);
};

const updateJsonContent = (value: string) => {
  try {
    formData.value.content.json = JSON.parse(value);
    hasChanges.value = true;
  } catch (e) {
    console.error('Invalid JSON');
  }
};

const saveDraft = async () => {
  formData.value.status = 'draft';
  const result = await savePage(formData.value, true);

  if (result.success) {
    router.push('/admin/pages');
  }
};

const publishPage = async () => {
  if (formData.value.status === 'draft') {
    formData.value.status = 'published';
  }

  const result = await savePage(formData.value, false);

  if (result.success) {
    router.push('/admin/pages');
  }
};

const previewPage = () => {
  // TODO: Implement preview
  window.open(`/preview/${formData.value.slug}`, '_blank');
};

const handleBack = () => {
  if (hasChanges.value) {
    pendingNavigation.value = '/admin/pages';
    showUnsavedDialog.value = true;
  } else {
    router.push('/admin/pages');
  }
};
const saveAndLeave = async () => {
  await saveDraft();
  showUnsavedDialog.value = false;
  if (pendingNavigation.value) {
    router.push(pendingNavigation.value);
  }
};

const addBlock = (block: any) => {
  if (!formData.value.content.blocks) {
    formData.value.content.blocks = [];
  }

  // Add block with default config
  formData.value.content.blocks.push({
    id: Date.now(),
    type: block.type,
    name: block.name,
    config: {},
  });

  hasChanges.value = true;
};

const removeBlock = (index: number) => {
  formData.value.content.blocks?.splice(index, 1);
  hasChanges.value = true;
};

const editBlock = (index: number) => {
  editingBlockIndex.value = index;
  editingBlock.value = formData.value.content.blocks?.[index];
  showBlockEditor.value = true;
};

const saveBlockConfig = (config: any) => {
  if (editingBlockIndex.value !== null && formData.value.content.blocks) {
    formData.value.content.blocks[editingBlockIndex.value].config = config;
    hasChanges.value = true;
  }
  editingBlockIndex.value = null;
  editingBlock.value = null;
};

// Prevent navigation when there are unsaved changes
onBeforeRouteLeave((to, from, next) => {
  router.push(pendingNavigation.value);
});

// Prevent navigation when there are unsaved changes
onBeforeRouteLeave((to, from, next) => {
  if (hasChanges.value) {
    pendingNavigation.value = to.path;
    showUnsavedDialog.value = true;
    next(false);
  } else {
    next();
  }
});

// Load page data if editing
onMounted(async () => {
  if (isEdit.value) {
    // TODO: Load page data from API
    const pageId = route.params.id;
    console.log('Loading page:', pageId);
  }
});
</script>

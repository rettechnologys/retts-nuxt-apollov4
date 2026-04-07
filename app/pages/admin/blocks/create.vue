<template>
  <div class="block-create-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <Button icon="pi pi-arrow-left" text @click="handleBack" />
        <div>
          <h1>{{ isEdit ? 'Edit Block' : 'Create New Block' }}</h1>
          <div v-if="formData.slug" class="text-sm text-surface-500">
            <code>{{ formData.slug }}</code>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <Button
          label="Preview"
          icon="pi pi-eye"
          severity="secondary"
          outlined
          :disabled="!formData.name"
          @click="showPreview = true"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          :loading="isSaving"
          @click="saveBlock"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <!-- Left Column -->
      <div class="main-column">
        <!-- Basic Info Card -->
        <Card>
          <template #title>Basic Information</template>
          <template #content>
            <div class="space-y-4">
              <!-- Name -->
              <div class="field">
                <label for="name" class="block font-medium mb-2">
                  Block Name <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="name"
                  v-model="formData.name"
                  placeholder="Enter block name"
                  class="w-full"
                  :class="{ 'p-invalid': errors.name }"
                  @input="handleNameChange"
                />
                <small v-if="errors.name" class="text-red-500">
                  {{ errors.name }}
                </small>
              </div>

              <!-- Slug -->
              <div class="field">
                <label for="slug" class="block font-medium mb-2">
                  Slug <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="slug"
                  v-model="formData.slug"
                  placeholder="block-slug"
                  class="w-full"
                  :class="{ 'p-invalid': errors.slug }"
                />
                <small v-if="errors.slug" class="text-red-500">
                  {{ errors.slug }}
                </small>
              </div>

              <!-- Category -->
              <div class="field">
                <label for="category" class="block font-medium mb-2">
                  Category <span class="text-red-500">*</span>
                </label>
                <Select
                  id="category"
                  v-model="formData.category"
                  :options="BLOCK_CATEGORIES"
                  optionLabel="label"
                  optionValue="id"
                  placeholder="Select category"
                  class="w-full"
                  :class="{ 'p-invalid': errors.category }"
                >
                  <template #option="slotProps">
                    <div class="flex items-center gap-2">
                      <i :class="`pi ${slotProps.option.icon}`"></i>
                      <div>
                        <div class="font-medium">
                          {{ slotProps.option.label }}
                        </div>
                        <div class="text-xs text-surface-500">
                          {{ slotProps.option.description }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Select>
                <small v-if="errors.category" class="text-red-500">
                  {{ errors.category }}
                </small>
              </div>

              <!-- Component -->
              <div class="field">
                <label for="component" class="block font-medium mb-2">
                  Component Name <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="component"
                  v-model="formData.component"
                  placeholder="HeroBlock"
                  class="w-full"
                  :class="{ 'p-invalid': errors.component }"
                />
                <small class="text-surface-500">
                  The Vue component name (e.g., HeroBlock, TextBlock)
                </small>
                <small v-if="errors.component" class="block text-red-500">
                  {{ errors.component }}
                </small>
              </div>

              <!-- Description -->
              <div class="field">
                <label for="description" class="block font-medium mb-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  placeholder="Describe what this block does..."
                  class="w-full"
                />
              </div>

              <!-- Icon -->
              <div class="field">
                <label for="icon" class="block font-medium mb-2"> Icon </label>
                <InputText
                  id="icon"
                  v-model="formData.icon"
                  placeholder="pi-box"
                  class="w-full"
                />
                <small class="text-surface-500">
                  PrimeIcons class (without 'pi pi-' prefix)
                </small>
              </div>
            </div>
          </template>
        </Card>

        <!-- Content Editor Card -->
        <Card class="mt-4">
          <template #title>Block Content Editor</template>
          <template #content>
            <Tabs value="0" class="block-editor-tabs">
              <TabList>
                <Tab value="0">Visual Editor</Tab>
                <Tab value="1">HTML Editor</Tab>
                <Tab value="2">JSON Preview</Tab>
              </TabList>

              <TabPanels>
                <!-- Visual Editor -->
                <TabPanel value="0">
                  <div class="space-y-4">
                    <Message severity="info" :closable="false">
                      <div class="text-sm">
                        Define default content fields for this block. Users can
                        override these when using the block.
                      </div>
                    </Message>

                    <div class="field">
                      <label class="block font-medium mb-2"
                        >Default Content (JSON)</label
                      >
                      <Textarea
                        v-model="defaultContentJson"
                        rows="10"
                        class="w-full font-mono text-sm"
                        placeholder='{\n  "title": "Default Title",\n  "description": "Default description"\n}'
                        @blur="validateJson('content')"
                      />
                      <small v-if="errors.defaultContent" class="text-red-500">
                        {{ errors.defaultContent }}
                      </small>
                    </div>

                    <Divider />

                    <div class="field">
                      <label class="block font-medium mb-2"
                        >Content Schema (Field Definitions)</label
                      >
                      <Textarea
                        v-model="contentSchemaJson"
                        rows="15"
                        class="w-full font-mono text-sm"
                        placeholder='{\n  "title": {\n    "type": "text",\n    "label": "Title",\n    "required": true\n  }\n}'
                        @blur="validateJson('contentSchema')"
                      />
                      <small class="text-surface-500 block mt-2">
                        Define what content fields this block accepts (for admin
                        UI generation)
                      </small>
                      <small v-if="errors.contentSchema" class="text-red-500">
                        {{ errors.contentSchema }}
                      </small>
                    </div>
                  </div>
                </TabPanel>

                <!-- HTML Editor -->
                <TabPanel value="1">
                  <div class="space-y-4">
                    <Message severity="warn" :closable="false">
                      <div class="text-sm">
                        This is the preview HTML template. Use
                        <code>{{ '{{' }}content.fieldName}}</code> to reference
                        content fields.
                      </div>
                    </Message>

                    <Textarea
                      v-model="formData.previewHtml"
                      rows="20"
                      class="w-full font-mono text-sm"
                      placeholder='<div class="hero-block">\n  <h1>{{content.title}}</h1>\n  <p>{{content.description}}</p>\n</div>'
                    />
                  </div>
                </TabPanel>

                <!-- JSON Preview -->
                <TabPanel value="2">
                  <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg">
                    <pre
                      class="text-sm"
                    ><code>{{ JSON.stringify(blockPreview, null, 2) }}</code></pre>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </template>
        </Card>

        <!-- Props Configuration Card -->
        <Card class="mt-4">
          <template #title>Block Properties Configuration</template>
          <template #content>
            <div class="space-y-4">
              <Message severity="info" :closable="false">
                <div class="text-sm">
                  Define component props (styling, layout options) separate from
                  content.
                </div>
              </Message>

              <div class="field">
                <label class="block font-medium mb-2"
                  >Default Props (JSON)</label
                >
                <Textarea
                  v-model="defaultPropsJson"
                  rows="8"
                  class="w-full font-mono text-sm"
                  placeholder='{\n  "class": "py-16 px-4",\n  "backgroundColor": "#ffffff"\n}'
                  @blur="validateJson('props')"
                />
                <small v-if="errors.defaultProps" class="text-red-500">
                  {{ errors.defaultProps }}
                </small>
              </div>

              <Divider />

              <div class="field">
                <label class="block font-medium mb-2"
                  >Props Schema (Configuration Options)</label
                >
                <Textarea
                  v-model="propsSchemaJson"
                  rows="12"
                  class="w-full font-mono text-sm"
                  placeholder='{\n  "backgroundColor": {\n    "type": "color",\n    "label": "Background Color",\n    "default": "#ffffff"\n  }\n}'
                  @blur="validateJson('propsSchema')"
                />
                <small class="text-surface-500 block mt-2">
                  Define what props can be configured (class, style, layout
                  options)
                </small>
                <small v-if="errors.propsSchema" class="text-red-500">
                  {{ errors.propsSchema }}
                </small>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Right Column -->
      <div class="sidebar-column">
        <!-- Status Card -->
        <Card>
          <template #title>Status</template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label for="isActive" class="font-medium">Active</label>
                <InputSwitch v-model="formData.isActive" inputId="isActive" />
              </div>
              <small class="text-surface-500">
                Inactive blocks won't appear in the block selector
              </small>
            </div>
          </template>
        </Card>

        <!-- Thumbnail Card -->
        <Card class="mt-4">
          <template #title>Thumbnail</template>
          <template #content>
            <div class="space-y-4">
              <div v-if="formData.thumbnail" class="thumbnail-preview">
                <img
                  :src="formData.thumbnail"
                  alt="Thumbnail"
                  class="w-full rounded-lg"
                />
                <Button
                  icon="pi pi-times"
                  text
                  rounded
                  severity="danger"
                  class="remove-thumbnail"
                  @click="formData.thumbnail = undefined"
                />
              </div>
              <div v-else class="thumbnail-placeholder">
                <i class="pi pi-image text-4xl text-surface-400"></i>
                <p class="text-sm text-surface-500 mt-2">No thumbnail</p>
              </div>
              <InputText
                v-model="formData.thumbnail"
                placeholder="Thumbnail URL"
                class="w-full"
              />
              <Button
                label="Upload"
                icon="pi pi-upload"
                outlined
                size="small"
                class="w-full"
                @click="uploadThumbnail"
              />
            </div>
          </template>
        </Card>

        <!-- Quick Reference Card -->
        <Card class="mt-4">
          <template #title>Quick Reference</template>
          <template #content>
            <div class="space-y-3 text-sm">
              <div>
                <strong>Content vs Props:</strong>
                <ul
                  class="list-disc list-inside mt-1 text-surface-600 dark:text-surface-400"
                >
                  <li>
                    <strong>Content:</strong> Data to display (text, images)
                  </li>
                  <li>
                    <strong>Props:</strong> Component config (class, style)
                  </li>
                </ul>
              </div>
              <Divider />
              <div>
                <strong>Field Types:</strong>
                <ul
                  class="list-disc list-inside mt-1 text-surface-600 dark:text-surface-400"
                >
                  <li>text, textarea, richtext</li>
                  <li>number, boolean, json</li>
                  <li>image, color, select</li>
                </ul>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Preview Dialog -->
    <Dialog
      v-model:visible="showPreview"
      modal
      header="Block Preview"
      :style="{ width: '60rem' }"
      :maximizable="true"
    >
      <div class="preview-container">
        <div v-html="formData.previewHtml"></div>
      </div>
    </Dialog>

    <!-- Unsaved Changes Dialog -->
    <Dialog
      v-model:visible="showUnsavedDialog"
      modal
      header="Unsaved Changes"
      :style="{ width: '32rem' }"
    >
      <p>You have unsaved changes. Do you want to save before leaving?</p>
      <template #footer>
        <Button
          label="Don't Save"
          text
          severity="secondary"
          @click="leaveWithoutSaving"
        />
        <Button label="Cancel" text @click="showUnsavedDialog = false" />
        <Button label="Save" @click="saveAndLeave" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type {
  BlockFormData,
  BlockValidationErrors,
} from '~/utils/types/admin/block.types';
import { BLOCK_CATEGORIES } from '~/utils/types/admin/block.types';

definePageMeta({
  layout: 'admin',
});

const route = useRoute();
const router = useRouter();

// State
const isEdit = computed(() => !!route.params.id);
const isSaving = ref(false);
const hasChanges = ref(false);
const showPreview = ref(false);
const showUnsavedDialog = ref(false);
const errors = ref<BlockValidationErrors>({});

const formData = ref<BlockFormData>({
  name: '',
  slug: '',
  category: 'content',
  component: '',
  defaultProps: {},
  defaultContent: {},
  propsSchema: {},
  contentSchema: {},
  isActive: true,
});

// JSON string representations for textareas
const defaultPropsJson = ref('{}');
const defaultContentJson = ref('{}');
const propsSchemaJson = ref('{}');
const contentSchemaJson = ref('{}');

// Watch for changes
watch(
  formData,
  () => {
    hasChanges.value = true;
  },
  { deep: true },
);

// Computed
const blockPreview = computed(() => ({
  name: formData.value.name,
  slug: formData.value.slug,
  category: formData.value.category,
  component: formData.value.component,
  defaultProps: formData.value.defaultProps,
  defaultContent: formData.value.defaultContent,
  propsSchema: formData.value.propsSchema,
  contentSchema: formData.value.contentSchema,
}));

// Methods
const handleNameChange = () => {
  if (!isEdit.value) {
    // Auto-generate slug from name
    formData.value.slug = formData.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
};

const validateJson = (
  field: 'props' | 'content' | 'propsSchema' | 'contentSchema',
) => {
  try {
    let jsonStr = '';
    switch (field) {
      case 'props':
        jsonStr = defaultPropsJson.value;
        formData.value.defaultProps = JSON.parse(jsonStr || '{}');
        errors.value.defaultProps = undefined;
        break;
      case 'content':
        jsonStr = defaultContentJson.value;
        formData.value.defaultContent = JSON.parse(jsonStr || '{}');
        errors.value.defaultContent = undefined;
        break;
      case 'propsSchema':
        jsonStr = propsSchemaJson.value;
        formData.value.propsSchema = JSON.parse(jsonStr || '{}');
        errors.value.propsSchema = undefined;
        break;
      case 'contentSchema':
        jsonStr = contentSchemaJson.value;
        formData.value.contentSchema = JSON.parse(jsonStr || '{}');
        errors.value.contentSchema = undefined;
        break;
    }
  } catch (e) {
    switch (field) {
      case 'props':
        errors.value.defaultProps = 'Invalid JSON format';
        break;
      case 'content':
        errors.value.defaultContent = 'Invalid JSON format';
        break;
      case 'propsSchema':
        errors.value.propsSchema = 'Invalid JSON schema format';
        break;
      case 'contentSchema':
        errors.value.contentSchema = 'Invalid JSON schema format';
        break;
    }
  }
};

const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.name.trim()) {
    errors.value.name = 'Block name is required';
    isValid = false;
  }

  if (!formData.value.slug.trim()) {
    errors.value.slug = 'Slug is required';
    isValid = false;
  }

  if (!formData.value.category) {
    errors.value.category = 'Category is required';
    isValid = false;
  }

  if (!formData.value.component.trim()) {
    errors.value.component = 'Component name is required';
    isValid = false;
  }

  // Validate all JSON fields
  validateJson('props');
  validateJson('content');
  validateJson('propsSchema');
  validateJson('contentSchema');

  if (
    errors.value.defaultProps ||
    errors.value.defaultContent ||
    errors.value.propsSchema ||
    errors.value.contentSchema
  ) {
    isValid = false;
  }

  return isValid;
};

const saveBlock = async () => {
  if (!validateForm()) {
    return;
  }

  isSaving.value = true;
  try {
    // TODO: API call
    // const result = isEdit.value
    //   ? await $fetch(`/api/admin/blocks/${route.params.id}`, { method: 'PUT', body: formData.value })
    //   : await $fetch('/api/admin/blocks', { method: 'POST', body: formData.value });

    hasChanges.value = false;

    // Show success toast
    // toast.add({ severity: 'success', summary: 'Success', detail: 'Block saved successfully' });

    // Navigate back
    await navigateTo('/admin/blocks');
  } catch (error) {
    console.error('Save error:', error);
    // Show error toast
  } finally {
    isSaving.value = false;
  }
};

const handleBack = () => {
  if (hasChanges.value) {
    showUnsavedDialog.value = true;
  } else {
    navigateTo('/admin/blocks');
  }
};

const saveAndLeave = async () => {
  await saveBlock();
};

const leaveWithoutSaving = () => {
  hasChanges.value = false;
  navigateTo('/admin/blocks');
};

const uploadThumbnail = () => {
  // TODO: Implement file upload
  console.log('Upload thumbnail');
};

// Load existing block if editing
onMounted(async () => {
  if (isEdit.value) {
    try {
      // TODO: Load block data
      // const block = await $fetch(`/api/admin/blocks/${route.params.id}`);
      // formData.value = block;

      // Populate JSON strings
      defaultPropsJson.value = JSON.stringify(
        formData.value.defaultProps,
        null,
        2,
      );
      defaultContentJson.value = JSON.stringify(
        formData.value.defaultContent,
        null,
        2,
      );
      propsSchemaJson.value = JSON.stringify(
        formData.value.propsSchema,
        null,
        2,
      );
      contentSchemaJson.value = JSON.stringify(
        formData.value.contentSchema,
        null,
        2,
      );

      hasChanges.value = false;
    } catch (error) {
      console.error('Load block error:', error);
    }
  }
});

// Prevent navigation if unsaved changes
onBeforeRouteLeave((to, from, next) => {
  if (hasChanges.value) {
    showUnsavedDialog.value = true;
    next(false);
  } else {
    next();
  }
});
</script>

<style scoped>
.block-create-container {
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

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.page-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
}

.main-column {
  min-width: 0;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.thumbnail-preview {
  position: relative;
}

.remove-thumbnail {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.thumbnail-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed var(--surface-border);
  border-radius: 0.5rem;
}

.preview-container {
  padding: 2rem;
  background: var(--surface-50);
  border-radius: 0.5rem;
  min-height: 300px;
}

@media (max-width: 1024px) {
  .page-content {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <Card>
    <template #title>
      <div class="flex items-center gap-2">
        <i class="pi pi-search text-xl"></i>
        <span>SEO Settings</span>
      </div>
    </template>
    <template #content>
      <div class="seo-fields space-y-4">
        <!-- Meta Title -->
        <div class="field">
          <label for="metaTitle" class="block font-medium mb-2">
            Meta Title
            <span class="text-sm text-surface-500 ml-2"
              >({{ metaTitleLength }}/60)</span
            >
          </label>
          <InputText
            id="metaTitle"
            v-model="localSEO.metaTitle"
            placeholder="Page title for search engines"
            class="w-full"
            :class="{ 'p-invalid': metaTitleLength > 60 }"
            @input="handleInput"
          />
          <small v-if="metaTitleLength > 60" class="text-red-500">
            Meta title is too long. Keep it under 60 characters for best
            results.
          </small>
          <small v-else class="text-surface-500">
            Leave empty to use the page title
          </small>
        </div>

        <!-- Meta Description -->
        <div class="field">
          <label for="metaDescription" class="block font-medium mb-2">
            Meta Description
            <span class="text-sm text-surface-500 ml-2"
              >({{ metaDescriptionLength }}/160)</span
            >
          </label>
          <Textarea
            id="metaDescription"
            v-model="localSEO.metaDescription"
            placeholder="Brief description for search results"
            rows="3"
            class="w-full"
            :class="{ 'p-invalid': metaDescriptionLength > 160 }"
            @input="handleInput"
          />
          <small v-if="metaDescriptionLength > 160" class="text-red-500">
            Meta description is too long. Keep it under 160 characters.
          </small>
        </div>

        <!-- Keywords -->
        <div class="field">
          <label for="keywords" class="block font-medium mb-2">Keywords</label>
          <Chips
            id="keywords"
            v-model="localSEO.keywords"
            placeholder="Add keyword and press Enter"
            class="w-full"
            @update:modelValue="handleInput"
          />
          <small class="text-surface-500">
            Press Enter to add keywords. Recommended: 3-5 keywords
          </small>
        </div>

        <!-- OG Image -->
        <div class="field">
          <label for="ogImage" class="block font-medium mb-2">
            Social Share Image (OG Image)
          </label>
          <div class="flex gap-2">
            <InputText
              id="ogImage"
              v-model="localSEO.ogImage"
              placeholder="https://example.com/image.jpg"
              class="flex-1"
              @input="handleInput"
            />
            <Button icon="pi pi-upload" outlined @click="selectImage" />
          </div>
          <small class="text-surface-500"> Recommended size: 1200x630px </small>
        </div>

        <!-- Canonical URL -->
        <div class="field">
          <label for="canonical" class="block font-medium mb-2">
            Canonical URL
          </label>
          <InputText
            id="canonical"
            v-model="localSEO.canonical"
            placeholder="https://example.com/page"
            class="w-full"
            @input="handleInput"
          />
          <small class="text-surface-500">
            Specify the preferred URL if this content exists on multiple URLs
          </small>
        </div>

        <!-- Indexing Options -->
        <div class="field">
          <label class="block font-medium mb-3">Search Engine Indexing</label>
          <div class="flex flex-col gap-3">
            <div class="flex items-center">
              <Checkbox
                inputId="noIndex"
                v-model="localSEO.noIndex"
                :binary="true"
                @update:modelValue="handleInput"
              />
              <label for="noIndex" class="ml-2 cursor-pointer">
                No Index (prevent search engines from indexing this page)
              </label>
            </div>
            <div class="flex items-center">
              <Checkbox
                inputId="noFollow"
                v-model="localSEO.noFollow"
                :binary="true"
                @update:modelValue="handleInput"
              />
              <label for="noFollow" class="ml-2 cursor-pointer">
                No Follow (prevent search engines from following links on this
                page)
              </label>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <Divider />
        <div class="field">
          <label class="block font-medium mb-3">Search Result Preview</label>
          <div
            class="seo-preview border rounded-lg p-4 bg-surface-50 dark:bg-surface-800"
          >
            <div
              class="preview-url text-sm text-green-600 dark:text-green-400 mb-1"
            >
              {{ previewUrl }}
            </div>
            <div
              class="preview-title text-lg text-blue-600 dark:text-blue-400 mb-1 font-medium"
            >
              {{ previewTitle }}
            </div>
            <div
              class="preview-description text-sm text-surface-600 dark:text-surface-400"
            >
              {{ previewDescription }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Chips from 'primevue/chips';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import type { PageSEO } from '~/utils/types/admin/page.types';

interface Props {
  modelValue: PageSEO;
  pageTitle?: string;
  pageUrl?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: PageSEO];
}>();

const localSEO = ref<PageSEO>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => {
    localSEO.value = { ...newVal };
  },
  { deep: true },
);

const handleInput = () => {
  emit('update:modelValue', { ...localSEO.value });
};

const metaTitleLength = computed(() => localSEO.value.metaTitle?.length || 0);
const metaDescriptionLength = computed(
  () => localSEO.value.metaDescription?.length || 0,
);

const previewUrl = computed(() => {
  return props.pageUrl || 'https://example.com/page-url';
});

const previewTitle = computed(() => {
  return localSEO.value.metaTitle || props.pageTitle || 'Page Title';
});

const previewDescription = computed(() => {
  return (
    localSEO.value.metaDescription ||
    'Add a meta description to see how it appears in search results.'
  );
});

const selectImage = () => {
  // TODO: Implement image selector
  console.log('Select image');
};
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}

.seo-preview {
  font-family: Arial, sans-serif;
}

.preview-url {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

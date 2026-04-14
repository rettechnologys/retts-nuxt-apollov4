<!-- Page Create/Edit View -->
<template>
  <form @submit.prevent="submitWithStatus('draft')">
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab :value="0">Basic Information</Tab>
        <Tab :value="1">Page Design</Tab>
        <Tab :value="2">Preview &amp; Submit</Tab>
      </TabList>

      <TabPanels>
        <TabPanel :value="0">
          <div
            class="grid grid-cols-1 gap-6 p-8 xl:grid-cols-[1fr_400px] mx-auto max-w-[1600px]"
          >
            <div class="min-w-0">
              <Card>
                <template #title>Basic Information</template>
                <template #content>
                  <div class="space-y-4">
                    <div class="field">
                      <label for="title" class="block font-medium mb-2">
                        Page Title <span class="text-red-500">*</span>
                      </label>
                      <InputText
                        id="title"
                        v-model="titleValue"
                        placeholder="Enter page title"
                        class="w-full"
                        :class="{ 'p-invalid': !!titleError }"
                        @input="handleTitleChange"
                      />
                      <small v-if="titleError" class="text-red-500">
                        {{ titleError }}
                      </small>
                    </div>

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
                          v-model="slugValue"
                          placeholder="page-url-slug"
                          class="flex-1"
                          :class="{ 'p-invalid': !!slugError }"
                          @input="handleSlugChange"
                        />
                        <Button
                          icon="pi pi-refresh"
                          type="button"
                          outlined
                          size="small"
                          v-tooltip.top="'Generate from title'"
                          @click.prevent="regenerateSlug"
                        />
                      </div>
                      <small v-if="slugError" class="text-red-500">
                        {{ slugError }}
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

                    <div class="field">
                      <label for="pageType" class="block font-medium mb-2">
                        Page Type <span class="text-red-500">*</span>
                      </label>
                      <Select
                        inputId="pageType"
                        v-model="typeValue"
                        :options="pageTypes"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select page type"
                        class="w-full"
                        :class="{ 'p-invalid': !!typeError }"
                      >
                        <template #option="{ option }">
                          <div class="flex items-center gap-2">
                            <i :class="option.icon"></i>
                            <div>
                              <div class="font-medium">{{ option.label }}</div>
                              <small class="text-surface-500">
                                {{ option.description }}
                              </small>
                            </div>
                          </div>
                        </template>
                      </Select>
                      <small v-if="typeError" class="text-red-500">
                        {{ typeError }}
                      </small>
                    </div>
                  </div>
                </template>
              </Card>

              <PageSEOFields
                :page-title="values.title"
                :page-url="pageUrlPreview"
                class="mt-4"
              />
            </div>

            <div class="xl:sticky xl:top-[100px] h-fit">
              <Card>
                <template #title>Publish</template>
                <template #content>
                  <div class="space-y-4">
                    <div class="field">
                      <label for="status" class="block font-medium mb-2">
                        Status
                      </label>
                      <Select
                        inputId="status"
                        v-model="statusValue"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full"
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

                    <div v-if="statusValue === 'scheduled'" class="field">
                      <label for="scheduledAt" class="block font-medium mb-2">
                        Publish Date &amp; Time
                      </label>
                      <DatePicker
                        inputId="scheduledAt"
                        v-model="scheduledAtModel"
                        showTime
                        hourFormat="12"
                        class="w-full"
                        :class="{ 'p-invalid': !!scheduledAtError }"
                      />
                      <small v-if="scheduledAtError" class="text-red-500">
                        {{ scheduledAtError }}
                      </small>
                    </div>

                    <div class="p-4 bg-gray-50 rounded-md">
                      <div class="flex items-center gap-2">
                        <i class="pi pi-eye text-surface-500"></i>
                        <span class="text-sm">
                          {{
                            statusValue === 'published'
                              ? 'Visible to public'
                              : 'Not visible to public'
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </Card>

              <PageSettingsPanel class="mt-4" />
            </div>
          </div>
        </TabPanel>

        <TabPanel :value="1">
          <div class="p-4">
            <Message
              v-if="blocksError"
              severity="error"
              :closable="true"
              class="mb-4"
            >
              {{ blocksError }}
            </Message>
            <PageDesign
              v-model="pageBlocksModel"
              :collection-cache="collectionData"
              :collections="collectionsListData ?? []"
              :collections-loading="collectionsLoading"
              :schemas="schemaCache"
              @fetch:collection="fetchCollection"
            />
          </div>
        </TabPanel>

        <TabPanel :value="2">
          <div class="grid gap-6 p-8 xl:grid-cols-1 mx-auto max-w-[1600px]">
            <div class="space-y-4 xl:sticky xl:top-[100px] h-fit">
              <Card>
                <template #title>Submission Summary</template>
                <template #content>
                  <div class="grid xl:grid-cols-3 space-y-4 text-sm">
                    <div class="flex gap-8">
                      <div class="">
                        <div
                          class="text-surface-500 uppercase tracking-wider text-xs"
                        >
                          Title
                        </div>
                        <div class="mt-1 font-semibold text-surface-800">
                          {{ values.title || 'Untitled page' }}
                        </div>
                      </div>

                      <div>
                        <div
                          class="text-surface-500 uppercase tracking-wider text-xs"
                        >
                          Path
                        </div>
                        <div class="mt-1 text-surface-700">
                          {{ pageUrlPreview }}
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div class="rounded-xl bg-surface-50 p-3">
                        <div
                          class="text-surface-500 uppercase tracking-wider text-xs"
                        >
                          Status
                        </div>
                        <div
                          class="mt-1 font-medium text-surface-800 capitalize"
                        >
                          {{ statusValue }}
                        </div>
                      </div>
                      <div class="rounded-xl bg-surface-50 p-3">
                        <div
                          class="text-surface-500 uppercase tracking-wider text-xs"
                        >
                          Blocks
                        </div>
                        <div class="mt-1 font-medium text-surface-800">
                          {{ values.blocks.length }}
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col gap-2 pt-2">
                      <ButtonGroup class="w-full justify-center">
                        <!-- <Button
                          label="Schedule"
                          type="button"
                          icon="pi pi-calendar"
                          outlined
                          :loading="isSaving"
                          @click="submitWithStatus('schedule')"
                        />
                        <Button
                          label="Save Draft"
                          type="button"
                          icon="pi pi-save"
                          :loading="isSaving"
                          @click="submitWithStatus('draft')"
                        /> -->
                        <Button
                          label="Submit"
                          type="button"
                          icon="pi pi-send"
                          severity="success"
                          :loading="isSaving"
                          @click="submitWithStatus('publish')"
                        />
                      </ButtonGroup>
                    </div>
                  </div>
                </template>
              </Card>
            </div>

            <div class="space-y-4">
              <div
                class="rounded-3xl border border-surface-200 bg-surface-0 p-6"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p
                      class="text-xs uppercase tracking-[0.18em] text-surface-500"
                    >
                      Live Preview
                    </p>
                    <h2 class="mt-2 text-2xl font-semibold text-surface-900">
                      {{ values.title || 'Untitled page' }}
                    </h2>
                    <p class="mt-2 text-sm text-surface-500">
                      {{ pageUrlPreview }}
                    </p>
                  </div>
                  <Badge
                    :value="
                      statusOptions.find(
                        (option) => option.value === statusValue,
                      )?.label
                    "
                    :severity="
                      statusOptions.find(
                        (option) => option.value === statusValue,
                      )?.severity
                    "
                  />
                </div>
              </div>

              <PageDesignPreview
                :blocks="values.blocks"
                :collection-cache="collectionData"
              />
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog
      v-model:visible="showUnsavedDialog"
      header="Unsaved Changes"
      :modal="true"
      :closable="false"
    >
      <p>You have unsaved changes. Do you want to save them before leaving?</p>
      <template #footer>
        <Button
          type="button"
          label="Discard"
          severity="secondary"
          outlined
          @click="discardChanges"
        />
        <Button type="button" label="Save Draft" @click="saveAndLeave" />
      </template>
    </Dialog>
  </form>
</template>

<script setup lang="ts">
//#region Imports
import { useField, useForm } from 'vee-validate';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Badge from 'primevue/badge';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import PageSEOFields from '~/components/admin/pages/PageSEOFields.vue';
import PageSettingsPanel from '~/components/admin/pages/PageSettingsPanel.vue';
import PageDesign from '~/components/admin/pages/PageDesign.vue';
import PageDesignPreview from '~/components/admin/pages/PageDesignPreview.vue';
import { usePageForm } from '~/composables/admin/usePageForm';
import type { BlockDefinition } from '~/components/admin/pages/pageDesign.types';
import type {
  PageFormData,
  PageSettings,
} from '~/utils/types/admin/page.types';
import type {
  CollectionSchemaWithCount,
  CollectionSchema,
} from '~/utils/types/admin/collection.types';
//#endregion Imports

//#region Props, Emit, Macros
definePageMeta({
  layout: 'admin',
});
//#endregion Props, Emit, Macros

//#region Types
type SubmitIntent = 'draft' | 'publish' | 'schedule';
//#endregion Types

//#region Constants
let slugCheckTimeout: ReturnType<typeof setTimeout> | undefined;

const DEFAULT_PAGE_SETTINGS: PageSettings = {
  isHomepage: false,
  requireAuth: false,
  allowComments: false,
  showInMenu: false,
  menuOrder: 0,
  parentPageId: null,
  customCSS: '',
  customJS: '',
};

const DEFAULT_FORM_VALUES: PageFormData = {
  title: '',
  slug: '',
  type: 'page',
  status: 'draft',
  blocks: [],
  seo: {
    keywords: [],
    noIndex: false,
    noFollow: false,
  },
  settings: { ...DEFAULT_PAGE_SETTINGS },
};

const pageTypes = [
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
];

const statusOptions = [
  { value: 'draft', label: 'Draft', severity: 'warning' },
  { value: 'published', label: 'Published', severity: 'success' },
  { value: 'scheduled', label: 'Scheduled', severity: 'info' },
  { value: 'archived', label: 'Archived', severity: 'secondary' },
];
//#endregion Constants

//#region Composables
const toast = useToast();
const route = useRoute();
const router = useRouter();
const {
  isSaving,
  hasChanges,
  generateSlug,
  checkSlugUniqueness,
  savePage,
  updatePage,
  resetForm: resetPageFormState,
} = usePageForm();

const { handleSubmit, setFieldValue, setFieldError, resetForm, values, meta } =
  useForm<PageFormData>({
    initialValues: DEFAULT_FORM_VALUES,
  });

const { value: titleValue, errorMessage: titleError } = useField<string>(
  'title',
  (value) => {
    if (!value?.trim()) return 'Title is required';
    return value.length <= 200 || 'Title must be less than 200 characters';
  },
);

const { value: slugValue, errorMessage: slugError } = useField<string>(
  'slug',
  (value) => {
    if (!value?.trim()) return 'Slug is required';
    return (
      /^[a-z0-9-]+$/.test(value) ||
      'Slug can only contain lowercase letters, numbers, and hyphens'
    );
  },
);

const { value: typeValue, errorMessage: typeError } = useField<string>(
  'type',
  (value) => !!value || 'Page type is required',
);

const { value: statusValue } = useField<PageFormData['status']>('status');
const { value: blocksValue, errorMessage: blocksError } = useField<
  BlockDefinition[]
>('blocks', (value) => {
  if (!value || value.length === 0) return 'At least one block is required';
  return true;
});
const { value: scheduledAtValue, errorMessage: scheduledAtError } = useField<
  string | undefined
>('scheduledAt', (value) => {
  if (statusValue.value !== 'scheduled') return true;
  return !!value || 'Publish date and time is required';
});
//#endregion Composables

//#region State
const activeTab = ref(0);
const slugStatus = ref<'idle' | 'checking' | 'available' | 'taken'>('idle');
const slugManuallyEdited = ref(false);
const showUnsavedDialog = ref(false);
const pendingNavigation = ref('');
const submitIntent = ref<SubmitIntent>('draft');
//#endregion State

//#region Computed
const isEdit = computed(() => !!route.query.edit);
const editSlug = computed(() => route.query.edit as string | undefined);
const pageUrlPreview = computed(() => {
  const baseUrl = 'https://example.com';
  return slugValue.value ? `${baseUrl}/${slugValue.value}` : baseUrl;
});

const pageBlocksModel = computed<BlockDefinition[]>({
  get: () => blocksValue.value ?? [],
  set: (value) => {
    setFieldValue('blocks', value);
  },
});

// ── Collections list (fetched once on mount) ─────────────────────────────────
const { data: collectionsListData, pending: collectionsLoading } =
  useFetch<CollectionSchemaWithCount[]>('/api/collections');

// ── Collection items + schema caches (keyed by slug) ─────────────────────────
const collectionData = ref<Record<string, any[]>>({});
const schemaCache = ref<Record<string, CollectionSchema>>({});

const fetchCollection = async (slug: string) => {
  if (!slug) return;
  try {
    const [itemsRes, schema] = await Promise.all([
      $fetch<{ items: any[] }>(`/api/collections/${slug}/items?perPage=50`),
      $fetch<CollectionSchema>(`/api/collections/${slug}`),
    ]);
    collectionData.value = {
      ...collectionData.value,
      [slug]: itemsRes.items ?? [],
    };
    schemaCache.value = { ...schemaCache.value, [slug]: schema };
  } catch (e) {
    console.warn(`[create] Failed to fetch collection "${slug}":`, e);
  }
};

const scheduledAtModel = computed<Date | null>({
  get: () => {
    if (!scheduledAtValue.value) return null;

    const parsed = new Date(scheduledAtValue.value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  },
  set: (value) => {
    setFieldValue('scheduledAt', value ? value.toISOString() : undefined);
  },
});
//#endregion Computed

//#region Lifecycle Hooks
onMounted(async () => {
  if (!editSlug.value) return;

  try {
    const stored = await $fetch<{ payload: PageFormData }>(
      `/api/admin/pages/${editSlug.value}`,
    );
    const p = stored.payload;
    resetForm({ values: { ...DEFAULT_FORM_VALUES, ...p } });
    slugManuallyEdited.value = true;
    slugStatus.value = 'available';
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Could not load page for editing',
      life: 4000,
    });
  }
});

onBeforeRouteLeave((to, from, next) => {
  if (hasChanges.value) {
    pendingNavigation.value = to.path;
    showUnsavedDialog.value = true;
    next(false);
    return;
  }

  next();
});
//#endregion Lifecycle Hooks

//#region Methods
const checkSlugAvailability = (candidate = slugValue.value ?? '') => {
  if (!candidate) {
    slugStatus.value = 'idle';
    return;
  }

  slugStatus.value = 'checking';

  if (slugCheckTimeout) {
    clearTimeout(slugCheckTimeout);
  }

  slugCheckTimeout = setTimeout(async () => {
    const isUnique = await checkSlugUniqueness(candidate);
    console.log(`Slug "${candidate}" uniqueness:`, isUnique);
    if (candidate !== slugValue.value) return;

    slugStatus.value = isUnique ? 'available' : 'taken';
    if (!isUnique) {
      setFieldError('slug', 'This URL is already in use');
    }
  }, 800);
};

const handleTitleChange = () => {
  if (!slugManuallyEdited.value || !slugValue.value) {
    const nextSlug = generateSlug(titleValue.value ?? '');
    setFieldValue('slug', nextSlug);
    checkSlugAvailability(nextSlug);
  }
};

const handleSlugChange = () => {
  slugManuallyEdited.value = true;
  const normalized = generateSlug(slugValue.value ?? '');
  if (normalized !== slugValue.value) {
    setFieldValue('slug', normalized);
  }
  checkSlugAvailability(normalized);
};

const regenerateSlug = () => {
  slugManuallyEdited.value = false;
  const nextSlug = generateSlug(titleValue.value ?? '');
  setFieldValue('slug', nextSlug);
  checkSlugAvailability(nextSlug);
};

const submitPage = handleSubmit(
  async (validatedValues) => {
    const nextStatus =
      submitIntent.value === 'publish'
        ? 'published'
        : submitIntent.value === 'schedule'
          ? 'scheduled'
          : 'draft';

    const payload: PageFormData = {
      ...validatedValues,
      status: nextStatus,
      blocks: validatedValues.blocks ?? [],
      seo: {
        ...validatedValues.seo,
        keywords: validatedValues.seo.keywords ?? [],
      },
      settings: {
        ...DEFAULT_PAGE_SETTINGS,
        ...validatedValues.settings,
      },
    };

    if (slugStatus.value === 'taken') {
      setFieldError('slug', 'This URL is already in use');
      activeTab.value = 0;
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'This URL is already in use',
      });
      return { success: false };
    }

    const result = isEdit.value
      ? await updatePage(payload, submitIntent.value === 'draft')
      : await savePage(payload, submitIntent.value === 'draft');

    if (!result.success) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.error || 'Failed to save page',
      });

      return {
        success: false,
      };
    }

    console.log('Page saved successfully:', result.data);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Page saved successfully',
    });

    resetForm({ values: payload });
    resetPageFormState();
    return { success: true, data: result.data };
  },
  ({ errors }) => {
    activeTab.value = Object.keys(errors).some((key) =>
      key.startsWith('blocks'),
    )
      ? 1
      : 0;
  },
);

const submitWithStatus = async (
  intent: SubmitIntent,
  redirectTo = '/admin/pages',
) => {
  submitIntent.value = intent;
  const nextStatus =
    intent === 'publish'
      ? 'published'
      : intent === 'schedule'
        ? 'scheduled'
        : 'draft';
  setFieldValue('status', nextStatus);

  const result = await submitPage();

  if (result && result.success) {
    await router.push(redirectTo);
  }
  return result;
};

const discardChanges = async () => {
  const target = pendingNavigation.value || '/admin/pages';
  showUnsavedDialog.value = false;
  hasChanges.value = false;
  await router.push(target);
};

const saveAndLeave = async () => {
  const target = pendingNavigation.value || '/admin/pages';
  const result = await submitWithStatus('draft', target);
  if (result?.success) {
    showUnsavedDialog.value = false;
  }
};
//#endregion Methods

//#region Watchers
watch(
  () => meta.value.dirty,
  (isDirty) => {
    hasChanges.value = isDirty;
  },
  { immediate: true },
);
//#endregion Watchers
</script>

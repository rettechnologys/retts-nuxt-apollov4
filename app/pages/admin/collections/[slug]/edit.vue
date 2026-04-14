<template>
  <div v-if="pending" class="flex items-center justify-center py-20">
    <i class="pi pi-spin pi-spinner text-3xl text-primary-500" />
  </div>

  <form v-else-if="schema" @submit.prevent="handleSubmit">
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab :value="0">Basic Info</Tab>
        <Tab :value="1">Fields</Tab>
      </TabList>

      <TabPanels>
        <!-- ── Tab 0: Basic Info ─────────────────────────────────────── -->
        <TabPanel :value="0">
          <div
            class="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[1fr_380px] mx-auto max-w-[1200px]"
          >
            <Card>
              <template #title>Collection Details</template>
              <template #content>
                <div class="space-y-4">
                  <div class="field">
                    <label class="block font-medium mb-2">
                      Name <span class="text-red-500">*</span>
                    </label>
                    <InputText
                      v-model="form.name"
                      placeholder="e.g. Blog Posts, Products"
                      class="w-full"
                      :class="{ 'p-invalid': errors.name }"
                    />
                    <small v-if="errors.name" class="text-red-500">{{
                      errors.name
                    }}</small>
                  </div>

                  <div class="field">
                    <label class="block font-medium mb-2">Description</label>
                    <Textarea
                      v-model="form.description"
                      rows="3"
                      class="w-full"
                    />
                  </div>

                  <div
                    class="p-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                  >
                    <div
                      class="text-xs text-surface-400 uppercase tracking-wider mb-1"
                    >
                      Slug (read-only)
                    </div>
                    <code
                      class="text-sm text-surface-700 dark:text-surface-300"
                      >{{ schema.slug }}</code
                    >
                  </div>
                </div>
              </template>
            </Card>

            <div class="xl:sticky xl:top-[100px] h-fit" style="grid-column: 2">
              <Card>
                <template #title>Appearance</template>
                <template #content>
                  <div class="field">
                    <label class="block font-medium mb-2">Icon</label>
                    <InputText
                      v-model="form.icon"
                      placeholder="pi pi-database"
                      class="w-full"
                    />
                    <div class="mt-3 flex items-center gap-2">
                      <div
                        class="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center"
                      >
                        <i
                          :class="form.icon || 'pi pi-database'"
                          class="text-primary-500 text-lg"
                        />
                      </div>
                      <span class="text-sm text-surface-500">Preview</span>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </TabPanel>

        <!-- ── Tab 1: Fields ─────────────────────────────────────────── -->
        <TabPanel :value="1">
          <div class="p-6 max-w-[900px] mx-auto">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2
                  class="text-lg font-semibold text-surface-800 dark:text-surface-200"
                >
                  Field Definitions
                </h2>
                <p class="text-sm text-surface-500 mt-0.5">
                  Reorder, add, or remove fields
                </p>
              </div>
              <Button
                label="Add Field"
                icon="pi pi-plus"
                size="small"
                @click="addField"
              />
            </div>

            <Message v-if="errors.fields" severity="error" class="mb-4">{{
              errors.fields
            }}</Message>

            <div
              v-if="form.fields.length === 0"
              class="flex flex-col items-center justify-center py-16 text-surface-400 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl"
            >
              <i class="pi pi-list text-4xl mb-3" />
              <p class="text-sm mt-1 mb-4">No fields defined</p>
              <Button
                label="Add Field"
                icon="pi pi-plus"
                size="small"
                outlined
                @click="addField"
              />
            </div>

            <VueDraggable
              v-model="form.fields"
              handle=".drag-handle"
              :animation="150"
            >
              <div
                v-for="(field, index) in form.fields"
                :key="field._uid"
                class="mb-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 overflow-hidden"
              >
                <div
                  class="flex items-center gap-2 px-3 py-2 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700"
                >
                  <i
                    class="drag-handle pi pi-bars text-surface-300 cursor-grab text-sm"
                  />
                  <i
                    :class="getFieldIcon(field.type)"
                    class="text-primary-500 text-sm"
                  />
                  <span
                    class="flex-1 text-sm font-medium text-surface-700 dark:text-surface-300"
                  >
                    {{ field.label || `Field ${index + 1}` }}
                    <span class="text-surface-400 font-normal ml-1">{{
                      field.key ? `(${field.key})` : ''
                    }}</span>
                  </span>
                  <Badge :value="field.type" severity="secondary" />
                  <Button
                    icon="pi pi-trash"
                    text
                    rounded
                    size="small"
                    severity="danger"
                    class="!p-1 !w-6 !h-6"
                    @click="removeField(index)"
                  />
                </div>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3"
                >
                  <div class="field">
                    <label
                      class="block text-xs font-medium mb-1 text-surface-500"
                      >Label *</label
                    >
                    <InputText
                      v-model="field.label"
                      placeholder="Field Label"
                      class="w-full"
                      size="small"
                      @input="onFieldLabelChange(field)"
                    />
                  </div>
                  <div class="field">
                    <label
                      class="block text-xs font-medium mb-1 text-surface-500"
                      >Key *</label
                    >
                    <InputText
                      v-model="field.key"
                      placeholder="field_key"
                      class="w-full"
                      size="small"
                    />
                  </div>
                  <div class="field">
                    <label
                      class="block text-xs font-medium mb-1 text-surface-500"
                      >Type</label
                    >
                    <Select
                      v-model="field.type"
                      :options="FIELD_TYPE_OPTIONS"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full"
                      size="small"
                    />
                  </div>
                  <div class="flex items-end gap-3 pb-1">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <ToggleSwitch v-model="field.required" />
                      <span
                        class="text-sm text-surface-600 dark:text-surface-300"
                        >Required</span
                      >
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <ToggleSwitch v-model="field.showInList" />
                      <span
                        class="text-sm text-surface-600 dark:text-surface-300"
                        >Show in list</span
                      >
                    </label>
                  </div>
                </div>
              </div>
            </VueDraggable>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <div
      class="flex items-center justify-between px-6 py-4 border-t border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 sticky bottom-0"
    >
      <Button
        label="Cancel"
        severity="secondary"
        text
        type="button"
        @click="navigateTo('/admin/collections')"
      />
      <Button
        label="Save Changes"
        icon="pi pi-check"
        type="submit"
        :loading="isSaving"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import {
  FIELD_TYPE_OPTIONS,
  type CollectionFieldDef,
  type CollectionFieldType,
  type CollectionSchema,
} from '~/utils/types/admin/collection.types';
import { useCollectionForm } from '~/composables/admin/useCollectionForm';

definePageMeta({ layout: 'admin' });

const toast = useToast();
const router = useRouter();
const route = useRoute();
const collectionSlug = computed(() => route.params.slug as string);

const { isSaving, generateSlug, updateCollection } = useCollectionForm();

const { data: schema, pending } = await useFetch<CollectionSchema>(
  () => `/api/collections/${collectionSlug.value}`,
);

interface FieldWithUid extends CollectionFieldDef {
  _uid: string;
}

const makeUid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const form = reactive<{
  name: string;
  icon: string;
  description: string;
  fields: FieldWithUid[];
}>({
  name: '',
  icon: 'pi pi-database',
  description: '',
  fields: [],
});

const errors = reactive<{ name?: string; fields?: string }>({});
const activeTab = ref(0);

// Populate form when schema loads
watch(
  schema,
  (s) => {
    if (!s) return;
    form.name = s.name;
    form.icon = s.icon;
    form.description = s.description ?? '';
    form.fields = s.fields.map((f) => ({ ...f, _uid: makeUid() }));
  },
  { immediate: true },
);

const addField = () => {
  form.fields.push({
    _uid: makeUid(),
    key: '',
    label: '',
    type: 'text' as CollectionFieldType,
    required: false,
    showInList: true,
  });
};

const removeField = (index: number) => {
  form.fields.splice(index, 1);
};

const onFieldLabelChange = (field: FieldWithUid) => {
  if (!field.key) field.key = generateSlug(field.label).replace(/-/g, '_');
};

const getFieldIcon = (type: CollectionFieldType): string => {
  const map: Partial<Record<CollectionFieldType, string>> = {
    text: 'pi pi-font',
    textarea: 'pi pi-align-left',
    richtext: 'pi pi-code',
    number: 'pi pi-hashtag',
    toggle: 'pi pi-toggle-on',
    select: 'pi pi-chevron-down',
    image: 'pi pi-image',
    file: 'pi pi-paperclip',
    date: 'pi pi-calendar',
    url: 'pi pi-link',
    color: 'pi pi-palette',
  };
  return map[type] ?? 'pi pi-circle';
};

const validate = (): boolean => {
  let valid = true;
  if (!form.name.trim()) {
    errors.name = 'Name is required';
    valid = false;
  }
  const bad = form.fields.findIndex((f) => !f.key || !f.label);
  if (bad !== -1) {
    errors.fields = `Field ${bad + 1} is missing a label or key`;
    activeTab.value = 1;
    valid = false;
  }
  return valid;
};

const handleSubmit = async () => {
  if (!validate()) return;
  const result = await updateCollection(collectionSlug.value, {
    name: form.name.trim(),
    icon: form.icon.trim() || 'pi pi-database',
    description: form.description.trim(),
    fields: form.fields.map(({ _uid: _u, ...rest }) => rest),
  });
  if (result.success) {
    toast.add({
      severity: 'success',
      summary: 'Saved',
      detail: 'Collection updated',
      life: 3000,
    });
    await router.push('/admin/collections');
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: result.error,
      life: 4000,
    });
  }
};
</script>

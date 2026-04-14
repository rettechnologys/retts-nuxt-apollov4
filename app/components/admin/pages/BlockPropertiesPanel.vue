<template>
  <div class="properties-panel">
    <!-- Block header -->
    <div
      class="flex items-center gap-2 px-4 py-3 border-b border-surface-200 dark:border-surface-700"
    >
      <i :class="block.icon" class="text-primary-500" />
      <div>
        <div
          class="font-semibold text-surface-800 dark:text-surface-200 text-sm"
        >
          {{ block.name }}
        </div>
        <div class="text-sm text-surface-500 capitalize">
          {{ block.type }} block
        </div>
      </div>
    </div>

    <!-- Tabs: Properties / Data Source -->
    <Tabs v-model:value="activeTab">
      <TabList class="px-2 pt-1">
        <Tab :value="0" class="text-xs">Properties</Tab>
        <Tab :value="1" class="text-xs">
          <span class="flex items-center gap-1">
            <i class="pi pi-database text-xs" />
            Data Source
            <Badge
              v-if="block.dataSource?.collection"
              value="1"
              severity="info"
              class="!text-[10px] !min-w-[16px] !h-4 !leading-none"
            />
          </span>
        </Tab>
      </TabList>

      <!-- Properties Panel -->
      <TabPanel :value="0" class="!p-0">
        <div class="p-4">
          <div v-if="hasFields" class="space-y-6">
            <section v-if="block.schema.global.length > 0" class="space-y-4">
              <div>
                <h3 class="panel-heading">Global Properties</h3>
                <p class="panel-description">
                  Shared block-level settings applied around the rendered
                  component.
                </p>
              </div>

              <div
                v-for="section in block.schema.global"
                :key="`global-${section.key}`"
                class="section-card"
              >
                <div class="section-card__header">
                  <div class="section-card__title">{{ section.label }}</div>
                  <p
                    v-if="section.description"
                    class="section-card__description"
                  >
                    {{ section.description }}
                  </p>
                </div>

                <div class="section-card__body">
                  <BlockPropertiesFieldRenderer
                    v-for="field in section.fields"
                    :key="`globalProps.${field.key}`"
                    :field="field"
                    :path="`globalProps.${field.key}`"
                    :scope-values="currentValues.globalProps"
                    :errors="fieldErrors"
                    :read-value="readValue"
                    :update-value="updateValue"
                    :add-array-item="addArrayItem"
                    :remove-array-item="removeArrayItem"
                  />
                </div>
              </div>
            </section>

            <section v-if="block.schema.content.length > 0" class="space-y-4">
              <div>
                <h3 class="panel-heading">Content</h3>
                <p class="panel-description">
                  Content and child-component data consumed by this block.
                </p>
              </div>

              <div
                v-for="section in block.schema.content"
                :key="`content-${section.key}`"
                class=""
              >
                <div class="section-card__header">
                  <div class="section-card__title">{{ section.label }}</div>
                  <p
                    v-if="section.description"
                    class="section-card__description"
                  >
                    {{ section.description }}
                  </p>
                </div>

                <div class="section-card__body">
                  <BlockPropertiesFieldRenderer
                    v-for="field in section.fields"
                    :key="`content.${field.key}`"
                    :field="field"
                    :path="`content.${field.key}`"
                    :scope-values="currentValues.content"
                    :errors="fieldErrors"
                    :read-value="readValue"
                    :update-value="updateValue"
                    :add-array-item="addArrayItem"
                    :remove-array-item="removeArrayItem"
                  />
                </div>
              </div>
            </section>
          </div>

          <div v-else class="text-center py-8 text-surface-400">
            <i class="pi pi-sliders-h text-3xl mb-3 block" />
            <p class="text-sm font-medium">{{ block.name }}</p>
            <p class="text-sm mt-1 text-surface-400">
              No configurable properties
            </p>
          </div>
        </div>
      </TabPanel>

      <!-- Data Source Panel -->
      <TabPanel :value="1" class="!p-0">
        <AdminCollectionsCollectionBindingPanel
          :modelValue="block.dataSource"
          :collections="props.collections"
          :collections-loading="props.collectionsLoading"
          :schemas="props.schemas"
          :block-prop-keys="blockPropKeys"
          @update:modelValue="onDataSourceUpdate"
          @fetch:collection="emit('fetch:collection', $event)"
        />
        <div v-if="block.dataSource?.collection" class="px-4 pb-4">
          <Button
            label="Refresh Preview"
            icon="pi pi-refresh"
            outlined
            size="small"
            class="w-full"
            @click="emit('fetch:collection', block.dataSource!.collection)"
          />
        </div>
      </TabPanel>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import BlockPropertiesFieldRenderer from './BlockPropertiesFieldRenderer.vue';
import {
  createArrayItemValue,
  type PageDesignArrayField,
  type PageDesignBlockSchema,
  type PageDesignBlockValues,
  type PageDesignFormField,
  validateBlockValues,
} from './pageDesignSchema';
import type {
  CollectionSchemaWithCount,
  CollectionSchema,
} from '~/utils/types/admin/collection.types';

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
  schema: PageDesignBlockSchema;
  globalProps: Record<string, any>;
  content: Record<string, any>;
  dataSource?: DataSource;
}

const props = defineProps<{
  block: CanvasBlock;
  collections?: CollectionSchemaWithCount[];
  collectionsLoading?: boolean;
  schemas?: Record<string, CollectionSchema>;
}>();

const emit = defineEmits<{
  'update:values': [values: PageDesignBlockValues];
  'update:dataSource': [dataSource: DataSource | undefined];
  'fetch:collection': [slug: string];
}>();

const activeTab = ref(0);

const onDataSourceUpdate = (v: DataSource | undefined) => {
  emit('update:dataSource', v);
};

const validationErrors = ref<Record<string, string | undefined>>({});

const toPlainValue = (value: any): any => {
  if (value == null || typeof value !== 'object') return value;
  if (value instanceof Date || value instanceof File) return value;
  if (Array.isArray(value)) return value.map((item) => toPlainValue(item));

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, toPlainValue(item)]),
  );
};

const createInitialValues = (block: CanvasBlock): PageDesignBlockValues => ({
  globalProps: toPlainValue(block.globalProps),
  content: toPlainValue(block.content),
});

const { values, resetForm, setFieldValue } = useForm<PageDesignBlockValues>({
  initialValues: createInitialValues(props.block),
});

const currentValues = computed<PageDesignBlockValues>(() => ({
  globalProps: toPlainValue(values.globalProps ?? {}),
  content: toPlainValue(values.content ?? {}),
}));

const fieldErrors = computed<Record<string, string | undefined>>(
  () => validationErrors.value,
);

const hasFields = computed(
  () =>
    props.block.schema.global.some((section) => section.fields.length > 0) ||
    props.block.schema.content.some((section) => section.fields.length > 0),
);

const blockPropKeys = computed(() => {
  const extractKeys = (
    fields: PageDesignFormField[],
  ): { key: string; label: string }[] =>
    fields.flatMap((f) => {
      if (f.type === 'array')
        return (f as PageDesignArrayField).of.map((sf) => ({
          key: `${f.key}.${sf.key}`, // "items.title"
          label: `${f.label} › ${sf.label}`, // "Items › Title"
        }));
      return [{ key: f.key, label: f.label }]; // "Title" for block-level
    });

  return [
    ...props.block.schema.global.flatMap((s) => extractKeys(s.fields)),
    ...props.block.schema.content.flatMap((s) => extractKeys(s.fields)),
  ];
});

// const blockPropKeys = computed(() => {
//   const extractKeys = (fields: PageDesignFormField[]): string[] =>
//     fields.flatMap((f) => {
//       if (f.type === 'array')
//         // return (f as PageDesignArrayField).of.map((sf) => f.key + '.' + sf.key);
//         return (f as PageDesignArrayField).of.map((sf) => sf.key);

//       return [f.key];
//     });

//   return [
//     ...props.block.schema.global.flatMap((s) => extractKeys(s.fields)),
//     ...props.block.schema.content.flatMap((s) => extractKeys(s.fields)),
//   ];
//   // return [
//   //   ...props.block.schema.global.flatMap((s) => s.fields.map((f) => f.key)),
//   //   ...props.block.schema.content.flatMap((s) => s.fields.map((f) => f.key)),
//   // ];
// });

const readValue = (path: string): any => {
  const segments = path.split('.');
  let current: any = values;

  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment];
  }

  return current;
};

const syncValidationAndEmit = () => {
  const nextValues = currentValues.value;
  validationErrors.value = validateBlockValues(props.block.schema, nextValues);
  console.log(
    'Emitting updated values for block',
    props.block.instanceId,
    nextValues,
  );
  emit('update:values', nextValues);
};

const updateValue = (path: string, value: any, _field: PageDesignFormField) => {
  setFieldValue(path as any, value);
};

const addArrayItem = (path: string, field: PageDesignArrayField) => {
  const currentItems = readValue(path);
  const nextItems = Array.isArray(currentItems) ? [...currentItems] : [];
  nextItems.push(createArrayItemValue(field));
  setFieldValue(path as any, nextItems);
};

const removeArrayItem = (path: string, index: number) => {
  const currentItems = readValue(path);
  if (!Array.isArray(currentItems)) return;
  const nextItems = [...currentItems];
  nextItems.splice(index, 1);
  setFieldValue(path as any, nextItems);
};

watch(
  () => props.block.instanceId,
  () => {
    resetForm({ values: createInitialValues(props.block) });
    syncValidationAndEmit();
  },
  { immediate: true },
);

watch(values, syncValidationAndEmit, { deep: true });
</script>

<style scoped>
.panel-heading {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--p-surface-600);
}

.panel-description {
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  color: var(--p-surface-500);
}

.section-card {
  border: 1px solid var(--p-surface-200);
  border-radius: 0.875rem;
  overflow: hidden;
  background: var(--p-surface-0);
}

.section-card__header {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--p-surface-200);
  background: var(--p-surface-50);
}

.section-card__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--p-surface-700);
}

.section-card__description {
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  color: var(--p-surface-500);
}

.section-card__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
</style>

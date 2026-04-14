<template>
  <div class="space-y-5 p-4">
    <div>
      <h3
        class="text-sm font-semibold text-surface-700 dark:text-surface-200 uppercase tracking-wider mb-1"
      >
        Data Source
      </h3>
      <p class="text-xs text-surface-400">
        Bind a collection to this block so it renders live data.
      </p>
    </div>

    <!-- Collection select -->
    <div class="field">
      <label class="block text-sm font-medium mb-1">Collection</label>
      <Select
        v-model="localValue.collection"
        :options="collections"
        optionLabel="name"
        optionValue="slug"
        placeholder="Select a collection…"
        class="w-full"
        :loading="collectionsLoading"
        showClear
        @change="onCollectionChange"
      />
    </div>

    <!-- Mode -->
    <div v-if="localValue.collection" class="field">
      <label class="block text-sm font-medium mb-1">Mode</label>
      <SelectButton
        v-model="localValue.mode"
        :options="modeOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full"
      />
    </div>

    <!-- Field mappings -->
    <template v-if="localValue.collection && selectedSchema">
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium">Field Mappings</label>
          <Button
            icon="pi pi-plus"
            text
            size="small"
            label="Add"
            @click="addMapping"
          />
        </div>
        <p class="text-xs text-surface-400 mb-3">
          Map collection fields → block content/prop keys
        </p>

        <div
          v-if="mappingRows.length === 0"
          class="text-center py-6 text-surface-400 border border-dashed border-surface-200 dark:border-surface-700 rounded-lg"
        >
          <p class="text-xs">No mappings defined</p>
          <Button
            label="Add Mapping"
            icon="pi pi-plus"
            text
            size="small"
            class="mt-1"
            @click="addMapping"
          />
        </div>

        <div
          v-for="(row, i) in mappingRows"
          :key="i"
          class="flex items-center gap-2 mb-2"
        >
          <!-- Collection field -->
          <Select
            v-model="row.collectionField"
            :options="selectedSchema.fields"
            optionLabel="label"
            optionValue="key"
            placeholder="Collection field"
            class="flex-1"
            size="small"
          />
          <i class="pi pi-arrow-right text-surface-400 flex-shrink-0" />
          <!-- Block prop key -->
          <AutoComplete
            :modelValue="blockKeyObject(row.blockKey)"
            :suggestions="filteredPropKeys"
            optionLabel="label"
            placeholder="Block key"
            class="flex-1"
            size="small"
            @update:model-value="
              (v) => (row.blockKey = typeof v === 'object' && v ? v.key : v)
            "
            @complete="filterPropKeys"
          />
          <Button
            icon="pi pi-trash"
            text
            rounded
            size="small"
            severity="danger"
            class="!p-1 !w-6 !h-6"
            @click="removeMapping(i)"
          />
        </div>
      </div>
    </template>

    <!-- Clear -->
    <Button
      v-if="localValue.collection"
      label="Clear binding"
      icon="pi pi-times"
      severity="secondary"
      text
      size="small"
      class="w-full"
      @click="clearBinding"
    />
  </div>
</template>

<script setup lang="ts">
import AutoComplete from 'primevue/autocomplete';
import type {
  CollectionSchemaWithCount,
  CollectionSchema,
} from '~/utils/types/admin/collection.types';

interface DataSource {
  collection: string;
  mode: 'list' | 'single';
  fieldMappings: Record<string, string>;
}

interface MappingRow {
  collectionField: string;
  blockKey: string;
}

interface BlockPropKeys {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    label: string;
  };
}

const props = defineProps<{
  modelValue: DataSource | undefined;
  collections?: CollectionSchemaWithCount[];
  collectionsLoading?: boolean;
  schemas?: Record<string, CollectionSchema>;
  blockPropKeys?: { key: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: DataSource | undefined): void;
  (e: 'fetch:collection', slug: string): void;
}>();

const modeOptions = [
  { label: 'List', value: 'list' },
  { label: 'Single', value: 'single' },
];

// const filteredPropKeys = ref<string[]>([]);
// const filterPropKeys = ({ query }: { query: string }) => {
//   const q = query.toLowerCase();
//   filteredPropKeys.value = (props.blockPropKeys ?? []).filter((k) =>
//     k.toLowerCase().includes(q),
//   );
// };

const filteredPropKeys = ref<{ key: string; label: string }[]>([]);
const filterPropKeys = ({ query }: { query: string }) => {
  const q = query.toLowerCase();
  filteredPropKeys.value = (props.blockPropKeys ?? []).filter(
    (p) => p.key.toLowerCase().includes(q) || p.label.toLowerCase().includes(q),
  );
};
// Resolves stored key string back to object for display.
// Falls back to synthetic object so optionLabel always shows something.
const blockKeyObject = (key: string) =>
  props.blockPropKeys?.find((p) => p.key === key) ??
  (key ? { key, label: key } : '');

// ── Collections list (provided by parent) ─────────────────────────────────────
const collections = computed(() => props.collections ?? []);

// ── Schema (provided by parent via schemas cache) ────────────────────────────
const selectedSchema = computed(
  () => props.schemas?.[localValue.collection] ?? null,
);

// ─── Local state ──────────────────────────────────────────────────────────────
const localValue = reactive<DataSource>({
  collection: props.modelValue?.collection ?? '',
  mode: props.modelValue?.mode ?? 'list',
  fieldMappings: { ...(props.modelValue?.fieldMappings ?? {}) },
});

const mappingRows = ref<MappingRow[]>(
  Object.entries(props.modelValue?.fieldMappings ?? {}).map(
    ([collectionField, blockKey]) => ({ collectionField, blockKey }),
  ),
);

// Emit fetch for pre-selected collection on mount so parent populates schema cache
if (localValue.collection) {
  emit('fetch:collection', localValue.collection);
}

const onCollectionChange = () => {
  mappingRows.value = [];
  if (localValue.collection) emit('fetch:collection', localValue.collection);
  emitChange();
};

const addMapping = () =>
  mappingRows.value.push({ collectionField: '', blockKey: '' });
const removeMapping = (i: number) => {
  mappingRows.value.splice(i, 1);
  emitChange();
};

const clearBinding = () => {
  localValue.collection = '';
  localValue.mode = 'list';
  localValue.fieldMappings = {};
  mappingRows.value = [];
  emit('update:modelValue', undefined);
};

const emitChange = () => {
  if (!localValue.collection) {
    emit('update:modelValue', undefined);
    return;
  }
  const mappings: Record<string, string> = {};
  for (const row of mappingRows.value) {
    if (row.collectionField && row.blockKey)
      mappings[row.collectionField] = row.blockKey;
  }
  emit('update:modelValue', {
    collection: localValue.collection,
    mode: localValue.mode,
    fieldMappings: mappings,
  });
};

// Watch for changes and emit
watch(
  () => [localValue.collection, localValue.mode, mappingRows.value],
  emitChange,
  { deep: true },
);
</script>

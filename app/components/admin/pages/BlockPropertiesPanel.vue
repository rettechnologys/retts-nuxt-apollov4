<template>
  <div class="properties-panel p-4">
    <!-- Block Header Info -->
    <div
      class="flex items-center gap-2 mb-4 pb-3 border-b border-surface-200 dark:border-surface-700"
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

    <!-- Dynamic Config Form — generated from config keys -->
    <div v-if="configFields.length > 0" class="space-y-3">
      <div v-for="field in configFields" :key="field.key" class="field">
        <label class="field-label">{{ field.label }}</label>

        <!-- Checkbox (boolean) -->
        <div
          v-if="field.type === 'checkbox'"
          class="flex items-center gap-2 mt-1"
        >
          <Checkbox
            :inputId="`field-${field.key}`"
            v-model="localConfig[field.key]"
            :binary="true"
            @update:modelValue="emitUpdate"
          />
          <label :for="`field-${field.key}`" class="text-sm cursor-pointer">{{
            field.label
          }}</label>
        </div>

        <!-- Number -->
        <InputNumber
          v-else-if="field.type === 'number'"
          v-model="localConfig[field.key]"
          :min="field.min"
          :max="field.max"
          showButtons
          class="w-full"
          @update:modelValue="emitUpdate"
        />

        <!-- Select -->
        <Select
          v-else-if="field.type === 'select'"
          v-model="localConfig[field.key]"
          :options="field.options"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          @update:modelValue="emitUpdate"
        />

        <!-- Textarea -->
        <Textarea
          v-else-if="field.type === 'textarea'"
          v-model="localConfig[field.key]"
          :placeholder="field.placeholder"
          rows="3"
          class="w-full"
          @update:modelValue="emitUpdate"
        />

        <!-- Color -->
        <div v-else-if="field.type === 'color'" class="flex gap-2 items-center">
          <input
            type="color"
            :value="localConfig[field.key] || '#3b82f6'"
            class="w-8 h-8 rounded cursor-pointer border border-surface-300"
            @input="
              (e) => {
                localConfig[field.key] = (e.target as HTMLInputElement).value;
                emitUpdate();
              }
            "
          />
          <InputText
            v-model="localConfig[field.key]"
            :placeholder="field.placeholder || '#3b82f6'"
            class="flex-1"
            @update:modelValue="emitUpdate"
          />
        </div>

        <!-- Array -->
        <div v-else-if="field.type === 'array'" class="space-y-2">
          <div
            v-for="(item, idx) in localConfig[field.key] as any[]"
            :key="idx"
            class="p-3 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-800"
          >
            <div class="flex justify-between items-center mb-2">
              <span
                class="text-xs font-semibold text-surface-500 uppercase tracking-wide"
              >
                Item {{ idx + 1 }}
              </span>
              <Button
                icon="pi pi-trash"
                text
                size="small"
                severity="danger"
                class="!p-1 !w-5 !h-5"
                @click="removeArrayItem(field.key, idx)"
              />
            </div>
            <!-- Sub-fields for each array item object -->
            <template v-if="typeof item === 'object' && !Array.isArray(item)">
              <div
                v-for="subKey in Object.keys(item)"
                :key="subKey"
                class="mb-2"
              >
                <label class="field-label">{{ formatLabel(subKey) }}</label>
                <Textarea
                  v-if="isTextareaKey(subKey)"
                  v-model="item[subKey]"
                  rows="2"
                  class="w-full text-sm"
                  @update:modelValue="emitUpdate"
                />
                <InputText
                  v-else
                  v-model="item[subKey]"
                  class="w-full text-sm"
                  @update:modelValue="emitUpdate"
                />
              </div>
            </template>
            <InputText
              v-else
              v-model="(localConfig[field.key] as any[])[idx]"
              class="w-full"
              @update:modelValue="emitUpdate"
            />
          </div>
          <Button
            label="Add Item"
            icon="pi pi-plus"
            outlined
            size="small"
            class="w-full"
            @click="addArrayItem(field.key)"
          />
        </div>

        <!-- URL -->
        <InputText
          v-else-if="field.type === 'url'"
          v-model="localConfig[field.key]"
          :placeholder="field.placeholder"
          class="w-full"
          @update:modelValue="emitUpdate"
        />

        <!-- Default: text -->
        <InputText
          v-else
          v-model="localConfig[field.key]"
          :placeholder="field.placeholder"
          class="w-full"
          @update:modelValue="emitUpdate"
        />
      </div>
    </div>

    <!-- Empty config -->
    <div v-else class="text-center py-8 text-surface-400">
      <i class="pi pi-sliders-h text-3xl mb-3 block" />
      <p class="text-sm font-medium">{{ block.name }}</p>
      <p class="text-sm mt-1 text-surface-400">No configurable properties</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

interface CanvasBlock {
  instanceId: string;
  id: string;
  type: string;
  name: string;
  icon: string;
  config: Record<string, any>;
}

type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'url'
  | 'color'
  | 'array';

interface FieldMeta {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
}

// ─── Known select options ──────────────────────────────────────────────────────

const knownSelectOptions: Record<string, { label: string; value: any }[]> = {
  alignment: [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ],
  level: [
    { label: 'H1 – Largest', value: 1 },
    { label: 'H2', value: 2 },
    { label: 'H3', value: 3 },
    { label: 'H4', value: 4 },
    { label: 'H5', value: 5 },
    { label: 'H6 – Smallest', value: 6 },
  ],
  size: [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
    { label: 'Full Width', value: 'full' },
  ],
  variant: [
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
    { label: 'Success', value: 'success' },
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warn' },
    { label: 'Danger', value: 'danger' },
  ],
  gap: [
    { label: 'None', value: '0' },
    { label: 'Small', value: '2' },
    { label: 'Medium', value: '4' },
    { label: 'Large', value: '8' },
  ],
  columns: [
    { label: '1 Column', value: '1' },
    { label: '2 Columns', value: '2' },
    { label: '3 Columns', value: '3' },
    { label: '4 Columns', value: '4' },
  ],
};

// ─── Number constraints ────────────────────────────────────────────────────────

const numberConstraints: Record<string, { min: number; max: number }> = {
  level: { min: 1, max: 6 },
  columns: { min: 1, max: 6 },
  columnCount: { min: 2, max: 6 },
  itemsPerRow: { min: 1, max: 6 },
  maxItems: { min: 1, max: 50 },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const formatLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const isTextareaKey = (key: string): boolean =>
  /content|description|subheading|subtitle|quote|body|text|html/i.test(key);

const inferField = (key: string, value: any): FieldMeta => {
  // Boolean
  if (typeof value === 'boolean') {
    return { key, label: formatLabel(key), type: 'checkbox' };
  }

  // Number
  if (typeof value === 'number') {
    const constraints = numberConstraints[key] ?? { min: 0, max: 999 };
    return { key, label: formatLabel(key), type: 'number', ...constraints };
  }

  // Array
  if (Array.isArray(value)) {
    return { key, label: formatLabel(key), type: 'array' };
  }

  // Known select key
  if (knownSelectOptions[key]) {
    return {
      key,
      label: formatLabel(key),
      type: 'select',
      options: knownSelectOptions[key],
    };
  }

  // String patterns
  if (typeof value === 'string') {
    if (/color|colour/i.test(key))
      return {
        key,
        label: formatLabel(key),
        type: 'color',
        placeholder: '#3b82f6',
      };
    if (/url|image|src|href|imageAlt/i.test(key))
      return {
        key,
        label: formatLabel(key),
        type: 'url',
        placeholder: 'https://',
      };
    if (isTextareaKey(key))
      return {
        key,
        label: formatLabel(key),
        type: 'textarea',
        placeholder: `Enter ${formatLabel(key).toLowerCase()}...`,
      };
  }

  return {
    key,
    label: formatLabel(key),
    type: 'text',
    placeholder: `Enter ${formatLabel(key).toLowerCase()}`,
  };
};

// ─── Props & Emits ─────────────────────────────────────────────────────────────

type FieldMetaOverride = {
  type?: FieldType;
  label?: string;
  placeholder?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
};

const props = defineProps<{
  block: CanvasBlock;
  fieldMeta?: Record<string, FieldMetaOverride>;
}>();

const emit = defineEmits<{
  'update:config': [config: Record<string, any>];
}>();

// ─── State ─────────────────────────────────────────────────────────────────────

const localConfig = ref<Record<string, any>>({});

watch(
  () => props.block,
  (newBlock) => {
    if (newBlock) localConfig.value = { ...newBlock.config };
  },
  { immediate: true, deep: true },
);

const configFields = computed<FieldMeta[]>(() =>
  Object.entries(localConfig.value).map(([key, value]) => {
    const inferred = inferField(key, value);
    const override = props.fieldMeta?.[key];
    if (!override) return inferred;
    // Merge override on top of inferred — explicit wins
    return {
      ...inferred,
      ...override,
      label: override.label ?? inferred.label,
    } as FieldMeta;
  }),
);

// ─── Actions ───────────────────────────────────────────────────────────────────

const emitUpdate = () => {
  emit('update:config', { ...localConfig.value });
};

const addArrayItem = (key: string) => {
  if (!Array.isArray(localConfig.value[key])) localConfig.value[key] = [];
  const existing = localConfig.value[key][0];
  if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
    // Clone structure of first item with empty strings
    const template = Object.fromEntries(
      Object.keys(existing).map((k) => [
        k,
        typeof existing[k] === 'number' ? 0 : '',
      ]),
    );
    localConfig.value[key].push(template);
  } else {
    localConfig.value[key].push('');
  }
  emitUpdate();
};

const removeArrayItem = (key: string, index: number) => {
  localConfig.value[key].splice(index, 1);
  emitUpdate();
};
</script>

<style scoped>
.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--p-surface-500);
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}
</style>

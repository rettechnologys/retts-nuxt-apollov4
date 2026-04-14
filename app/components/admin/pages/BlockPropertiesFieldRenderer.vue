<template>
  <div v-if="isVisible" class="field-block">
    <div v-if="field.type === 'object'" class="nested-group">
      <div class="nested-group__header">
        <div>
          <div class="field-label">{{ field.label }}</div>
          <p v-if="field.helpText" class="field-help">{{ field.helpText }}</p>
        </div>
      </div>

      <div class="nested-group__body">
        <BlockPropertiesFieldRenderer
          v-for="childField in field.fields"
          :key="`${path}.${childField.key}`"
          :field="childField"
          :path="`${path}.${childField.key}`"
          :scope-values="objectValue"
          :errors="errors"
          :read-value="readValue"
          :update-value="updateValue"
          :add-array-item="addArrayItem"
          :remove-array-item="removeArrayItem"
        />
      </div>
    </div>

    <div v-else-if="field.type === 'array'" class="nested-group">
      <div class="nested-group__header nested-group__header--actions">
        <div>
          <div class="field-label">{{ field.label }}</div>
          <p v-if="field.helpText" class="field-help">{{ field.helpText }}</p>
          <p v-if="errors[path]" class="field-error">{{ errors[path] }}</p>
        </div>

        <Button
          label="Add Item"
          icon="pi pi-plus"
          size="small"
          outlined
          @click="addArrayItem(path, field)"
        />
      </div>

      <div v-if="arrayItems.length > 0" class="nested-group__body space-y-3">
        <div
          v-for="(item, index) in arrayItems"
          :key="`${path}.${index}`"
          class="array-item"
        >
          <div class="array-item__header">
            <span class="array-item__title">
              {{ field.itemLabel || field.label }} {{ index + 1 }}
            </span>
            <Button
              icon="pi pi-trash"
              text
              severity="danger"
              size="small"
              class="!p-1 !w-6 !h-6"
              @click="removeArrayItem(path, index)"
            />
          </div>

          <div class="space-y-3">
            <template v-if="field.itemShape === 'primitive'">
              <BlockPropertiesFieldRenderer
                :field="field.of[0]"
                :path="`${path}.${index}`"
                :scope-values="{ value: item }"
                :errors="errors"
                :read-value="readValue"
                :update-value="updateValue"
                :add-array-item="addArrayItem"
                :remove-array-item="removeArrayItem"
              />
            </template>

            <template v-else>
              <BlockPropertiesFieldRenderer
                v-for="childField in field.of"
                :key="`${path}.${index}.${childField.key}`"
                :field="childField"
                :path="`${path}.${index}.${childField.key}`"
                :scope-values="item"
                :errors="errors"
                :read-value="readValue"
                :update-value="updateValue"
                :add-array-item="addArrayItem"
                :remove-array-item="removeArrayItem"
              />
            </template>
          </div>
        </div>
      </div>

      <div v-else class="array-empty">No items added yet.</div>
    </div>

    <div v-else class="field-control">
      <label class="field-label">{{ field.label }}</label>
      <p v-if="field.helpText" class="field-help">{{ field.helpText }}</p>

      <InputText
        v-if="
          field.type === 'text' ||
          field.type === 'url' ||
          field.type === 'image'
        "
        :modelValue="currentValue"
        :placeholder="field.placeholder"
        class="w-full"
        v-bind="field.primeProps"
        @update:modelValue="(value) => updateValue(path, value, field)"
      />

      <Textarea
        v-else-if="field.type === 'textarea' || field.type === 'json'"
        :modelValue="currentValue"
        :placeholder="field.placeholder"
        class="w-full"
        rows="field.type === 'json' ? 6 : 4"
        autoResize
        v-bind="field.primeProps"
        @update:modelValue="(value) => updateValue(path, value, field)"
      />

      <Editor
        v-else-if="field.type === 'richtext'"
        :modelValue="currentValue"
        editorStyle="height: 180px"
        v-bind="field.primeProps"
        @text-change="
          ({ htmlValue }: { htmlValue: string }) =>
            updateValue(path, htmlValue, field)
        "
      />

      <InputNumber
        v-else-if="field.type === 'number'"
        :modelValue="currentValue"
        class="w-full"
        inputClass="w-full"
        showButtons
        v-bind="field.primeProps"
        @update:modelValue="(value) => updateValue(path, value, field)"
      />

      <div
        v-else-if="field.type === 'checkbox'"
        class="flex items-center gap-2 mt-2"
      >
        <Checkbox
          :binary="true"
          :modelValue="Boolean(currentValue)"
          v-bind="field.primeProps"
          @update:modelValue="(value) => updateValue(path, value, field)"
        />
        <span class="text-sm text-surface-600 dark:text-surface-300">{{
          field.label
        }}</span>
      </div>

      <div v-else-if="field.type === 'toggle'" class="mt-2">
        <ToggleSwitch
          :modelValue="Boolean(currentValue)"
          v-bind="field.primeProps"
          @update:modelValue="(value) => updateValue(path, value, field)"
        />
      </div>

      <Select
        v-else-if="field.type === 'select'"
        :modelValue="currentValue"
        :options="field.options"
        optionLabel="label"
        optionValue="value"
        class="w-full"
        v-bind="field.primeProps"
        @update:modelValue="(value) => updateValue(path, value, field)"
      />

      <MultiSelect
        v-else-if="field.type === 'multiselect'"
        :modelValue="Array.isArray(currentValue) ? currentValue : []"
        :options="field.options"
        optionLabel="label"
        optionValue="value"
        class="w-full"
        display="chip"
        v-bind="field.primeProps"
        @update:modelValue="(value) => updateValue(path, value, field)"
      />

      <div v-else-if="field.type === 'radio'" class="radio-group">
        <label
          v-for="option in field.options"
          :key="`${path}-${String(option.value)}`"
          class="radio-option"
        >
          <RadioButton
            :name="path"
            :value="option.value"
            :modelValue="currentValue"
            v-bind="field.primeProps"
            @update:modelValue="(value) => updateValue(path, value, field)"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>

      <div v-else-if="field.type === 'color'" class="color-field">
        <ColorPicker
          :modelValue="normalizedColorValue"
          format="hex"
          v-bind="field.primeProps"
          @update:modelValue="
            (value) => updateValue(path, normalizeColorOutput(value), field)
          "
        />
        <InputText
          :modelValue="currentValue"
          class="flex-1"
          placeholder="#3b82f6"
          @update:modelValue="(value) => updateValue(path, value, field)"
        />
      </div>

      <DatePicker
        v-else-if="field.type === 'date' || field.type === 'datetime'"
        :modelValue="currentValue"
        :showTime="field.type === 'datetime'"
        class="w-full"
        v-bind="field.primeProps"
        @update:modelValue="(value) => updateValue(path, value, field)"
      />

      <div v-else-if="field.type === 'file'" class="space-y-2">
        <FileUpload
          mode="basic"
          customUpload
          auto
          chooseLabel="Choose"
          :accept="field.accept"
          :multiple="field.multiple"
          @select="(event) => handleFileSelect(event.files, field)"
        />

        <div v-if="fileLabel" class="text-xs text-surface-500 break-all">
          {{ fileLabel }}
        </div>

        <Button
          v-if="currentValue"
          label="Clear"
          severity="secondary"
          outlined
          size="small"
          @click="updateValue(path, field.multiple ? [] : null, field)"
        />
      </div>

      <p v-if="errors[path]" class="field-error">{{ errors[path] }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import ColorPicker from 'primevue/colorpicker';
import DatePicker from 'primevue/datepicker';
import Editor from 'primevue/editor';
import FileUpload from 'primevue/fileupload';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import RadioButton from 'primevue/radiobutton';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import ToggleSwitch from 'primevue/toggleswitch';
import type {
  PageDesignArrayField,
  PageDesignFormField,
} from './pageDesignSchema';
import { isFieldVisible } from './pageDesignSchema';

defineOptions({
  name: 'BlockPropertiesFieldRenderer',
});

const props = defineProps<{
  field: PageDesignFormField;
  path: string;
  scopeValues: Record<string, any>;
  errors: Record<string, string | undefined>;
  readValue: (path: string) => any;
  updateValue: (path: string, value: any, field: PageDesignFormField) => void;
  addArrayItem: (path: string, field: PageDesignArrayField) => void;
  removeArrayItem: (path: string, index: number) => void;
}>();

const currentValue = computed(() => props.readValue(props.path));

const arrayItems = computed<any[]>(() => {
  const value = currentValue.value;
  return Array.isArray(value) ? value : [];
});

const objectValue = computed<Record<string, any>>(() => {
  const value = currentValue.value;
  return value && typeof value === 'object' ? value : {};
});

const isVisible = computed(() =>
  isFieldVisible(props.field, props.scopeValues),
);

const normalizedColorValue = computed(() => {
  const value = String(currentValue.value || '').replace('#', '');
  return value || '3b82f6';
});

const fileLabel = computed(() => {
  if (Array.isArray(currentValue.value)) {
    return currentValue.value
      .map((file) => file?.name || String(file))
      .join(', ');
  }

  return currentValue.value?.name || currentValue.value || '';
});

const normalizeColorOutput = (value: string | null | undefined) => {
  if (!value) return '';
  return value.startsWith('#') ? value : `#${value}`;
};

const handleFileSelect = (files: File[], field: PageDesignFormField) => {
  if (field.type !== 'file') return;

  if (field.multiple) {
    props.updateValue(props.path, files, field);
    return;
  }

  props.updateValue(props.path, files[0] ?? null, field);
};
</script>

<style scoped>
.field-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--p-surface-500);
}

.field-help {
  font-size: 0.75rem;
  color: var(--p-surface-400);
  margin: 0;
}

.field-error {
  font-size: 0.75rem;
  color: var(--p-red-500);
  margin: 0;
}

.nested-group {
  border: 1px solid var(--p-surface-200);
  border-radius: 0.75rem;
  background: var(--p-surface-50);
}

.nested-group__header {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--p-surface-200);
}

.nested-group__header--actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.nested-group__body {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
}

.array-item {
  border: 1px solid var(--p-surface-200);
  border-radius: 0.75rem;
  background: var(--p-surface-0);
  padding: 0.875rem;
}

.array-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.array-item__title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--p-surface-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.array-empty {
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: var(--p-surface-400);
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.color-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>

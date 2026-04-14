<template>
  <div class="space-y-5">
    <div v-for="field in schema.fields" :key="field.key" class="field">
      <label
        class="block font-medium mb-1 text-sm text-surface-700 dark:text-surface-200"
      >
        {{ field.label }}
        <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
      </label>
      <p v-if="field.helpText" class="text-xs text-surface-400 mb-2">
        {{ field.helpText }}
      </p>

      <!-- text / url / image -->
      <InputText
        v-if="['text', 'url', 'image'].includes(field.type)"
        :modelValue="modelValue[field.key]"
        :placeholder="field.placeholder"
        class="w-full"
        @update:modelValue="update(field.key, $event)"
      />

      <!-- textarea -->
      <Textarea
        v-else-if="field.type === 'textarea'"
        :modelValue="modelValue[field.key]"
        :placeholder="field.placeholder"
        class="w-full"
        rows="4"
        autoResize
        @update:modelValue="update(field.key, $event)"
      />

      <!-- richtext -->
      <Editor
        v-else-if="field.type === 'richtext'"
        :modelValue="modelValue[field.key]"
        editorStyle="height: 180px"
        @text-change="
          ({ htmlValue }: { htmlValue: string }) => update(field.key, htmlValue)
        "
      />

      <!-- number -->
      <InputNumber
        v-else-if="field.type === 'number'"
        :modelValue="modelValue[field.key]"
        class="w-full"
        inputClass="w-full"
        showButtons
        @update:modelValue="update(field.key, $event)"
      />

      <!-- toggle -->
      <div v-else-if="field.type === 'toggle'" class="mt-1">
        <ToggleSwitch
          :modelValue="Boolean(modelValue[field.key])"
          @update:modelValue="update(field.key, $event)"
        />
      </div>

      <!-- checkbox -->
      <div
        v-else-if="field.type === 'checkbox'"
        class="flex items-center gap-2 mt-1"
      >
        <Checkbox
          :binary="true"
          :modelValue="Boolean(modelValue[field.key])"
          @update:modelValue="update(field.key, $event)"
        />
        <span class="text-sm">{{ field.label }}</span>
      </div>

      <!-- select -->
      <Select
        v-else-if="field.type === 'select'"
        :modelValue="modelValue[field.key]"
        :options="field.options ?? []"
        optionLabel="label"
        optionValue="value"
        class="w-full"
        @update:modelValue="update(field.key, $event)"
      />

      <!-- multiselect -->
      <MultiSelect
        v-else-if="field.type === 'multiselect'"
        :modelValue="
          Array.isArray(modelValue[field.key]) ? modelValue[field.key] : []
        "
        :options="field.options ?? []"
        optionLabel="label"
        optionValue="value"
        class="w-full"
        display="chip"
        @update:modelValue="update(field.key, $event)"
      />

      <!-- radio -->
      <div v-else-if="field.type === 'radio'" class="flex flex-col gap-2 mt-1">
        <label
          v-for="option in field.options ?? []"
          :key="String(option.value)"
          class="flex items-center gap-2 cursor-pointer"
        >
          <RadioButton
            :name="field.key"
            :value="option.value"
            :modelValue="modelValue[field.key]"
            @update:modelValue="update(field.key, $event)"
          />
          <span class="text-sm">{{ option.label }}</span>
        </label>
      </div>

      <!-- color -->
      <div v-else-if="field.type === 'color'" class="flex items-center gap-2">
        <ColorPicker
          :modelValue="(modelValue[field.key] ?? '').replace('#', '')"
          format="hex"
          @update:modelValue="
            (v: string) =>
              update(field.key, v ? (v.startsWith('#') ? v : `#${v}`) : '')
          "
        />
        <InputText
          :modelValue="modelValue[field.key]"
          placeholder="#3b82f6"
          class="flex-1"
          @update:modelValue="update(field.key, $event)"
        />
      </div>

      <!-- date / datetime -->
      <DatePicker
        v-else-if="field.type === 'date' || field.type === 'datetime'"
        :modelValue="
          modelValue[field.key] ? new Date(modelValue[field.key]) : null
        "
        :showTime="field.type === 'datetime'"
        class="w-full"
        @update:modelValue="update(field.key, $event)"
      />

      <!-- json -->
      <Textarea
        v-else-if="field.type === 'json'"
        :modelValue="
          typeof modelValue[field.key] === 'string'
            ? modelValue[field.key]
            : JSON.stringify(modelValue[field.key] ?? null, null, 2)
        "
        :placeholder="field.placeholder ?? 'Enter JSON…'"
        class="w-full font-mono text-xs"
        rows="6"
        autoResize
        @update:modelValue="update(field.key, $event)"
      />

      <!-- file / image -->
      <AdminCollectionsFileUploadPreview
        v-else-if="field.type === 'file' || field.type === 'image'"
        :modelValue="modelValue[field.key]"
        :accept="field.accept"
        @update:modelValue="update(field.key, $event)"
      />

      <!-- fallback -->
      <InputText
        v-else
        :modelValue="modelValue[field.key]"
        :placeholder="field.placeholder"
        class="w-full"
        @update:modelValue="update(field.key, $event)"
      />

      <!-- error -->
      <small v-if="errors?.[field.key]" class="text-red-500">{{
        errors[field.key]
      }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { CollectionSchema } from '~/utils/types/admin/collection.types';

const Editor = defineAsyncComponent(() => import('primevue/editor'));

const props = defineProps<{
  schema: CollectionSchema;
  modelValue: Record<string, any>;
  errors?: Record<string, string | undefined>;
}>();

console.log('CollectionItemForm props', props);

const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void;
}>();

const update = (key: string, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
};
</script>

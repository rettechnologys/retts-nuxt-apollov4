<template>
  <div class="space-y-2">
    <!-- Image preview -->
    <div
      v-if="resolvedIsImage && previewSrc"
      class="relative group w-full max-w-xs"
    >
      <img
        :src="previewSrc"
        alt="Preview"
        class="rounded-xl border border-surface-200 dark:border-surface-700 object-cover w-full max-h-52"
      />
      <button
        type="button"
        class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
        @click="clear"
      >
        <i class="pi pi-times text-xs" />
      </button>
    </div>

    <!-- File info card (non-image or image not yet previewed) -->
    <div
      v-else-if="!resolvedIsImage && fileName"
      class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
    >
      <i class="pi pi-paperclip text-primary-500" />
      <div class="flex-1 min-w-0">
        <p
          class="text-sm font-medium text-surface-700 dark:text-surface-200 truncate"
        >
          {{ fileName }}
        </p>
        <p v-if="fileSize" class="text-xs text-surface-400 mt-0.5">
          {{ fileSize }}
        </p>
      </div>
      <button
        type="button"
        class="w-7 h-7 flex items-center justify-center rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        @click="clear"
      >
        <i class="pi pi-times text-xs" />
      </button>
    </div>

    <!-- Upload button -->
    <div class="flex items-center gap-2">
      <FileUpload
        ref="uploaderRef"
        mode="basic"
        customUpload
        auto
        :chooseLabel="hasValue ? 'Replace' : 'Choose File'"
        :chooseIcon="hasValue ? 'pi pi-refresh' : 'pi pi-upload'"
        :accept="accept"
        class="!inline-flex"
        @select="onFileSelect"
      />
      <Button
        v-if="hasValue"
        label="Remove"
        icon="pi pi-trash"
        severity="danger"
        text
        size="small"
        type="button"
        @click="clear"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: File | string | null | undefined;
  accept?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: File | string | null): void;
}>();

// Revokable object URL for File previews
const objectUrl = ref<string | null>(null);

const IMAGE_MIME_RE = /^image\//;
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)([?#].*)?$/i;

/** True when the current value is (or looks like) an image */
const resolvedIsImage = computed<boolean>(() => {
  const v = props.modelValue;
  if (!v) return false;
  if (v instanceof File) return IMAGE_MIME_RE.test(v.type);
  return IMAGE_EXT_RE.test(v) || v.startsWith('data:image/');
});

const previewSrc = computed<string | null>(() => {
  if (!props.modelValue) return null;
  if (typeof props.modelValue === 'string') return props.modelValue || null;
  return objectUrl.value;
});

const fileName = computed<string | null>(() => {
  if (!props.modelValue) return null;
  if (props.modelValue instanceof File) return props.modelValue.name;
  return props.modelValue.split('/').pop() ?? props.modelValue;
});

const fileSize = computed<string | null>(() => {
  if (!(props.modelValue instanceof File)) return null;
  const bytes = props.modelValue.size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
});

const hasValue = computed(() => !!props.modelValue);

// Maintain object URL lifecycle
watch(
  () => props.modelValue,
  (val) => {
    if (objectUrl.value) {
      URL.revokeObjectURL(objectUrl.value);
      objectUrl.value = null;
    }
    if (val instanceof File) objectUrl.value = URL.createObjectURL(val);
  },
  { immediate: true },
);

onUnmounted(() => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value);
});

const onFileSelect = (e: any) => {
  const file: File | undefined = e.files?.[0];
  emit('update:modelValue', file ?? null);
};

const clear = () => emit('update:modelValue', null);
</script>

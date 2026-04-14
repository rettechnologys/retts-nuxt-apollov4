<template>
  <!-- Boolean-like -->
  <template v-if="type === 'toggle' || type === 'checkbox'">
    <i
      :class="
        value
          ? 'pi pi-check-circle text-green-500'
          : 'pi pi-times-circle text-surface-300'
      "
    />
  </template>
  <!-- Image -->
  <template v-else-if="type === 'image'">
    <img
      v-if="value"
      :src="value"
      alt=""
      class="h-8 w-12 object-cover rounded"
    />
    <span v-else class="text-surface-300 text-xs">—</span>
  </template>
  <!-- File -->
  <template v-else-if="type === 'file'">
    <template v-if="value">
      <!-- Looks like an image URL → show thumbnail -->
      <img
        v-if="isImageValue(value)"
        :src="value"
        alt=""
        class="h-8 w-12 object-cover rounded"
      />
      <!-- Generic file → filename pill -->
      <span
        v-else
        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 max-w-[160px] truncate"
      >
        <i class="pi pi-paperclip text-[10px] flex-shrink-0" />
        {{ getFileName(value) }}
      </span>
    </template>
    <span v-else class="text-surface-300 text-xs">—</span>
  </template>
  <!-- Long text -->
  <template
    v-else-if="type === 'textarea' || type === 'richtext' || type === 'json'"
  >
    <span class="text-sm text-surface-500 line-clamp-1">{{
      value ?? '—'
    }}</span>
  </template>
  <!-- Date -->
  <template v-else-if="type === 'date' || type === 'datetime'">
    <span class="text-sm">{{
      value ? formatDate(value, type === 'datetime') : '—'
    }}</span>
  </template>
  <!-- Color -->
  <template v-else-if="type === 'color'">
    <div class="flex items-center gap-2">
      <span
        v-if="value"
        :style="{ background: value }"
        class="w-5 h-5 rounded border border-surface-200"
      />
      <span class="text-sm">{{ value ?? '—' }}</span>
    </div>
  </template>
  <!-- Array / object: just show count or type label -->
  <template v-else-if="type === 'array'">
    <span class="text-sm text-surface-400">{{
      Array.isArray(value) ? `${value.length} items` : '—'
    }}</span>
  </template>
  <!-- Default: text-like -->
  <template v-else>
    <span class="text-sm line-clamp-1">{{ value ?? '—' }}</span>
  </template>
</template>

<script setup lang="ts">
import type { CollectionFieldType } from '~/utils/types/admin/collection.types';

defineProps<{ value: any; type: CollectionFieldType }>();

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)([?#].*)?$/i;

const isImageValue = (v: any): boolean => {
  if (!v || typeof v !== 'string') return false;
  return IMAGE_EXT_RE.test(v) || v.startsWith('data:image/');
};

const getFileName = (v: any): string => {
  if (!v || typeof v !== 'string') return String(v ?? '—');
  return v.split('/').pop()?.split('?')[0] ?? v;
};

const formatDate = (v: string, withTime: boolean) => {
  try {
    return new Date(v).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    });
  } catch {
    return v;
  }
};
</script>

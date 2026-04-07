<template>
  <div
    class="relative border-2 border-dashed border-surface-border rounded-md px-2 py-2 cursor-pointer transition-colors mb-1.5 min-h-9 bg-surface-card"
    :class="{
      '!border-primary-500 !border-solid bg-primary-50 dark:bg-primary-900/20':
        isSelected,
      'hover:border-primary-200': !isSelected,
    }"
    @click.stop="emit('select', block.id)"
  >
    <!-- block label chip -->
    <div
      class="absolute -top-2 left-2 text-xs px-1.5 py-0.5 rounded-full leading-snug font-medium"
      :class="[
        block.type === 'wrapper' &&
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
        block.type === 'text' &&
          'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
        block.type === 'button' &&
          'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
        block.type === 'input' &&
          'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        block.type === 'image' &&
          'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
        block.type === 'divider' &&
          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      ]"
    >
      {{ block.label || block.type }}
    </div>

    <!-- wrapper: render children -->
    <template v-if="isWrapper">
      <div
        v-if="block.children && block.children.length > 0"
        class="mt-1.5 min-h-8"
        :class="childrenStyle.cls"
        :style="childrenStyle.style"
      >
        <CanvasBlock
          v-for="child in block.children"
          :key="child.id"
          :block="child"
          :selected-id="selectedId"
          @select="emit('select', $event)"
        />
      </div>
      <div
        v-else
        class="mt-1.5 py-2.5 px-2.5 text-center text-xs text-surface-500 border border-dashed border-surface-border rounded"
      >
        Empty wrapper
      </div>
    </template>

    <!-- leaf: show content preview -->
    <template v-else>
      <div class="mt-1.5">
        <template v-if="block.type === 'text'">
          <component
            :is="block.pv?.tag ?? 'p'"
            class="text-sm text-surface-900 dark:text-surface-0 m-0"
          >
            {{ block.pv?.content || 'Text content...' }}
          </component>
        </template>

        <template v-else-if="block.type === 'button'">
          <Button
            :icon="block.pv?.icon as string"
            :label="(block.pv?.label as string) || 'Button'"
            size="small"
          />
        </template>

        <template v-else-if="block.type === 'input'">
          <InputText
            :placeholder="(block.pv?.placeholder as string) || 'Input field...'"
            size="small"
            class="w-full"
            disabled
          />
        </template>

        <template v-else-if="block.type === 'image'">
          <div
            class="flex items-center gap-2 px-2 py-2 text-surface-500 bg-surface-ground rounded text-xs"
          >
            <i class="pi pi-image text-xl" />
            <span>Image</span>
          </div>
        </template>

        <template v-else-if="block.type === 'divider'">
          <Divider />
        </template>

        <template v-else>
          <span class="text-xs text-surface-500 font-mono">{{
            block.type
          }}</span>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import type { BlockNode } from '@/utils/types/admin/block-v2.types';

const props = defineProps<{
  block: BlockNode;
  selectedId: string | null;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();

const isWrapper = computed(() => props.block.type === 'wrapper');
const isSelected = computed(() => props.block.id === props.selectedId);

// Minimal style from resolved class — parse flex/grid for canvas preview
const childrenStyle = computed(() => {
  console.log(
    '🔄 CanvasBlock childrenStyle recomputing for:',
    props.block.id,
    props.block,
  );
  const cls = props.block.style?.class ?? '';
  const style: Record<string, string> = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  };

  if (cls.includes('grid')) style.display = 'grid';
  else if (cls.includes('block')) style.display = 'block';
  else style.display = 'flex';

  if (cls.includes('flex-col')) style.flexDirection = 'column';
  if (cls.includes('flex-wrap')) style.flexWrap = 'wrap';
  if (cls.includes('items-center')) style.alignItems = 'center';
  if (cls.includes('items-end')) style.alignItems = 'flex-end';
  if (cls.includes('justify-center')) style.justifyContent = 'center';
  if (cls.includes('justify-end')) style.justifyContent = 'flex-end';
  if (cls.includes('justify-between')) style.justifyContent = 'space-between';

  const gapMatch = cls.match(/gap-(\d+)/);
  if (gapMatch) style.gap = `${parseInt(gapMatch[1]) * 4}px`;

  const colsMatch = cls.match(/grid-cols-(\d+)/);
  if (colsMatch)
    style.gridTemplateColumns = `repeat(${colsMatch[1]}, minmax(0, 1fr))`;

  console.log('final childrenStyle for block', props.block.id, style);

  return { style, cls };
});
</script>

<style scoped>
/* All styling now uses Tailwind CSS v4 utility classes */
</style>

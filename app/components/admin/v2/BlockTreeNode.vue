<template>
  <div class="select-none">
    <div
      class="group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors min-h-[30px]"
      :class="{
        'bg-primary-50 dark:bg-primary-900/30': isSelected,
        'hover:bg-surface-hover': !isSelected,
        'font-medium': isWrapper,
      }"
      @click="emit('select', block.id)"
    >
      <Button
        v-if="isWrapper"
        :icon="open ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
        text
        rounded
        size="small"
        severity="secondary"
        class="w-4 h-4 !p-0"
        @click.stop="open = !open"
      />
      <span
        v-else
        class="w-1.5 h-1.5 rounded-full bg-surface-border ml-1.5 flex-shrink-0"
      />

      <span
        class="text-xs text-surface-900 dark:text-surface-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {{ block.label || block.type }}
      </span>

      <span
        class="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
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
        {{ block.type }}
      </span>

      <div class="hidden group-hover:flex items-center gap-0.5" @click.stop>
        <Button
          icon="pi pi-arrow-up"
          text
          rounded
          size="small"
          severity="secondary"
          class="!w-5 !h-5"
          title="Move up"
          :disabled="isFirst"
          @click="emit('move', block.id, 'up')"
        />
        <Button
          icon="pi pi-arrow-down"
          text
          rounded
          size="small"
          severity="secondary"
          class="!w-5 !h-5"
          title="Move down"
          :disabled="isLast"
          @click="emit('move', block.id, 'down')"
        />
        <Button
          icon="pi pi-copy"
          text
          rounded
          size="small"
          severity="secondary"
          class="!w-5 !h-5"
          title="Duplicate"
          @click="emit('duplicate', block.id)"
        />
        <Button
          icon="pi pi-times"
          text
          rounded
          size="small"
          severity="danger"
          class="!w-5 !h-5"
          title="Delete"
          @click="emit('remove', block.id)"
        />
      </div>
    </div>

    <template v-if="isWrapper && open">
      <div class="pl-4 ml-2 border-l-2 border-surface-border mt-0.5">
        <BlockTreeNode
          v-for="(child, idx) in block.children"
          :key="child.id"
          :block="child"
          :selected-id="selectedId"
          :is-first="idx === 0"
          :is-last="idx === block.children!.length - 1"
          @select="emit('select', $event)"
          @remove="emit('remove', $event)"
          @duplicate="emit('duplicate', $event)"
          @move="(id, dir) => emit('move', id, dir)"
          @add="emit('add', $event)"
        />
        <Button
          icon="pi pi-plus"
          label="Tambah block"
          text
          size="small"
          severity="secondary"
          class="!w-full !justify-start !px-2 !text-xs mt-0.5 hover:bg-surface-hover hover:text-primary-500"
          @click="emit('add', block.id)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import type { BlockNode } from '@/utils/types/admin/block-v2.types';

const props = withDefaults(
  defineProps<{
    block: BlockNode;
    selectedId: string | null;
    isFirst?: boolean;
    isLast?: boolean;
  }>(),
  {
    isFirst: false,
    isLast: false,
  },
);

const emit = defineEmits<{
  select: [id: string];
  remove: [id: string];
  duplicate: [id: string];
  move: [id: string, dir: 'up' | 'down'];
  add: [parentId: string];
}>();

const open = ref(true);
const isWrapper = computed(() => props.block.type === 'wrapper');
const isSelected = computed(() => props.block.id === props.selectedId);
</script>

<style scoped>
/* Using group-hover utility - need to add 'group' class to parent */
.flex:hover .hidden {
  display: flex;
}
</style>

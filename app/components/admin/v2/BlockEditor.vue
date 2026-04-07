<template>
  <div
    class="flex flex-col h-screen bg-surface-ground font-sans text-surface-900 dark:text-surface-0"
  >
    <!-- ── TOP BAR ─────────────────────────────────────── -->
    <header
      class="flex items-center justify-between px-4 h-12 bg-surface-card border-b border-surface-border flex-shrink-0 z-10"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold">Block Editor</span>
        <span v-if="selectedBlock" class="text-sm text-surface-500">
          › {{ selectedBlock.label || selectedBlock.type }}
        </span>
      </div>
      <div class="flex gap-2">
        <Button
          :label="showSchema ? 'Hide schema' : 'View schema'"
          severity="secondary"
          outlined
          size="small"
          @click="showSchema = !showSchema"
        />
        <Button label="Simpan halaman" size="small" @click="handleSave" />
      </div>
    </header>

    <div class="grid grid-cols-[240px_1fr_268px] flex-1 overflow-hidden">
      <!-- ── PANEL KIRI: TREE ────────────────────────────── -->
      <aside
        class="flex flex-col overflow-hidden bg-surface-card border-r border-surface-border"
      >
        <div
          class="flex items-center justify-between px-3 py-2 text-xs font-semibold text-surface-500 uppercase tracking-wider border-b border-surface-border bg-surface-section flex-shrink-0 min-h-9"
        >
          <span>Block tree</span>
          <!-- <Button
            icon="pi pi-plus"
            text
            rounded
            size="small"
            severity="secondary"
            title="Tambah block ke root"
            @click="showAddModal = true"
          /> -->
        </div>

        <div class="flex-1 overflow-y-auto p-2">
          <div
            v-if="blocks.length === 0"
            class="flex flex-col items-center gap-2 py-6 px-4 text-center text-surface-500 text-sm"
          >
            <p>Belum ada block.</p>
            <Button
              label="Tambah block"
              icon="pi pi-plus"
              outlined
              size="small"
              @click="showAddModal = true"
            />
          </div>

          <BlockTreeNode
            v-for="(block, idx) in blocks"
            :key="block.id"
            :block="block"
            :selected-id="selectedId"
            :is-first="idx === 0"
            :is-last="idx === blocks.length - 1"
            @select="select"
            @remove="removeBlock"
            @duplicate="duplicateBlock"
            @move="moveBlock"
            @add="(pid) => openAddModal(pid)"
          />
        </div>
      </aside>

      <!-- ── PANEL TENGAH: CANVAS ───────────────────────── -->
      <main class="flex flex-col overflow-hidden bg-surface-ground">
        <div
          class="flex items-center justify-between px-3 py-2 text-xs font-semibold text-surface-500 uppercase tracking-wider border-b border-surface-border bg-surface-section flex-shrink-0 min-h-9"
        >
          <span>Preview</span>
          <div class="flex gap-1">
            <Button
              v-for="vp in viewports"
              :key="vp.label"
              :label="vp.label"
              :outlined="viewport !== vp.w"
              :severity="viewport === vp.w ? 'primary' : 'secondary'"
              size="small"
              text
              @click="viewport = vp.w"
            />
          </div>
        </div>

        <div class="flex-1 overflow-auto p-5 flex justify-center">
          <div
            class="w-full transition-all duration-200"
            :style="{ maxWidth: viewport }"
          >
            <div
              v-if="blocks.length === 0"
              class="flex flex-col items-center gap-3 py-16 px-6 text-surface-500 text-sm border-2 border-dashed border-surface-border rounded-lg"
            >
              <p>Canvas kosong</p>
              <Button
                label="Tambah block"
                icon="pi pi-plus"
                outlined
                size="small"
                @click="showAddModal = true"
              />
            </div>

            <CanvasBlock
              v-for="block in blocks"
              :key="block.id"
              :block="block"
              :selected-id="selectedId"
              @select="select"
            />
          </div>
        </div>
      </main>

      <!-- ── PANEL KANAN: PROPERTIES ────────────────────── -->
      <aside
        class="flex flex-col overflow-hidden bg-surface-card border-l border-surface-border"
      >
        <div
          class="flex items-center justify-between px-3 py-2 text-xs font-semibold text-surface-500 uppercase tracking-wider border-b border-surface-border bg-surface-section flex-shrink-0 min-h-9"
        >
          <span v-if="selectedBlock" class="flex items-center gap-2">
            <span
              class="text-xs px-2 py-0.5 rounded-full"
              :class="[
                selectedBlock.type === 'wrapper' &&
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
                selectedBlock.type === 'text' &&
                  'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
                selectedBlock.type === 'button' &&
                  'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
                selectedBlock.type === 'input' &&
                  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                selectedBlock.type === 'image' &&
                  'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
                selectedBlock.type === 'divider' &&
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
              ]"
            >
              {{ selectedBlock.type }}
            </span>
            {{ selectedBlock.id }}
          </span>
          <span v-else>Properties</span>
        </div>

        <div v-if="!selectedBlock" class="flex-1 overflow-y-auto p-2">
          <div
            class="flex flex-col items-center gap-2 py-6 px-4 text-center text-surface-500 text-sm"
          >
            <p>Pilih block untuk edit properties.</p>
          </div>
        </div>

        <div v-else class="flex-1 overflow-y-auto">
          <!-- label editor -->
          <div
            class="flex items-center gap-2 p-3 border-b border-surface-border"
          >
            <label class="text-xs text-surface-500 min-w-9">Label</label>
            <InputText
              :model-value="selectedBlock.label"
              placeholder="Nama block..."
              size="small"
              class="flex-1"
              @update:model-value="
                updateLabel(selectedBlock!.id, $event as string)
              "
            />
          </div>

          <!-- resolved class preview -->
          <div
            v-if="resolvedClass"
            class="flex items-baseline gap-1.5 px-3 py-1.5 bg-surface-ground border-b border-surface-border flex-wrap"
          >
            <span
              class="text-xs font-semibold text-primary-500 font-mono flex-shrink-0"
              >class</span
            >
            <span class="text-xs font-mono text-surface-500 break-all">{{
              resolvedClass
            }}</span>
          </div>

          <!-- form generator -->
          <PropsFormGenerator
            v-if="propsConfig.length"
            :config="propsConfig"
            :model-value="selectedBlock.styleProps ?? {}"
            @update:model-value="onPropsUpdate"
          />

          <div
            v-else
            class="flex flex-col items-center gap-2 p-4 text-center text-surface-500 text-sm"
          >
            <p>
              Belum ada config untuk tipe
              <code class="px-1.5 py-0.5 bg-surface-border rounded text-xs">{{
                selectedBlock.type
              }}</code
              >.
            </p>
          </div>
        </div>
      </aside>
    </div>

    <!-- ── MODAL: ADD BLOCK ────────────────────────────── -->
    <Dialog
      v-model:visible="showAddModal"
      header="Tambah block"
      :style="{ width: '480px' }"
      modal
    >
      <p class="text-xs text-surface-500 mb-3 font-mono">
        {{ addTargetId ? `Di dalam: ${addTargetId}` : 'Di root halaman' }}
      </p>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="bt in blockTypes"
          :key="bt.type"
          class="flex flex-col items-center gap-1 p-3.5 border border-surface-border rounded-lg bg-surface-ground cursor-pointer transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-center"
          @click="handleAdd(bt.type as BlockType)"
        >
          <span class="text-xl">{{ bt.icon }}</span>
          <span
            class="text-sm font-medium text-surface-900 dark:text-surface-0"
            >{{ bt.label }}</span
          >
          <span class="text-xs text-surface-500">{{ bt.desc }}</span>
        </button>
      </div>
    </Dialog>

    <!-- ── SCHEMA MODAL ────────────────────────────────── -->
    <Dialog
      v-model:visible="showSchema"
      header="Schema JSON"
      :style="{ width: '640px' }"
      modal
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <span class="text-sm font-semibold">Schema JSON</span>
          <Button
            :label="copied ? 'Copied!' : 'Copy'"
            icon="pi pi-copy"
            severity="secondary"
            text
            size="small"
            @click="copySchema"
          />
        </div>
      </template>
      <pre
        class="font-mono text-xs leading-relaxed text-surface-900 dark:text-surface-0 whitespace-pre-wrap break-words m-0"
        >{{ exportSchema }}</pre
      >
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import type { BlockType } from '@/utils/types/admin/block-v2.types';
import { useBlockTree } from '@/composables/admin/useBlockTree';
import { configFor } from '@/utils/helpers/BlockConfig';
import { resolveClass } from '@/utils/helpers/StyleResolver';
import BlockTreeNode from './BlockTreeNode.vue';
import PropsFormGenerator from './PropsFormGenerator.vue';
import CanvasBlock from './CanvasBlock.vue';

const {
  blocks,
  selectedId,
  selectedBlock,
  select,
  addBlock,
  removeBlock,
  duplicateBlock,
  moveBlock,
  updateStyleProps,
  updateStyleClass,
  updateLabel,
  exportSchema,
} = useBlockTree();

const showAddModal = ref(false);
const showSchema = ref(false);
const addTargetId = ref<string | null>(null);
const copied = ref(false);
const viewport = ref('100%');

const viewports = [
  { label: 'Mobile', w: '390px' },
  { label: 'Tablet', w: '768px' },
  { label: 'Full', w: '100%' },
];

const blockTypes = [
  {
    type: 'wrapper',
    icon: '⬜',
    label: 'Wrapper',
    desc: 'Container / layout div',
  },
  { type: 'text', icon: 'T', label: 'Text', desc: 'Heading, paragraph, span' },
  { type: 'button', icon: '⬡', label: 'Button', desc: 'PrimeVue Button' },
  { type: 'input', icon: '▭', label: 'Input', desc: 'PrimeVue InputText' },
  { type: 'image', icon: '🖼', label: 'Image', desc: 'Gambar / media' },
  { type: 'divider', icon: '—', label: 'Divider', desc: 'Garis pemisah' },
];

const propsConfig = computed(() =>
  selectedBlock.value ? configFor(selectedBlock.value.type) : [],
);

const resolvedClass = computed(() => {
  if (!selectedBlock.value?.styleProps || !propsConfig.value.length) return '';
  return resolveClass(selectedBlock.value.styleProps, propsConfig.value);
});

watch(resolvedClass, (cls) => {
  if (selectedBlock.value) {
    updateStyleClass(selectedBlock.value.id, cls);
  }
});

function openAddModal(parentId?: string | null) {
  addTargetId.value = parentId ?? null;
  showAddModal.value = true;
}

function handleAdd(type: BlockType) {
  addBlock(type, addTargetId.value);
  showAddModal.value = false;
  addTargetId.value = null;
}

function onPropsUpdate(val: Record<string, unknown>) {
  if (selectedBlock.value) {
    updateStyleProps(selectedBlock.value.id, val);
  }
}

async function copySchema() {
  await navigator.clipboard.writeText(exportSchema.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

function handleSave() {
  // emit ke parent atau call API
  console.log('save', JSON.parse(exportSchema.value));
}
</script>

<style scoped>
/* All styling now uses Tailwind CSS v4 utility classes */
</style>

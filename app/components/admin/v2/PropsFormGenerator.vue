<template>
  <div class="form-generator">
    <div v-for="group in visibleGroups" :key="group.group" class="field-group">
      <button class="group-header" @click="toggleGroup(group.group)">
        <span class="group-title">
          <span class="group-dot" :class="{ active: groupHasValue(group) }" />
          {{ group.group }}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          :style="{
            transform: isOpen(group.group) ? 'rotate(90deg)' : 'rotate(0)',
            transition: 'transform 0.15s',
          }"
        >
          <path
            d="M3 2L7 5L3 8"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div v-if="isOpen(group.group)" class="group-body">
        <template v-for="field in group.fields" :key="field.key">
          <div
            v-if="!field.showIf || evalShowIf(field.showIf, modelValue)"
            class="field-row"
            :class="{ 'field-row--tall': field.type === 'spacing-box' }"
          >
            <label v-if="field.label" class="field-label">{{
              field.label
            }}</label>

            <!-- segment -->
            <div v-if="field.type === 'segment'" class="segment-group">
              <button
                v-for="opt in field.options"
                :key="opt.label"
                class="seg-btn"
                :class="{ active: modelValue[field.key] === opt.label }"
                @click="
                  set(
                    field.key,
                    modelValue[field.key] === opt.label ? undefined : opt.label,
                  )
                "
              >
                {{ opt.label }}
              </button>
            </div>

            <!-- select -->
            <select
              v-else-if="field.type === 'select'"
              class="field-select"
              :value="(modelValue[field.key] as string) ?? ''"
              @change="
                set(
                  field.key,
                  ($event.target as HTMLSelectElement).value || undefined,
                )
              "
            >
              <option value="">–</option>
              <option
                v-for="opt in field.options"
                :key="opt.label"
                :value="opt.label"
              >
                {{ opt.label }}
              </option>
            </select>

            <!-- toggle -->
            <div v-else-if="field.type === 'toggle'" class="toggle-wrap">
              <div
                class="toggle"
                :class="{ on: !!modelValue[field.key] }"
                @click="set(field.key, !modelValue[field.key] || undefined)"
              />
            </div>

            <!-- spacing-box -->
            <div v-else-if="field.type === 'spacing-box'" class="spacing-box">
              <div class="sp-grid">
                <div
                  v-for="side in ['top', 'right', 'bottom', 'left']"
                  :key="side"
                  class="sp-wrap"
                >
                  <span class="sp-label">{{ side[0].toUpperCase() }}</span>
                  <select
                    class="sp-select"
                    :value="
                      (spacingVal(field.key) as Record<string, string>)[side] ??
                      '0'
                    "
                    @change="
                      setSpacing(
                        field.key,
                        side,
                        ($event.target as HTMLSelectElement).value,
                      )
                    "
                  >
                    <option v-for="s in SPACING_SCALE" :key="s" :value="s">
                      {{ s }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="sp-preview">
                {{ resolveSpacingPreview(field.key, field.twPrefix!) }}
              </div>
            </div>

            <!-- spacing-single -->
            <select
              v-else-if="field.type === 'spacing-single'"
              class="field-select"
              :value="(modelValue[field.key] as string) ?? ''"
              @change="
                set(
                  field.key,
                  ($event.target as HTMLSelectElement).value || undefined,
                )
              "
            >
              <option value="">–</option>
              <option v-for="s in SPACING_SCALE" :key="s" :value="s">
                {{ s }}
              </option>
            </select>

            <!-- sizing -->
            <select
              v-else-if="field.type === 'sizing'"
              class="field-select"
              :value="(modelValue[field.key] as string) ?? ''"
              @change="
                set(
                  field.key,
                  ($event.target as HTMLSelectElement).value || undefined,
                )
              "
            >
              <option value="">–</option>
              <option v-for="s in SIZING_OPTIONS" :key="s" :value="s">
                {{ s }}
              </option>
            </select>

            <!-- color-picker -->
            <div v-else-if="field.type === 'color-picker'" class="color-grid">
              <div
                v-for="c in TAILWIND_COLORS"
                :key="c.tw"
                class="color-swatch"
                :class="{ selected: modelValue[field.key] === c.tw }"
                :style="{ background: c.hex }"
                :title="c.label"
                @click="
                  set(
                    field.key,
                    modelValue[field.key] === c.tw ? undefined : c.tw,
                  )
                "
              />
            </div>

            <!-- text / custom class -->
            <input
              v-else-if="field.type === 'text'"
              class="field-input"
              type="text"
              :placeholder="field.placeholder"
              :value="(modelValue[field.key] as string) ?? ''"
              @input="
                set(
                  field.key,
                  ($event.target as HTMLInputElement).value || undefined,
                )
              "
            />

            <!-- icon-picker -->
            <div v-else-if="field.type === 'icon-picker'" class="icon-picker">
              <input
                v-model="iconSearch"
                class="field-input"
                placeholder="Cari icon pi-..."
              />
              <div class="icon-results">
                <button
                  v-for="icon in filteredIcons"
                  :key="icon"
                  class="icon-btn"
                  :class="{ active: modelValue[field.key] === icon }"
                  @click="
                    set(
                      field.key,
                      modelValue[field.key] === icon ? undefined : icon,
                    )
                  "
                >
                  <i :class="['pi', icon]" style="font-size: 14px" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type {
  FieldGroup,
  SpacingValue,
} from '@/utils/types/admin/block-v2.types';
import { evalShowIf } from '@/utils/helpers/StyleResolver';
import {
  TAILWIND_COLORS,
  SPACING_SCALE,
  SIZING_OPTIONS,
} from '@/utils/helpers/BlockConfig';

const props = defineProps<{
  config: FieldGroup[];
  modelValue: Record<string, unknown>;
}>();

const emit = defineEmits<{
  'update:modelValue': [val: Record<string, unknown>];
}>();

const openGroups = ref<Set<string>>(
  new Set(props.config.filter((g) => !g.collapsed).map((g) => g.group)),
);

const visibleGroups = computed(() => props.config);

function isOpen(group: string) {
  return openGroups.value.has(group);
}

function toggleGroup(group: string) {
  if (openGroups.value.has(group)) openGroups.value.delete(group);
  else openGroups.value.add(group);
}

function groupHasValue(group: FieldGroup) {
  return group.fields.some((f) => {
    const v = props.modelValue[f.key];
    return v !== undefined && v !== null && v !== '' && v !== false;
  });
}

function set(key: string, value: unknown) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}

function spacingVal(key: string): Record<string, string> {
  return (
    (props.modelValue[key] as Record<string, string>) ?? {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    }
  );
}

function setSpacing(key: string, side: string, value: string) {
  const current = spacingVal(key);
  set(key, { ...current, [side]: value });
}

function resolveSpacingPreview(key: string, prefix: string): string {
  const v = spacingVal(key);
  const parts: string[] = [];
  if (v.top === v.bottom && v.left === v.right) {
    if (v.top === v.left) parts.push(`${prefix}-${v.top}`);
    else {
      parts.push(`${prefix}y-${v.top}`);
      parts.push(`${prefix}x-${v.left}`);
    }
  } else {
    if (v.top) parts.push(`${prefix}t-${v.top}`);
    if (v.right) parts.push(`${prefix}r-${v.right}`);
    if (v.bottom) parts.push(`${prefix}b-${v.bottom}`);
    if (v.left) parts.push(`${prefix}l-${v.left}`);
  }
  return parts.join(' ') || `${prefix}-0`;
}

const PI_ICONS = [
  'pi-home',
  'pi-search',
  'pi-user',
  'pi-cog',
  'pi-bell',
  'pi-envelope',
  'pi-phone',
  'pi-star',
  'pi-heart',
  'pi-check',
  'pi-times',
  'pi-plus',
  'pi-minus',
  'pi-arrow-right',
  'pi-arrow-left',
  'pi-arrow-up',
  'pi-arrow-down',
  'pi-send',
  'pi-download',
  'pi-upload',
  'pi-trash',
  'pi-pencil',
  'pi-eye',
  'pi-lock',
  'pi-unlock',
  'pi-refresh',
  'pi-share-alt',
  'pi-link',
  'pi-image',
  'pi-file',
  'pi-folder',
  'pi-calendar',
  'pi-clock',
  'pi-map-marker',
  'pi-shopping-cart',
  'pi-credit-card',
  'pi-globe',
  'pi-info-circle',
  'pi-exclamation-triangle',
  'pi-question-circle',
];

const iconSearch = ref('');
const filteredIcons = computed(() => {
  const q = iconSearch.value.toLowerCase();
  return q ? PI_ICONS.filter((i) => i.includes(q)) : PI_ICONS.slice(0, 20);
});
</script>

<style scoped>
.form-generator {
  padding: 4px 0;
}

.field-group {
  border-bottom: 1px solid var(--surface-border);
}
.field-group:last-child {
  border-bottom: none;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color-secondary);
  transition: background 0.1s;
}
.group-header:hover {
  background: var(--surface-hover);
}

.group-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
}

.group-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--surface-border);
  flex-shrink: 0;
  transition: background 0.2s;
}
.group-dot.active {
  background: var(--primary-color);
}

.group-body {
  padding: 6px 12px 10px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
  min-height: 28px;
}
.field-row:last-child {
  margin-bottom: 0;
}
.field-row--tall {
  align-items: flex-start;
  padding-top: 2px;
}

.field-label {
  font-size: 11.5px;
  color: var(--text-color-secondary);
  min-width: 64px;
  flex-shrink: 0;
}

/* segment */
.segment-group {
  display: flex;
  gap: 3px;
  flex: 1;
}
.seg-btn {
  flex: 1;
  padding: 4px 2px;
  font-size: 11px;
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  background: transparent;
  color: var(--text-color-secondary);
  cursor: pointer;
  text-align: center;
  transition: all 0.1s;
}
.seg-btn:hover {
  background: var(--surface-hover);
}
.seg-btn.active {
  background: var(--primary-50);
  color: var(--primary-700);
  border-color: var(--primary-200);
}

/* select */
.field-select {
  flex: 1;
  padding: 4px 6px;
  font-size: 12px;
  border: 1px solid var(--surface-border);
  border-radius: 5px;
  background: var(--surface-ground);
  color: var(--text-color);
  font-family: inherit;
}

/* toggle */
.toggle-wrap {
  display: flex;
  align-items: center;
}
.toggle {
  width: 30px;
  height: 16px;
  border-radius: 8px;
  background: var(--surface-border);
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}
.toggle.on {
  background: var(--primary-color);
}
.toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  transition: transform 0.2s;
}
.toggle.on::after {
  transform: translateX(14px);
}

/* spacing-box */
.spacing-box {
  flex: 1;
}
.sp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}
.sp-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sp-label {
  font-size: 10px;
  color: var(--text-color-secondary);
  text-align: center;
}
.sp-select {
  padding: 3px 2px;
  font-size: 11px;
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  background: var(--surface-ground);
  color: var(--text-color);
  text-align: center;
  font-family: inherit;
  cursor: pointer;
}
.sp-preview {
  font-size: 10.5px;
  font-family: monospace;
  color: var(--text-color-secondary);
  margin-top: 5px;
  padding: 4px 6px;
  background: var(--surface-ground);
  border-radius: 4px;
}

/* color picker */
.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
}
.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition:
    border-color 0.1s,
    transform 0.1s;
  outline: 1px solid rgba(0, 0, 0, 0.08);
}
.color-swatch:hover {
  transform: scale(1.15);
}
.color-swatch.selected {
  border-color: var(--primary-color);
  transform: scale(1.15);
}

/* text input */
.field-input {
  flex: 1;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid var(--surface-border);
  border-radius: 5px;
  background: var(--surface-ground);
  color: var(--text-color);
  font-family: inherit;
}
.field-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* icon picker */
.icon-picker {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.icon-results {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-height: 100px;
  overflow-y: auto;
}
.icon-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--surface-border);
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  color: var(--text-color-secondary);
  transition: all 0.1s;
}
.icon-btn:hover {
  background: var(--surface-hover);
  color: var(--text-color);
}
.icon-btn.active {
  background: var(--primary-50);
  color: var(--primary-700);
  border-color: var(--primary-200);
}
</style>

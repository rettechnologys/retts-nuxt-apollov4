<template>
  <Card>
    <template #title>
      <div class="flex items-center gap-2">
        <i class="pi pi-cog text-xl"></i>
        <span>Page Settings</span>
      </div>
    </template>
    <template #content>
      <div class="settings-fields space-y-4">
        <!-- Homepage Setting -->
        <div class="field">
          <div class="flex items-center justify-between">
            <div>
              <label for="isHomepage" class="font-medium block mb-1">
                Set as Homepage
              </label>
              <small class="text-surface-500">
                Make this the main landing page of your website
              </small>
            </div>
            <InputSwitch
              inputId="isHomepage"
              v-model="localSettings.isHomepage"
              @update:modelValue="handleInput"
            />
          </div>
        </div>

        <Divider />

        <!-- Require Authentication -->
        <div class="field">
          <div class="flex items-center justify-between">
            <div>
              <label for="requireAuth" class="font-medium block mb-1">
                Require Authentication
              </label>
              <small class="text-surface-500">
                Only logged-in users can access this page
              </small>
            </div>
            <InputSwitch
              inputId="requireAuth"
              v-model="localSettings.requireAuth"
              @update:modelValue="handleInput"
            />
          </div>
        </div>

        <Divider />

        <!-- Allow Comments -->
        <div class="field">
          <div class="flex items-center justify-between">
            <div>
              <label for="allowComments" class="font-medium block mb-1">
                Allow Comments
              </label>
              <small class="text-surface-500">
                Enable comments section on this page
              </small>
            </div>
            <InputSwitch
              inputId="allowComments"
              v-model="localSettings.allowComments"
              @update:modelValue="handleInput"
            />
          </div>
        </div>

        <Divider />

        <!-- Show in Menu -->
        <div class="field">
          <div class="flex items-center justify-between mb-3">
            <div>
              <label for="showInMenu" class="font-medium block mb-1">
                Show in Navigation Menu
              </label>
              <small class="text-surface-500">
                Display this page in the main navigation
              </small>
            </div>
            <InputSwitch
              inputId="showInMenu"
              v-model="localSettings.showInMenu"
              @update:modelValue="handleInput"
            />
          </div>

          <!-- Menu Order (shown when showInMenu is true) -->
          <div v-if="localSettings.showInMenu" class="ml-4 mt-3">
            <label for="menuOrder" class="block font-medium mb-2">
              Menu Order
            </label>
            <InputNumber
              inputId="menuOrder"
              v-model="localSettings.menuOrder"
              :min="0"
              :max="100"
              showButtons
              class="w-full"
              @update:modelValue="handleInput"
            />
            <small class="text-surface-500">
              Lower numbers appear first (0 = first position)
            </small>
          </div>
        </div>

        <Divider />

        <!-- Parent Page -->
        <div class="field">
          <label for="parentPage" class="block font-medium mb-2">
            Parent Page
          </label>
          <Select
            inputId="parentPage"
            v-model="localSettings.parentPageId"
            :options="parentPageOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="None (Top Level)"
            class="w-full"
            :showClear="true"
            @update:modelValue="handleInput"
          />
          <small class="text-surface-500">
            Create a page hierarchy by setting a parent page
          </small>
        </div>

        <Divider />

        <!-- Custom CSS -->
        <div class="field">
          <label for="customCSS" class="block font-medium mb-2">
            Custom CSS
          </label>
          <Textarea
            inputId="customCSS"
            v-model="localSettings.customCSS"
            placeholder=".my-class { color: red; }"
            rows="5"
            class="w-full font-mono text-sm"
            @input="handleInput"
          />
          <small class="text-surface-500">
            Add custom CSS styles for this page only
          </small>
        </div>

        <Divider />

        <!-- Custom JavaScript -->
        <div class="field">
          <label for="customJS" class="block font-medium mb-2">
            Custom JavaScript
          </label>
          <Textarea
            inputId="customJS"
            v-model="localSettings.customJS"
            placeholder="console.log('Hello');"
            rows="5"
            class="w-full font-mono text-sm"
            @input="handleInput"
          />
          <small class="text-surface-500">
            Add custom JavaScript for this page only
          </small>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import InputSwitch from 'primevue/inputswitch';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Divider from 'primevue/divider';
import type { PageSettings } from '~/utils/types/admin/page.types';

interface Props {
  modelValue: PageSettings;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: PageSettings];
}>();

const localSettings = ref<PageSettings>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => {
    localSettings.value = { ...newVal };
  },
  { deep: true },
);

const handleInput = () => {
  emit('update:modelValue', { ...localSettings.value });
};

// Mock parent pages - in real app, fetch from API
const parentPageOptions = ref([
  { label: 'Home', value: 1 },
  { label: 'About', value: 2 },
  { label: 'Services', value: 3 },
  { label: 'Blog', value: 4 },
]);
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>

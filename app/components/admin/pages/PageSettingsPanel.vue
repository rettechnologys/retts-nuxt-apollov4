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
            <ToggleSwitch inputId="isHomepage" v-model="isHomepageValue" />
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
            <ToggleSwitch inputId="requireAuth" v-model="requireAuthValue" />
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
            <ToggleSwitch
              inputId="allowComments"
              v-model="allowCommentsValue"
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
            <ToggleSwitch inputId="showInMenu" v-model="showInMenuValue" />
          </div>

          <!-- Menu Order (shown when showInMenu is true) -->
          <div v-if="showInMenuValue" class="ml-4 mt-3">
            <label for="menuOrder" class="block font-medium mb-2">
              Menu Order
            </label>
            <InputNumber
              inputId="menuOrder"
              v-model="menuOrderValue"
              :min="0"
              :max="100"
              showButtons
              class="w-full"
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
            v-model="parentSlugValue"
            :options="parentPageOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="None (Top Level)"
            class="w-full"
            :showClear="true"
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
            v-model="customCSSValue"
            placeholder=".my-class { color: red; }"
            rows="5"
            class="w-full font-mono text-sm"
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
            v-model="customJSValue"
            placeholder="console.log('Hello');"
            rows="5"
            class="w-full font-mono text-sm"
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
import Divider from 'primevue/divider';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import ToggleSwitch from 'primevue/toggleswitch';
import { useField } from 'vee-validate';
const { value: isHomepageValue } = useField<boolean>('settings.isHomepage');
const { value: requireAuthValue } = useField<boolean>('settings.requireAuth');
const { value: allowCommentsValue } = useField<boolean>(
  'settings.allowComments',
);
const { value: showInMenuValue } = useField<boolean>('settings.showInMenu');
const { value: menuOrderValue } = useField<number>('settings.menuOrder');
const { value: parentSlugValue } = useField<string | null>(
  'settings.parentSlug',
);
const { value: customCSSValue } = useField<string>('settings.customCSS');
const { value: customJSValue } = useField<string>('settings.customJS');

// Parent pages fetched from API
const { data: pagesData } =
  useFetch<{ slug: string; title: string; path: string }[]>('/api/admin/pages');
const parentPageOptions = computed(() =>
  (pagesData.value ?? []).map((p) => ({
    label: `${p.title} (${p.path})`,
    value: p.slug,
  })),
);
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>

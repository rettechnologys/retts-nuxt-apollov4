<template>
  <div v-if="pending" class="flex items-center justify-center py-20">
    <i class="pi pi-spin pi-spinner text-3xl text-primary-500" />
  </div>

  <form v-else-if="schema" @submit.prevent="handleSubmit">
    <!-- Header -->
    <div
      class="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 sticky top-0 z-10"
    >
      <div class="flex items-center gap-3">
        <Button
          icon="pi pi-arrow-left"
          text
          rounded
          type="button"
          @click="navigateTo(`/admin/collections/${collectionSlug}/items`)"
        />
        <div>
          <h1 class="text-lg font-bold text-surface-800 dark:text-surface-100">
            {{ isCreate ? `New ${schema.name} Item` : `Edit Item` }}
          </h1>
          <p class="text-sm text-surface-500">{{ schema.name }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button
          label="Cancel"
          severity="secondary"
          text
          type="button"
          @click="navigateTo(`/admin/collections/${collectionSlug}/items`)"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          type="submit"
          :loading="saving"
        />
      </div>
    </div>

    <!-- Form body -->
    <div class="p-6 max-w-[800px] mx-auto">
      <Message v-if="errorMessage" severity="error" class="mb-4">{{
        errorMessage
      }}</Message>

      <Card>
        <template #content>
          <AdminCollectionsCollectionItemForm
            v-model="formData"
            :schema="schema"
            :errors="fieldErrors"
          />
        </template>
      </Card>
    </div>
  </form>
</template>

<script setup lang="ts">
import type {
  CollectionSchema,
  CollectionItem,
} from '~/utils/types/admin/collection.types';

definePageMeta({ layout: 'admin' });

const toast = useToast();
const route = useRoute();
const collectionSlug = computed(() => route.params.slug as string);
const itemId = computed(() => route.params.id as string);
const isCreate = computed(() => itemId.value === 'create');

// ─── Schema ───────────────────────────────────────────────────────────────────
const { data: schema, pending } = await useFetch<CollectionSchema>(
  () => `/api/collections/${collectionSlug.value}`,
);

// ─── Form state ───────────────────────────────────────────────────────────────
const formData = ref<Record<string, any>>({});
const saving = ref(false);
const errorMessage = ref('');
const fieldErrors = ref<Record<string, string | undefined>>({});

// When editing, load existing item
if (!isCreate.value) {
  const { data: existingItem } = await useFetch<CollectionItem>(
    () => `/api/collections/${collectionSlug.value}/items/${itemId.value}`,
  );
  if (existingItem.value) formData.value = { ...existingItem.value.data };
}

// ─── Validation ───────────────────────────────────────────────────────────────
const validate = (): boolean => {
  fieldErrors.value = {};
  if (!schema.value) return false;
  let valid = true;
  for (const field of schema.value.fields) {
    if (field.required) {
      const val = formData.value[field.key];
      const empty =
        val === undefined ||
        val === null ||
        val === '' ||
        (Array.isArray(val) && val.length === 0);
      if (empty) {
        fieldErrors.value[field.key] = `${field.label} is required`;
        valid = false;
      }
    }
  }
  return valid;
};

// ─── FormData builder ────────────────────────────────────────────────────────
const buildFormData = (data: Record<string, any>): FormData => {
  const fd = new FormData();
  for (const [key, val] of Object.entries(data)) {
    if (val instanceof File) {
      fd.append(key, val, val.name);
    } else {
      fd.append(key, JSON.stringify(val ?? null));
    }
  }
  return fd;
};

// ─── Submit ───────────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  errorMessage.value = '';
  if (!validate()) return;
  saving.value = true;
  try {
    const fd = buildFormData(formData.value);
    if (isCreate.value) {
      await $fetch(`/api/collections/${collectionSlug.value}/items`, {
        method: 'POST',
        body: fd,
      });
      toast.add({
        severity: 'success',
        summary: 'Created',
        detail: 'Item added',
        life: 3000,
      });
    } else {
      await $fetch(
        `/api/collections/${collectionSlug.value}/items/${itemId.value}`,
        {
          method: 'PUT',
          body: fd,
        },
      );
      toast.add({
        severity: 'success',
        summary: 'Saved',
        detail: 'Item updated',
        life: 3000,
      });
    }
    await navigateTo(`/admin/collections/${collectionSlug.value}/items`);
  } catch (err: any) {
    errorMessage.value = err?.data?.message ?? 'Failed to save item';
  } finally {
    saving.value = false;
  }
};
</script>

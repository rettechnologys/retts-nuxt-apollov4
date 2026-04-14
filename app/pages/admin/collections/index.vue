<template>
  <div class="p-6 max-w-[1400px] mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Collections
        </h1>
        <p class="text-sm text-surface-500 mt-1">
          Define structured data types and manage their content
        </p>
      </div>
      <Button
        label="New Collection"
        icon="pi pi-plus"
        @click="navigateTo('/admin/collections/create')"
      />
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-20">
      <i class="pi pi-spin pi-spinner text-3xl text-primary-500" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!collections.length"
      class="flex flex-col items-center justify-center py-20 text-surface-400"
    >
      <i class="pi pi-database text-5xl mb-4" />
      <p class="text-lg font-semibold">No collections yet</p>
      <p class="text-sm mt-1 mb-6">
        Create your first collection to start managing structured content
      </p>
      <Button
        label="Create Collection"
        icon="pi pi-plus"
        @click="navigateTo('/admin/collections/create')"
      />
    </div>

    <!-- Collections grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <Card
        v-for="col in collections"
        :key="col.slug"
        class="hover:shadow-md transition-shadow cursor-pointer group"
        @click="navigateTo(`/admin/collections/${col.slug}/items`)"
      >
        <template #content>
          <div class="flex flex-col gap-3">
            <div class="flex items-start justify-between">
              <div
                class="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center"
              >
                <i :class="col.icon" class="text-primary-500 text-lg" />
              </div>
              <div
                class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Button
                  icon="pi pi-pencil"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'Configure'"
                  @click.stop="
                    navigateTo(`/admin/collections/${col.slug}/edit`)
                  "
                />
                <Button
                  icon="pi pi-trash"
                  text
                  rounded
                  size="small"
                  severity="danger"
                  v-tooltip.top="'Delete'"
                  @click.stop="confirmDelete(col)"
                />
              </div>
            </div>

            <div>
              <div class="font-semibold text-surface-800 dark:text-surface-200">
                {{ col.name }}
              </div>
              <p
                v-if="col.description"
                class="text-sm text-surface-500 mt-0.5 line-clamp-2"
              >
                {{ col.description }}
              </p>
            </div>

            <div
              class="flex gap-4 pt-1 border-t border-surface-100 dark:border-surface-700"
            >
              <div class="text-center">
                <div
                  class="text-lg font-bold text-surface-800 dark:text-surface-200"
                >
                  {{ col.itemCount ?? 0 }}
                </div>
                <div class="text-xs text-surface-400">Items</div>
              </div>
              <div class="text-center">
                <div
                  class="text-lg font-bold text-surface-800 dark:text-surface-200"
                >
                  {{ col.fields.length }}
                </div>
                <div class="text-xs text-surface-400">Fields</div>
              </div>
            </div>

            <Button
              label="View Items"
              icon="pi pi-list"
              outlined
              size="small"
              class="w-full"
              @click.stop="navigateTo(`/admin/collections/${col.slug}/items`)"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Delete confirm dialog -->
    <Dialog
      v-model:visible="deleteDialog"
      header="Delete Collection"
      :modal="true"
      :style="{ width: '420px' }"
    >
      <div class="flex items-start gap-3">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-2xl mt-0.5" />
        <div>
          <p class="font-medium text-surface-800 dark:text-surface-200">
            Delete "{{ collectionToDelete?.name }}"?
          </p>
          <p class="text-sm text-surface-500 mt-1">
            This will permanently delete the collection schema and all
            <strong>{{ collectionToDelete?.itemCount ?? 0 }} item(s)</strong>.
            This action cannot be undone.
          </p>
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          text
          @click="deleteDialog = false"
        />
        <Button
          label="Delete"
          severity="danger"
          :loading="deleting"
          @click="executeDelete"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { CollectionSchemaWithCount } from '~/utils/types/admin/collection.types';
import { useCollectionForm } from '~/composables/admin/useCollectionForm';

definePageMeta({ layout: 'admin' });

const toast = useToast();
const { deleteCollection } = useCollectionForm();

const { data, pending, refresh } = await useFetch<CollectionSchemaWithCount[]>(
  '/api/collections',
  { default: () => [] },
);

const collections = computed(() => data.value ?? []);

const deleteDialog = ref(false);
const deleting = ref(false);
const collectionToDelete = ref<CollectionSchemaWithCount | null>(null);

const confirmDelete = (col: CollectionSchemaWithCount) => {
  collectionToDelete.value = col;
  deleteDialog.value = true;
};

const executeDelete = async () => {
  if (!collectionToDelete.value) return;

  deleting.value = true;
  const result = await deleteCollection(collectionToDelete.value.slug);
  deleting.value = false;

  if (result.success) {
    deleteDialog.value = false;
    collectionToDelete.value = null;
    toast.add({
      severity: 'success',
      summary: 'Deleted',
      detail: 'Collection removed',
      life: 3000,
    });
    await refresh();
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: result.error,
      life: 4000,
    });
  }
};
</script>

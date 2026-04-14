<template>
  <!-- Loading -->
  <div v-if="pending" class="flex items-center justify-center py-20">
    <i class="pi pi-spin pi-spinner text-3xl text-primary-500" />
  </div>

  <div v-else class="p-6 max-w-[1400px] mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-surface-800 dark:text-surface-100">
          Pages
        </h1>
        <p class="text-sm text-surface-500 mt-0.5">
          {{ (data ?? []).length }}
          {{ (data ?? []).length === 1 ? 'page' : 'pages' }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <IconField class="max-w-sm">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="search"
            placeholder="Search pages…"
            class="w-full"
          />
        </IconField>
        <Button
          label="New Page"
          icon="pi pi-plus"
          size="small"
          @click="navigateTo('/admin/pages/create')"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredPages.length === 0"
      class="flex flex-col items-center justify-center py-20 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl text-surface-400"
    >
      <i class="pi pi-file text-4xl mb-4" />
      <p class="text-lg font-medium">No pages yet</p>
      <Button
        label="Create Page"
        icon="pi pi-plus"
        class="mt-4"
        @click="navigateTo('/admin/pages/create')"
      />
    </div>

    <!-- Table -->
    <DataTable
      v-else
      :value="filteredPages"
      stripedRows
      class="shadow-sm rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700"
    >
      <Column header="Title">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="font-medium">{{ data.title }}</span>
            <code class="text-xs text-surface-400">{{ data.path }}</code>
          </div>
        </template>
      </Column>

      <Column header="Status" class="w-32">
        <template #body="{ data }">
          <Badge :value="data.status" :severity="statusSeverity(data.status)" />
        </template>
      </Column>

      <Column header="Type" class="w-32">
        <template #body="{ data }">
          <span class="text-sm capitalize text-surface-500">{{
            data.type
          }}</span>
        </template>
      </Column>

      <Column header="Blocks" class="w-24">
        <template #body="{ data }">
          <span class="text-sm text-surface-500">{{ data.blockCount }}</span>
        </template>
      </Column>

      <Column header="Saved" class="w-44">
        <template #body="{ data }">
          <span class="text-sm text-surface-400">{{
            formatDate(data.savedAt)
          }}</span>
        </template>
      </Column>

      <Column header="" class="w-32">
        <template #body="{ data }">
          <div class="flex items-center gap-1 justify-end">
            <Button
              icon="pi pi-eye"
              text
              rounded
              size="small"
              severity="info"
              v-tooltip.top="'View'"
              @click="viewPage(data)"
            />
            <Button
              icon="pi pi-pencil"
              text
              rounded
              size="small"
              v-tooltip.top="'Edit'"
              @click="editPage(data)"
            />
            <Button
              icon="pi pi-trash"
              text
              rounded
              size="small"
              severity="danger"
              v-tooltip.top="'Delete'"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Delete confirmation dialog -->
  <Dialog
    v-model:visible="showDeleteDialog"
    modal
    header="Delete Page"
    :style="{ width: '400px' }"
  >
    <p class="text-surface-600 dark:text-surface-300">
      Are you sure you want to delete <strong>{{ pageToDelete?.title }}</strong
      >? This cannot be undone.
    </p>
    <template #footer>
      <Button
        label="Cancel"
        severity="secondary"
        text
        @click="showDeleteDialog = false"
      />
      <Button
        label="Delete"
        severity="danger"
        icon="pi pi-trash"
        :loading="deleting"
        @click="doDelete"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' });

interface PageSummary {
  slug: string;
  id: string;
  title: string;
  status: string;
  type: string;
  path: string;
  blockCount: number;
  savedAt: string;
}

const toast = useToast();
const search = ref('');
const showDeleteDialog = ref(false);
const deleting = ref(false);
const pageToDelete = ref<PageSummary | null>(null);

const { data, pending, refresh } =
  await useFetch<PageSummary[]>('/api/admin/pages');

const filteredPages = computed(() => {
  const q = search.value.toLowerCase();
  return (data.value ?? []).filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.path.toLowerCase().includes(q),
  );
});

const statusSeverity = (status: string) =>
  ({
    published: 'success',
    draft: 'warning',
    scheduled: 'info',
    archived: 'secondary',
  })[status] ?? 'secondary';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const viewPage = (page: PageSummary) => window.open(page.path, '_blank');
const editPage = (page: PageSummary) =>
  navigateTo(`/admin/pages/create?edit=${page.slug}`);

const confirmDelete = (page: PageSummary) => {
  pageToDelete.value = page;
  showDeleteDialog.value = true;
};

const doDelete = async () => {
  if (!pageToDelete.value) return;
  deleting.value = true;
  try {
    await $fetch(`/api/admin/pages/${pageToDelete.value.slug}`, {
      method: 'DELETE',
    });
    toast.add({
      severity: 'success',
      summary: 'Deleted',
      detail: 'Page removed',
      life: 3000,
    });
    showDeleteDialog.value = false;
    pageToDelete.value = null;
    await refresh();
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete page',
      life: 4000,
    });
  } finally {
    deleting.value = false;
  }
};
</script>

<template>
  <!-- Loading -->
  <div v-if="pending" class="flex items-center justify-center py-20">
    <i class="pi pi-spin pi-spinner text-3xl text-primary-500" />
  </div>

  <div v-else-if="schema" class="p-6 max-w-[1400px] mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <Button
          icon="pi pi-arrow-left"
          text
          rounded
          @click="navigateTo('/admin/collections')"
        />
        <div
          class="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center"
        >
          <i
            :class="schema.icon || 'pi pi-database'"
            class="text-primary-500 text-lg"
          />
        </div>
        <div>
          <h1 class="text-xl font-bold text-surface-800 dark:text-surface-100">
            {{ schema.name }}
          </h1>
          <p class="text-sm text-surface-500 mt-0.5">
            {{ total }} {{ total === 1 ? 'item' : 'items' }} &middot;
            {{ schema.fields.length }} fields
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button
          label="Configure"
          icon="pi pi-cog"
          severity="secondary"
          outlined
          size="small"
          @click="navigateTo(`/admin/collections/${collectionSlug}/edit`)"
        />
        <Button
          label="Add Item"
          icon="pi pi-plus"
          size="small"
          @click="
            navigateTo(`/admin/collections/${collectionSlug}/items/create`)
          "
        />
      </div>
    </div>

    <!-- Search -->
    <div class="mb-4 flex items-center gap-2">
      <IconField class="flex-1 max-w-sm">
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="search"
          placeholder="Search items…"
          class="w-full"
          @input="onSearch"
        />
      </IconField>
      <Button
        v-if="search"
        icon="pi pi-times"
        text
        rounded
        @click="clearSearch"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="items.length === 0"
      class="flex flex-col items-center justify-center py-20 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl text-surface-400"
    >
      <i class="pi pi-inbox text-4xl mb-4" />
      <p class="text-lg font-medium">No items yet</p>
      <p class="text-sm mt-1 mb-6">
        Create your first item in the
        <strong>{{ schema.name }}</strong> collection
      </p>
      <Button
        label="Add Item"
        icon="pi pi-plus"
        @click="navigateTo(`/admin/collections/${collectionSlug}/items/create`)"
      />
    </div>

    <!-- Table -->
    <template v-else>
      <DataTable
        :value="items"
        :loading="refreshing"
        stripedRows
        class="shadow-sm rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700"
      >
        <Column field="id" header="ID" class="w-32">
          <template #body="{ data }">
            <code class="text-xs text-surface-400">{{
              data.id.slice(0, 8)
            }}</code>
          </template>
        </Column>

        <!-- Dynamic columns from schema fields where showInList = true -->
        <Column
          v-for="field in listFields"
          :key="field.key"
          :header="field.label"
        >
          <template #body="{ data }">
            <ItemCellValue :value="data.data[field.key]" :type="field.type" />
          </template>
        </Column>

        <Column header="Updated" class="w-44">
          <template #body="{ data }">
            <span class="text-sm text-surface-400">{{
              formatDate(data.updatedAt)
            }}</span>
          </template>
        </Column>

        <Column header="" class="w-24">
          <template #body="{ data }">
            <div class="flex items-center gap-1 justify-end">
              <Button
                icon="pi pi-pencil"
                text
                rounded
                size="small"
                @click="
                  navigateTo(
                    `/admin/collections/${collectionSlug}/items/${data.id}`,
                  )
                "
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                size="small"
                severity="danger"
                @click="confirmDelete(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Pagination -->
      <Paginator
        v-if="total > perPage"
        :rows="perPage"
        :totalRecords="total"
        :first="(page - 1) * perPage"
        :rowsPerPageOptions="[10, 20, 50]"
        class="mt-4"
        @page="onPageChange"
      />
    </template>
  </div>

  <!-- Delete dialog -->
  <Dialog
    v-model:visible="showDeleteDialog"
    modal
    header="Delete Item"
    :style="{ width: '400px' }"
  >
    <p class="text-surface-600 dark:text-surface-300">
      Are you sure you want to delete this item? This action cannot be undone.
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
import ItemCellValue from '~/components/admin/collections/ItemCellValue.vue';
import type {
  CollectionSchema,
  CollectionItem,
  CollectionItemListResponse,
} from '~/utils/types/admin/collection.types';

definePageMeta({ layout: 'admin' });

const toast = useToast();
const route = useRoute();
const collectionSlug = computed(() => route.params.slug as string);

// ─── Schema ───────────────────────────────────────────────────────────────────
const { data: schema, pending } = await useFetch<CollectionSchema>(
  () => `/api/collections/${collectionSlug.value}`,
);

const listFields = computed(() =>
  (schema.value?.fields ?? []).filter((f) => f.showInList !== false),
);

// ─── Items ────────────────────────────────────────────────────────────────────
const page = ref(1);
const perPage = ref(20);
const search = ref('');
const refreshing = ref(false);
const items = ref<CollectionItem[]>([]);
const total = ref(0);

const buildQuery = () => ({
  page: page.value,
  perPage: perPage.value,
  ...(search.value ? { search: search.value } : {}),
});

const fetchItems = async () => {
  refreshing.value = true;
  try {
    const res = await $fetch<CollectionItemListResponse>(
      `/api/collections/${collectionSlug.value}/items`,
      { query: buildQuery() },
    );
    items.value = res.items;
    total.value = res.total;
  } finally {
    refreshing.value = false;
  }
};

await fetchItems();

let searchTimer: ReturnType<typeof setTimeout> | null = null;
const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    fetchItems();
  }, 400);
};

const clearSearch = () => {
  search.value = '';
  page.value = 1;
  fetchItems();
};

const onPageChange = (e: { page: number; rows: number }) => {
  page.value = e.page + 1;
  perPage.value = e.rows;
  fetchItems();
};

// ─── Delete ───────────────────────────────────────────────────────────────────
const showDeleteDialog = ref(false);
const deleting = ref(false);
const itemToDelete = ref<CollectionItem | null>(null);

const confirmDelete = (item: CollectionItem) => {
  itemToDelete.value = item;
  showDeleteDialog.value = true;
};

const doDelete = async () => {
  if (!itemToDelete.value) return;
  deleting.value = true;
  try {
    await $fetch(
      `/api/collections/${collectionSlug.value}/items/${itemToDelete.value.id}`,
      { method: 'DELETE' },
    );
    toast.add({
      severity: 'success',
      summary: 'Deleted',
      detail: 'Item removed',
      life: 3000,
    });
    showDeleteDialog.value = false;
    itemToDelete.value = null;
    await fetchItems();
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete item',
      life: 4000,
    });
  } finally {
    deleting.value = false;
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
</script>

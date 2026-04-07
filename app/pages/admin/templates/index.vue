<!-- Templates - List View -->
<template>
  <div class="templates-page">
    <div class="page-header">
      <h1>Page Templates</h1>
      <div class="header-actions">
        <span class="p-input-icon-left search-input">
          <i class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Search templates..." />
        </span>
        <Button
          label="Create Template"
          icon="pi pi-plus"
          @click="navigateTo('/admin/templates/create')"
        />
      </div>
    </div>

    <div class="templates-content">
      <DataTable
        :value="filteredTemplates"
        :paginator="true"
        :rows="10"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="name" header="Template Name" sortable>
          <template #body="{ data }">
            <div class="template-name">
              <i :class="data.icon || 'pi pi-file'"></i>
              <span>{{ data.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="type" header="Type" sortable>
          <template #body="{ data }">
            <Badge :value="data.type" :severity="getTypeSeverity(data.type)" />
          </template>
        </Column>

        <Column field="blocksCount" header="Blocks" sortable>
          <template #body="{ data }">
            <Badge :value="data.blocksCount" severity="info" />
          </template>
        </Column>

        <Column field="usedBy" header="Used By" sortable>
          <template #body="{ data }">
            <span>{{ data.usedBy }} pages</span>
          </template>
        </Column>

        <Column field="status" header="Status" sortable>
          <template #body="{ data }">
            <Badge
              :value="data.status"
              :severity="data.status === 'active' ? 'success' : 'warning'"
            />
          </template>
        </Column>

        <Column field="updatedAt" header="Last Updated" sortable>
          <template #body="{ data }">
            {{ formatDate(data.updatedAt) }}
          </template>
        </Column>

        <Column header="Actions">
          <template #body="{ data }">
            <div class="table-actions">
              <Button
                icon="pi pi-eye"
                text
                rounded
                severity="info"
                @click="previewTemplate(data)"
                v-tooltip.top="'Preview'"
              />
              <Button
                icon="pi pi-pencil"
                text
                rounded
                @click="editTemplate(data)"
                v-tooltip.top="'Edit'"
              />
              <Button
                icon="pi pi-copy"
                text
                rounded
                severity="secondary"
                @click="duplicateTemplate(data)"
                v-tooltip.top="'Duplicate'"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                @click="deleteTemplate(data)"
                v-tooltip.top="'Delete'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteDialog"
      header="Confirm Delete"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle"
          style="font-size: 3rem; color: #f59e0b"
        ></i>
        <p>
          Are you sure you want to delete template
          <strong>{{ selectedTemplate?.name }}</strong
          >?
        </p>
        <p
          v-if="
            selectedTemplate &&
            selectedTemplate.usedBy &&
            selectedTemplate.usedBy > 0
          "
          class="warning-text"
        >
          This template is currently used by
          {{ selectedTemplate.usedBy }} page(s).
        </p>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          text
          @click="deleteDialog = false"
        />
        <Button label="Delete" severity="danger" @click="confirmDelete" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

interface Template {
  id: number;
  name: string;
  type: string;
  icon?: string;
  blocksCount: number;
  usedBy: number;
  status: string;
  updatedAt: string;
}

const loading = ref(false);
const searchQuery = ref('');
const deleteDialog = ref(false);
const selectedTemplate = ref<Template | null>(null);

const templates = ref<Template[]>([
  {
    id: 1,
    name: 'Homepage Hero',
    type: 'hero',
    icon: 'pi pi-star',
    blocksCount: 5,
    usedBy: 3,
    status: 'active',
    updatedAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'About Page',
    type: 'page',
    icon: 'pi pi-info-circle',
    blocksCount: 8,
    usedBy: 1,
    status: 'active',
    updatedAt: '2024-01-14',
  },
  {
    id: 3,
    name: 'Product Listing',
    type: 'listing',
    icon: 'pi pi-th-large',
    blocksCount: 6,
    usedBy: 5,
    status: 'active',
    updatedAt: '2024-01-13',
  },
  {
    id: 4,
    name: 'Contact Form',
    type: 'form',
    icon: 'pi pi-envelope',
    blocksCount: 3,
    usedBy: 2,
    status: 'active',
    updatedAt: '2024-01-12',
  },
  {
    id: 5,
    name: 'Blog Post',
    type: 'blog',
    icon: 'pi pi-book',
    blocksCount: 7,
    usedBy: 12,
    status: 'active',
    updatedAt: '2024-01-11',
  },
  {
    id: 6,
    name: 'Team Section',
    type: 'section',
    icon: 'pi pi-users',
    blocksCount: 4,
    usedBy: 0,
    status: 'draft',
    updatedAt: '2024-01-10',
  },
]);

const filteredTemplates = computed(() => {
  if (!searchQuery.value) return templates.value;
  const query = searchQuery.value.toLowerCase();
  return templates.value.filter(
    (t) =>
      t.name.toLowerCase().includes(query) ||
      t.type.toLowerCase().includes(query),
  );
});

const getTypeSeverity = (type: string) => {
  const severityMap: Record<string, string> = {
    hero: 'info',
    page: 'success',
    listing: 'warning',
    form: 'secondary',
    blog: 'info',
    section: 'contrast',
  };
  return severityMap[type] || 'info';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const previewTemplate = (template: Template) => {
  navigateTo(`/admin/templates/preview/${template.id}`);
};

const editTemplate = (template: Template) => {
  navigateTo(`/admin/templates/edit/${template.id}`);
};

const duplicateTemplate = (template: Template) => {
  // TODO: Implement duplicate functionality
  console.log('Duplicate template:', template);
};

const deleteTemplate = (template: Template) => {
  selectedTemplate.value = template;
  deleteDialog.value = true;
};

const confirmDelete = () => {
  // TODO: Call API to delete template
  const index = templates.value.findIndex(
    (t) => t.id === selectedTemplate.value?.id,
  );
  if (index !== -1) {
    templates.value.splice(index, 1);
  }
  deleteDialog.value = false;
  selectedTemplate.value = null;
};
</script>

<style scoped>
.templates-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  width: 300px;
}

.template-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.template-name i {
  color: #3b82f6;
  font-size: 1.25rem;
}

.table-actions {
  display: flex;
  gap: 0.25rem;
}

.confirmation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.warning-text {
  color: #f59e0b;
  font-weight: 500;
}
</style>

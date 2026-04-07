<!-- Pages Management - List View -->
<template>
  <div class="pages-management">
    <div class="page-header">
      <h1>Pages</h1>
      <div class="header-actions">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Search pages..." />
        </span>
        <Dropdown
          v-model="statusFilter"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Status"
        />
        <Button
          label="Create Page"
          icon="pi pi-plus"
          @click="navigateTo('/admin/pages/create')"
        />
      </div>
    </div>

    <div class="pages-content">
      <DataTable
        :value="filteredPages"
        :paginator="true"
        :rows="15"
        :loading="loading"
        stripedRows
        v-model:selection="selectedPages"
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

        <Column field="title" header="Title" sortable>
          <template #body="{ data }">
            <div class="page-title">
              <i :class="getPageIcon(data.type)" style="color: #3b82f6"></i>
              <div>
                <div class="title-main">{{ data.title }}</div>
                <small class="page-url">{{ data.url }}</small>
              </div>
            </div>
          </template>
        </Column>

        <Column field="template" header="Template" sortable>
          <template #body="{ data }">
            <Badge :value="data.template" severity="info" />
          </template>
        </Column>

        <Column field="status" header="Status" sortable>
          <template #body="{ data }">
            <Badge
              :value="data.status"
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </Column>

        <Column field="author" header="Author" sortable>
          <template #body="{ data }">
            <div class="author-cell">
              <Avatar
                :label="data.author.initials"
                size="small"
                shape="circle"
              />
              <span>{{ data.author.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="views" header="Views" sortable>
          <template #body="{ data }">
            <span>{{ formatNumber(data.views) }}</span>
          </template>
        </Column>

        <Column field="updatedAt" header="Last Modified" sortable>
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
                @click="viewPage(data)"
                v-tooltip.top="'View'"
              />
              <Button
                icon="pi pi-pencil"
                text
                rounded
                @click="editPage(data)"
                v-tooltip.top="'Edit'"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                @click="deletePage(data)"
                v-tooltip.top="'Delete'"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Bulk Actions -->
      <div v-if="selectedPages.length > 0" class="bulk-actions">
        <span>{{ selectedPages.length }} pages selected</span>
        <Button
          label="Publish"
          severity="success"
          size="small"
          @click="bulkPublish"
        />
        <Button
          label="Draft"
          severity="secondary"
          size="small"
          @click="bulkDraft"
        />
        <Button
          label="Delete"
          severity="danger"
          size="small"
          @click="bulkDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

interface Page {
  id: number;
  title: string;
  url: string;
  type: string;
  template: string;
  status: string;
  author: { name: string; initials: string };
  views: number;
  updatedAt: string;
}

const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');
const selectedPages = ref<Page[]>([]);

const pages = ref<Page[]>([
  {
    id: 1,
    title: 'Home',
    url: '/',
    type: 'home',
    template: 'Homepage Hero',
    status: 'published',
    author: { name: 'John Doe', initials: 'JD' },
    views: 15234,
    updatedAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'About Us',
    url: '/about',
    type: 'page',
    template: 'About Page',
    status: 'published',
    author: { name: 'Jane Smith', initials: 'JS' },
    views: 8921,
    updatedAt: '2024-01-14',
  },
  {
    id: 3,
    title: 'Services',
    url: '/services',
    type: 'page',
    template: 'Product Listing',
    status: 'published',
    author: { name: 'John Doe', initials: 'JD' },
    views: 6543,
    updatedAt: '2024-01-13',
  },
  {
    id: 4,
    title: 'Contact',
    url: '/contact',
    type: 'page',
    template: 'Contact Form',
    status: 'published',
    author: { name: 'Jane Smith', initials: 'JS' },
    views: 4321,
    updatedAt: '2024-01-12',
  },
  {
    id: 5,
    title: 'Privacy Policy',
    url: '/privacy',
    type: 'page',
    template: 'About Page',
    status: 'draft',
    author: { name: 'John Doe', initials: 'JD' },
    views: 0,
    updatedAt: '2024-01-11',
  },
]);

const statusOptions = ref([
  { label: 'All Status', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
]);

const filteredPages = computed(() => {
  let result = pages.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.url.toLowerCase().includes(query),
    );
  }

  if (statusFilter.value !== 'all') {
    result = result.filter((p) => p.status === statusFilter.value);
  }

  return result;
});

const getPageIcon = (type: string) => {
  const icons: Record<string, string> = {
    home: 'pi pi-home',
    page: 'pi pi-file',
    blog: 'pi pi-book',
    product: 'pi pi-shopping-cart',
  };
  return icons[type] || 'pi pi-file';
};

const getStatusSeverity = (status: string) => {
  const severityMap: Record<string, string> = {
    published: 'success',
    draft: 'warning',
    scheduled: 'info',
  };
  return severityMap[status] || 'secondary';
};

const formatNumber = (num: number) => {
  return num.toLocaleString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const viewPage = (page: Page) => {
  window.open(page.url, '_blank');
};

const editPage = (page: Page) => {
  navigateTo(`/admin/pages/edit/${page.id}`);
};

const deletePage = (page: Page) => {
  // TODO: Implement delete
  console.log('Delete page:', page);
};

const bulkPublish = () => {
  console.log('Bulk publish:', selectedPages.value);
};

const bulkDraft = () => {
  console.log('Bulk draft:', selectedPages.value);
};

const bulkDelete = () => {
  console.log('Bulk delete:', selectedPages.value);
};
</script>

<style scoped>
.pages-management {
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

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title i {
  font-size: 1.25rem;
}

.title-main {
  font-weight: 500;
}

.page-url {
  color: #6b7280;
  font-size: 0.75rem;
}

.author-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-actions {
  display: flex;
  gap: 0.25rem;
}

.bulk-actions {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.bulk-actions span {
  font-weight: 500;
}
</style>

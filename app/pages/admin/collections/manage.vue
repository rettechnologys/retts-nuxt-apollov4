<!-- Collections - Manage Collections (Dynamic) -->
<template>
  <div class="manage-collections-page">
    <div class="page-header">
      <h1>Manage Collections</h1>
      <Button
        label="Create Collection"
        icon="pi pi-plus"
        @click="createDialog = true"
      />
    </div>

    <div class="collections-grid">
      <Card
        v-for="collection in collections"
        :key="collection.id"
        class="collection-card"
      >
        <template #header>
          <div class="card-header">
            <i :class="collection.icon"></i>
          </div>
        </template>
        <template #title>{{ collection.name }}</template>
        <template #subtitle>{{ collection.description }}</template>
        <template #content>
          <div class="collection-stats">
            <div class="stat-item">
              <span class="stat-label">Items</span>
              <span class="stat-value">{{ collection.itemCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Fields</span>
              <span class="stat-value">{{ collection.fieldCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Status</span>
              <Badge
                :value="collection.status"
                :severity="
                  collection.status === 'active' ? 'success' : 'warning'
                "
              />
            </div>
          </div>

          <div class="collection-actions">
            <Button
              label="View Items"
              icon="pi pi-list"
              outlined
              size="small"
              @click="viewItems(collection)"
            />
            <Button
              label="Configure"
              icon="pi pi-cog"
              outlined
              size="small"
              @click="configureCollection(collection)"
            />
            <Button
              icon="pi pi-trash"
              text
              rounded
              size="small"
              severity="danger"
              @click="deleteCollection(collection)"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Create Collection Dialog -->
    <Dialog
      v-model:visible="createDialog"
      header="Create New Collection"
      :modal="true"
      :style="{ width: '700px' }"
    >
      <div class="form-grid">
        <div class="form-field full-width">
          <label>Collection Name</label>
          <InputText
            v-model="newCollection.name"
            placeholder="e.g., Products, Team Members"
          />
        </div>

        <div class="form-field full-width">
          <label>Description</label>
          <Textarea
            v-model="newCollection.description"
            rows="3"
            placeholder="Describe this collection..."
          />
        </div>

        <div class="form-field">
          <label>Icon</label>
          <InputText
            v-model="newCollection.icon"
            placeholder="pi pi-shopping-cart"
          />
        </div>

        <div class="form-field">
          <label>Slug</label>
          <InputText v-model="newCollection.slug" placeholder="products" />
        </div>

        <div class="form-field full-width">
          <h4>Fields Configuration</h4>
          <div class="fields-list">
            <div
              v-for="(field, index) in newCollection.fields"
              :key="index"
              class="field-item"
            >
              <InputText v-model="field.name" placeholder="Field Name" />
              <Dropdown
                v-model="field.type"
                :options="fieldTypes"
                optionLabel="label"
                optionValue="value"
                placeholder="Type"
              />
              <Checkbox v-model="field.required" :binary="true" />
              <label>Required</label>
              <Button
                icon="pi pi-trash"
                text
                rounded
                size="small"
                severity="danger"
                @click="removeField(index)"
              />
            </div>
          </div>
          <Button
            label="Add Field"
            icon="pi pi-plus"
            size="small"
            text
            @click="addField"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          text
          @click="createDialog = false"
        />
        <Button label="Create" @click="createCollection" :loading="creating" />
      </template>
    </Dialog>

    <!-- Configure Collection Dialog -->
    <Dialog
      v-model:visible="configDialog"
      header="Configure Collection"
      :modal="true"
      :style="{ width: '800px' }"
    >
      <div v-if="selectedCollection" class="config-content">
        <TabView>
          <TabPanel value="0" header="General">
            <div class="form-grid">
              <div class="form-field">
                <label>Collection Name</label>
                <InputText v-model="selectedCollection.name" />
              </div>
              <div class="form-field">
                <label>Icon</label>
                <InputText v-model="selectedCollection.icon" />
              </div>
              <div class="form-field full-width">
                <label>Description</label>
                <Textarea v-model="selectedCollection.description" rows="3" />
              </div>
              <div class="form-field">
                <label class="flex align-items-center gap-2">
                  <Checkbox
                    v-model="selectedCollection.enableCategories"
                    :binary="true"
                  />
                  Enable Categories
                </label>
              </div>
              <div class="form-field">
                <label class="flex align-items-center gap-2">
                  <Checkbox
                    v-model="selectedCollection.enableTags"
                    :binary="true"
                  />
                  Enable Tags
                </label>
              </div>
            </div>
          </TabPanel>

          <TabPanel value="1" header="Fields">
            <div class="fields-manager">
              <draggable
                v-model="selectedCollection.fields"
                item-key="id"
                handle=".drag-handle"
              >
                <template #item="{ element }">
                  <div class="field-config-item">
                    <i class="pi pi-bars drag-handle"></i>
                    <div class="field-details">
                      <strong>{{ element.name }}</strong>
                      <Badge :value="element.type" severity="info" />
                      <Badge
                        v-if="element.required"
                        value="Required"
                        severity="danger"
                      />
                    </div>
                    <Button icon="pi pi-pencil" text rounded size="small" />
                    <Button
                      icon="pi pi-trash"
                      text
                      rounded
                      size="small"
                      severity="danger"
                    />
                  </div>
                </template>
              </draggable>
              <Button
                label="Add Field"
                icon="pi pi-plus"
                size="small"
                outlined
                class="add-field-btn"
              />
            </div>
          </TabPanel>

          <TabPanel value="2" header="Display">
            <div class="form-grid">
              <div class="form-field">
                <label>Items Per Page</label>
                <InputNumber
                  v-model="selectedCollection.itemsPerPage"
                  :min="10"
                  :max="100"
                  :step="10"
                  showButtons
                />
              </div>
              <div class="form-field">
                <label>Default Sort Field</label>
                <Dropdown
                  v-model="selectedCollection.defaultSort"
                  :options="selectedCollection.fields"
                  optionLabel="name"
                  optionValue="name"
                />
              </div>
              <div class="form-field">
                <label>Sort Order</label>
                <Dropdown
                  v-model="selectedCollection.sortOrder"
                  :options="[
                    { label: 'Ascending', value: 'asc' },
                    { label: 'Descending', value: 'desc' },
                  ]"
                  optionLabel="label"
                  optionValue="value"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          text
          @click="configDialog = false"
        />
        <Button label="Save Changes" @click="saveCollectionConfig" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable as draggable } from 'vue-draggable-plus';

definePageMeta({
  layout: 'admin',
});

const createDialog = ref(false);
const configDialog = ref(false);
const creating = ref(false);
const selectedCollection = ref<any>(null);

const collections = ref([
  {
    id: 1,
    name: 'Blog Posts',
    description: 'Blog articles and news',
    icon: 'pi pi-book',
    itemCount: 128,
    fieldCount: 8,
    status: 'active',
    slug: 'blog',
    enableCategories: true,
    enableTags: true,
    itemsPerPage: 20,
    defaultSort: 'publishedAt',
    sortOrder: 'desc',
    fields: [
      { id: 1, name: 'title', type: 'text', required: true },
      { id: 2, name: 'content', type: 'richtext', required: true },
      { id: 3, name: 'excerpt', type: 'textarea', required: false },
      { id: 4, name: 'featuredImage', type: 'image', required: false },
    ],
  },
  {
    id: 2,
    name: 'Products',
    description: 'Product catalog items',
    icon: 'pi pi-shopping-cart',
    itemCount: 256,
    fieldCount: 12,
    status: 'active',
    slug: 'products',
    enableCategories: true,
    enableTags: true,
    itemsPerPage: 30,
    fields: [],
  },
  {
    id: 3,
    name: 'Projects',
    description: 'Portfolio projects',
    icon: 'pi pi-briefcase',
    itemCount: 42,
    fieldCount: 6,
    status: 'active',
    slug: 'projects',
    enableCategories: true,
    enableTags: false,
    itemsPerPage: 20,
    fields: [],
  },
  {
    id: 4,
    name: 'Team Members',
    description: 'Staff and team profiles',
    icon: 'pi pi-users',
    itemCount: 15,
    fieldCount: 10,
    status: 'active',
    slug: 'team',
    enableCategories: false,
    enableTags: false,
    itemsPerPage: 20,
    fields: [],
  },
]);

const newCollection = ref({
  name: '',
  description: '',
  icon: '',
  slug: '',
  fields: [{ name: 'title', type: 'text', required: true }],
});

const fieldTypes = ref([
  { label: 'Text', value: 'text' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Rich Text', value: 'richtext' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
  { label: 'Image', value: 'image' },
  { label: 'File', value: 'file' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Select', value: 'select' },
  { label: 'Multi-Select', value: 'multiselect' },
]);

const addField = () => {
  newCollection.value.fields.push({
    name: '',
    type: 'text',
    required: false,
  });
};

const removeField = (index: number) => {
  newCollection.value.fields.splice(index, 1);
};

const createCollection = async () => {
  creating.value = true;
  try {
    // TODO: Call API to create collection
    await new Promise((resolve) => setTimeout(resolve, 1000));
    createDialog.value = false;
    // Reset form
    newCollection.value = {
      name: '',
      description: '',
      icon: '',
      slug: '',
      fields: [{ name: 'title', type: 'text', required: true }],
    };
  } finally {
    creating.value = false;
  }
};

const viewItems = (collection: any) => {
  navigateTo(`/admin/collections/${collection.slug}`);
};

const configureCollection = (collection: any) => {
  selectedCollection.value = { ...collection };
  configDialog.value = true;
};

const saveCollectionConfig = () => {
  // TODO: Save collection configuration
  configDialog.value = false;
};

const deleteCollection = (collection: any) => {
  // TODO: Confirm and delete collection
  console.log('Delete collection:', collection);
};
</script>

<style scoped>
.manage-collections-page {
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

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.collection-card {
  transition: all 0.2s;
}

.collection-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-header i {
  font-size: 3rem;
  color: white;
}

.collection-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.collection-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-weight: 500;
  font-size: 0.875rem;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-item {
  display: grid;
  grid-template-columns: 1fr 150px auto auto auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.fields-manager {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-config-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.drag-handle {
  cursor: move;
  color: #9ca3af;
}

.field-details {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.add-field-btn {
  margin-top: 0.5rem;
}

.config-content {
  min-height: 400px;
}
</style>

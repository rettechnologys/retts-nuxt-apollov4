<!-- Global Settings - Menus -->
<template>
  <div class="menus-page">
    <div class="page-header">
      <h1>Menu Management</h1>
      <div class="header-actions">
        <Dropdown
          v-model="selectedMenu"
          :options="menus"
          optionLabel="name"
          placeholder="Select Menu"
          @change="loadMenuItems"
        />
        <Button
          label="Create Menu"
          icon="pi pi-plus"
          @click="createMenuDialog = true"
        />
        <Button
          label="Save Changes"
          icon="pi pi-check"
          @click="saveMenu"
          :loading="saving"
        />
      </div>
    </div>

    <div class="menus-content">
      <div class="menus-layout">
        <!-- Menu Items Tree -->
        <Card class="menu-tree-card">
          <template #title>Menu Items</template>
          <template #subtitle>Drag and drop to reorder menu items</template>
          <template #content>
            <div class="tree-actions">
              <Button
                label="Add Item"
                icon="pi pi-plus"
                size="small"
                @click="addMenuItemDialog = true"
              />
            </div>

            <draggable
              v-model="menuItems"
              :group="{ name: 'menu-items' }"
              item-key="id"
              class="menu-tree"
              handle=".drag-handle"
              @change="onMenuChange"
            >
              <template #item="{ element }">
                <div class="menu-item">
                  <div class="menu-item-content">
                    <i class="pi pi-bars drag-handle"></i>
                    <i :class="element.icon || 'pi pi-link'"></i>
                    <span class="menu-label">{{ element.label }}</span>
                    <Badge
                      v-if="element.children?.length"
                      :value="element.children.length"
                      severity="info"
                    />
                    <div class="menu-actions">
                      <Button
                        icon="pi pi-pencil"
                        text
                        rounded
                        size="small"
                        @click="editMenuItem(element)"
                      />
                      <Button
                        icon="pi pi-trash"
                        text
                        rounded
                        size="small"
                        severity="danger"
                        @click="deleteMenuItem(element)"
                      />
                    </div>
                  </div>

                  <!-- Nested Children -->
                  <draggable
                    v-if="element.children?.length"
                    v-model="element.children"
                    :group="{ name: 'menu-items' }"
                    item-key="id"
                    class="menu-tree-nested"
                    handle=".drag-handle"
                  >
                    <template #item="{ element: child }">
                      <div class="menu-item">
                        <div class="menu-item-content">
                          <i class="pi pi-bars drag-handle"></i>
                          <i :class="child.icon || 'pi pi-link'"></i>
                          <span class="menu-label">{{ child.label }}</span>
                          <div class="menu-actions">
                            <Button
                              icon="pi pi-pencil"
                              text
                              rounded
                              size="small"
                              @click="editMenuItem(child)"
                            />
                            <Button
                              icon="pi pi-trash"
                              text
                              rounded
                              size="small"
                              severity="danger"
                              @click="deleteMenuItem(child)"
                            />
                          </div>
                        </div>
                      </div>
                    </template>
                  </draggable>
                </div>
              </template>
            </draggable>
          </template>
        </Card>

        <!-- Menu Preview -->
        <Card class="menu-preview-card">
          <template #title>Preview</template>
          <template #content>
            <div class="menu-preview">
              <nav class="preview-nav">
                <div
                  v-for="item in menuItems"
                  :key="item.id"
                  class="preview-item"
                >
                  <a href="#" class="preview-link">
                    <i v-if="item.icon" :class="item.icon"></i>
                    {{ item.label }}
                  </a>
                  <div v-if="item.children?.length" class="preview-dropdown">
                    <a
                      v-for="child in item.children"
                      :key="child.id"
                      href="#"
                      class="preview-dropdown-item"
                    >
                      <i v-if="child.icon" :class="child.icon"></i>
                      {{ child.label }}
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Create Menu Dialog -->
    <Dialog
      v-model:visible="createMenuDialog"
      header="Create New Menu"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div class="form-field">
        <label>Menu Name</label>
        <InputText v-model="newMenu.name" placeholder="e.g., Main Navigation" />
      </div>
      <div class="form-field">
        <label>Location</label>
        <Dropdown
          v-model="newMenu.location"
          :options="menuLocations"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Location"
        />
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          text
          @click="createMenuDialog = false"
        />
        <Button label="Create" @click="createMenu" />
      </template>
    </Dialog>

    <!-- Add/Edit Menu Item Dialog -->
    <Dialog
      v-model:visible="addMenuItemDialog"
      :header="editingItem ? 'Edit Menu Item' : 'Add Menu Item'"
      :modal="true"
      :style="{ width: '600px' }"
    >
      <div class="form-grid">
        <div class="form-field full-width">
          <label>Label</label>
          <InputText
            v-model="menuItemForm.label"
            placeholder="Menu Item Label"
          />
        </div>

        <div class="form-field">
          <label>Link Type</label>
          <Dropdown
            v-model="menuItemForm.linkType"
            :options="linkTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Type"
          />
        </div>

        <div class="form-field">
          <label>URL/Path</label>
          <InputText v-model="menuItemForm.url" placeholder="/about" />
        </div>

        <div class="form-field">
          <label>Icon (Optional)</label>
          <InputText v-model="menuItemForm.icon" placeholder="pi pi-home" />
        </div>

        <div class="form-field">
          <label>Target</label>
          <Dropdown
            v-model="menuItemForm.target"
            :options="targetOptions"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div class="form-field full-width">
          <label class="flex align-items-center gap-2">
            <Checkbox v-model="menuItemForm.isActive" :binary="true" />
            Active
          </label>
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          text
          @click="cancelEditMenuItem"
        />
        <Button label="Save" @click="saveMenuItem" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable as draggable } from 'vue-draggable-plus';

definePageMeta({
  layout: 'admin',
});

interface MenuItem {
  id: number;
  label: string;
  url: string;
  icon?: string;
  linkType: string;
  target: string;
  isActive: boolean;
  children?: MenuItem[];
}

const saving = ref(false);
const createMenuDialog = ref(false);
const addMenuItemDialog = ref(false);
const editingItem = ref<MenuItem | null>(null);

const menus = ref([
  { id: 1, name: 'Main Navigation', location: 'header' },
  { id: 2, name: 'Footer Menu', location: 'footer' },
  { id: 3, name: 'Mobile Menu', location: 'mobile' },
]);

const selectedMenu = ref(menus.value[0]);

const menuItems = ref<MenuItem[]>([
  {
    id: 1,
    label: 'Home',
    url: '/',
    icon: 'pi pi-home',
    linkType: 'internal',
    target: '_self',
    isActive: true,
  },
  {
    id: 2,
    label: 'About',
    url: '/about',
    icon: 'pi pi-info-circle',
    linkType: 'internal',
    target: '_self',
    isActive: true,
    children: [
      {
        id: 21,
        label: 'Our Story',
        url: '/about/story',
        linkType: 'internal',
        target: '_self',
        isActive: true,
      },
      {
        id: 22,
        label: 'Team',
        url: '/about/team',
        linkType: 'internal',
        target: '_self',
        isActive: true,
      },
    ],
  },
  {
    id: 3,
    label: 'Services',
    url: '/services',
    icon: 'pi pi-briefcase',
    linkType: 'internal',
    target: '_self',
    isActive: true,
  },
  {
    id: 4,
    label: 'Blog',
    url: '/blog',
    icon: 'pi pi-book',
    linkType: 'internal',
    target: '_self',
    isActive: true,
  },
  {
    id: 5,
    label: 'Contact',
    url: '/contact',
    icon: 'pi pi-envelope',
    linkType: 'internal',
    target: '_self',
    isActive: true,
  },
]);

const newMenu = ref({
  name: '',
  location: '',
});

const menuItemForm = ref({
  label: '',
  url: '',
  icon: '',
  linkType: 'internal',
  target: '_self',
  isActive: true,
});

const menuLocations = ref([
  { label: 'Header', value: 'header' },
  { label: 'Footer', value: 'footer' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Sidebar', value: 'sidebar' },
]);

const linkTypes = ref([
  { label: 'Internal Page', value: 'internal' },
  { label: 'External URL', value: 'external' },
  { label: 'Custom Link', value: 'custom' },
]);

const targetOptions = ref([
  { label: 'Same Window', value: '_self' },
  { label: 'New Window', value: '_blank' },
]);

const loadMenuItems = () => {
  // TODO: Load menu items from API based on selectedMenu
};

const onMenuChange = () => {
  // Menu order changed
};

const createMenu = () => {
  // TODO: Call API to create menu
  createMenuDialog.value = false;
};

const editMenuItem = (item: MenuItem) => {
  editingItem.value = item;
  menuItemForm.value = {
    label: item.label,
    url: item.url,
    icon: item.icon || '',
    linkType: item.linkType,
    target: item.target,
    isActive: item.isActive,
  };
  addMenuItemDialog.value = true;
};

const deleteMenuItem = (item: MenuItem) => {
  // TODO: Confirm and delete menu item
  const index = menuItems.value.findIndex((i) => i.id === item.id);
  if (index !== -1) {
    menuItems.value.splice(index, 1);
  }
};

const saveMenuItem = () => {
  if (editingItem.value) {
    // Update existing item
    Object.assign(editingItem.value, menuItemForm.value);
  } else {
    // Add new item
    menuItems.value.push({
      id: Date.now(),
      ...menuItemForm.value,
    });
  }
  cancelEditMenuItem();
};

const cancelEditMenuItem = () => {
  addMenuItemDialog.value = false;
  editingItem.value = null;
  menuItemForm.value = {
    label: '',
    url: '',
    icon: '',
    linkType: 'internal',
    target: '_self',
    isActive: true,
  };
};

const saveMenu = async () => {
  saving.value = true;
  try {
    // TODO: Call API to save menu structure
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.menus-page {
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
}

.menus-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.tree-actions {
  margin-bottom: 1rem;
}

.menu-tree,
.menu-tree-nested {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-tree-nested {
  margin-left: 2rem;
  margin-top: 0.5rem;
}

.menu-item {
  display: flex;
  flex-direction: column;
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.menu-item-content:hover {
  background: #f3f4f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.drag-handle {
  cursor: move;
  color: #9ca3af;
}

.menu-label {
  flex: 1;
  font-weight: 500;
}

.menu-actions {
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
}

.menu-preview {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  min-height: 400px;
}

.preview-nav {
  display: flex;
  gap: 2rem;
}

.preview-item {
  position: relative;
}

.preview-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.preview-link:hover {
  color: #3b82f6;
}

.preview-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 0.5rem;
  display: none;
  z-index: 10;
}

.preview-item:hover .preview-dropdown {
  display: block;
}

.preview-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #374151;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.preview-dropdown-item:hover {
  background: #f3f4f6;
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

@media (max-width: 1024px) {
  .menus-layout {
    grid-template-columns: 1fr;
  }
}
</style>

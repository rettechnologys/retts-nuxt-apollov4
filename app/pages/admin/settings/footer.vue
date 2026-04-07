<!-- Global Settings - Footer -->
<template>
  <div class="footer-settings-page">
    <div class="page-header">
      <h1>Footer Settings</h1>
      <div class="header-actions">
        <Button
          label="Preview"
          icon="pi pi-eye"
          severity="secondary"
          outlined
          @click="showPreview = true"
        />
        <Button
          label="Save Changes"
          icon="pi pi-check"
          @click="saveFooter"
          :loading="saving"
        />
      </div>
    </div>

    <div class="footer-content">
      <!-- Footer Layout -->
      <Card>
        <template #title>Footer Layout</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field">
              <label>Layout Type</label>
              <Dropdown
                v-model="footer.layout"
                :options="layoutTypes"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Layout"
              />
            </div>

            <div class="form-field">
              <label>Number of Columns</label>
              <InputNumber
                v-model="footer.columns"
                :min="1"
                :max="5"
                showButtons
              />
            </div>

            <div class="form-field full-width">
              <label class="flex align-items-center gap-2">
                <Checkbox v-model="footer.showSocial" :binary="true" />
                Show Social Media Links
              </label>
            </div>

            <div class="form-field full-width">
              <label class="flex align-items-center gap-2">
                <Checkbox v-model="footer.showNewsletter" :binary="true" />
                Show Newsletter Signup
              </label>
            </div>
          </div>
        </template>
      </Card>

      <!-- Footer Columns -->
      <Card>
        <template #title>Footer Columns</template>
        <template #subtitle>Configure each column content</template>
        <template #content>
          <div class="columns-manager">
            <div
              v-for="(column, index) in footer.columnData"
              :key="index"
              class="column-card"
            >
              <div class="column-header">
                <h3>Column {{ index + 1 }}</h3>
                <Button
                  icon="pi pi-trash"
                  text
                  rounded
                  severity="danger"
                  size="small"
                  @click="removeColumn(index)"
                />
              </div>

              <div class="column-form">
                <div class="form-field">
                  <label>Column Title</label>
                  <InputText
                    v-model="column.title"
                    placeholder="e.g., Quick Links"
                  />
                </div>

                <div class="form-field">
                  <label>Content Type</label>
                  <Dropdown
                    v-model="column.type"
                    :options="columnTypes"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Type"
                  />
                </div>

                <!-- Links List -->
                <div v-if="column.type === 'links'" class="links-section">
                  <div class="section-header">
                    <label>Links</label>
                    <Button
                      label="Add Link"
                      icon="pi pi-plus"
                      size="small"
                      text
                      @click="addLink(column)"
                    />
                  </div>

                  <draggable
                    v-model="column.links!"
                    item-key="id"
                    handle=".drag-handle"
                    class="links-list"
                  >
                    <template #item="{ element: link }">
                      <div class="link-item">
                        <i class="pi pi-bars drag-handle"></i>
                        <InputText
                          v-model="link.label"
                          placeholder="Link Label"
                          class="flex-1"
                        />
                        <InputText
                          v-model="link.url"
                          placeholder="URL"
                          class="flex-1"
                        />
                        <Button
                          icon="pi pi-trash"
                          text
                          rounded
                          size="small"
                          severity="danger"
                          @click="removeLink(column, link)"
                        />
                      </div>
                    </template>
                  </draggable>
                </div>

                <!-- Text Content -->
                <div v-if="column.type === 'text'" class="form-field">
                  <label>Content</label>
                  <Textarea
                    v-model="column.content"
                    rows="5"
                    placeholder="Enter text content..."
                  />
                </div>

                <!-- Contact Info -->
                <div v-if="column.type === 'contact'" class="contact-section">
                  <div class="form-field">
                    <label>Email</label>
                    <InputText
                      v-model="column.email"
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div class="form-field">
                    <label>Phone</label>
                    <InputText
                      v-model="column.phone"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div class="form-field">
                    <label>Address</label>
                    <Textarea
                      v-model="column.address"
                      rows="3"
                      placeholder="Enter address..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              v-if="footer.columnData.length < footer.columns"
              label="Add Column"
              icon="pi pi-plus"
              outlined
              class="add-column-btn"
              @click="addColumn"
            />
          </div>
        </template>
      </Card>

      <!-- Copyright & Social -->
      <Card>
        <template #title>Copyright & Social Media</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field full-width">
              <label>Copyright Text</label>
              <InputText
                v-model="footer.copyright"
                placeholder="© 2024 Your Company. All rights reserved."
              />
            </div>

            <div v-if="footer.showSocial" class="form-field full-width">
              <label>Social Media Links</label>
              <div class="social-links">
                <div
                  v-for="social in footer.socialLinks"
                  :key="social.platform"
                  class="social-item"
                >
                  <i :class="social.icon"></i>
                  <span>{{ social.platform }}</span>
                  <InputText
                    v-model="social.url"
                    :placeholder="`${social.platform} URL`"
                    class="flex-1"
                  />
                  <Checkbox v-model="social.enabled" :binary="true" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Preview Dialog -->
    <Dialog
      v-model:visible="showPreview"
      header="Footer Preview"
      :modal="true"
      :style="{ width: '90vw' }"
    >
      <div class="footer-preview">
        <footer class="preview-footer">
          <div class="preview-columns">
            <div
              v-for="(column, index) in footer.columnData"
              :key="index"
              class="preview-column"
            >
              <h4>{{ column.title }}</h4>

              <!-- Links -->
              <ul v-if="column.type === 'links' && column.links">
                <li v-for="link in column.links" :key="link.id">
                  <a href="#">{{ link.label }}</a>
                </li>
              </ul>

              <!-- Text -->
              <p v-if="column.type === 'text'">{{ column.content }}</p>

              <!-- Contact -->
              <div v-if="column.type === 'contact'" class="contact-info">
                <p v-if="column.email">
                  <i class="pi pi-envelope"></i> {{ column.email }}
                </p>
                <p v-if="column.phone">
                  <i class="pi pi-phone"></i> {{ column.phone }}
                </p>
                <p v-if="column.address">
                  <i class="pi pi-map-marker"></i> {{ column.address }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="footer.showSocial" class="preview-social">
            <a
              v-for="social in footer.socialLinks.filter((s) => s.enabled)"
              :key="social.platform"
              href="#"
              class="social-link"
            >
              <i :class="social.icon"></i>
            </a>
          </div>

          <div class="preview-copyright">
            <p>{{ footer.copyright }}</p>
          </div>
        </footer>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable as draggable } from 'vue-draggable-plus';

definePageMeta({
  layout: 'admin',
});

const saving = ref(false);
const showPreview = ref(false);

const footer = ref({
  layout: 'columns',
  columns: 4,
  showSocial: true,
  showNewsletter: false,
  copyright: '© 2024 Your Company. All rights reserved.',
  columnData: [
    {
      title: 'About Us',
      type: 'text',
      content:
        'We are a leading company providing excellent services to our customers worldwide.',
    },
    {
      title: 'Quick Links',
      type: 'links',
      links: [
        { id: 1, label: 'Home', url: '/' },
        { id: 2, label: 'About', url: '/about' },
        { id: 3, label: 'Services', url: '/services' },
        { id: 4, label: 'Contact', url: '/contact' },
      ],
    },
    {
      title: 'Resources',
      type: 'links',
      links: [
        { id: 5, label: 'Blog', url: '/blog' },
        { id: 6, label: 'FAQ', url: '/faq' },
        { id: 7, label: 'Support', url: '/support' },
      ],
    },
    {
      title: 'Contact',
      type: 'contact',
      email: 'contact@example.com',
      phone: '+1 234 567 8900',
      address: '123 Business Street, City, Country',
    },
  ],
  socialLinks: [
    { platform: 'Facebook', icon: 'pi pi-facebook', url: '', enabled: true },
    { platform: 'Twitter', icon: 'pi pi-twitter', url: '', enabled: true },
    { platform: 'Instagram', icon: 'pi pi-instagram', url: '', enabled: true },
    { platform: 'LinkedIn', icon: 'pi pi-linkedin', url: '', enabled: true },
    { platform: 'YouTube', icon: 'pi pi-youtube', url: '', enabled: false },
  ],
});

const layoutTypes = ref([
  { label: 'Columns', value: 'columns' },
  { label: 'Centered', value: 'centered' },
  { label: 'Minimal', value: 'minimal' },
]);

const columnTypes = ref([
  { label: 'Links', value: 'links' },
  { label: 'Text Content', value: 'text' },
  { label: 'Contact Info', value: 'contact' },
]);

const addColumn = () => {
  footer.value.columnData.push({
    title: `Column ${footer.value.columnData.length + 1}`,
    type: 'links',
    links: [],
  });
};

const removeColumn = (index: number) => {
  footer.value.columnData.splice(index, 1);
};

const addLink = (column: any) => {
  if (!column.links) column.links = [];
  column.links.push({
    id: Date.now(),
    label: '',
    url: '',
  });
};

const removeLink = (column: any, link: any) => {
  const index = column.links.indexOf(link);
  if (index !== -1) {
    column.links.splice(index, 1);
  }
};

const saveFooter = async () => {
  saving.value = true;
  try {
    // TODO: Call API to save footer settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.footer-settings-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
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

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.columns-manager {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.column-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f9fafb;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.column-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
}

.column-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.links-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.drag-handle {
  cursor: move;
  color: #9ca3af;
}

.contact-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.social-item i {
  font-size: 1.25rem;
  color: #3b82f6;
}

.social-item span {
  min-width: 100px;
  font-weight: 500;
}

.add-column-btn {
  height: 200px;
}

.footer-preview {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 8px;
}

.preview-footer {
  background: #1f2937;
  color: white;
  padding: 3rem 2rem 2rem;
  border-radius: 8px;
}

.preview-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.preview-column h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.preview-column ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-column a {
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.2s;
}

.preview-column a:hover {
  color: white;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #d1d5db;
}

.contact-info i {
  margin-right: 0.5rem;
}

.preview-social {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-top: 1px solid #374151;
  border-bottom: 1px solid #374151;
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #374151;
  border-radius: 50%;
  color: white;
  transition: all 0.2s;
}

.social-link:hover {
  background: #3b82f6;
  transform: translateY(-2px);
}

.preview-copyright {
  text-align: center;
  padding-top: 1.5rem;
  color: #9ca3af;
}
</style>

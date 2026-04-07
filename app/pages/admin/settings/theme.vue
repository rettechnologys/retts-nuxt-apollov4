<!-- Global Settings - Theme/Layout -->
<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>Theme & Layout Settings</h1>
      <div class="header-actions">
        <Button label="Reset to Default" icon="pi pi-refresh" severity="secondary" outlined @click="resetTheme" />
        <Button label="Save Changes" icon="pi pi-check" @click="saveTheme" :loading="saving" />
      </div>
    </div>

    <div class="settings-content">
      <!-- Theme Colors -->
      <Card>
        <template #title>Theme Colors</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field">
              <label>Primary Color</label>
              <ColorPicker v-model="theme.primaryColor" format="hex" />
              <InputText v-model="theme.primaryColor" placeholder="#3B82F6" />
            </div>

            <div class="form-field">
              <label>Secondary Color</label>
              <ColorPicker v-model="theme.secondaryColor" format="hex" />
              <InputText v-model="theme.secondaryColor" placeholder="#10B981" />
            </div>

            <div class="form-field">
              <label>Accent Color</label>
              <ColorPicker v-model="theme.accentColor" format="hex" />
              <InputText v-model="theme.accentColor" placeholder="#F59E0B" />
            </div>

            <div class="form-field">
              <label>Background Color</label>
              <ColorPicker v-model="theme.backgroundColor" format="hex" />
              <InputText v-model="theme.backgroundColor" placeholder="#FFFFFF" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Typography -->
      <Card>
        <template #title>Typography</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field full-width">
              <label>Font Family</label>
              <Dropdown
                v-model="theme.fontFamily"
                :options="fontFamilies"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Font Family"
              />
            </div>

            <div class="form-field">
              <label>Base Font Size (px)</label>
              <InputNumber v-model="theme.baseFontSize" :min="12" :max="20" showButtons />
            </div>

            <div class="form-field">
              <label>Line Height</label>
              <InputNumber v-model="theme.lineHeight" :min="1" :max="2" :step="0.1" showButtons />
            </div>
          </div>
        </template>
      </Card>

      <!-- Layout Settings -->
      <Card>
        <template #title>Layout Settings</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field">
              <label>Border Radius (px)</label>
              <InputNumber v-model="theme.borderRadius" :min="0" :max="24" showButtons />
            </div>

            <div class="form-field">
              <label>Container Max Width (px)</label>
              <InputNumber v-model="theme.containerMaxWidth" :min="960" :max="1920" :step="40" showButtons />
            </div>

            <div class="form-field">
              <label>Spacing Unit (px)</label>
              <InputNumber v-model="theme.spacingUnit" :min="4" :max="16" showButtons />
            </div>

            <div class="form-field">
              <label class="flex align-items-center gap-2">
                <Checkbox v-model="theme.darkMode" :binary="true" />
                Enable Dark Mode
              </label>
            </div>

            <div class="form-field">
              <label class="flex align-items-center gap-2">
                <Checkbox v-model="theme.responsiveImages" :binary="true" />
                Responsive Images
              </label>
            </div>

            <div class="form-field">
              <label class="flex align-items-center gap-2">
                <Checkbox v-model="theme.stickyHeader" :binary="true" />
                Sticky Header
              </label>
            </div>
          </div>
        </template>
      </Card>

      <!-- Preview -->
      <Card>
        <template #title>Live Preview</template>
        <template #content>
          <div class="theme-preview" :style="previewStyles">
            <div class="preview-header">
              <h2>Website Header</h2>
              <nav>
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Contact</a>
              </nav>
            </div>
            <div class="preview-content">
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <p>
                This is a paragraph of text showing how your theme will look. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </p>
              <button class="preview-btn primary">Primary Button</button>
              <button class="preview-btn secondary">Secondary Button</button>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

const saving = ref(false);

const theme = ref({
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  accentColor: '#F59E0B',
  backgroundColor: '#FFFFFF',
  fontFamily: 'Inter',
  baseFontSize: 16,
  lineHeight: 1.5,
  borderRadius: 8,
  containerMaxWidth: 1280,
  spacingUnit: 8,
  darkMode: false,
  responsiveImages: true,
  stickyHeader: true,
});

const fontFamilies = ref([
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Poppins', value: 'Poppins' },
]);

const previewStyles = computed(() => ({
  '--primary-color': theme.value.primaryColor,
  '--secondary-color': theme.value.secondaryColor,
  '--accent-color': theme.value.accentColor,
  '--bg-color': theme.value.backgroundColor,
  '--font-family': theme.value.fontFamily,
  '--font-size': `${theme.value.baseFontSize}px`,
  '--line-height': theme.value.lineHeight,
  '--border-radius': `${theme.value.borderRadius}px`,
}));

const saveTheme = async () => {
  saving.value = true;
  try {
    // TODO: Call API to save theme settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Show success message
  } finally {
    saving.value = false;
  }
};

const resetTheme = () => {
  theme.value = {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter',
    baseFontSize: 16,
    lineHeight: 1.5,
    borderRadius: 8,
    containerMaxWidth: 1280,
    spacingUnit: 8,
    darkMode: false,
    responsiveImages: true,
    stickyHeader: true,
  };
};
</script>

<style scoped>
.settings-page {
  padding: 2rem;
  max-width: 1200px;
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

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
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

.theme-preview {
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius);
  padding: 2rem;
  background: var(--bg-color);
  font-family: var(--font-family), sans-serif;
  font-size: var(--font-size);
  line-height: var(--line-height);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
  margin-bottom: 2rem;
}

.preview-header h2 {
  color: var(--primary-color);
  margin: 0;
}

.preview-header nav {
  display: flex;
  gap: 1.5rem;
}

.preview-header nav a {
  color: #374151;
  text-decoration: none;
  transition: color 0.2s;
}

.preview-header nav a:hover {
  color: var(--primary-color);
}

.preview-content h1 {
  font-size: 2em;
  margin-bottom: 0.5em;
  color: var(--primary-color);
}

.preview-content h2 {
  font-size: 1.5em;
  margin-bottom: 0.5em;
  color: var(--secondary-color);
}

.preview-content p {
  margin-bottom: 1.5rem;
  color: #374151;
}

.preview-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  margin-right: 1rem;
  transition: all 0.2s;
}

.preview-btn.primary {
  background: var(--primary-color);
  color: white;
}

.preview-btn.primary:hover {
  opacity: 0.9;
}

.preview-btn.secondary {
  background: var(--secondary-color);
  color: white;
}

.preview-btn.secondary:hover {
  opacity: 0.9;
}
</style>

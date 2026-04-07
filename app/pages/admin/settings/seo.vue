<!-- Global Settings - SEO Defaults -->
<template>
  <div class="seo-settings-page">
    <div class="page-header">
      <h1>SEO Default Settings</h1>
      <div class="header-actions">
        <Button
          label="Generate Sitemap"
          icon="pi pi-sitemap"
          severity="secondary"
          outlined
          @click="generateSitemap"
        />
        <Button
          label="Save Changes"
          icon="pi pi-check"
          @click="saveSEO"
          :loading="saving"
        />
      </div>
    </div>

    <div class="seo-content">
      <!-- General SEO -->
      <Card>
        <template #title>General SEO Settings</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field full-width">
              <label>Default Site Title</label>
              <InputText
                v-model="seo.siteTitle"
                placeholder="Your Website Name"
              />
            </div>

            <div class="form-field full-width">
              <label>Title Separator</label>
              <Dropdown
                v-model="seo.titleSeparator"
                :options="separators"
                optionLabel="label"
                optionValue="value"
              />
            </div>

            <div class="form-field full-width">
              <label>Meta Description</label>
              <Textarea
                v-model="seo.metaDescription"
                rows="3"
                placeholder="Default meta description for your website..."
                maxlength="160"
              />
              <small>{{ seo.metaDescription.length }}/160 characters</small>
            </div>

            <div class="form-field full-width">
              <label>Meta Keywords (comma-separated)</label>
              <Textarea
                v-model="seo.metaKeywords"
                rows="2"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Open Graph -->
      <Card>
        <template #title>Open Graph (Social Media)</template>
        <template #subtitle
          >Settings for Facebook, LinkedIn, and other social platforms</template
        >
        <template #content>
          <div class="form-grid">
            <div class="form-field full-width">
              <label>OG Title</label>
              <InputText
                v-model="seo.ogTitle"
                placeholder="Leave empty to use site title"
              />
            </div>

            <div class="form-field full-width">
              <label>OG Description</label>
              <Textarea
                v-model="seo.ogDescription"
                rows="3"
                placeholder="Leave empty to use meta description"
              />
            </div>

            <div class="form-field full-width">
              <label>OG Image</label>
              <div class="image-upload">
                <img
                  v-if="seo.ogImage"
                  :src="seo.ogImage"
                  alt="OG Image"
                  class="og-preview"
                />
                <div class="upload-actions">
                  <Button
                    label="Upload Image"
                    icon="pi pi-upload"
                    @click="uploadOGImage"
                  />
                  <Button
                    v-if="seo.ogImage"
                    label="Remove"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    @click="seo.ogImage = ''"
                  />
                </div>
                <small>Recommended size: 1200x630px</small>
              </div>
            </div>

            <div class="form-field">
              <label>OG Type</label>
              <Dropdown
                v-model="seo.ogType"
                :options="ogTypes"
                optionLabel="label"
                optionValue="value"
              />
            </div>

            <div class="form-field">
              <label>OG Locale</label>
              <InputText v-model="seo.ogLocale" placeholder="en_US" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Twitter Card -->
      <Card>
        <template #title>Twitter Card</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field">
              <label>Twitter Card Type</label>
              <Dropdown
                v-model="seo.twitterCard"
                :options="twitterCardTypes"
                optionLabel="label"
                optionValue="value"
              />
            </div>

            <div class="form-field">
              <label>Twitter Site Handle</label>
              <InputText v-model="seo.twitterSite" placeholder="@yourhandle" />
            </div>

            <div class="form-field full-width">
              <label>Twitter Creator Handle</label>
              <InputText
                v-model="seo.twitterCreator"
                placeholder="@creatorhandle"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Technical SEO -->
      <Card>
        <template #title>Technical SEO</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field full-width">
              <label>Canonical URL</label>
              <InputText
                v-model="seo.canonicalUrl"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div class="form-field">
              <label class="flex align-items-center gap-2">
                <Checkbox v-model="seo.noindex" :binary="true" />
                No Index (Hide from search engines)
              </label>
            </div>

            <div class="form-field">
              <label class="flex align-items-center gap-2">
                <Checkbox v-model="seo.nofollow" :binary="true" />
                No Follow (Don't follow links)
              </label>
            </div>
          </div>
        </template>
      </Card>

      <!-- Structured Data -->
      <Card>
        <template #title>Structured Data (Schema.org)</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field">
              <label>Organization Name</label>
              <InputText
                v-model="seo.orgName"
                placeholder="Your Organization"
              />
            </div>

            <div class="form-field">
              <label>Organization Logo URL</label>
              <InputText v-model="seo.orgLogo" placeholder="https://..." />
            </div>

            <div class="form-field full-width">
              <label>Custom Schema JSON-LD</label>
              <Textarea
                v-model="seo.customSchema"
                rows="8"
                placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                class="code-input"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Robots.txt & Sitemap -->
      <Card>
        <template #title>Robots.txt & Sitemap</template>
        <template #content>
          <div class="form-grid">
            <div class="form-field full-width">
              <label>Robots.txt Content</label>
              <Textarea v-model="seo.robotsTxt" rows="10" class="code-input" />
            </div>

            <div class="form-field">
              <label>Sitemap URL</label>
              <InputText
                v-model="seo.sitemapUrl"
                placeholder="https://yourwebsite.com/sitemap.xml"
                readonly
              />
            </div>

            <div class="form-field">
              <label>Last Generated</label>
              <InputText :value="seo.lastGenerated" readonly />
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

const seo = ref({
  siteTitle: 'Your Website Name',
  titleSeparator: '|',
  metaDescription:
    'Welcome to our website. We provide excellent services and products.',
  metaKeywords: 'website, services, products',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterSite: '',
  twitterCreator: '',
  canonicalUrl: 'https://yourwebsite.com',
  noindex: false,
  nofollow: false,
  orgName: 'Your Organization',
  orgLogo: '',
  customSchema: '',
  robotsTxt: `User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /

Sitemap: https://yourwebsite.com/sitemap.xml`,
  sitemapUrl: 'https://yourwebsite.com/sitemap.xml',
  lastGenerated: '2024-01-15 10:30:00',
});

const separators = ref([
  { label: '| (Pipe)', value: '|' },
  { label: '- (Dash)', value: '-' },
  { label: '– (En Dash)', value: '–' },
  { label: '— (Em Dash)', value: '—' },
  { label: '» (Right Arrow)', value: '»' },
]);

const ogTypes = ref([
  { label: 'Website', value: 'website' },
  { label: 'Article', value: 'article' },
  { label: 'Product', value: 'product' },
  { label: 'Profile', value: 'profile' },
]);

const twitterCardTypes = ref([
  { label: 'Summary', value: 'summary' },
  { label: 'Summary Large Image', value: 'summary_large_image' },
  { label: 'App', value: 'app' },
  { label: 'Player', value: 'player' },
]);

const uploadOGImage = () => {
  // TODO: Implement image upload
  console.log('Upload OG image');
};

const generateSitemap = async () => {
  // TODO: Generate sitemap
  console.log('Generate sitemap');
};

const saveSEO = async () => {
  saving.value = true;
  try {
    // TODO: Call API to save SEO settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.seo-settings-page {
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

.seo-content {
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

.form-field small {
  color: #6b7280;
  font-size: 0.75rem;
}

.image-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.og-preview {
  max-width: 300px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.upload-actions {
  display: flex;
  gap: 1rem;
}

.code-input {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>

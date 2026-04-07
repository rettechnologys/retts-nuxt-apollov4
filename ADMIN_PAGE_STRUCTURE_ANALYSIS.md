# Admin Page Create Structure - Deep Analysis & Required Changes

## Executive Summary

After conducting a comprehensive analysis of the current admin page create structure against the CMS database schema, Dynamic CMS Guide, and PageConfig requirements, **significant structural gaps have been identified** that must be addressed before the system can properly integrate with the backend.

## 🚨 Critical Findings

### Current State

- ✅ Basic CRUD UI implemented with PrimeVue 4
- ✅ Block selector and editor functional
- ✅ Form validation and state management working
- ❌ **Data structure incompatible with database schema**
- ❌ **Missing critical fields required by backend**
- ❌ **No multi-language support**
- ❌ **PageMeta and CollectionMeta not integrated**
- ❌ **SEO structure doesn't match database**

---

## 📊 Gap Analysis

### 1. Type System Misalignment

#### Current (`app/utils/types/admin/page.types.ts`)

```typescript
export interface PageFormData {
  title: string;
  slug: string;
  type: string; // ❌ Plain string instead of enum
  templateId: number | null; // ❌ Should be UUID string
  status: string; // ❌ Plain string instead of enum
  content: PageContent;
  seo: PageSEO;
  settings: PageSettings;
  scheduledAt?: string;
}
```

#### Required by System (`shared/types.ts` + Database)

```typescript
export interface PageConfig {
  id?: string; // UUID
  name: string; // ❌ MISSING - Legacy page name
  path: string; // ❌ MISSING - URL path (different from slug)
  title?: string;
  layout?: string; // ❌ MISSING - Layout wrapper

  meta: PageMeta; // ❌ MISSING - Required enhanced metadata
  seoMeta?: SEOMeta; // Structure differs from current
  blocks: BlockConfig[]; // Structure differs from current
}

export interface PageMeta {
  type: PageType; // Enum: 'static' | 'collection-list' | 'collection-detail' | 'landing' | 'custom'
  category?: PageCategory; // Enum: 'content' | 'commerce' | 'portfolio' | 'community' | 'utility'
  template?: string;
  collection?: CollectionMeta; // ❌ MISSING - Required for collection pages
}

export interface CollectionMeta {
  type: string; // 'blog', 'product', 'project'
  isDetail: boolean;
  itemId?: string | number;
  itemSlug?: string;
  parentPage?: string;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  previousItem?: { slug: string; title: string };
  nextItem?: { slug: string; title: string };
}
```

---

### 2. Database Schema Requirements

#### Page Entity (Backend)

```typescript
@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string; // ❌ Form uses number

  @Column({ unique: true })
  @Index()
  slug: string; // ✅ Exists

  @Column({ name: 'template_id', nullable: true })
  templateId: string; // ❌ Form uses number, should be UUID string

  @Column()
  title: string; // ✅ Exists

  @Column({ type: 'enum', enum: PageStatus, default: PageStatus.DRAFT })
  status: PageStatus; // ❌ Form uses plain string

  @Column({ type: 'enum', enum: PageType, nullable: true })
  pageType: PageType; // ❌ MISSING in form

  @Column({ nullable: true })
  pageCategory: string; // ❌ MISSING in form

  // Collection-specific
  @Column({ nullable: true })
  collectionType: string; // ❌ MISSING in form

  @Column({ type: 'uuid', nullable: true })
  collectionItemId: string; // ❌ MISSING in form

  // SEO columns (direct on entity, not nested)
  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string; // ❌ Form has keywords as array

  @Column({ type: 'text', nullable: true })
  ogImage: string;

  @Column({ type: 'text', nullable: true })
  canonicalUrl: string;

  @Column({ default: false })
  noindex: boolean; // ❌ Form has noIndex (camelCase)

  // Publishing
  @Column({ nullable: true })
  publishedAt: Date; // ❌ MISSING in form

  @Column({ name: 'author_id', nullable: true })
  authorId: string; // ❌ MISSING in form

  // Stats
  @Column({ default: 0 })
  viewCount: number; // ❌ MISSING in form

  // Relations
  @OneToMany(() => PageBlock, (block) => block.page, { cascade: true })
  blocks: PageBlock[]; // ❌ Form has loose array structure

  @OneToMany(() => PageTranslation, (translation) => translation.page)
  translations: PageTranslation[]; // ❌ MISSING - No i18n support in form
}
```

#### PageBlock Entity (Backend)

```typescript
@Entity('page_blocks')
export class PageBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'page_id' })
  pageId: string;

  @Column({ name: 'template_block_id', nullable: true })
  templateBlockId: string; // ❌ MISSING - Link to template blocks

  @Column()
  name: string; // ✅ Exists

  @Column({ nullable: true })
  type: string; // ✅ Exists

  @Column()
  component: string; // ✅ Exists

  @Column('jsonb', { nullable: true })
  props: Record<string, any>; // ✅ Exists

  @Column({ default: 0 })
  sortOrder: number; // ❌ MISSING in form
}
```

#### PageTranslation Entity (Backend)

```typescript
@Entity('page_translations')
@Unique(['pageId', 'languageId'])
export class PageTranslation {
  @Column({ name: 'page_id' })
  pageId: string;

  @Column({ name: 'language_id' })
  languageId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;
}
```

---

### 3. SEO Structure Mismatch

#### Current Form SEO

```typescript
interface PageSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[]; // ❌ Array, database expects TEXT
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean; // ❌ Camel case
  noFollow?: boolean; // ❌ Database doesn't have this field
}
```

#### Required Structure

```typescript
// Option A: Flat structure matching database columns
interface PageSEOForm {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string; // Convert array to comma-separated string
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean; // Lowercase to match database
}

// Option B: Use SEOMeta from shared/types.ts
export interface SEOMeta {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;

  // Additional fields for detail pages
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  type?: 'website' | 'article' | 'product';
}
```

---

### 4. Settings Structure Issues

#### Current Form Settings

```typescript
interface PageSettings {
  isHomepage?: boolean; // ❌ Not in database
  requireAuth?: boolean; // ❌ Not in database
  allowComments?: boolean; // ❌ Not in database
  showInMenu?: boolean; // ❌ Not in database
  menuOrder?: number; // ❌ Not in database
  parentPageId?: number; // ❌ Not in database
  customCSS?: string; // ❌ Not in database
  customJS?: string; // ❌ Not in database
}
```

#### Database Reality

**The Page entity has NO columns for these settings.**

**Solutions:**

1. **Add JSONB column** to Page entity:

   ```typescript
   @Column('jsonb', { nullable: true, default: {} })
   settings: Record<string, any>;
   ```

2. **Create separate PageSettings entity:**

   ```typescript
   @Entity('page_settings')
   export class PageSettings {
     @OneToOne(() => Page)
     page: Page;

     @Column({ default: false })
     isHomepage: boolean;

     @Column({ default: false })
     requireAuth: boolean;

     // ... other settings
   }
   ```

3. **Use GlobalConfig for page-level settings:**
   Store in global*configs with key like `page_settings*{pageId}`

---

### 5. Block Structure Incompatibility

#### Current Form Blocks

```typescript
content: {
  blocks?: any[];  // ❌ Too loose, no structure
  html?: string;
  json?: any;
}
```

#### Required BlockConfig Structure

```typescript
export interface BlockConfig {
  name: string;
  type?: 'predefined' | 'custom';
  component?: string; // For predefined: 'HeroWidget', 'FeaturesWidget'
  components?: ComponentConfig[]; // For custom blocks
  props?: Record<string, any>;
}

export interface ComponentConfig {
  name: string;
  component: string;
  props?: Record<string, any>;
  content?: ComponentContent;
  components?: ComponentConfig[]; // Nested components
}
```

#### Database PageBlock Entity

- Has `sortOrder` field (missing in form)
- Has `templateBlockId` for template inheritance (missing in form)
- Stored as separate rows, not array in JSON

---

### 6. Missing Multi-Language Support

#### Current State

- **No language selector in form**
- **No translation fields**
- **No language-specific content**

#### Required Implementation

**Per the CMS guides, the system uses a hybrid i18n approach:**

1. **Static UI**: Nuxt i18n (`$t()` functions)
2. **Dynamic Content**: Translation tables in database

**Required Changes:**

```typescript
// Add to PageFormData
interface PageFormData {
  // ... existing fields

  // Primary language content
  title: string;
  slug: string;

  // Translations for each language
  translations: {
    [languageCode: string]: PageTranslation;
  };
}

interface PageTranslation {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  // Note: Content blocks are handled separately with {{item.field}} variables
}

// UI needs language tabs
<TabView>
  <TabPanel header="English (en)">
    <InputText v-model="formData.title" />
  </TabPanel>
  <TabPanel header="Indonesia (id)">
    <InputText v-model="formData.translations.id.title" />
  </TabPanel>
</TabView>
```

---

### 7. Template Integration Issues

#### Current Implementation

```typescript
templateId: number | null; // ❌ Wrong type
```

#### Required Implementation

```typescript
// Type should be UUID string
templateId: string | null;

// When template is selected, should:
1. Fetch template details including blocks
2. Pre-populate page blocks from template blocks
3. Link page blocks to template blocks via templateBlockId
4. Allow overriding props while maintaining reference

// Template structure
interface Template {
  id: string;  // UUID
  name: string;
  slug: string;
  category: string;
  blocks: TemplateBlock[];
}

interface TemplateBlock {
  id: string;
  name: string;
  type: string;
  component: string;
  props: Record<string, any>;
  sortOrder: number;
}

// When creating page from template:
pageBlocks = template.blocks.map(tb => ({
  templateBlockId: tb.id,  // Link to template
  name: tb.name,
  type: tb.type,
  component: tb.component,
  props: { ...tb.props },  // Clone props (can be overridden)
  sortOrder: tb.sortOrder
}));
```

---

## 🔧 Required Implementation Plan

### Phase 1: Core Type System Alignment (CRITICAL)

**File:** `app/utils/types/admin/page.types.ts`

```typescript
import type {
  PageConfig,
  PageMeta,
  PageType,
  PageCategory,
  CollectionMeta,
  BlockConfig,
  SEOMeta,
} from '#shared/types';

// Align with shared types
export interface PageFormData {
  // Identity
  id?: string; // UUID for edits
  name: string; // Add legacy page name
  title: string;
  slug: string;
  path: string; // Add URL path (can auto-generate from slug)

  // Type & Classification
  type: PageType; // Use enum: 'static' | 'collection-list' | 'collection-detail' | 'landing' | 'custom'
  pageCategory?: PageCategory; // Use enum

  // Template
  templateId?: string | null; // UUID string, not number
  layout?: string; // 'default' | 'full-width' | 'admin'

  // Status & Publishing
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: string;
  scheduledAt?: string;
  authorId?: string;

  // Collection-specific
  collectionType?: string; // For collection pages: 'blog', 'product'
  collectionItemId?: string;

  // Content
  blocks: BlockConfig[]; // Use proper BlockConfig structure

  // SEO - align with database structure
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string; // Comma-separated string
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;

  // Enhanced Meta
  meta?: PageMeta; // Add PageMeta structure

  // Settings (to be stored in JSONB or separate table)
  settings?: {
    isHomepage?: boolean;
    requireAuth?: boolean;
    allowComments?: boolean;
    showInMenu?: boolean;
    menuOrder?: number;
    parentPageId?: string;
    customCSS?: string;
    customJS?: string;
  };

  // Multi-language support
  translations?: {
    [languageCode: string]: {
      title: string;
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string;
    };
  };

  // Stats (read-only in form)
  viewCount?: number;
}

// Conversion functions
export function formDataToPageConfig(formData: PageFormData): PageConfig {
  return {
    id: formData.id,
    name: formData.name,
    path: formData.path || `/${formData.slug}`,
    title: formData.title,
    layout: formData.layout,
    blocks: formData.blocks,
    meta: {
      type: formData.type,
      category: formData.pageCategory,
      template: formData.templateId || undefined,
      collection: formData.collectionType
        ? {
            type: formData.collectionType,
            isDetail: formData.type === 'collection-detail',
            itemId: formData.collectionItemId,
          }
        : undefined,
    },
    seoMeta: {
      title: formData.metaTitle || formData.title,
      description: formData.metaDescription || '',
      ogImage: formData.ogImage,
      keywords: formData.metaKeywords?.split(',').map((k) => k.trim()),
      canonical: formData.canonicalUrl,
      noindex: formData.noindex,
      publishedDate: formData.publishedAt,
      author: formData.authorId,
    },
  };
}

export function pageConfigToFormData(config: PageConfig): PageFormData {
  // Reverse conversion
  return {
    id: config.id,
    name: config.name,
    title: config.title || '',
    slug: config.path.replace(/^\//, ''),
    path: config.path,
    type: config.meta.type,
    pageCategory: config.meta.category,
    templateId: config.meta.template,
    layout: config.layout,
    status: 'draft', // Determine from other sources
    blocks: config.blocks,
    metaTitle: config.seoMeta?.title,
    metaDescription: config.seoMeta?.description,
    metaKeywords: config.seoMeta?.keywords?.join(', '),
    ogImage: config.seoMeta?.ogImage,
    canonicalUrl: config.seoMeta?.canonical,
    noindex: config.seoMeta?.noindex,
  };
}
```

---

### Phase 2: Update Form Component

**File:** `app/pages/admin/pages/create.vue`

**Add Missing Fields:**

```vue
<!-- After slug field, add path field -->
<div class="field">
  <label for="path">URL Path</label>
  <InputText 
    id="path" 
    v-model="formData.path" 
    placeholder="/about-us"
    :disabled="true"
  />
  <small class="text-surface-500">
    Auto-generated from slug. Edit slug to change path.
  </small>
</div>

<!-- Update type field to use proper enums -->
<div class="field">
  <label for="type">Page Type <span class="text-red-500">*</span></label>
  <Select
    id="type"
    v-model="formData.type"
    :options="pageTypeOptions"
    optionLabel="label"
    optionValue="value"
    class="w-full"
  />
</div>

<!-- Add page category -->
<div class="field">
  <label for="category">Page Category</label>
  <Select
    id="category"
    v-model="formData.pageCategory"
    :options="pageCategoryOptions"
    optionLabel="label"
    optionValue="value"
    class="w-full"
  />
</div>

<!-- Add layout selector -->
<div class="field">
  <label for="layout">Layout</label>
  <Select
    id="layout"
    v-model="formData.layout"
    :options="layoutOptions"
    optionLabel="label"
    optionValue="value"
    class="w-full"
  />
</div>

<!-- Add collection settings (conditional) -->
<Card v-if="isCollectionPage">
  <template #title>Collection Settings</template>
  <template #content>
    <div class="field">
      <label for="collectionType">Collection Type</label>
      <Select
        id="collectionType"
        v-model="formData.collectionType"
        :options="collectionTypeOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full"
      />
    </div>
    
    <div class="field" v-if="formData.type === 'collection-detail'">
      <label for="collectionItemId">Collection Item</label>
      <Select
        id="collectionItemId"
        v-model="formData.collectionItemId"
        :options="collectionItems"
        optionLabel="title"
        optionValue="id"
        class="w-full"
      />
    </div>
  </template>
</Card>

<!-- Add author field -->
<div class="field">
  <label for="author">Author</label>
  <Select
    id="author"
    v-model="formData.authorId"
    :options="authors"
    optionLabel="name"
    optionValue="id"
    class="w-full"
  />
</div>

<!-- Add published date -->
<div class="field" v-if="formData.status === 'published'">
  <label for="publishedAt">Published Date</label>
  <DatePicker
    id="publishedAt"
    v-model="formData.publishedAt"
    showTime
    class="w-full"
  />
</div>
```

**Add Language Tabs:**

```vue
<Card>
  <template #title>Translations</template>
  <template #content>
    <TabView>
      <TabPanel 
        v-for="lang in availableLanguages" 
        :key="lang.code"
        :header="lang.name"
      >
        <div class="space-y-4">
          <div class="field">
            <label>Title ({{ lang.code }})</label>
            <InputText
              v-model="formData.translations[lang.code].title"
              class="w-full"
            />
          </div>
          
          <div class="field">
            <label>Meta Title ({{ lang.code }})</label>
            <InputText
              v-model="formData.translations[lang.code].metaTitle"
              class="w-full"
            />
          </div>
          
          <div class="field">
            <label>Meta Description ({{ lang.code }})</label>
            <Textarea
              v-model="formData.translations[lang.code].metaDescription"
              rows="3"
              class="w-full"
            />
          </div>
        </div>
      </TabPanel>
    </TabView>
  </template>
</Card>
```

**Update Script:**

```typescript
<script setup lang="ts">
import type { PageFormData } from '~/utils/types/admin/page.types';
import type { PageType, PageCategory } from '#shared/types';

const formData = ref<PageFormData>({
  name: '',
  title: '',
  slug: '',
  path: '',
  type: 'static',
  status: 'draft',
  blocks: [],
  translations: {},
  settings: {},
});

// Watch slug to auto-generate path
watch(() => formData.value.slug, (newSlug) => {
  formData.value.path = `/${newSlug}`;
});

// Page type options from enum
const pageTypeOptions = [
  { label: 'Static Page', value: 'static' },
  { label: 'Collection List', value: 'collection-list' },
  { label: 'Collection Detail', value: 'collection-detail' },
  { label: 'Landing Page', value: 'landing' },
  { label: 'Custom', value: 'custom' },
];

const pageCategoryOptions = [
  { label: 'Content', value: 'content' },
  { label: 'Commerce', value: 'commerce' },
  { label: 'Portfolio', value: 'portfolio' },
  { label: 'Community', value: 'community' },
  { label: 'Utility', value: 'utility' },
];

const layoutOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Full Width', value: 'full-width' },
  { label: 'Admin', value: 'admin' },
];

// Fetch available languages from backend
const availableLanguages = ref([
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Indonesia' },
]);

// Initialize translations for each language
onMounted(() => {
  availableLanguages.value.forEach(lang => {
    if (!formData.value.translations[lang.code]) {
      formData.value.translations[lang.code] = {
        title: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
      };
    }
  });
});

// Check if current type is collection-related
const isCollectionPage = computed(() => {
  return ['collection-list', 'collection-detail'].includes(formData.value.type);
});

// Fetch collection types and items
const collectionTypeOptions = ref([]);
const collectionItems = ref([]);

watch(() => formData.value.collectionType, async (newType) => {
  if (newType && formData.value.type === 'collection-detail') {
    // Fetch items for this collection type
    collectionItems.value = await $fetch(`/api/collections/${newType}/items`);
  }
});
</script>
```

---

### Phase 3: Update SEO Fields Component

**File:** `app/components/admin/pages/PageSEOFields.vue`

```vue
<script setup lang="ts">
// Update to use metaKeywords as string instead of array
const seoData = defineModel<{
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string; // Changed from string[]
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean; // Changed from noIndex
}>({ required: true });

// Convert comma-separated string to array for Chips display
const keywordsArray = computed({
  get: () =>
    seoData.value.metaKeywords
      ?.split(',')
      .map((k) => k.trim())
      .filter(Boolean) || [],
  set: (val: string[]) => {
    seoData.value.metaKeywords = val.join(', ');
  },
});
</script>

<template>
  <Card>
    <template #title>SEO Settings</template>
    <template #content>
      <!-- ... existing fields -->

      <!-- Update keywords field -->
      <div class="field">
        <label for="keywords">Keywords</label>
        <Chips
          v-model="keywordsArray"
          separator=","
          class="w-full"
          placeholder="Enter keywords, separated by comma"
        />
      </div>

      <!-- Update noindex checkbox -->
      <div class="field">
        <Checkbox inputId="noindex" v-model="seoData.noindex" :binary="true" />
        <label for="noindex" class="ml-2">No Index</label>
      </div>
    </template>
  </Card>
</template>
```

---

### Phase 4: Update Composable

**File:** `app/composables/admin/usePageForm.ts`

```typescript
import type { PageFormData } from '~/utils/types/admin/page.types';
import { formDataToPageConfig } from '~/utils/types/admin/page.types';

export function usePageForm() {
  const savePage = async (formData: PageFormData, isDraft: boolean) => {
    try {
      // Convert form data to PageConfig format
      const pageConfig = formDataToPageConfig(formData);

      // Prepare database payload
      const payload = {
        // Page entity fields
        id: formData.id,
        slug: formData.slug,
        templateId: formData.templateId,
        title: formData.title,
        status: isDraft ? 'draft' : formData.status,
        pageType: formData.type,
        pageCategory: formData.pageCategory,
        collectionType: formData.collectionType,
        collectionItemId: formData.collectionItemId,

        // SEO fields (direct columns)
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
        ogImage: formData.ogImage,
        canonicalUrl: formData.canonicalUrl,
        noindex: formData.noindex || false,

        // Publishing
        publishedAt:
          formData.status === 'published'
            ? formData.publishedAt || new Date().toISOString()
            : null,
        scheduledAt:
          formData.status === 'scheduled' ? formData.scheduledAt : null,
        authorId: formData.authorId,

        // Blocks (will be saved as separate page_blocks rows)
        blocks: formData.blocks.map((block, index) => ({
          name: block.name,
          type: block.type,
          component: block.component || block.components?.[0]?.component,
          props: block.props || {},
          sortOrder: index,
        })),

        // Translations (will be saved as separate page_translations rows)
        translations: Object.entries(formData.translations || {}).map(
          ([languageCode, trans]) => ({
            languageCode,
            title: trans.title,
            metaTitle: trans.metaTitle,
            metaDescription: trans.metaDescription,
            metaKeywords: trans.metaKeywords,
          }),
        ),

        // Settings (stored as JSONB)
        settings: formData.settings,
      };

      // Call backend API
      const url = formData.id
        ? `/api/cms/pages/${formData.id}`
        : '/api/cms/pages';

      const method = formData.id ? 'PUT' : 'POST';

      const result = await $fetch(url, {
        method,
        body: payload,
      });

      return { success: true, data: result };
    } catch (error: any) {
      console.error('Save page error:', error);
      return {
        success: false,
        error: error.message || 'Failed to save page',
      };
    }
  };

  return {
    savePage,
    // ... other methods
  };
}
```

---

### Phase 5: Backend API Adjustments

**The backend needs to handle:**

1. **Page Settings Storage**
   - Add `settings` JSONB column to `pages` table, OR
   - Create separate `page_settings` table

2. **Block sortOrder**
   - Ensure frontend sends `sortOrder` for each block
   - Backend saves as `sortOrder` column in `page_blocks`

3. **Translation Handling**
   - Backend receives `translations` array
   - Creates/updates rows in `page_translations` table

4. **Template Integration**
   - When `templateId` is provided, fetch template blocks
   - Set `templateBlockId` on page blocks if they come from template

---

## 📝 Implementation Checklist

### Immediate (Critical)

- [ ] Update `page.types.ts` to match `PageConfig` and database schema
- [ ] Add missing fields: `name`, `path`, `layout`, `pageCategory`
- [ ] Change `templateId` from `number` to `string` (UUID)
- [ ] Add `PageMeta` and `CollectionMeta` structures
- [ ] Fix SEO structure: `metaKeywords` as string, `noindex` lowercase
- [ ] Add `authorId`, `publishedAt`, `viewCount`

### High Priority

- [ ] Add multi-language translation support with language tabs
- [ ] Add collection-specific fields (type, itemId) with conditional UI
- [ ] Update blocks to include `sortOrder` and `templateBlockId`
- [ ] Add conversion functions: `formDataToPageConfig`, `pageConfigToFormData`
- [ ] Update `usePageForm` composable to send correct API payload

### Medium Priority

- [ ] Implement template selection with block pre-population
- [ ] Add author selection dropdown (fetch from `/api/users`)
- [ ] Add layout selector
- [ ] Fetch and display collection types and items
- [ ] Add block sortOrder drag-and-drop UI

### Backend Coordination Required

- [ ] Confirm `settings` storage strategy (JSONB vs separate table)
- [ ] Verify API endpoints accept new payload structure
- [ ] Ensure translation rows are created/updated correctly
- [ ] Test template block inheritance and overrides

---

## 🎯 Recommended Next Steps

### Step 1: Align Type System (This Week)

Update all type definitions to match the actual database schema and `PageConfig` structure. This is foundational work that everything else depends on.

### Step 2: Update Form UI (Next Week)

Add all missing fields to the create page UI with proper validation and conditional rendering.

### Step 3: Add Multi-Language Support (Week 3)

Implement translation tabs and ensure content can be entered for each language.

### Step 4: Backend Integration Testing (Week 4)

Test full round-trip: create page → save to backend → fetch page → edit → save again.

### Step 5: Template Integration (Week 5)

Implement proper template selection and block inheritance from templates.

---

## 💡 Key Architectural Decisions Needed

### Decision 1: Page Settings Storage

**Options:**

- A. Add `settings` JSONB column to `pages` table (simple, flexible)
- B. Create `page_settings` entity (normalized, type-safe)
- C. Store each setting as separate column (verbose, rigid)

**Recommendation:** Option A (JSONB) for flexibility

### Decision 2: Block Management

**Options:**

- A. Continue with array in form, backend creates separate rows
- B. Manage blocks as entities from the start with IDs
- C. Hybrid: array in form, track IDs after save

**Recommendation:** Option A (current approach is fine)

### Decision 3: Translation Workflow

**Options:**

- A. All languages in one form with tabs
- B. Separate edit per language
- C. Primary language required, others optional

**Recommendation:** Option A with C (primary required, tabs for all)

---

## 📚 References

- **Database Schema:** `CMS_DATABASE_STRUCTURE.md` (lines 678-880)
- **PageConfig Interface:** `shared/types.ts` (lines 1-100)
- **Dynamic CMS Guide:** `DYNAMIC_CMS_GUIDE.md` (lines 1-530)
- **Server API Example:** `server/api/pages/[...slug].ts` (lines 1-1067)
- **Current Form:** `app/pages/admin/pages/create.vue` (lines 1-801)

---

## Conclusion

The current admin page create structure is **functionally working** but **structurally incompatible** with the actual CMS requirements. A comprehensive refactor is needed to:

1. Align type definitions with `PageConfig` and database schema
2. Add missing critical fields (meta, collection settings, translations)
3. Fix data type mismatches (UUID strings, enums, SEO structure)
4. Implement multi-language support
5. Properly integrate with templates

**Estimated Effort:** 3-4 weeks for complete alignment

**Priority:** HIGH - Current structure cannot successfully save to backend without these changes.

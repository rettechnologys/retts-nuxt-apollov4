# Dynamic CMS Template System

## Overview

This system fetches page content and templates from an **existing NestJS backend CMS**. All content is managed by admins through the Vue 3 admin panel, which communicates with the backend. This Nuxt 4 frontend acts as a public-facing presentation layer that renders the content dynamically.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CMS ECOSYSTEM                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐         ┌──────────────┐         ┌─────────────┐ │
│  │ Vue 3 Admin  │────────▶│   NestJS     │◀────────│   Nuxt 4    │ │
│  │    Panel     │  ✅ Done │   Backend    │  🆕 NEW │   Public    │ │
│  │  (Manages)   │         │  (API/Data)  │         │   Website   │ │
│  └──────────────┘         └──────────────┘         └─────────────┘ │
│        │                         │                         │         │
│        │ Create/Edit             │ Store/Serve            │ Fetch   │
│        │ Content                 │ Data                   │ Render  │
│        ▼                         ▼                         ▼         │
│  [Theme Settings]          [PostgreSQL]              [End Users]    │
│  [Menu Config]             [TypeORM]                 [SEO/SSR]      │
│  [Page Templates]          [Entities]                [Performance]  │
│  [Collections]                                                       │
│  [Media Library]                                                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Admin Panel Structure

The Vue 3 admin panel provides a comprehensive interface for managing all CMS content:

```
📊 CMS Dashboard
   └── Overview, quick stats, recent activity

⚙️ Global Settings
   ├── 🎨 Theme/Layout
   ├── 📝 Typography (Optional)
   ├── 🔝 Menus Configuration
   ├── 🔽 Footer Configuration
   └── 🔍 SEO Defaults

📋 Templates
   ├── List Templates
   ├── ➕ Create Template
   │   └── Visual Block Builder
   └── 👁️ Preview Template

📄 Pages
   ├── All Pages (table with search/filter)
   ├── ➕ Create New Page
   │   ├── Select Template
   │   ├── Configure Content
   │   ├── Collection Settings
   │   └── SEO Settings
   ├── ✏️ Edit Page
   └── 🗑️ Trash

📚 Collections (Content Management)
   ├── 📝 Blog Posts
   ├── 🛍️ Products
   ├── 💼 Projects
   └── ➕ Custom Collections

🖼️ Media Library
   └── Upload & manage images/files
```

## How It Works

### 1. **Content Management Flow**

```
Admin creates content in Vue 3 Admin Panel
    ↓
    [Global Settings Tab]
    - Configure theme colors, fonts
    - Set up navigation menus (with translations via sysMenuLangs)
    - Configure footer structure
    - Set SEO defaults
    ↓
    [Templates Tab]
    - Create reusable page templates
    - Define block structure using Visual Block Builder
    - Set default props for components
    ↓
    [Pages Tab]
    - Create new page
    - Select template
    - Fill in content (with translations for each language)
    - Configure SEO metadata
    - Set published status
    ↓
    [Collections Tab]
    - Add blog posts, products, projects
    - Configure custom fields
    - Set categories and tags
    ↓
NestJS Backend stores all data in PostgreSQL
    ↓
Nuxt Public Site fetches and displays content
```

### 2. **Page Rendering Flow**

```
User visits: /articles/my-post
    ↓
Nuxt catches route in pages/[...slugs].vue
    ↓
Fetch page config from NestJS Backend
    → GET /api/pages/public/articles/my-post?lang=en
    ← Returns: PageConfig with blocks, translations, SEO metadata
    ↓
Check: Is this a collection detail? (pattern: collection/slug)
    ↓
If collection: Fetch collection item data
    → GET /api/collections/blog/public/my-post?lang=en
    ← Returns: { title: "My Post", content: "...", author: {...} }
    ↓
Fetch template configuration
    → GET /api/templates/blog-detail-template
    ← Returns: Template with {{item.field}} variables
    ↓
Server builds complete PageConfig:
    - Replace {{item.field}} with actual data
    - Apply translations based on ?lang parameter
    - Inject SEO metadata
    ↓
Return PageConfig to Nuxt
    ↓
DynamicRenderer.vue processes blocks
    ↓
Component registry maps block types to Vue components
    ↓
Render page with proper components and data
```

### 3. **Internationalization (i18n)**

The system uses a **hybrid approach** for translations:

**Static UI Translations** (Nuxt i18n)

```vue
<!-- Button labels, form fields, navigation -->
<button>{{ $t('common.submit') }}</button>
<p>{{ $t('home.welcome') }}</p>
```

**Dynamic Content Translations** (Backend sysMenuLangs)

```vue
<script setup>
const { getLocalizedText } = useSmartI18n();

// For menus with sysMenuLangs structure
const menuTitle = getLocalizedText(menu.sysMenuLangs, 'title');
</script>

<template>
  <h1>{{ menuTitle }}</h1>
</template>
```

**Language Switching**

- Uses `LanguageSwitcher.vue` component
- Fetches available languages from `useAppGCStore().getLangs`
- Changes route: `domain.com/about` → `domain.com/id/about`
- Refreshes content with new language parameter

See `I18N_HYBRID_GUIDE.md` and `LANGUAGE_SWITCHER_INTEGRATION.md` for details.

### 4. **Template Syntax**

Templates use `{{item.field}}` syntax for dynamic content:

```json
{
  "blocks": [
    {
      "name": "hero",
      "type": "predefined",
      "component": "HeroWidget",
      "props": {
        "title": "{{item.title}}",
        "subtitle": "{{item.excerpt}}",
        "backgroundImage": "{{item.coverImage}}"
      }
    },
    {
      "name": "metadata",
      "type": "custom",
      "components": [
        {
          "name": "meta",
          "component": "Metadata",
          "props": {
            "author": "{{item.author}}",
            "date": "{{item.publishedAt}}",
            "duration": "{{item.readTime}}",
            "tags": "{{item.tags}}"
          }
        }
      ]
    },
    {
      "name": "content",
      "type": "custom",
      "components": [
        {
          "name": "body",
          "component": "Content",
          "props": {
            "content": "{{item.content}}",
            "format": "html",
            "prose": true
          }
        }
      ]
    }
  ]
}
```

### 5. **Generic Components**

All detail pages use generic, reusable components:

#### **Metadata** (`components/fields/Metadata.vue`)

Display author, date, reading time, tags, categories

```vue
<Metadata
  :author="{ name: 'John Doe', avatar: '...' }"
  :date="publishedAt"
  :duration="5"
  duration-unit="min read"
  :tags="['vue', 'nuxt']"
  :categories="['Tech']"
/>
```

#### **Content** (`components/fields/Content.vue`)

Display HTML, markdown, or plain text content

```vue
<Content :content="htmlContent" format="html" :prose="true" max-width="4xl" />
```

#### **MediaGallery** (`components/fields/MediaGallery.vue`)

Display single image, grid, or carousel

```vue
<MediaGallery
  :images="imageArray"
  variant="carousel"
  aspect-ratio="square"
  :show-indicators="true"
/>
```

#### **InfoList** (`components/fields/InfoList.vue`)

Display key-value pairs in list or grid

```vue
<InfoList
  title="Details"
  :items="[
    { label: 'Price', value: '$99', icon: 'mdi:currency-usd' },
    { label: 'SKU', value: 'PROD-001', icon: 'mdi:barcode' },
  ]"
  layout="grid"
  :columns="2"
/>
```

#### **ShareButtons** (`components/fields/ShareButtons.vue`)

Social sharing buttons

```vue
<ShareButtons
  :title="pageTitle"
  :platforms="['twitter', 'facebook', 'linkedin']"
/>
```

## Database Schema

### Collections Configuration

```typescript
{
  _id: ObjectId,
  slug: 'articles',        // URL segment
  type: 'blog',            // Collection type
  name: 'Articles',        // Display name
  tableName: 'blogPosts',  // Database table/collection
  detailTemplateId: 'blog-detail-template',
  listTemplateId: 'blog-list-template'
}
```

### Page Templates

```typescript
{
  _id: 'blog-detail-template',
  name: 'Blog Detail Template',
  title: '{{item.title}}',
  layout: 'default',
  meta: {
    title: '{{item.title}} | Blog',
    description: '{{item.excerpt}}',
    ogImage: '{{item.coverImage}}'
  },
  blocks: [
    // Block configurations with {{item.field}} variables
  ]
}
```

### Collection Items (Blog Posts)

```typescript
{
  _id: ObjectId,
  slug: 'my-post',
  title: 'My Blog Post',
  excerpt: 'Short description',
  content: '<p>Full content...</p>',
  coverImage: 'https://...',
  author: {
    name: 'John Doe',
    avatar: 'https://...'
  },
  publishedAt: '2024-01-01',
  readTime: 5,
  tags: ['vue', 'nuxt'],
  categories: ['Technology']
}
```

## API Endpoints

### CMS Endpoints (Admin-facing)

```
POST   /api/cms/pages                    - Create page
GET    /api/cms/pages/:slug              - Get page
PUT    /api/cms/pages/:slug              - Update page
DELETE /api/cms/pages/:slug              - Delete page

POST   /api/cms/templates                - Create template
GET    /api/cms/templates/:id            - Get template
PUT    /api/cms/templates/:id            - Update template
DELETE /api/cms/templates/:id            - Delete template

POST   /api/cms/collections/:type        - Create collection item
GET    /api/cms/collections/:type/:slug  - Get collection item
PUT    /api/cms/collections/:type/:slug  - Update collection item
DELETE /api/cms/collections/:type/:slug  - Delete collection item

GET    /api/cms/collections/:slug/config - Get collection configuration
```

### Public Endpoints (Frontend-facing)

```
GET /api/pages/[...slug]                 - Get page configuration
```

## Admin Panel Integration

### Creating a Template (Admin UI)

```typescript
const template = {
  name: 'Blog Detail Template',
  blocks: [
    {
      name: 'hero',
      type: 'predefined',
      component: 'HeroWidget',
      props: {
        // Admin selects field mappings via dropdown
        title: '{{item.title}}',
        subtitle: '{{item.excerpt}}',
      },
    },
    {
      name: 'content',
      type: 'custom',
      components: [
        {
          component: 'Metadata',
          props: {
            // Admin drags fields to map them
            author: '{{item.author}}',
            date: '{{item.publishedAt}}',
          },
        },
      ],
    },
  ],
};

await $fetch('/api/cms/templates', {
  method: 'POST',
  body: template,
});
```

### Assigning Template to Collection

```typescript
const collectionConfig = {
  slug: 'articles',
  type: 'blog',
  detailTemplateId: 'blog-detail-template', // Select from dropdown
  listTemplateId: 'blog-list-template',
};

await $fetch('/api/cms/collections/articles/config', {
  method: 'PUT',
  body: collectionConfig,
});
```

## Example: Complete Flow

### Creating and Publishing Content

1. **Admin opens Vue 3 Admin Panel**
   - Logs in with existing authentication

2. **Admin configures global settings**
   - Sets theme colors, fonts
   - Configures navigation menus with translations (sysMenuLangs)
   - Sets up footer structure
   - Defines SEO defaults

3. **Admin creates a blog post template**
   - Opens Templates section
   - Uses Visual Block Builder
   - Adds blocks: Hero, Metadata, Content, ShareButtons
   - Maps template variables: `{{item.title}}`, `{{item.author}}`, `{{item.content}}`
   - Saves template to backend

4. **Admin creates a blog post**
   - Opens Collections → Blog Posts
   - Clicks "Create New"
   - Fills in content for each language (en, id)
   - Adds SEO metadata
   - Sets published status
   - Saves to backend

5. **User visits public site**
   - Navigates to `/articles/my-first-post` or `/id/articles/my-first-post`
   - Nuxt fetches page config with language parameter
   - DynamicRenderer displays content in correct language

### Language Switching

1. **User clicks language switcher**
   - Dropdown shows available languages from backend
2. **User selects "Indonesia"**
   - Route changes: `/about` → `/id/about`
   - All menus update using `getLocalizedText(sysMenuLangs)`
   - Page content fetches with `?lang=id` parameter
   - UI elements use `$t('key')` from locale files

## Benefits

✅ **Separation of concerns** - Admin panel, backend, and public site are independent
✅ **Backend/Admin already exist** - Only need to build Nuxt integration
✅ **No hardcoded content** - Everything managed through admin panel
✅ **Multi-language support** - Built-in i18n with hybrid approach
✅ **Reusable templates** - Same template for all similar pages
✅ **Type-safe** - TypeScript throughout the stack
✅ **SEO-friendly** - SSR, meta tags, structured data
✅ **Performance** - Caching, lazy loading, optimized images

## Current State

### ✅ Already Complete

- NestJS backend running with TypeORM + PostgreSQL
- Vue 3 admin panel integrated with backend
- User authentication system
- Database entities (Pages, Templates, Collections, GlobalConfig)
- Translation system (sysMenuLangs structure)

### 🆕 Currently Building

- Nuxt 4 public website
- i18n integration with @nuxtjs/i18n
- Language switcher component
- Dynamic page rendering
- Connection to existing backend APIs

### 📋 Next Steps

See `IMPLEMENTATION_ROADMAP.md` for detailed tasks:

1. **Week 1**: Document backend APIs, connect Nuxt to backend
2. **Week 2**: Complete i18n setup, dynamic page rendering
3. **Week 3-4**: Global settings, navigation, collections
4. **Week 5-6**: Search, analytics, SEO optimization
5. **Week 7-8**: Performance, security, deployment

## Related Documentation

- `ADMIN_INTEGRATION_GUIDE.md` - Complete architecture explanation
- `I18N_HYBRID_GUIDE.md` - Internationalization approach
- `LANGUAGE_SWITCHER_INTEGRATION.md` - Language switcher usage
- `IMPLEMENTATION_ROADMAP.md` - Task breakdown and timeline
- `BASE_LAYOUT_GUIDE.md` - Layout system documentation
- `BLOCK_MANAGEMENT_GUIDE.md` - Block-based rendering system

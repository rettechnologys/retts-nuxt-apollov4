# Arsitektur Dynamic Page - Dokumentasi

## Gambaran Umum

Sistem Dynamic Page adalah arsitektur CMS yang memungkinkan rendering halaman secara dinamis berdasarkan konfigurasi JSON. Semua struktur halaman dikontrol oleh admin melalui CMS eksternal, tanpa perlu hardcoding konten di kode.

## Konsep Dasar

### Alur Kerja Sistem

```
User mengunjungi URL
    ↓
[...slugs].vue menangkap route
    ↓
Fetch PageConfig dari API
    ↓
DynamicRenderer memproses konfigurasi
    ↓
DynamicBlockRenderer render blok-blok
    ↓
DynamicComponentRenderer render komponen
    ↓
Halaman ditampilkan
```

## Struktur Data

### 1. PageConfig

Interface utama yang mendefinisikan struktur halaman:

```typescript
interface PageConfig {
  id?: string; // ID unik halaman
  name: string; // Nama halaman
  path: string; // URL path
  title?: string; // Judul halaman
  layout?: string; // Layout wrapper (default, full-width)

  meta: PageMeta; // Metadata halaman
  seoMeta?: SEOMeta; // Metadata SEO
  blocks: BlockConfig[]; // Array blok konten
}
```

### 2. PageMeta - Metadata Halaman

Metadata eksplisit untuk mengidentifikasi tipe halaman:

```typescript
interface PageMeta {
  type: PageType; // Tipe halaman eksplisit
  category?: PageCategory; // Kategori halaman (opsional)
  template?: string; // Nama template (opsional)
  collection?: CollectionMeta; // Data collection-specific
}
```

#### Tipe Halaman (PageType)

```typescript
type PageType =
  | 'static' // Halaman biasa (tentang, kontak)
  | 'collection-list' // Halaman daftar item (listing)
  | 'collection-detail' // Halaman detail item tunggal
  | 'landing' // Halaman landing marketing
  | 'custom'; // Template custom
```

#### Kategori Halaman (PageCategory)

```typescript
type PageCategory =
  | 'content' // Blog, artikel
  | 'commerce' // Produk, layanan
  | 'portfolio' // Project, portfolio
  | 'community' // Forum, member
  | 'utility'; // Search, 404, dll
```

### 3. CollectionMeta - Metadata Collection

Data khusus untuk halaman listing dan detail:

```typescript
interface CollectionMeta {
  type: string; // 'blog', 'product', 'project'
  isDetail: boolean; // true untuk halaman detail
  itemId?: string | number; // ID item spesifik
  itemSlug?: string; // Slug item spesifik
  parentPage?: string; // Link kembali ke listing

  // Untuk halaman listing
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;

  // Untuk halaman detail - navigasi antar item
  previousItem?: {
    slug: string;
    title: string;
  };
  nextItem?: {
    slug: string;
    title: string;
  };
}
```

### 4. SEOMeta - Metadata SEO

Metadata SEO yang ditingkatkan:

```typescript
interface SEOMeta {
  title: string; // Meta title
  description: string; // Meta description
  ogImage?: string; // Open Graph image
  keywords?: string[]; // Meta keywords
  canonical?: string; // Canonical URL
  noindex?: boolean; // Noindex flag

  // Untuk halaman detail
  author?: string; // Nama penulis
  publishedDate?: string; // Tanggal publikasi
  modifiedDate?: string; // Tanggal modifikasi terakhir
  type?: 'website' | 'article' | 'product'; // Schema type
}
```

### 5. BlockConfig - Konfigurasi Blok

```typescript
interface BlockConfig {
  name: string; // Nama blok
  type?: 'predefined' | 'custom'; // Tipe blok
  component?: string; // Nama komponen (untuk predefined)
  components?: ComponentConfig[]; // Array komponen (untuk custom)
  props?: Record<string, any>; // Props untuk blok
}
```

### 6. ComponentConfig - Konfigurasi Komponen

```typescript
interface ComponentConfig {
  name: string; // Nama komponen
  component: string; // Nama komponen Vue
  props?: Record<string, any>; // Props untuk komponen
  content?: ComponentContent; // Konten komponen
  components?: ComponentConfig[]; // Nested components
}
```

## Contoh Implementasi

### 1. Halaman Landing (Home)

```typescript
{
  id: "home",
  name: "home",
  path: "/",
  meta: {
    type: "landing",
    category: "utility"
  },
  seoMeta: {
    title: "Home - Welcome to Our Platform",
    description: "Transform your workflow with our innovative platform.",
    ogImage: "https://example.com/og-image.png",
    type: "website"
  },
  blocks: [
    {
      name: "HeroWidget_2",
      type: "predefined",
      component: "HeroWidget_2",
      props: {
        title: "Selamat Datang",
        subtitle: "Platform terbaik untuk Anda",
        primaryButtonLabel: "Mulai Sekarang",
        primaryButtonLink: "/signup"
      }
    }
  ]
}
```

### 2. Halaman Listing (Blog)

```typescript
{
  id: "articles-blog",
  name: "blog",
  path: "/articles/blog",
  meta: {
    type: "collection-list",
    category: "content",
    collection: {
      type: "blog",
      isDetail: false,
      totalItems: 50,
      currentPage: 1,
      itemsPerPage: 12
    }
  },
  seoMeta: {
    title: "Blog - Insights & Tutorials",
    description: "Read our latest blog posts.",
    type: "website"
  },
  blocks: [
    {
      name: "blog-listing",
      type: "predefined",
      component: "ContentListingBlock",
      props: {
        dataSource: {
          type: "api",
          endpoint: "/api/blog/posts"
        },
        fieldMapping: {
          title: "post_title",
          excerpt: "post_excerpt",
          image: "featured_image",
          slug: "post_slug"
        }
      }
    }
  ]
}
```

### 3. Halaman Detail (Artikel)

```typescript
{
  id: "article-getting-started",
  name: "getting-started",
  path: "/articles/getting-started",
  meta: {
    type: "collection-detail",
    category: "content",
    collection: {
      type: "blog",
      isDetail: true,
      itemSlug: "getting-started",
      parentPage: "/articles/blog",
      previousItem: {
        slug: "previous-post",
        title: "Previous Post Title"
      },
      nextItem: {
        slug: "next-post",
        title: "Next Post Title"
      }
    }
  },
  seoMeta: {
    title: "Getting Started with Our Platform - Blog",
    description: "A comprehensive guide to help you get started.",
    ogImage: "/demo/images/blog/blog-1.png",
    author: "John Doe",
    publishedDate: "2024-03-15",
    type: "article"
  },
  blocks: [
    {
      name: "article-hero",
      type: "custom",
      components: [
        {
          name: "hero-container",
          component: "BaseLayout",
          props: { /* ... */ },
          components: [
            {
              name: "article-title",
              component: "H1_TextField",
              props: {
                text: "Getting Started with Our Platform",
                class: "text-5xl font-bold"
              }
            },
            {
              name: "article-metadata",
              component: "Metadata",
              props: {
                items: [
                  { label: "Author", value: "John Doe", icon: "pi pi-user" },
                  { label: "Published", value: "2024-03-15", icon: "pi pi-calendar" }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## Cara Kerja Komponen

### 1. DynamicRenderer.vue

Komponen root yang menerima PageConfig dan mengatur rendering:

**Fungsi:**

- Mengatur SEO meta tags
- Menambahkan structured data (JSON-LD)
- Mendeteksi tipe halaman
- Menambahkan CSS class berdasarkan tipe
- Loop through blocks dan pass ke DynamicBlockRenderer

**Fitur:**

```vue
<template>
  <div
    class="dynamic-page-renderer"
    :class="pageTypeClass"
    :data-page-type="pageConfig.meta.type"
  >
    <DynamicBlockRenderer
      v-for="(block, index) in pageConfig.blocks"
      :key="`${block.name}-${index}`"
      :block-config="block"
      :page-meta="pageConfig.meta"
    />
  </div>
</template>
```

**Page Type Classes:**

- `page-detail` - Untuk halaman detail
- `page-listing` - Untuk halaman listing
- `page-static` - Untuk halaman statis
- `page-landing` - Untuk halaman landing

### 2. DynamicBlockRenderer.vue

Render blok individual (predefined atau custom):

**Tanggung Jawab:**

- Membedakan predefined widget vs custom block
- Resolve komponen dari widget registry
- Render komponen dengan props yang sesuai
- Apply layout classes

**Widget Registry:**

```typescript
const widgetMap = {
  HeroWidget: () => import('@/components/landing/HeroWidget.vue'),
  FeaturesWidget: () => import('@/components/landing/FeaturesWidget.vue'),
  ContentListingBlock: () =>
    import('@/components/blocks/ContentListingBlock.vue'),
  // ... dll
};
```

### 3. DynamicComponentRenderer.vue

Render komponen individual dalam custom block:

**Tanggung Jawab:**

- Resolve komponen dari nama string
- Pass props dinamis
- Handle nested components

## Perbedaan Halaman Listing vs Detail

### Halaman Listing (Collection List)

**Karakteristik:**

- Menampilkan daftar item (blog, produk, dll)
- Memiliki filter, search, pagination
- Metadata: `type: 'collection-list'`, `isDetail: false`
- Komponen utama: `ContentListingBlock`

**Contoh URL:**

- `/articles/blog` - Daftar artikel blog
- `/products` - Daftar produk
- `/projects` - Daftar portfolio

**Metadata:**

```typescript
meta: {
  type: "collection-list",
  collection: {
    type: "blog",
    isDetail: false,
    totalItems: 50,
    currentPage: 1,
    itemsPerPage: 12
  }
}
```

### Halaman Detail (Collection Detail)

**Karakteristik:**

- Menampilkan satu item secara detail
- Memiliki konten lengkap, metadata, social share
- Metadata: `type: 'collection-detail'`, `isDetail: true`
- Link kembali ke halaman listing (parent)
- Navigasi previous/next item

**Contoh URL:**

- `/articles/getting-started` - Detail artikel
- `/products/iphone-15` - Detail produk
- `/projects/my-portfolio` - Detail project

**Metadata:**

```typescript
meta: {
  type: "collection-detail",
  collection: {
    type: "blog",
    isDetail: true,
    itemSlug: "getting-started",
    parentPage: "/articles/blog",
    previousItem: { slug: "prev", title: "Previous" },
    nextItem: { slug: "next", title: "Next" }
  }
}
```

## Alur Request API

### 1. User mengunjungi halaman

```
GET /articles/blog
GET /articles/getting-started
```

### 2. [...slugs].vue menangkap route

```typescript
const slugsPath = computed(() => slugsArray.value.join('/') || 'home');
const { data: pageConfig } = await useFetch(`/api/pages/${slugsPath.value}`);
```

### 3. Server API memproses request

```typescript
// server/api/pages/[...slug].ts

export default defineEventHandler(async (event) => {
  const slugPath = getSlugPath(event);

  // 1. Cek static page
  const staticPage = await fetchStaticPage(slugPath);
  if (staticPage) return staticPage;

  // 2. Cek collection listing
  const listingPage = await tryFetchCollectionList(slugPath);
  if (listingPage) return listingPage;

  // 3. Cek collection detail (pattern: collection/slug)
  const detailPage = await tryFetchCollectionDetail(slugPath);
  if (detailPage) return detailPage;

  // 4. Fallback ke mock data
  const mockPage = getMockPage(slugPath);
  if (mockPage) return mockPage;

  // 5. Not found
  throw createError({ statusCode: 404 });
});
```

### 4. Prioritas Pencocokan

1. **Static Page** - Cek dulu apakah ada di daftar halaman statis
2. **Collection Listing** - Cek apakah URL adalah listing page
3. **Collection Detail** - Cek pattern `collection/item-slug`
4. **Mock Data** - Fallback untuk development
5. **404** - Halaman tidak ditemukan

## Pattern Matching untuk Collection Detail

### Regex Pattern

```typescript
const match = slugPath.match(/^([^/]+)\/([^/]+)$/);
// Matches: collection-slug/item-slug
// Example: articles/getting-started
//          ↓          ↓
//     collection   item-slug
```

### Contoh Pattern

| URL                         | Match? | Collection | Item Slug       |
| --------------------------- | ------ | ---------- | --------------- |
| `/articles/blog`            | ❌     | -          | -               |
| `/articles/getting-started` | ✅     | articles   | getting-started |
| `/products/iphone-15`       | ✅     | products   | iphone-15       |
| `/about`                    | ❌     | -          | -               |
| `/blog/category/tech`       | ❌     | -          | -               |

### Penanganan Khusus

Untuk mencegah `/articles/blog` (listing) terdeteksi sebagai detail page:

```typescript
function getMockPage(slugPath: string): PageConfig | null {
  const pages: Record<string, PageConfig> = {
    /* ... */
  };

  // 1. Cek static pages dulu
  if (pages[slugPath]) {
    return pages[slugPath];
  }

  // 2. Baru cek pattern detail
  const articleMatch = slugPath.match(/^articles\/([^/]+)$/);
  if (articleMatch) {
    const articleSlug = articleMatch[1];
    return getMockArticleDetailPage(articleSlug);
  }

  return null;
}
```

## Komponen Reusable

### 1. ContentListingBlock

Menampilkan daftar item dengan fitur lengkap:

**Props:**

```typescript
{
  dataSource: {
    type: 'api',              // 'api' | 'cms' | 'static'
    endpoint: '/api/blog/posts'
  },
  fieldMapping: {
    title: 'post_title',      // Mapping field dari API
    excerpt: 'post_excerpt',
    image: 'featured_image',
    slug: 'post_slug'
  },
  itemComponent: {            // Template untuk setiap item
    component: 'BaseLayout',
    props: { /* ... */ },
    components: [ /* ... */ ]
  },
  layout: 'grid',             // 'grid' | 'flex'
  columns: '3',
  gap: 'lg',
  pagination: {
    enabled: true,
    perPage: 12
  },
  filters: {
    enabled: true,
    fields: ['category']
  }
}
```

### 2. Metadata

Menampilkan metadata (author, date, dll):

```typescript
{
  component: "Metadata",
  props: {
    items: [
      { label: "Author", value: "John Doe", icon: "pi pi-user" },
      { label: "Published", value: "2024-03-15", icon: "pi pi-calendar" },
      { label: "Read Time", value: "5 min", icon: "pi pi-clock" }
    ],
    layout: "horizontal",     // 'horizontal' | 'vertical'
    separator: true
  }
}
```

### 3. Content

Render konten HTML/Markdown:

```typescript
{
  component: "Content",
  props: {
    content: "<h2>Title</h2><p>Content here...</p>",
    format: "html",           // 'html' | 'markdown' | 'text'
    class: "prose prose-lg"
  }
}
```

### 4. MediaGallery

Galeri gambar/video:

```typescript
{
  component: "MediaGallery",
  props: {
    images: [
      { src: "/image1.jpg", alt: "Image 1" },
      { src: "/image2.jpg", alt: "Image 2" }
    ],
    layout: "grid",           // 'grid' | 'carousel' | 'masonry'
    columns: 3
  }
}
```

### 5. ShareButtons

Tombol share sosial media:

```typescript
{
  component: "ShareButtons",
  props: {
    url: "https://example.com/article",
    title: "Article Title",
    platforms: ["twitter", "facebook", "linkedin", "email"],
    layout: "horizontal"
  }
}
```

## Best Practices

### 1. Penamaan Konsisten

```typescript
// ✅ Good
{
  name: "hero-section",
  component: "HeroWidget"
}

// ❌ Bad
{
  name: "hero_section_1",
  component: "Hero"
}
```

### 2. Gunakan Type yang Tepat

```typescript
// ✅ Good - Eksplisit
meta: {
  type: "collection-detail",
  category: "content"
}

// ❌ Bad - Implisit/tidak jelas
meta: {
  type: "custom"  // Tidak jelas apa jenis halamannya
}
```

### 3. Selalu Sertakan Parent Page

```typescript
// ✅ Good
collection: {
  type: "blog",
  isDetail: true,
  itemSlug: "my-post",
  parentPage: "/articles/blog"  // Link kembali ke listing
}

// ❌ Bad
collection: {
  type: "blog",
  isDetail: true,
  itemSlug: "my-post"
  // Tidak ada parent page - sulit navigasi
}
```

### 4. SEO Metadata Lengkap

```typescript
// ✅ Good
seoMeta: {
  title: "Getting Started - Blog",
  description: "Complete guide...",
  ogImage: "/image.jpg",
  author: "John Doe",
  publishedDate: "2024-03-15",
  type: "article"
}

// ❌ Bad
seoMeta: {
  title: "Page"  // Tidak deskriptif
}
```

## Perbandingan dengan CMS Lain

| Fitur             | Our System     | WordPress         | Contentful        | Strapi              |
| ----------------- | -------------- | ----------------- | ----------------- | ------------------- |
| Page Types        | ✅ Eksplisit   | ✅ Post Types     | ✅ Content Models | ✅ Collection Types |
| Dynamic Rendering | ✅ JSON-driven | ❌ Template files | ✅ JSON           | ✅ JSON             |
| Type Safety       | ✅ TypeScript  | ❌ PHP            | ⚠️ Partial        | ✅ TypeScript       |
| Collection Meta   | ✅ Built-in    | ⚠️ Custom fields  | ✅ Relations      | ✅ Relations        |
| SEO Schema        | ✅ Automatic   | ⚠️ Plugins        | ✅ Built-in       | ⚠️ Plugins          |

## Troubleshooting

### Halaman tidak ditemukan (404)

**Penyebab:**

1. Slug tidak ada di mock data
2. Pattern matching salah
3. Static page tidak terdaftar

**Solusi:**

```typescript
// Tambahkan ke mock data
const pages: Record<string, PageConfig> = {
  'your-slug': {
    /* config */
  },
};

// Atau periksa pattern matching
const match = slugPath.match(/^([^/]+)\/([^/]+)$/);
```

### Komponen tidak render

**Penyebab:**

1. Komponen tidak terdaftar di widget registry
2. Nama komponen salah (case-sensitive)
3. Props tidak sesuai

**Solusi:**

```typescript
// Tambahkan ke widgetMap di DynamicBlockRenderer
const widgetMap = {
  YourComponent: () => import('@/components/YourComponent.vue'),
};
```

### TypeScript error: Property 'meta' is missing

**Penyebab:**
PageConfig baru membutuhkan field `meta`

**Solusi:**

```typescript
// Tambahkan meta ke semua PageConfig
{
  name: "page-name",
  path: "/path",
  meta: {
    type: "static",
    category: "content"
  },
  blocks: [ /* ... */ ]
}
```

## Catatan

Arsitektur ini mengikuti **best practices dari industri** dan compatible dengan CMS enterprise seperti WordPress, Contentful, dan Strapi.

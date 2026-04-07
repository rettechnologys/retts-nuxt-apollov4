# Sistem Template CMS Dinamis

## Gambaran Umum

Sistem ini mengambil konten halaman dan template dari **backend NestJS CMS yang sudah ada**. Semua konten dikelola oleh admin melalui panel admin Vue 3, yang berkomunikasi dengan backend. Frontend Nuxt 4 ini bertindak sebagai lapisan presentasi publik yang merender konten secara dinamis.

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────────┐
│                          EKOSISTEM CMS                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐         ┌──────────────┐         ┌─────────────┐  │
│  │ Panel Admin  │────────▶│   Backend    │◀────────│   Nuxt 4    │  │
│  │   Vue 3      │         │  NestJS      │         │   Situs     │  │
│  │  (Kelola)    │         │  (API/Data)  │         │   Publik    │  │
│  └──────────────┘         └──────────────┘         └─────────────┘  │
│        │                         │                        │         │
│        │ Buat/Edit               │ Simpan/Sajikan         │ Ambil   │
│        │ Konten                  │ Data                   │ Render  │
│        ▼                         ▼                        ▼         │
│  [Pengaturan Tema]         [PostgreSQL]              [Pengguna]     │
│  [Konfigurasi Menu]        [TypeORM]                 [SEO/SSR]      │
│  [Template Halaman]        [Entities]                [Performa]     │
│  [Koleksi]                                                          │
│  [Perpustakaan Media]                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Pondasi Struktur

Struktur pondasi untuk CMS dinamis:

```
📊 Dashboard CMS
   └── Ringkasan, statistik cepat, aktivitas terkini

⚙️ Pengaturan Global
   ├── 🎨 Tema/Layout
   ├── 📝 Tipografi (Opsional)
   ├── 🔝 Konfigurasi Menu
   ├── 🔽 Konfigurasi Footer
   └── 🔍 Default SEO

📋 Template
   ├── Daftar Template
   ├── ➕ Buat Template
   │   └── Visual Block Builder
   └── 👁️ Preview Template

📄 Halaman
   ├── Semua Halaman (tabel dengan pencarian/filter)
   ├── ➕ Buat Halaman Baru
   │   ├── Pilih Template
   │   ├── Konfigurasi Konten
   │   ├── Pengaturan Koleksi
   │   └── Pengaturan SEO
   ├── ✏️ Edit Halaman
   └── 🗑️ Sampah

📚 Koleksi (Manajemen Konten)
   ├── 📝 Artikel Blog
   ├── 🛍️ Produk
   ├── 💼 Proyek
   └── ➕ Koleksi Kustom

🖼️ Perpustakaan Media
   └── Upload & kelola gambar/file
```

## Cara Kerja

### 1. **Alur Manajemen Konten**

```
Admin membuat konten di Panel Admin Vue 3
    ↓
    [Tab Pengaturan Global]
    - Konfigurasi warna tema, font
    - Atur menu navigasi (dengan terjemahan via sysMenuLangs)
    - Konfigurasi struktur footer
    - Atur default SEO
    ↓
    [Tab Template]
    - Buat template halaman yang dapat digunakan kembali
    - Definisikan struktur blok menggunakan Visual Block Builder
    - Atur props default untuk komponen
    ↓
    [Tab Halaman]
    - Buat halaman baru
    - Pilih template
    - Isi konten (dengan terjemahan untuk setiap bahasa)
    - Konfigurasi metadata SEO
    - Atur status publikasi
    ↓
    [Tab Koleksi]
    - Tambah artikel blog, produk, proyek
    - Konfigurasi field kustom
    - Atur kategori dan tag
    ↓
Backend NestJS menyimpan semua data di PostgreSQL
    ↓
Situs Publik Nuxt mengambil dan menampilkan konten
```

### 2. **Alur Rendering Halaman**

```
Pengguna mengunjungi: /articles/my-post
    ↓
Nuxt menangkap route di pages/[...slugs].vue
    ↓
Ambil konfigurasi halaman dari Backend NestJS
    → GET /api/pages/public/articles/my-post?lang=en
    ← Return: PageConfig dengan blocks, translations, metadata SEO
    ↓
Cek: Apakah ini detail koleksi? (pola: collection/slug)
    ↓
Jika koleksi: Ambil data item koleksi
    → GET /api/collections/blog/public/my-post?lang=en
    ← Return: { title: "My Post", content: "...", author: {...} }
    ↓
Ambil konfigurasi template
    → GET /api/templates/blog-detail-template
    ← Return: Template dengan variabel {{item.field}}
    ↓
Server membangun PageConfig lengkap:
    - Ganti {{item.field}} dengan data aktual
    - Terapkan terjemahan berdasarkan parameter ?lang
    - Injeksi metadata SEO
    ↓
Return PageConfig ke Nuxt
    ↓
DynamicRenderer.vue memproses blocks
    ↓
Component registry memetakan tipe blok ke komponen Vue
    ↓
Render halaman dengan komponen dan data yang tepat
```

### 3. **Internasionalisasi (i18n)**

Sistem menggunakan **pendekatan hybrid** untuk terjemahan:

**Terjemahan UI Statis** (Nuxt i18n)

```vue
<!-- Label tombol, field form, navigasi -->
<button>{{ $t('common.submit') }}</button>
<p>{{ $t('home.welcome') }}</p>
```

**Terjemahan Konten Dinamis** (Backend sysMenuLangs)

```vue
<script setup>
// Untuk menu dengan struktur sysMenuLangs
const menuTitle = getLocalizedText(menu.sysMenuLangs, 'title');
</script>

<template>
  <h1>{{ menuTitle }}</h1>
</template>
```

**Pergantian Bahasa**

- Menggunakan komponen `LanguageSwitcher.vue`
- Mengambil bahasa yang tersedia dari `useAppGCStore().getLangs`
- Mengubah route: `domain.com/about` → `domain.com/id/about`
- Memperbarui konten dengan parameter bahasa baru

Lihat `I18N_HYBRID_GUIDE.md` dan `LANGUAGE_SWITCHER_INTEGRATION.md` untuk detail.

### 4. **Sintaks Template**

Template menggunakan sintaks `{{item.field}}` untuk konten dinamis:

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

### 5. **Komponen Generik**

Semua halaman detail menggunakan komponen generik yang dapat digunakan kembali:

#### **Metadata** (`components/fields/Metadata.vue`)

Menampilkan penulis, tanggal, waktu baca, tag, kategori

```vue
<Metadata
  :author="{ name: 'John Doe', avatar: '...' }"
  :date="publishedAt"
  :duration="5"
  duration-unit="menit baca"
  :tags="['vue', 'nuxt']"
  :categories="['Teknologi']"
/>
```

#### **Content** (`components/fields/Content.vue`)

Menampilkan konten HTML, markdown, atau teks biasa

```vue
<Content :content="htmlContent" format="html" :prose="true" max-width="4xl" />
```

#### **MediaGallery** (`components/fields/MediaGallery.vue`)

Menampilkan gambar tunggal, grid, atau carousel

```vue
<MediaGallery
  :images="imageArray"
  variant="carousel"
  aspect-ratio="square"
  :show-indicators="true"
/>
```

#### **InfoList** (`components/fields/InfoList.vue`)

Menampilkan pasangan key-value dalam list atau grid

```vue
<InfoList
  title="Detail"
  :items="[
    { label: 'Harga', value: '$99', icon: 'mdi:currency-usd' },
    { label: 'SKU', value: 'PROD-001', icon: 'mdi:barcode' },
  ]"
  layout="grid"
  :columns="2"
/>
```

#### **ShareButtons** (`components/fields/ShareButtons.vue`)

Tombol berbagi media sosial

```vue
<ShareButtons
  :title="pageTitle"
  :platforms="['twitter', 'facebook', 'linkedin']"
/>
```

## Skema Database

### Konfigurasi Koleksi

```typescript
{
  _id: ObjectId,
  slug: 'articles',        // Segmen URL
  type: 'blog',            // Tipe koleksi
  name: 'Articles',        // Nama tampilan
  tableName: 'blogPosts',  // Tabel/koleksi database
  detailTemplateId: 'blog-detail-template',
  listTemplateId: 'blog-list-template'
}
```

### Template Halaman

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
    // Konfigurasi blok dengan variabel {{item.field}}
  ]
}
```

### Item Koleksi (Artikel Blog)

```typescript
{
  _id: ObjectId,
  slug: 'my-post',
  title: 'Artikel Blog Saya',
  excerpt: 'Deskripsi singkat',
  content: '<p>Konten lengkap...</p>',
  coverImage: 'https://...',
  author: {
    name: 'John Doe',
    avatar: 'https://...'
  },
  publishedAt: '2024-01-01',
  readTime: 5,
  tags: ['vue', 'nuxt'],
  categories: ['Teknologi']
}
```

## Endpoint API

### Endpoint CMS (Untuk Admin)

```
POST   /api/cms/pages                    - Buat halaman
GET    /api/cms/pages/:slug              - Ambil halaman
PUT    /api/cms/pages/:slug              - Update halaman
DELETE /api/cms/pages/:slug              - Hapus halaman

POST   /api/cms/templates                - Buat template
GET    /api/cms/templates/:id            - Ambil template
PUT    /api/cms/templates/:id            - Update template
DELETE /api/cms/templates/:id            - Hapus template

POST   /api/cms/collections/:type        - Buat item koleksi
GET    /api/cms/collections/:type/:slug  - Ambil item koleksi
PUT    /api/cms/collections/:type/:slug  - Update item koleksi
DELETE /api/cms/collections/:type/:slug  - Hapus item koleksi

GET    /api/cms/collections/:slug/config - Ambil konfigurasi koleksi
```

### Endpoint Publik (Untuk Frontend)

```
GET /api/pages/[...slug]                 - Ambil konfigurasi halaman
```

## Integrasi Panel Admin

### Membuat Template (UI Admin)

```typescript
const template = {
  name: 'Blog Detail Template',
  blocks: [
    {
      name: 'hero',
      type: 'predefined',
      component: 'HeroWidget',
      props: {
        // Admin memilih pemetaan field via dropdown
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
            // Admin drag field untuk memetakannya
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

### Menetapkan Template ke Koleksi

```typescript
const collectionConfig = {
  slug: 'articles',
  type: 'blog',
  detailTemplateId: 'blog-detail-template', // Pilih dari dropdown
  listTemplateId: 'blog-list-template',
};

await $fetch('/api/cms/collections/articles/config', {
  method: 'PUT',
  body: collectionConfig,
});
```

## Contoh: Alur Lengkap

### Membuat dan Mempublikasikan Konten

1. **Admin membuka Panel Admin Vue 3**
   - Login dengan autentikasi yang sudah ada

2. **Admin mengkonfigurasi pengaturan global**
   - Mengatur warna tema, font
   - Mengkonfigurasi menu navigasi dengan terjemahan (sysMenuLangs)
   - Mengatur struktur footer
   - Mendefinisikan default SEO

3. **Admin membuat template artikel blog**
   - Membuka bagian Templates
   - Menggunakan Visual Block Builder
   - Menambahkan blok: Hero, Metadata, Content, ShareButtons
   - Memetakan variabel template: `{{item.title}}`, `{{item.author}}`, `{{item.content}}`
   - Menyimpan template ke backend

4. **Admin membuat artikel blog**
   - Membuka Collections → Blog Posts
   - Klik "Create New"
   - Mengisi konten untuk setiap bahasa (en, id)
   - Menambahkan metadata SEO
   - Mengatur status publikasi
   - Menyimpan ke backend

5. **Pengguna mengunjungi situs publik**
   - Navigasi ke `/articles/my-first-post` atau `/id/articles/my-first-post`
   - Nuxt mengambil konfigurasi halaman dengan parameter bahasa
   - DynamicRenderer menampilkan konten dalam bahasa yang benar

### Pergantian Bahasa

1. **Pengguna klik language switcher**
   - Dropdown menampilkan bahasa yang tersedia dari backend

2. **Pengguna memilih "Indonesia"**
   - Route berubah: `/about` → `/id/about`
   - Semua menu diperbarui menggunakan `getLocalizedText(sysMenuLangs)`
   - Konten halaman diambil dengan parameter `?lang=id`
   - Elemen UI menggunakan `$t('key')` dari file locale

## Keuntungan

✅ **Pemisahan tanggung jawab** - Panel admin, backend, dan situs publik independen
✅ **Backend/Admin sudah ada** - Hanya perlu membangun integrasi Nuxt
✅ **Tidak ada konten hardcode** - Semua dikelola melalui panel admin
✅ **Dukungan multi-bahasa** - i18n built-in dengan pendekatan hybrid
✅ **Template yang dapat digunakan kembali** - Template yang sama untuk semua halaman serupa
✅ **Type-safe** - TypeScript di seluruh stack
✅ **SEO-friendly** - SSR, meta tags, structured data
✅ **Performa** - Caching, lazy loading, optimasi gambar

## Status Saat Ini

### ✅ Sudah Selesai

- Backend NestJS berjalan dengan TypeORM + PostgreSQL
- Panel admin Vue 3 terintegrasi dengan backend
- Sistem autentikasi pengguna
- Entitas database (Pages, Templates, Collections, GlobalConfig)
- Sistem terjemahan (struktur sysMenuLangs)

### 🆕 Sedang Dibangun

- Situs publik Nuxt 4
- Integrasi i18n dengan @nuxtjs/i18n
- Komponen language switcher
- Rendering halaman dinamis
- Koneksi ke API backend yang ada

### 📋 Langkah Selanjutnya

Lihat `IMPLEMENTATION_ROADMAP.md` untuk tugas detail:

## Dokumentasi Terkait

- `ADMIN_INTEGRATION_GUIDE.md` - Penjelasan arsitektur lengkap
- `I18N_HYBRID_GUIDE.md` - Pendekatan internasionalisasi
- `LANGUAGE_SWITCHER_INTEGRATION.md` - Penggunaan language switcher
- `IMPLEMENTATION_ROADMAP.md` - Breakdown tugas dan timeline
- `BASE_LAYOUT_GUIDE.md` - Dokumentasi sistem layout
- `BLOCK_MANAGEMENT_GUIDE.md` - Sistem rendering berbasis blok

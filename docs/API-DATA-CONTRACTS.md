# API Data Contracts

Date: 2026-04-15

This document contains the TypeScript data contracts (request/response shapes) for the main HTTP APIs implemented in this project. Use these types when integrating frontend and backend.

Notes:

- Endpoints accept `application/json` for normal payloads. Endpoints that accept file uploads support `multipart/form-data`.
- File parts are converted to data-URL strings in the current implementation.

---

## Pages API

- GET `/api/pages/[...slug]`
  - Response: `PageConfig` (see type below)

- POST `/api/pages/[...slug]`
  - Request: `PagePayload`
  - Response: `{ success: true; data: PageConfig }

TypeScript types (canonicalized from server code):

```ts
// Page request payload sent to POST /api/pages/[...slug]
export interface PagePayload {
  id?: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  type: string; // e.g. 'static' | 'landing' | ...
  blocks: DemoBlockDefinition[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
    noIndex?: boolean;
    noFollow?: boolean;
  };
  settings: {
    isHomepage: boolean;
    requireAuth: boolean;
    allowComments: boolean;
    showInMenu: boolean;
    menuOrder: number;
    parentPageId?: number | null;
    parentSlug?: string | null;
    customCSS?: string;
    customJS?: string;
  };
  publishedAt?: string;
  scheduledAt?: string;
}

// Reduced block + component definitions used in payload and page config
export interface DemoDataSource {
  collection: string;
  mode: 'list' | 'single';
  fieldMappings: Record<string, string>;
}

export interface DemoBlockDefinition {
  id: string;
  name: string;
  type: string;
  icon?: string;
  description?: string;
  category?: string;
  defaultConfig?: any; // shape used by admin; simplified here
  previewMode?: 'config' | 'flat';
  dataSource?: DemoDataSource;
}

// PageConfig returned by GET and in POST response `data`
export interface PageConfig {
  id?: string;
  name: string;
  path: string;
  title?: string;
  meta: {
    type: string; // derived page type
    category?: string;
    template?: string;
    collection?: any;
  };
  seoMeta?: {
    title: string;
    description: string;
    ogImage?: string;
    keywords?: string[];
    canonical?: string;
    noindex?: boolean;
    nofollow?: boolean;
    type?: 'website' | 'article' | 'product';
  };
  blocks: Array<{
    id?: string;
    name: string;
    type?: 'predefined' | 'custom';
    component?: string;
    props?: Record<string, any>;
    content?: Record<string, any>;
    html?: string;
    sortOrder?: number;
    dataSource?: DemoDataSource;
    collectionItems?: Array<Record<string, any>>;
  }>;
}
```

Example request (POST /api/pages/home):

```json
{
  "title": "Home",
  "slug": "home",
  "status": "draft",
  "type": "landing",
  "blocks": [
    {
      "id": "hero-0",
      "name": "Hero",
      "type": "predefined",
      "previewMode": "flat"
    }
  ],
  "seo": { "metaTitle": "Home" },
  "settings": {
    "isHomepage": true,
    "requireAuth": false,
    "allowComments": false,
    "showInMenu": true,
    "menuOrder": 0
  }
}
```

Example response (200):

```json
{
  "success": true,
  "data": {
    "id": "home",
    "name": "home",
    "path": "/",
    "title": "Home",
    "meta": { "type": "landing" },
    "blocks": []
  }
}
```

---

## Collections (schema) API

- POST `/api/collections` — create new collection schema
- GET `/api/collections` — list schemas
- GET `/api/collections/:slug` — get single schema
- PUT `/api/collections/:slug` — update schema
- DELETE `/api/collections/:slug` — delete schema (and items)

TypeScript types:

```ts
export interface CollectionFieldDef {
  key: string;
  label: string;
  type: string; // e.g. 'string' | 'richtext' | 'number' | 'file' | 'object' | 'array'
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  accept?: string; // for files
  of?: CollectionFieldDef[]; // nested element type
  fields?: CollectionFieldDef[]; // object fields
  showInList?: boolean;
}

export interface CollectionSchema {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  fields: CollectionFieldDef[];
  createdAt: string;
  updatedAt: string;
}
```

Example create request:

```json
{
  "name": "Posts",
  "slug": "posts",
  "fields": [
    { "key": "title", "label": "Title", "type": "string" },
    { "key": "body", "label": "Body", "type": "richtext" }
  ]
}
```

Example response:

```json
{ "success": true, "data": { "id": "k0f9a3", "name": "Posts", "slug": "posts", "fields": [...] } }
```

---

## Collection Items API

- GET `/api/collections/:slug/items` — list with pagination and optional `search`, returns `{ items, total, page, perPage }`
- POST `/api/collections/:slug/items` — create item; accepts `application/json` or `multipart/form-data` for files
- GET `/api/collections/:slug/items/:id` — fetch one item
- PUT `/api/collections/:slug/items/:id` — update item
- DELETE `/api/collections/:slug/items/:id` — delete item

TypeScript types:

```ts
export interface CollectionItem {
  id: string;
  collectionSlug: string;
  data: Record<string, any>; // fields according to collection schema
  createdAt: string;
  updatedAt: string;
}

// List response
export interface CollectionItemsListResponse {
  items: CollectionItem[];
  total: number;
  page: number;
  perPage: number;
}
```

Create item request (example for `posts`):

```json
{
  "title": "Hello world",
  "body": "This is a post."
}
```

Create item response:

```json
{
  "success": true,
  "data": {
    "id": "k1x9p",
    "collectionSlug": "posts",
    "data": { "title": "Hello world", "body": "This is a post." },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## Site Config API

- GET `/api/site-config` — returns the global site configuration
- POST `/api/site-config` — upsert the site config (accepts partial updates)

TypeScript types (canonical):

```ts
export interface FooterLink {
  id: number;
  label: string;
  url: string;
}
export interface FooterColumn {
  title: string;
  type: 'links' | 'text' | 'contact';
  links?: FooterLink[];
  content?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SocialLink {
  platform: string;
  icon: string;
  url: string;
  enabled: boolean;
}

export interface FooterConfig {
  layout: 'columns' | 'centered' | 'minimal';
  columns: number;
  showSocial: boolean;
  showNewsletter: boolean;
  copyright: string;
  columnData: FooterColumn[];
  socialLinks: SocialLink[];
}

export interface SiteInfo {
  name: string;
  logoUrl?: string;
  tagline?: string;
}

export interface StoredSiteConfig {
  site: SiteInfo;
  footer: FooterConfig;
}
```

Example site-config upsert request:

```json
{
  "site": { "name": "My Site" },
  "footer": { "layout": "columns", "columns": 4 }
}
```

Example response:

```json
{
  "site": { "name": "My Site" },
  "footer": {
    "layout": "columns",
    "columns": 4,
    "showSocial": true,
    "showNewsletter": false,
    "copyright": "© 2026 Your Company. All rights reserved.",
    "columnData": [],
    "socialLinks": []
  }
}
```

---

If you'd like, I can now:

- Extract exact, canonical TypeScript type exports from the server/shared files into a `packages` or `types` folder and reference them directly from the frontend build (so the contract is compiled and enforced).
- Run the dev server and capture real request/response examples into this document.

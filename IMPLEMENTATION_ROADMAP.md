# Implementation Roadmap & TODO List

## CMS Public Website + Admin Panel Integration

> **Reference**: See `ADMIN_INTEGRATION_GUIDE.md` for detailed implementation details and `I18N_HYBRID_GUIDE.md` for internationalization setup.

---

## 🎯 TL;DR - What You Need To Do

**Your Situation**: Backend (NestJS) and Admin (Vue 3) already exist and work together. You need to build the Nuxt 4 public website that consumes the existing backend APIs.

**Your Timeline**: **6-8 weeks** instead of 12-16 weeks

**Your Focus**:

1. 📝 **Week 1**: Document existing backend APIs, connect Nuxt to backend, test authentication
2. 🌐 **Week 2**: Set up i18n on Nuxt, fetch pages from backend, render dynamically
3. 🎨 **Week 3-4**: Global settings, navigation, collections/blog integration
4. 🔍 **Week 5-6**: Search, analytics, SEO optimization
5. 🚀 **Week 7-8**: Performance tuning, security hardening, deployment

**Key Action**: Start by running Postman/Thunder Client against your backend to document what APIs already exist.

---

## 📋 Overview

This roadmap breaks down the implementation into **phases** with clear tasks for:

- 🎨 **Frontend (Nuxt Public Site)** - What needs to be built in the public website ⭐ **YOUR MAIN FOCUS**
- 🔧 **Backend (NestJS API)** - Verify APIs exist, document structure, request minor additions if needed
- 🖥️ **Admin Panel (Vue 3)** - Document existing capabilities, note any gaps

Each task is marked with: `[ ]` Not started | `[~]` In progress | `[x]` Completed

---

## ⚠️ Important Context

### **Current State:**

- ✅ **Backend (NestJS)** - Already built and running
- ✅ **Admin Panel (Vue 3)** - Already built and integrated with backend
- ✅ **Database entities** - Already exist and working
- ✅ **Authentication** - Already working between admin and backend
- 🆕 **Public Website (Nuxt 4)** - NEW, needs integration with existing backend

### **What This Means:**

- **Skip backend setup tasks** - Backend is ready, just need to know the API endpoints
- **Skip admin panel tasks** - Admin already exists and functional
- **Focus on Frontend tasks** - Integrate Nuxt public site with existing backend
- **Backend tasks marked "Verify"** - Just confirm endpoints exist or request minor additions

### **Your Existing Stack:**

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Admin Panel   │────────▶│  NestJS Backend │◀────────│  Public Website │
│   (Vue 3)       │  ✅ Done │   (Running)     │  🆕 NEW │   (Nuxt 4)      │
│   ✅ Working    │         │   ✅ Working    │         │   🔨 Build This │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## 🚀 Phase 1: Foundation & Integration (Week 1)

### **Priority: CRITICAL** - Connect to existing backend

### 1.1 Backend Documentation & Verification

**Backend Tasks:**

- [x] 🔧 **B1.1** - ✅ Backend already set up
  - [x] ✅ NestJS application running
  - [x] ✅ TypeORM + PostgreSQL configured
  - [x] ✅ Environment variables configured
  - [x] ✅ Base entities exist
  - [x] ✅ Database migrations in place

- [x] 🔧 **B1.2** - ✅ Authentication already implemented
  - [x] ✅ Users entity exists
  - [x] ✅ JWT authentication working
  - [x] ✅ Auth endpoints exist (admin uses them)
  - [x] ✅ Guards configured
  - [x] ✅ Password hashing working

- [ ] 🔧 **B1.3** - Verify/Add public endpoints
  - [ ] 📝 **Document:** List all existing API endpoints
  - [ ] ✅ **Verify:** `GET /api/configs/global?lang={code}` exists
  - [ ] ✅ **Verify:** `GET /api/pages/public/:slug` exists
  - [ ] ✅ **Verify:** `GET /api/menus/public` exists
  - [ ] 🔧 **Add if missing:** Public filtering (published=true)
  - [ ] 🔧 **Add if missing:** Public DTOs (hide admin fields)
  - [ ] ✅ **Verify:** CORS allows Nuxt domain

**Frontend Tasks:**

- [ ] 🎨 **F1.1** - Connect Nuxt to existing backend
  - [x] ✅ Nuxt 4 project initialized
  - [x] ✅ Tailwind CSS configured
  - [x] ✅ BaseLayout.vue exists
  - [ ] Add backend API URL to `nuxt.config.ts` runtime config
  - [ ] Configure axios/ofetch baseURL for existing backend
  - [ ] Test connection to backend
  - [ ] Update `server/api/global-configs.ts` to call **existing** API
  - [ ] Remove mock data

- [ ] 🎨 **F1.2** - Authentication Integration with existing backend
  - [ ] Update `AppADStore` to use **existing** backend auth endpoints
  - [ ] Connect login flow to **existing** `/auth/login` API
  - [ ] Store JWT tokens securely
  - [ ] Implement token refresh using **existing** refresh endpoint
  - [ ] Update axios interceptors for auth headers
  - [ ] Test authentication flow

**Admin Panel Tasks:**

- [x] 🖥️ **A1.1** - ✅ Admin already built
  - [x] ✅ Vue 3 + Vite + PrimeVue working
  - [x] ✅ Router and Pinia configured
  - [x] ✅ Connected to backend
  - [x] ✅ Can manage content

- [ ] 🖥️ **A1.2** - Document existing admin capabilities
  - [ ] 📝 **Document:** What content types can be managed?
  - [ ] 📝 **Document:** Translation management features?
  - [ ] 📝 **Document:** Publish/unpublish functionality?
  - [ ] 📝 **Document:** SEO fields available?
  - [ ] 🔍 **Check:** Any missing features for public site?

**Deliverables:**

- ✅ Backend API endpoints documented
- ✅ Nuxt site connects to **existing** backend
- ✅ Authentication working between Nuxt and backend
- ✅ Global configs fetched from backend
- ✅ Admin capabilities documented

---

## 🌐 Phase 2: Internationalization Setup (Week 2-3)

### **Priority: HIGH** - Foundation for all content

**Reference**: See `I18N_HYBRID_GUIDE.md` for complete implementation

### 2.1 Static UI Translations

**Frontend Tasks:**

- [ ] 🎨 **F2.1** - Install and configure Nuxt i18n
  - [ ] `npm install @nuxtjs/i18n`
  - [ ] Configure in `nuxt.config.ts` (locales, strategy, lazy loading)
  - [ ] Create `locales/en.json` with UI translations
  - [ ] Create `locales/id.json` with UI translations
  - [ ] Create `locales/fr.json` (optional)
  - [ ] Create `locales/de.json` (optional)

- [x] 🎨 **F2.2** - Build Language Switcher
  - [x] Create `components/LanguageSwitcher.vue`
  - [x] Add to header/navigation
  - [x] Handle locale switching with data refresh
  - [ ] Store selected language in cookie

- [ ] 🎨 **F2.3** - Create i18n composables
  - [x] Create `composables/useSmartI18n.ts`
  - [x] Implement `getLocalizedText()` for sysMenuLangs
  - [x] Implement `getLocalizedContent()` for page translations
  - [x] Add fallback logic to default language

### 2.2 Dynamic Content Translations

**Backend Tasks:**

- [ ] 🔧 **B2.1** - Verify existing translation structure
  - [x] ✅ `sysMenuLangs` structure already exists (admin uses it)
  - [ ] ✅ **Verify:** Pages entity has translation support
  - [ ] ✅ **Verify:** Content/Blocks have translation fields
  - [ ] 📝 **Document:** Current translation data structure
  - [ ] 🔧 **Add if missing:** Translation fields to any entity

- [ ] 🔧 **B2.2** - Verify/update API language support
  - [ ] ✅ **Verify:** `GET /api/configs/global?lang={code}` works
  - [ ] ✅ **Verify:** `GET /api/pages/:slug?lang={code}` works
  - [ ] ✅ **Verify:** Localized content returned correctly
  - [ ] ✅ **Verify:** Fallback to default language works
  - [ ] 🔧 **Fix if needed:** Language parameter handling

**Admin Panel Tasks:**

- [ ] 🖥️ **A2.1** - Verify language management exists
  - [x] ✅ Admin can manage translations (sysMenuLangs proves this)
  - [ ] 📝 **Document:** How admin manages translations
  - [ ] 📝 **Document:** Supported languages list
  - [ ] 🔍 **Check:** Language enable/disable functionality?

- [ ] 🖥️ **A2.2** - Verify translation editors exist
  - [ ] 📝 **Document:** Menu translation editor UI
  - [ ] 📝 **Document:** Page translation editor UI
  - [ ] 📝 **Document:** Content translation workflow
  - [ ] 🔍 **Check:** Any improvements needed?

**Deliverables:**

- ✅ Users can switch language on public site
- ✅ Static UI texts change immediately
- ✅ Dynamic content loads in selected language
- ✅ Admin can manage translations per language

---

## 📄 Phase 3: Page Management System (Week 2-3)

### **Priority: HIGH** - Core CMS functionality

### 3.1 Backend - Verify Pages Module

**Backend Tasks:**

- [ ] 🔧 **B3.1** - Verify existing Pages structure
  - [x] ✅ Pages entity likely exists (admin manages pages)
  - [ ] 📝 **Document:** Pages entity fields (slug, status, translations, blocks, meta)
  - [ ] 📝 **Document:** Current page types supported
  - [ ] ✅ **Verify:** Translation structure (JSONB with language codes)
  - [ ] ✅ **Verify:** Blocks configuration structure
  - [ ] ✅ **Verify:** SEO metadata fields
  - [ ] 🔧 **Add if missing:** Published status, publishedAt timestamp

- [ ] 🔧 **B3.2** - Verify/add public Pages endpoints
  - [x] ✅ Admin CRUD endpoints exist (admin uses them)
  - [ ] ✅ **Verify:** `GET /api/pages/public/:slug?lang={code}` exists
  - [ ] ✅ **Verify:** Returns only published pages
  - [ ] ✅ **Verify:** Filters by language correctly
  - [ ] ✅ **Verify:** Returns blocks and metadata
  - [ ] 🔧 **Add if missing:** Public page listing endpoint
  - [ ] 🔧 **Add if missing:** Preview endpoint for admin

- [ ] 🔧 **B3.3** - Verify Templates Module (if used)
  - [ ] 📝 **Document:** Does backend use templates?
  - [ ] ✅ **Verify:** Template entity and endpoints
  - [ ] 📝 **Document:** How templates relate to pages
  - [ ] 🔍 **Check:** Template system needed for public site?

### 3.2 Frontend - Connect to Pages System

**Frontend Tasks:**

- [ ] 🎨 **F3.1** - Connect page fetching to backend
  - [x] ✅ `pages/[...slugs].vue` already exists
  - [ ] Update to call **existing** backend pages API
  - [ ] Pass language parameter from i18n
  - [ ] Handle 404 when page not found
  - [ ] Add error boundaries
  - [ ] Implement caching strategy

- [ ] 🎨 **F3.2** - Integrate dynamic rendering
  - [x] ✅ `DynamicRenderer.vue` already implemented
  - [x] ✅ Block components exist (HeroSection, FeatureBlock, etc.)
  - [ ] Test with real backend page data
  - [ ] Verify all block types render correctly
  - [ ] Add loading states
  - [ ] Test SEO meta tags from backend data
  - [ ] Test structured data generation

- [ ] 🎨 **F3.3** - Add page-level features
  - [ ] Implement breadcrumbs
  - [ ] Add social share buttons
  - [ ] Add print stylesheet
  - [ ] Test different page types

### 3.3 Admin Panel - Verify Page Management

**Admin Panel Tasks:**

- [x] 🖥️ **A3.1** - ✅ Pages management exists
  - [x] ✅ Admin can list pages
  - [x] ✅ Admin can create/edit pages
  - [x] ✅ Admin can manage blocks
  - [ ] 📝 **Document:** Current page editor features
  - [ ] 📝 **Document:** Available block types
  - [ ] 🔍 **Check:** Any missing features?

- [ ] 🖥️ **A3.2** - Verify page editor capabilities
  - [ ] 📝 **Document:** How blocks are configured
  - [ ] 📝 **Document:** Translation editing workflow
  - [ ] 📝 **Document:** SEO fields available
  - [ ] 🔍 **Check:** Publish/unpublish functionality
  - [ ] 🔍 **Check:** Preview functionality
  - [ ] 🔍 **Check:** Slug generation/editing

- [ ] 🖥️ **A3.3** - Check for needed enhancements
  - [ ] 🔍 **Assess:** Block builder UI improvements needed?
  - [ ] 🔍 **Assess:** Media picker integration working?
  - [ ] 🔍 **Assess:** Duplicate page functionality?
  - [ ] 🔍 **Assess:** Bulk operations needed?

**Deliverables:**

- ✅ Admin can create/edit pages
- ✅ Pages stored in database with translations
- ✅ Public site displays pages from database
- ✅ SEO meta tags working correctly

---

## 🎨 Phase 4: Global Settings Integration (Week 3-4)

### **Priority: MEDIUM** - Needed for branding

### 4.1 Backend - Verify Global Settings

**Backend Tasks:**

- [ ] 🔧 **B4.1** - Verify existing Global Configs
  - [x] ✅ GlobalConfig entity exists (admin manages it)
  - [ ] 📝 **Document:** Current config structure
  - [ ] ✅ **Verify:** Theme settings exist (colors, fonts)
  - [ ] ✅ **Verify:** Header config exists (logo, menu, CTA)
  - [ ] ✅ **Verify:** Footer config exists
  - [ ] ✅ **Verify:** SEO defaults exist
  - [ ] ✅ **Verify:** Translations in config
  - [ ] 🔧 **Add if missing:** Any config fields needed

### 4.2 Admin Panel - Verify Settings UI

**Admin Panel Tasks:**

- [x] 🖥️ **A4.1** - ✅ Settings management exists
  - [x] ✅ Admin can manage global settings
  - [ ] 📝 **Document:** Current settings UI structure
  - [ ] 🔍 **Check:** Theme customization available?
  - [ ] 🔍 **Check:** Header/footer editors?
  - [ ] 🔍 **Check:** SEO settings editor?
  - [ ] 🔍 **Assess:** Any UI improvements needed?

- [ ] 🖥️ **A4.2** - Verify menu management
  - [x] ✅ Menu system exists (sysMenuLangs)
  - [ ] 📝 **Document:** How menus are managed
  - [ ] 📝 **Document:** Translation workflow for menus
  - [ ] 🔍 **Check:** Nested menu support?
  - [ ] 🔍 **Check:** Drag-drop reordering?
  - [ ] 🔍 **Assess:** Menu builder improvements needed?

**Frontend Tasks:**

- [ ] 🎨 **F4.1** - Connect to global settings
  - [x] ✅ `server/api/global-configs.ts` exists
  - [ ] Update to fetch from **existing** backend API
  - [ ] Create `composables/useTheme.ts`
  - [ ] Apply theme colors dynamically (CSS custom properties)
  - [ ] Implement theme switching (light/dark/dim)
  - [ ] Persist theme preference in localStorage

- [ ] 🎨 **F4.2** - Integrate menu system
  - [ ] Fetch menu from backend
  - [ ] Render navigation with translations
  - [ ] Handle nested menus
  - [ ] Add active state highlighting
  - [ ] Make responsive (mobile menu)

**Deliverables:**

- ✅ Public site uses real global configs from backend
- ✅ Theme applied dynamically
- ✅ Navigation menus render correctly
- ✅ Multi-language menu support working
- ✅ Understanding of existing admin capabilities

---

## 📦 Phase 5: Collections & Content Integration (Week 4-5)

### **Priority: HIGH** - For dynamic content (blog, products, etc.)

### 5.1 Backend - Verify Collections System

**Backend Tasks:**

- [ ] 🔧 **B5.1** - Document existing content types
  - [ ] 📝 **Document:** What collection types exist? (blog, products, etc.)
  - [ ] 📝 **Document:** How collections are structured in database
  - [ ] 📝 **Document:** Translation support for collections
  - [ ] ✅ **Verify:** Collections entity/module exists
  - [ ] ✅ **Verify:** Flexible data structure (JSONB fields)

- [ ] 🔧 **B5.2** - Verify/add collection endpoints
  - [ ] ✅ **Verify:** `GET /api/collections/{type}/public?lang={code}` - List items
  - [ ] ✅ **Verify:** `GET /api/collections/{type}/public/:slug?lang={code}` - Single item
  - [ ] ✅ **Verify:** Pagination support
  - [ ] ✅ **Verify:** Filtering and sorting
  - [ ] 🔧 **Add if missing:** Public filtering (published=true)
  - [ ] 🔧 **Add if missing:** Category/tag filtering
  - [ ] `POST /api/collections/{type}` - Create item (admin)
  - [ ] `PUT /api/collections/{type}/:id` - Update item (admin)
  - [ ] `DELETE /api/collections/{type}/:id` - Delete item (admin)
  - [ ] Support pagination, filtering, sorting

- [ ] 🔧 **B5.3** - Field Mapping Configuration
  - [ ] Store field mapping per collection type
  - [ ] Define which fields are translatable
  - [ ] API to get field definitions per type

### 5.2 Frontend - Collection Pages

**Frontend Tasks:**

- [ ] 🎨 **F5.1** - Collection List Pages
  - [ ] Update `server/api/pages/[...slug].ts` to detect collection routes
  - [ ] Fetch collection items from backend
  - [ ] Pass to `ContentListingBlock` component
  - [ ] Implement pagination
  - [ ] Implement filtering (categories, tags)

- [ ] 🎨 **F5.2** - Collection Detail Pages
  - [ ] Detect detail page pattern (e.g., /blog/:slug)
  - [ ] Fetch single item from backend
  - [ ] Render using field mapping
  - [ ] Add prev/next navigation
  - [ ] Related items section

### 5.3 Admin Panel - Content Management

**Admin Panel Tasks:**

- [ ] 🖥️ **A5.1** - Collection Type Manager
  - [ ] Create `pages/Collections/Types.vue`
  - [ ] List collection types (Blog, Products, Projects)
  - [ ] Create new collection type
  - [ ] Define fields per type
  - [ ] Set which fields are translatable

- [ ] 🖥️ **A5.2** - Blog Post Manager
  - [ ] Create `pages/Collections/Blog/index.vue`
  - [ ] List all blog posts
  - [ ] CRUD operations
  - [ ] Rich text editor for content
  - [ ] Featured image upload
  - [ ] Category/tag management
  - [ ] Multi-language content tabs

- [ ] 🖥️ **A5.3** - Product Manager (if needed)
  - [ ] Create `pages/Collections/Products/index.vue`
  - [ ] Product-specific fields (price, SKU, images)
  - [ ] Inventory management
  - [ ] Multi-language translations

- [ ] 🖥️ **A5.4** - Field Mapping Editor
  - [ ] Visual editor for mapping API fields to display fields
  - [ ] For `ContentListingBlock` configuration
  - [ ] Save mappings per collection type

**Deliverables:**

- ✅ Admin can create blog posts / products
- ✅ Public site displays collection lists
- ✅ Detail pages work with correct data
- ✅ Multi-language content for collections
- ✅ Field mapping working correctly

---

## 🖼️ Phase 6: Media Library (Week 7-8)

### **Priority: MEDIUM** - Needed for images and files

### 6.1 Backend - Media Management

**Backend Tasks:**

- [ ] 🔧 **B6.1** - Media Storage Setup
  - [ ] Choose storage: AWS S3, Cloudinary, or local
  - [ ] Configure storage credentials
  - [ ] Set up CDN if needed

- [ ] 🔧 **B6.2** - Media Module
  - [ ] Entity: Media (id, filename, url, mimeType, size, width, height)
  - [ ] `POST /api/media/upload` - Upload file
  - [ ] `GET /api/media` - List media with pagination
  - [ ] `GET /api/media/:id` - Get media details
  - [ ] `DELETE /api/media/:id` - Delete media
  - [ ] Image optimization (resize, convert to WebP)
  - [ ] Generate thumbnails

### 6.2 Admin Panel - Media Library UI

**Admin Panel Tasks:**

- [ ] 🖥️ **A6.1** - Media Library Component
  - [ ] Create `components/MediaLibrary.vue`
  - [ ] Grid view with thumbnails
  - [ ] Upload zone (drag-drop)
  - [ ] Search and filter
  - [ ] Select mode (for inserting into content)
  - [ ] Delete confirmation

- [ ] 🖥️ **A6.2** - Image Picker Component
  - [ ] Create `components/ImagePicker.vue`
  - [ ] Open media library on click
  - [ ] Show selected image preview
  - [ ] Clear selection button
  - [ ] Use in page editor, blog editor, etc.

### 6.3 Frontend - Image Optimization

**Frontend Tasks:**

- [ ] 🎨 **F6.1** - Implement image optimization
  - [ ] Install `@nuxt/image`
  - [ ] Configure image domains
  - [ ] Replace `<img>` tags with `<NuxtImg>`
  - [ ] Set up responsive images (srcset)
  - [ ] Enable lazy loading

**Deliverables:**

- ✅ Admin can upload images
- ✅ Media library with search/filter
- ✅ Images optimized and served via CDN
- ✅ Easy image selection in editors

---

## 🔍 Phase 7: Search & Filtering (Week 8-9)

### **Priority: HIGH** - Essential for usability

### 7.1 Backend - Search Implementation

**Backend Tasks:**

- [ ] 🔧 **B7.1** - Basic Search Endpoint
  - [ ] `GET /api/search?q={query}&type={type}&lang={code}`
  - [ ] Full-text search across pages and collections
  - [ ] Return results with highlights
  - [ ] Support filters (type, category, date range)
  - [ ] Pagination and sorting

- [ ] 🔧 **B7.2** - Advanced Search (Optional)
  - [ ] Integrate Elasticsearch or MeiliSearch
  - [ ] Index all searchable content
  - [ ] Implement autocomplete suggestions
  - [ ] Track search analytics

### 7.2 Frontend - Search UI

**Frontend Tasks:**

- [ ] 🎨 **F7.1** - Search Bar Component
  - [ ] Create `components/SearchBar.vue`
  - [ ] Input with debounced search
  - [ ] Autocomplete dropdown
  - [ ] Keyboard navigation (up/down/enter)
  - [ ] Recent searches

- [ ] 🎨 **F7.2** - Search Results Page
  - [ ] Create `pages/search.vue`
  - [ ] Display results with highlights
  - [ ] Filters sidebar (type, category, date)
  - [ ] Pagination
  - [ ] Empty state when no results

**Deliverables:**

- ✅ Users can search site content
- ✅ Results show relevant items
- ✅ Filters work correctly
- ✅ Search works across languages

---

## 📊 Phase 8: Analytics & Tracking (Week 9-10)

### **Priority: MEDIUM** - For insights

### 8.1 Backend - Analytics Module

**Backend Tasks:**

- [ ] 🔧 **B8.1** - Analytics Database
  - [ ] Entity: PageViews (id, path, referer, userAgent, timestamp)
  - [ ] Entity: Events (id, eventType, data, timestamp)
  - [ ] `POST /api/analytics/pageview` - Track page view
  - [ ] `POST /api/analytics/event` - Track custom event

- [ ] 🔧 **B8.2** - Analytics Endpoints
  - [ ] `GET /api/analytics/overview` - Summary stats
  - [ ] `GET /api/analytics/popular-pages` - Top pages
  - [ ] `GET /api/analytics/traffic-sources` - Referrers
  - [ ] `GET /api/analytics/events` - Custom events

### 8.2 Frontend - Tracking Implementation

**Frontend Tasks:**

- [ ] 🎨 **F8.1** - Analytics Plugin
  - [ ] Create `plugins/analytics.client.ts`
  - [ ] Track page views on route change
  - [ ] Send to backend API
  - [ ] Integrate Google Analytics (optional)

- [ ] 🎨 **F8.2** - Event Tracking Composable
  - [ ] Create `composables/useAnalytics.ts`
  - [ ] `trackEvent()` function
  - [ ] Track button clicks, form submissions, etc.

### 8.3 Admin Panel - Analytics Dashboard

**Admin Panel Tasks:**

- [ ] 🖥️ **A8.1** - Dashboard Page
  - [ ] Create `pages/Dashboard.vue`
  - [ ] Overview cards (total views, unique visitors)
  - [ ] Chart: Page views over time
  - [ ] Table: Popular pages
  - [ ] Chart: Traffic sources
  - [ ] Date range selector

**Deliverables:**

- ✅ Page views tracked automatically
- ✅ Admin can see analytics data
- ✅ Insights on popular content
- ✅ Traffic source analysis

---

## 🔐 Phase 9: Security & Performance (Week 10-11)

### **Priority: CRITICAL** - Before production

### 9.1 Backend - Security Hardening

**Backend Tasks:**

- [ ] 🔧 **B9.1** - Rate Limiting
  - [ ] Install `@nestjs/throttler`
  - [ ] Limit API requests per IP
  - [ ] Stricter limits on auth endpoints
  - [ ] Custom error messages

- [ ] 🔧 **B9.2** - Input Validation & Sanitization
  - [ ] Use `class-validator` on all DTOs
  - [ ] Sanitize HTML input
  - [ ] Validate file uploads (type, size)
  - [ ] SQL injection protection (TypeORM handles this)

- [ ] 🔧 **B9.3** - Security Headers
  - [ ] Add Helmet middleware
  - [ ] Configure CORS properly
  - [ ] Set CSP headers
  - [ ] Add rate limiting headers

- [ ] 🔧 **B9.4** - Audit Logging
  - [ ] Log all admin actions
  - [ ] Track who changed what and when
  - [ ] Entity: AuditLogs (userId, action, entity, changes, timestamp)

### 9.2 Frontend - Security

**Frontend Tasks:**

- [ ] 🎨 **F9.1** - XSS Protection
  - [ ] Sanitize user-generated content
  - [ ] Use `v-html` carefully
  - [ ] Install DOMPurify for sanitization

- [ ] 🎨 **F9.2** - CSRF Protection
  - [ ] Implement CSRF tokens if needed
  - [ ] Secure cookie settings

### 9.3 Performance Optimization

**Backend Tasks:**

- [ ] 🔧 **B9.5** - Caching
  - [ ] Install Redis
  - [ ] Cache global configs (5-10 min TTL)
  - [ ] Cache page configs (5 min TTL)
  - [ ] Cache collection lists
  - [ ] Cache invalidation on updates

- [ ] 🔧 **B9.6** - Database Optimization
  - [ ] Add indexes on frequently queried fields
  - [ ] Optimize slow queries
  - [ ] Set up connection pooling
  - [ ] Implement pagination on all list endpoints

**Frontend Tasks:**

- [ ] 🎨 **F9.3** - Nuxt Optimization
  - [ ] Enable route caching
  - [ ] Implement ISR (Incremental Static Regeneration)
  - [ ] Lazy load heavy components
  - [ ] Optimize images with `@nuxt/image`
  - [ ] Enable compression

**Deliverables:**

- ✅ Rate limiting active
- ✅ Input validation working
- ✅ Caching implemented
- ✅ Site performance improved
- ✅ Security headers configured

---

## 🚢 Phase 10: Deployment & DevOps (Week 11-12)

### **Priority: CRITICAL** - Go live!

### 10.1 Backend Deployment

**Backend Tasks:**

- [ ] 🔧 **B10.1** - Prepare for production
  - [ ] Environment variables properly configured
  - [ ] Database migrations tested
  - [ ] Seed data scripts ready
  - [ ] Health check endpoint: `GET /health`

- [ ] 🔧 **B10.2** - Deploy Backend
  - [ ] Choose hosting (AWS, DigitalOcean, Heroku, Railway)
  - [ ] Set up database (RDS, managed PostgreSQL)
  - [ ] Set up Redis cache
  - [ ] Configure environment variables
  - [ ] Deploy application
  - [ ] Set up SSL certificate

- [ ] 🔧 **B10.3** - Set up Monitoring
  - [ ] Install Sentry for error tracking
  - [ ] Set up logging (Winston, CloudWatch)
  - [ ] Configure alerts for errors
  - [ ] Monitor API performance

### 10.2 Frontend Deployment

**Frontend Tasks:**

- [ ] 🎨 **F10.1** - Prepare for production
  - [ ] Update API URLs to production
  - [ ] Test build locally: `npm run build`
  - [ ] Optimize bundle size
  - [ ] Set up environment variables

- [ ] 🎨 **F10.2** - Deploy Public Site
  - [ ] Choose hosting (Vercel, Netlify, Cloudflare Pages)
  - [ ] Connect Git repository
  - [ ] Configure build settings
  - [ ] Set up custom domain
  - [ ] Enable SSL
  - [ ] Test deployment

### 10.3 Admin Panel Deployment

**Admin Panel Tasks:**

- [ ] 🖥️ **A10.1** - Deploy Admin Panel
  - [ ] Build production bundle
  - [ ] Choose hosting (Vercel, Netlify, or same as backend)
  - [ ] Set up authentication redirect
  - [ ] Configure CORS for backend
  - [ ] Set up custom subdomain (admin.yoursite.com)

### 10.4 CI/CD Pipeline

**DevOps Tasks:**

- [ ] 🔧 **D10.1** - GitHub Actions (or similar)
  - [ ] Create `.github/workflows/backend.yml`
  - [ ] Create `.github/workflows/frontend.yml`
  - [ ] Run tests on PR
  - [ ] Auto-deploy on merge to main
  - [ ] Environment-based deployments (staging/production)

- [ ] 🔧 **D10.2** - Backup Strategy
  - [ ] Automated database backups
  - [ ] Media files backup
  - [ ] Backup retention policy
  - [ ] Test restore process

**Deliverables:**

- ✅ Backend API live and accessible
- ✅ Public website deployed
- ✅ Admin panel accessible
- ✅ CI/CD pipeline working
- ✅ Monitoring and alerts configured
- ✅ Backups running automatically

---

## 🎯 Phase 11: Additional Features (Week 12+)

### **Priority: LOW** - Nice to have

### 11.1 Forms & Lead Capture

**Backend Tasks:**

- [ ] 🔧 **B11.1** - Forms Module
  - [ ] Entity: Forms (id, name, fields, submitAction)
  - [ ] Entity: FormSubmissions (id, formId, data, timestamp)
  - [ ] `POST /api/forms/{id}/submit` - Submit form
  - [ ] Email notification on submission
  - [ ] Webhook support

**Frontend Tasks:**

- [ ] 🎨 **F11.1** - Contact Form
  - [ ] Create `components/ContactForm.vue`
  - [ ] Validation
  - [ ] CAPTCHA integration
  - [ ] Success/error messages

- [ ] 🎨 **F11.2** - Newsletter Form
  - [ ] Create `components/NewsletterForm.vue`
  - [ ] Email validation
  - [ ] Integration with email service (Mailchimp, SendGrid)

**Admin Panel Tasks:**

- [ ] 🖥️ **A11.1** - Form Builder
  - [ ] Visual form builder
  - [ ] Drag-drop fields
  - [ ] Field validation rules
  - [ ] Submit action configuration

- [ ] 🖥️ **A11.2** - Submissions Manager
  - [ ] View form submissions
  - [ ] Export to CSV
  - [ ] Mark as read/unread
  - [ ] Reply to submissions

### 11.2 Notifications

**Backend Tasks:**

- [ ] 🔧 **B11.2** - Notifications Module
  - [ ] Entity: Notifications (userId, type, title, message, read, timestamp)
  - [ ] `GET /api/notifications` - Get user notifications
  - [ ] `PATCH /api/notifications/:id/read` - Mark as read
  - [ ] WebSocket or SSE for real-time

**Frontend Tasks:**

- [ ] 🎨 **F11.3** - Notification Bell
  - [ ] Create `components/NotificationBell.vue`
  - [ ] Badge with unread count
  - [ ] Dropdown with notifications
  - [ ] Real-time updates

### 11.3 PWA Features

**Frontend Tasks:**

- [ ] 🎨 **F11.4** - Progressive Web App
  - [ ] Install `@vite-pwa/nuxt`
  - [ ] Configure manifest.json
  - [ ] Add service worker
  - [ ] Offline support
  - [ ] Add to home screen prompt

### 11.4 SEO Enhancements

**Backend Tasks:**

- [ ] 🔧 **B11.3** - Sitemap Generation
  - [ ] `GET /api/sitemap.xml` - Generate sitemap
  - [ ] Include all published pages
  - [ ] Include collection items
  - [ ] Update on content change

**Frontend Tasks:**

- [ ] 🎨 **F11.5** - SEO Improvements
  - [ ] Install `@nuxtjs/sitemap`
  - [ ] Configure robots.txt
  - [ ] Add JSON-LD structured data
  - [ ] Optimize meta tags
  - [ ] Add canonical URLs

### 11.5 Testing

**All Teams:**

- [ ] 🔧 **B11.4** - Backend Tests
  - [ ] Unit tests for services
  - [ ] Integration tests for endpoints
  - [ ] E2E tests for critical flows

- [ ] 🎨 **F11.6** - Frontend Tests
  - [ ] Component tests (Vitest + Vue Test Utils)
  - [ ] E2E tests (Playwright)
  - [ ] Accessibility testing

- [ ] 🖥️ **A11.3** - Admin Panel Tests
  - [ ] Component tests
  - [ ] E2E for admin workflows

---

## 📊 Progress Tracking

### Summary by Phase (Updated for Existing Infrastructure)

| Phase              | Status | Backend (Verify) | Frontend (Build) | Admin (Document) | Estimated Time |
| ------------------ | ------ | ---------------- | ---------------- | ---------------- | -------------- |
| 1. Integration     | `[ ]`  | 3 verify         | 2 connect        | 1 document       | 3-5 days       |
| 2. i18n Setup      | `[ ]`  | 2 verify         | 3 tasks          | 1 document       | 1 week         |
| 3. Pages System    | `[ ]`  | 2 verify         | 3 tasks          | 2 document       | 1 week         |
| 4. Global Settings | `[ ]`  | 1 verify         | 2 tasks          | 2 document       | 3-5 days       |
| 5. Collections     | `[ ]`  | 2 verify         | 3 tasks          | 1 document       | 1-2 weeks      |
| 6. Media Library   | `[ ]`  | 1 verify         | 2 tasks          | 1 document       | 3-5 days       |
| 7. Search          | `[ ]`  | 1 verify         | 3 tasks          | 0 tasks          | 1 week         |
| 8. Analytics       | `[ ]`  | 1 verify         | 3 tasks          | 1 document       | 1 week         |
| 9. Security & Perf | `[ ]`  | 2 verify         | 4 tasks          | 0 tasks          | 1 week         |
| 10. Deployment     | `[ ]`  | 1 verify         | 3 tasks          | 0 tasks          | 3-5 days       |
| 11. Extras         | `[ ]`  | 1 verify         | 6 tasks          | 1 document       | 1-2 weeks      |

> **Legend:**
>
> - **Backend (Verify)**: Check if API exists, document structure, request additions if needed
> - **Frontend (Build)**: Implement Nuxt features and connect to backend
> - **Admin (Document)**: Document existing capabilities, note any gaps

**Total Estimated Time**: ~~12-16 weeks~~ → **6-8 weeks** (adjusted for existing backend/admin)

> **Note**: Original estimate assumed building everything from scratch. Since backend and admin already exist and are integrated, timeline is significantly reduced. Focus is now on Nuxt public site integration only.

---

## 🎯 Quick Start Checklist

### ✅ Already Complete

- [x] ✅ NestJS backend running
- [x] ✅ PostgreSQL database set up
- [x] ✅ Authentication module working
- [x] ✅ Global configs module exists
- [x] ✅ Vue 3 admin panel working
- [x] ✅ Admin connected to backend

### This Week (Week 1) - Integration Phase

- [ ] 📝 Document existing backend API endpoints
- [ ] 📝 Document existing database entities
- [ ] 📝 Document existing admin capabilities
- [ ] Configure Nuxt to connect to **existing** backend
- [ ] Test authentication flow from Nuxt
- [ ] Update global-configs to fetch from backend
- [ ] Remove all mock data

### Next Week (Week 2) - i18n & Pages

- [ ] Install and configure @nuxtjs/i18n
- [ ] Create static UI locale files (en.json, id.json)
- [ ] Build language switcher component
- [ ] Create useSmartI18n composable
- [ ] Connect pages/[...slugs].vue to backend API
- [ ] Test dynamic page rendering with backend data

### Month 1 Goal (Week 1-4)

- ✅ Nuxt authenticated with **existing** backend
- ✅ i18n fully implemented on Nuxt side
- ✅ Dynamic pages render from **existing** backend data
- ✅ Global configs integrated
- ✅ Navigation menus working with translations

### Month 2 Goal (Week 5-8)

- ✅ Collections/blog integrated
- ✅ Search functionality working
- ✅ Performance optimized (caching, SSR)
- ✅ SEO fully implemented
- ✅ Ready for production deployment

---

## 📝 Notes & Best Practices

### Development Workflow (Adjusted for Existing Backend)

1. **Document existing APIs** - Know what's available
2. **Test with Postman/Thunder Client** - Verify endpoints work
3. **Connect Nuxt to APIs** - Integrate with existing backend
4. **Test with real data** - Use content from admin panel
5. **Optimize & polish** - Performance, SEO, UX

### ⚠️ Important Reminders

- **Backend is ready** - Don't rebuild what exists
- **Admin works** - Document its capabilities, don't recreate
- **Focus on Nuxt** - This is the only new piece
- **Verify first** - Check if endpoints exist before requesting new ones
- **Ask for help** - Backend team can clarify existing structure

### Code Organization

- **Backend**: Feature modules (Auth, Pages, Media, etc.)
- **Frontend**: Composables for reusable logic
- **Admin**: Component-based architecture

### Testing Strategy

- Test backend endpoints as you build
- Manual testing in admin panel
- Visual testing on public site
- Automated tests for critical flows

### Documentation

- Update this roadmap as tasks complete
- Document API endpoints (Swagger)
- Create admin user guide
- Write developer documentation

---

## 🚨 Critical Dependencies

Some tasks depend on others being completed first:

1. **Phase 1 (Integration)** - Document existing APIs and connect Nuxt ⚠️ **START HERE**
2. **Phase 2 (i18n)** - Set up early as it affects all content rendering
3. **Phase 3 (Pages)** - Core functionality for displaying dynamic pages
4. **Phase 4 (Global Settings)** - Needed for layout, theme, navigation
5. **Phase 5 (Collections)** - For blog, products, etc.
6. **Phase 9 (Security/Performance)** - Must be done before production
7. **Phase 10 (Deployment)** - Final step

---

## 📌 Roadmap Change Log

### Updated: Based on Existing Infrastructure

**Original Plan**: Build entire CMS from scratch (backend + admin + public site)  
**Updated Plan**: Integrate Nuxt public site with existing backend and admin

**Key Changes:**

- ✅ Marked all backend setup tasks as complete
- ✅ Marked all admin panel tasks as complete
- ✅ Changed focus to verification and documentation of existing APIs
- ✅ Backend tasks now say "Verify" instead of "Create"
- ✅ Admin tasks now say "Document" instead of "Build"
- ✅ Reduced timeline from 12-16 weeks to **6-8 weeks**
- ✅ All frontend tasks focus on connecting to existing backend

**What This Means for You:**

1. Start by documenting what backend APIs already exist
2. Test existing endpoints with Postman/Thunder Client
3. Connect Nuxt to those endpoints (don't rebuild them)
4. If something is missing, request a small addition from backend team
5. Focus 90% of effort on Nuxt public site features

---

## ✅ Definition of Done

Each task is considered "done" when:

- [ ] Code is written and tested
- [ ] Works across all supported languages (if applicable)
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] Reviewed by another developer (if team)
- [ ] Deployed to staging for testing

---

**Keep this document updated as you progress! Mark tasks with `[x]` when completed and `[~]` when in progress.**

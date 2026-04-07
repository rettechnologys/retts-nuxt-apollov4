# Struktur Database CMS

## Pendahuluan

Dokumen ini menjelaskan struktur database untuk sistem CMS dinamis berdasarkan pondasi struktur yang telah didefinisikan. Database dirancang dengan prinsip:

1. **Fleksibel** - Mendukung konten dinamis dengan JSONB
2. **Relasional** - Menjaga integritas data dengan foreign keys
3. **Multi-bahasa** - Translation tables untuk semua entitas
4. **Hierarkis** - Mendukung nested structures (menu, blocks)
5. **Scalable** - Indexed columns untuk query cepat

---

## Diagram ERD

Lihat file `CMS_DATABASE_ERD.drawio` untuk diagram visual lengkap atau import `CMS_DATABASE_SCHEMA.dbml` ke https://dbdiagram.io

**Relasi Utama:**

```
users ──────┬─── pages (author)
            ├─── collection_items (author)
            ├─── media_files (uploader)
            └─── templates (creator)

languages ──┬─── menu_item_translations
            ├─── page_translations
            ├─── collection_item_translations
            └─── media_translations

menus ────── menu_items ────── menu_item_translations
                    │
                    └────────── pages (optional link)
                    └────────── menu_items (self-reference for nested)

templates ──┬─── template_blocks
            ├─── pages
            └─── collection_configs (list & detail templates)

pages ──────┬─── page_blocks
            └─── page_translations

collection_configs ──┬─── collection_fields (field definitions)
                     └─── collection_items (actual data)

collection_items ───┬─── collection_item_translations
                    ├─── categories (many-to-many)
                    └─── tags (many-to-many)

categories ────── collection_configs (optional - can be global)
tags ──────────── collection_configs (optional - can be global)

media_files ──── media_translations
```

**Catatan Penting:**

- `collection_items` adalah **generic table** untuk SEMUA collection types (blog, products, portfolio, dll)
- Tidak perlu membuat entity baru untuk setiap collection type
- Custom fields disimpan di JSONB column `data`

---

## 1. Core Entities

### 1.1 Users Entity

Menyimpan data pengguna admin dan penulis konten.

```typescript
// user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Page } from './page.entity';
import { BlogPost } from './blog-post.entity';
import { MediaFile } from './media-file.entity';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  AUTHOR = 'author',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Page, (page) => page.author)
  pages: Page[];

  @OneToMany(() => BlogPost, (post) => post.author)
  blogPosts: BlogPost[];

  @OneToMany(() => MediaFile, (file) => file.uploadedBy)
  mediaFiles: MediaFile[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Penjelasan Field:**

- `email` - Unique identifier untuk login
- `passwordHash` - Password ter-hash dengan bcrypt
- `role` - Menentukan permission level (admin, editor, author, user)
- `isActive` - Untuk soft disable akun tanpa delete

---

### 1.2 Languages Entity

Menyimpan bahasa yang tersedia di sistem.

```typescript
// language.entity.ts
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { MenuItemTranslation } from './menu-item-translation.entity';
import { PageTranslation } from './page-translation.entity';

@Entity('languages')
export class Language {
  @PrimaryColumn({ length: 10 })
  id: string; // 'en', 'id', 'fr', 'de'

  @Column()
  name: string; // 'English', 'Indonesian'

  @Column({ nullable: true })
  nativeName: string; // 'English', 'Bahasa Indonesia'

  @Column({ nullable: true })
  iconName: string; // 'flag-icon-us', 'fi fi-id'

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @OneToMany(() => MenuItemTranslation, (translation) => translation.language)
  menuItemTranslations: MenuItemTranslation[];

  @OneToMany(() => PageTranslation, (translation) => translation.language)
  pageTranslations: PageTranslation[];

  @CreateDateColumn()
  createdAt: Date;
}
```

**Penjelasan Field:**

- `id` - Kode bahasa ISO (en, id, fr, dll)
- `nativeName` - Nama bahasa dalam bahasa aslinya
- `iconName` - Icon class untuk flag atau emoji
- `isDefault` - Bahasa default sistem
- `sortOrder` - Urutan tampilan di language switcher

---

## 2. Global Settings

### 2.1 GlobalConfig Entity

Menyimpan konfigurasi global seperti tema, SEO defaults, footer.

```typescript
// global-config.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('global_configs')
export class GlobalConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  key: string; // 'theme', 'seo_defaults', 'footer_config'

  @Column({ nullable: true })
  @Index()
  category: string; // 'theme', 'seo', 'layout', 'features'

  @Column('jsonb')
  value: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isPublic: boolean; // Apakah exposed ke public API

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Contoh Data:**

```typescript
// Tema
{
  key: 'theme',
  category: 'theme',
  value: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    darkMode: true,
    fontFamily: 'Inter',
    borderRadius: '8px'
  },
  isPublic: true
}

// SEO Defaults
{
  key: 'seo_defaults',
  category: 'seo',
  value: {
    siteName: 'My Website',
    defaultTitle: 'Welcome',
    defaultDescription: 'Best site ever',
    defaultImage: '/og-default.jpg',
    twitterHandle: '@mysite'
  },
  isPublic: true
}

// Footer
{
  key: 'footer_config',
  category: 'layout',
  value: {
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'About', url: '/about' },
          { label: 'Contact', url: '/contact' }
        ]
      }
    ],
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/...' }
    ],
    copyright: '© 2024 My Company'
  },
  isPublic: true
}
```

---

### 2.2 Menu Entities

#### Menu Entity

```typescript
// menu.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string; // 'header', 'footer', 'sidebar', 'mobile'

  @Column()
  name: string; // 'Header Menu', 'Footer Menu'

  @Column()
  location: string; // 'header', 'footer', 'sidebar'

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => MenuItem, (item) => item.menu)
  items: MenuItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### MenuItem Entity

```typescript
// menu-item.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Menu } from './menu.entity';
import { Page } from './page.entity';
import { MenuItemTranslation } from './menu-item-translation.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Menu, (menu) => menu.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @Column({ name: 'menu_id' })
  @Index()
  menuId: string;

  // Self-referencing untuk nested menu
  @ManyToOne(() => MenuItem, (item) => item.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: MenuItem;

  @Column({ name: 'parent_id', nullable: true })
  @Index()
  parentId: string;

  @OneToMany(() => MenuItem, (item) => item.parent)
  children: MenuItem[];

  @Column()
  title: string;

  @Column({ nullable: true })
  url: string; // External URL atau route path

  // Optional: Link ke halaman internal
  @ManyToOne(() => Page, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'page_id' })
  page: Page;

  @Column({ name: 'page_id', nullable: true })
  pageId: string;

  @Column({ default: '_self' })
  target: string; // '_self', '_blank'

  @Column({ nullable: true })
  icon: string; // Icon class name

  @Column({ default: 0 })
  @Index()
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => MenuItemTranslation, (translation) => translation.menuItem, {
    cascade: true,
  })
  translations: MenuItemTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### MenuItemTranslation Entity

```typescript
// menu-item-translation.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { Language } from './language.entity';

@Entity('menu_item_translations')
@Unique(['menuItemId', 'languageId'])
export class MenuItemTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MenuItem, (item) => item.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column({ name: 'menu_item_id' })
  menuItemId: string;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column({ name: 'language_id' })
  languageId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
```

**Struktur Menu Bersarang:**

```typescript
// Contoh: Menu dengan children
{
  id: 'menu-1',
  title: 'Products',
  url: null,
  children: [
    {
      id: 'menu-1-1',
      title: 'Software',
      url: '/products/software',
      parentId: 'menu-1'
    },
    {
      id: 'menu-1-2',
      title: 'Hardware',
      url: '/products/hardware',
      parentId: 'menu-1'
    }
  ]
}
```

---

## 3. Templates

### 3.1 Template Entity

```typescript
// template.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TemplateBlock } from './template-block.entity';
import { Page } from './page.entity';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string; // 'page', 'blog', 'product', 'landing'

  @Column({ nullable: true })
  previewImage: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by', nullable: true })
  createdById: string;

  @OneToMany(() => TemplateBlock, (block) => block.template, { cascade: true })
  blocks: TemplateBlock[];

  @OneToMany(() => Page, (page) => page.template)
  pages: Page[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 3.2 TemplateBlock Entity

```typescript
// template-block.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Template } from './template.entity';

@Entity('template_blocks')
export class TemplateBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Template, (template) => template.blocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column({ name: 'template_id' })
  @Index()
  templateId: string;

  @Column()
  name: string; // 'hero-section', 'content-area'

  @Column({ nullable: true })
  type: string; // 'predefined', 'custom'

  @Column()
  component: string; // 'HeroWidget', 'ContentBlock'

  @Column('jsonb', { nullable: true })
  props: Record<string, any>; // Component props

  @Column({ default: 0 })
  @Index()
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

**Contoh Template dengan Blocks:**

```typescript
{
  name: 'Blog Post Template',
  slug: 'blog-post-template',
  category: 'blog',
  blocks: [
    {
      name: 'hero',
      type: 'predefined',
      component: 'HeroWidget',
      sortOrder: 1,
      props: {
        height: 'large',
        title: '{{item.title}}',
        subtitle: '{{item.excerpt}}',
        backgroundImage: '{{item.coverImage}}'
      }
    },
    {
      name: 'metadata',
      type: 'custom',
      component: 'Metadata',
      sortOrder: 2,
      props: {
        author: '{{item.author}}',
        date: '{{item.publishedAt}}',
        readTime: '{{item.readTime}}'
      }
    },
    {
      name: 'content',
      type: 'custom',
      component: 'Content',
      sortOrder: 3,
      props: {
        content: '{{item.content}}',
        format: 'html'
      }
    }
  ]
}
```

---

## 4. Pages

### 4.1 Page Entity

```typescript
// page.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Template } from './template.entity';
import { User } from './user.entity';
import { PageBlock } from './page-block.entity';
import { PageTranslation } from './page-translation.entity';

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum PageType {
  STATIC = 'static',
  COLLECTION_LIST = 'collection-list',
  COLLECTION_DETAIL = 'collection-detail',
  LANDING = 'landing',
  CUSTOM = 'custom',
}

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  slug: string; // '/about', '/blog/my-post'

  @ManyToOne(() => Template, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column({ name: 'template_id', nullable: true })
  templateId: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: PageStatus, default: PageStatus.DRAFT })
  @Index()
  status: PageStatus;

  @Column({ type: 'enum', enum: PageType, nullable: true })
  @Index()
  pageType: PageType;

  @Column({ nullable: true })
  pageCategory: string; // 'content', 'commerce', 'portfolio'

  // Untuk collection pages
  @Column({ nullable: true })
  collectionType: string; // 'blog', 'product', 'project'

  @Column({ type: 'uuid', nullable: true })
  collectionItemId: string;

  // SEO
  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @Column({ type: 'text', nullable: true })
  ogImage: string;

  @Column({ type: 'text', nullable: true })
  canonicalUrl: string;

  @Column({ default: false })
  noindex: boolean;

  // Publishing
  @Column({ nullable: true })
  @Index()
  publishedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id', nullable: true })
  authorId: string;

  // Stats
  @Column({ default: 0 })
  viewCount: number;

  @OneToMany(() => PageBlock, (block) => block.page, { cascade: true })
  blocks: PageBlock[];

  @OneToMany(() => PageTranslation, (translation) => translation.page, {
    cascade: true,
  })
  translations: PageTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 4.2 PageBlock Entity

```typescript
// page-block.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Page } from './page.entity';
import { TemplateBlock } from './template-block.entity';

@Entity('page_blocks')
export class PageBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Page, (page) => page.blocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  page: Page;

  @Column({ name: 'page_id' })
  @Index()
  pageId: string;

  // Reference ke template block (jika menggunakan template)
  @ManyToOne(() => TemplateBlock, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'template_block_id' })
  templateBlock: TemplateBlock;

  @Column({ name: 'template_block_id', nullable: true })
  templateBlockId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column()
  component: string;

  @Column('jsonb', { nullable: true })
  props: Record<string, any>; // Override atau custom props

  @Column({ default: 0 })
  @Index()
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 4.3 PageTranslation Entity

```typescript
// page-translation.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Page } from './page.entity';
import { Language } from './language.entity';

@Entity('page_translations')
@Unique(['pageId', 'languageId'])
export class PageTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Page, (page) => page.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  page: Page;

  @Column({ name: 'page_id' })
  pageId: string;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

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

## 5. Collections (Dynamic & Flexible)

> **Catatan Penting**: Sistem collections menggunakan pendekatan **generic/dynamic** sehingga Anda **TIDAK perlu membuat entity baru** setiap kali menambah collection type baru (blog, products, portfolio, dll). Semua collection menggunakan table yang sama dengan field definitions yang fleksibel.

### 5.1 CollectionConfig Entity

Mendefinisikan tipe collection dan field schema-nya.

```typescript
// collection-config.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Template } from './template.entity';
import { CollectionField } from './collection-field.entity';
import { CollectionItem } from './collection-item.entity';

@Entity('collection_configs')
export class CollectionConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  slug: string; // 'blog', 'products', 'projects', 'team-members', dll

  @Column()
  name: string; // 'Blog Posts', 'Products', 'Portfolio'

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string; // Icon untuk UI admin

  // Templates
  @ManyToOne(() => Template, { nullable: true })
  @JoinColumn({ name: 'list_template_id' })
  listTemplate: Template;

  @Column({ name: 'list_template_id', nullable: true })
  listTemplateId: string;

  @ManyToOne(() => Template, { nullable: true })
  @JoinColumn({ name: 'detail_template_id' })
  detailTemplate: Template;

  @Column({ name: 'detail_template_id', nullable: true })
  detailTemplateId: string;

  // Features
  @Column({ default: true })
  supportsCategories: boolean;

  @Column({ default: true })
  supportsTags: boolean;

  @Column({ default: false })
  supportsComments: boolean;

  @Column({ default: false })
  supportsRating: boolean;

  @Column({ default: true })
  supportsMultiLanguage: boolean;

  @Column({ default: true })
  supportsSEO: boolean;

  // Behavior
  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 10 })
  defaultPageSize: number;

  @Column({ default: 'createdAt' })
  defaultSortField: string;

  @Column({ default: 'DESC' })
  defaultSortOrder: string;

  // Relations
  @OneToMany(() => CollectionField, (field) => field.collection, {
    cascade: true,
  })
  fields: CollectionField[];

  @OneToMany(() => CollectionItem, (item) => item.collection)
  items: CollectionItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 5.2 CollectionField Entity

Mendefinisikan field/column yang dimiliki setiap collection type.

```typescript
// collection-field.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { CollectionConfig } from './collection-config.entity';

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RICH_TEXT = 'rich_text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  EMAIL = 'email',
  URL = 'url',
  IMAGE = 'image',
  FILE = 'file',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  JSON = 'json',
  RELATION = 'relation',
}

@Entity('collection_fields')
export class CollectionField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CollectionConfig, (config) => config.fields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  collection: CollectionConfig;

  @Column({ name: 'collection_id' })
  @Index()
  collectionId: string;

  @Column()
  name: string; // 'title', 'content', 'price', 'specifications'

  @Column()
  label: string; // 'Title', 'Content', 'Price', 'Product Specs'

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ default: false })
  isUnique: boolean;

  @Column({ default: true })
  isTranslatable: boolean; // Apakah field ini perlu diterjemahkan

  @Column({ default: true })
  showInList: boolean; // Tampil di list view admin

  @Column({ default: true })
  showInDetail: boolean; // Tampil di detail view

  @Column({ default: true })
  isSearchable: boolean; // Include dalam search query

  @Column({ default: false })
  isFilterable: boolean; // Bisa jadi filter

  @Column({ nullable: true })
  defaultValue: string;

  @Column('jsonb', { nullable: true })
  validationRules: Record<string, any>; // { min: 10, max: 200, pattern: '^[A-Z]' }

  @Column('jsonb', { nullable: true })
  options: Record<string, any>; // Untuk select/multi-select: { choices: ['opt1', 'opt2'] }

  @Column({ default: 0 })
  @Index()
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 5.3 CollectionItem Entity (Generic untuk semua collection)

**INI ADALAH KUNCI**: Satu entity untuk SEMUA collection items (blog, products, portfolio, dll).

```typescript
// collection-item.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { CollectionConfig } from './collection-config.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { CollectionItemTranslation } from './collection-item-translation.entity';

export enum ItemStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled',
}

@Entity('collection_items')
export class CollectionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CollectionConfig, (config) => config.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  collection: CollectionConfig;

  @Column({ name: 'collection_id' })
  @Index()
  collectionId: string;

  @Column({ unique: true })
  @Index()
  slug: string; // Auto-generated atau manual

  @Column()
  title: string; // Title utama (untuk semua jenis collection)

  // ⭐ FIELD UTAMA: Semua data custom disimpan di JSONB
  @Column('jsonb', { default: {} })
  data: Record<string, any>; // Flexible data berdasarkan CollectionField definitions

  @Column({ type: 'enum', enum: ItemStatus, default: ItemStatus.DRAFT })
  @Index()
  status: ItemStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id', nullable: true })
  @Index()
  authorId: string;

  // Publishing
  @Column({ nullable: true })
  @Index()
  publishedAt: Date;

  @Column({ nullable: true })
  scheduledAt: Date;

  // SEO (jika supportsSEO = true)
  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @Column({ nullable: true })
  ogImage: string;

  // Stats
  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number; // Average rating (jika supportsRating = true)

  // Relations (jika diaktifkan di config)
  @ManyToMany(() => Category)
  @JoinTable({
    name: 'collection_item_categories',
    joinColumn: { name: 'item_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'collection_item_tags',
    joinColumn: { name: 'item_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @OneToMany(
    () => CollectionItemTranslation,
    (translation) => translation.item,
    { cascade: true },
  )
  translations: CollectionItemTranslation[];

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 5.4 CollectionItemTranslation Entity

```typescript
// collection-item-translation.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { CollectionItem } from './collection-item.entity';
import { Language } from './language.entity';

@Entity('collection_item_translations')
@Unique(['itemId', 'languageId'])
export class CollectionItemTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CollectionItem, (item) => item.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id' })
  item: CollectionItem;

  @Column({ name: 'item_id' })
  itemId: string;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column({ name: 'language_id' })
  languageId: string;

  @Column()
  title: string;

  // ⭐ Translated data untuk field yang isTranslatable = true
  @Column('jsonb', { default: {} })
  data: Record<string, any>;

  // SEO translations
  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;
}
```

### 5.5 Category & Tag Entities (Generic untuk semua collections)

```typescript
// category.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { CollectionConfig } from './collection-config.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CollectionConfig, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'collection_id' })
  collection: CollectionConfig;

  @Column({ name: 'collection_id', nullable: true })
  @Index()
  collectionId: string; // null = global category

  @Column()
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  color: string;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// tag.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { CollectionConfig } from './collection-config.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CollectionConfig, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'collection_id' })
  collection: CollectionConfig;

  @Column({ name: 'collection_id', nullable: true })
  @Index()
  collectionId: string; // null = global tag

  @Column()
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ nullable: true })
  color: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## Contoh Penggunaan Dynamic Collections

### Contoh 1: Blog Collection

```typescript
// Setup blog collection
const blogCollection = {
  slug: 'blog',
  name: 'Blog Posts',
  icon: 'mdi-post',
  supportsCategories: true,
  supportsTags: true,
  supportsComments: true,
  fields: [
    {
      name: 'excerpt',
      label: 'Excerpt',
      type: FieldType.TEXTAREA,
      isRequired: true,
      isTranslatable: true,
      showInList: true,
    },
    {
      name: 'content',
      label: 'Content',
      type: FieldType.RICH_TEXT,
      isRequired: true,
      isTranslatable: true,
    },
    {
      name: 'featuredImage',
      label: 'Featured Image',
      type: FieldType.IMAGE,
      isRequired: true,
    },
    {
      name: 'readTime',
      label: 'Read Time (minutes)',
      type: FieldType.NUMBER,
      defaultValue: '5',
    },
  ],
};

// Create blog post item
const blogPost = {
  collectionId: 'blog-config-uuid',
  slug: 'my-first-post',
  title: 'My First Blog Post',
  status: ItemStatus.PUBLISHED,
  authorId: 'user-uuid',
  data: {
    excerpt: 'This is a short excerpt...',
    content: '<p>Full blog content here...</p>',
    featuredImage: '/uploads/blog-1.jpg',
    readTime: 5,
  },
  metaTitle: 'My First Blog Post - Website',
  metaDescription: 'Learn about...',
};
```

### Contoh 2: Products Collection

```typescript
// Setup products collection
const productsCollection = {
  slug: 'products',
  name: 'Products',
  icon: 'mdi-shopping',
  supportsCategories: true,
  supportsTags: true,
  supportsRating: true,
  fields: [
    {
      name: 'price',
      label: 'Price',
      type: FieldType.NUMBER,
      isRequired: true,
      validationRules: { min: 0 },
    },
    {
      name: 'salePrice',
      label: 'Sale Price',
      type: FieldType.NUMBER,
      validationRules: { min: 0 },
    },
    {
      name: 'sku',
      label: 'SKU',
      type: FieldType.TEXT,
      isUnique: true,
      isRequired: true,
      isTranslatable: false,
    },
    {
      name: 'description',
      label: 'Description',
      type: FieldType.RICH_TEXT,
      isRequired: true,
      isTranslatable: true,
    },
    {
      name: 'specifications',
      label: 'Specifications',
      type: FieldType.JSON,
      isTranslatable: true,
    },
    {
      name: 'images',
      label: 'Product Images',
      type: FieldType.FILE,
      options: { multiple: true, accept: 'image/*' },
    },
    {
      name: 'inStock',
      label: 'In Stock',
      type: FieldType.BOOLEAN,
      defaultValue: 'true',
    },
    {
      name: 'stockQuantity',
      label: 'Stock Quantity',
      type: FieldType.NUMBER,
      validationRules: { min: 0 },
    },
  ],
};

// Create product item
const product = {
  collectionId: 'products-config-uuid',
  slug: 'awesome-t-shirt',
  title: 'Awesome T-Shirt',
  status: ItemStatus.PUBLISHED,
  data: {
    price: 299000,
    salePrice: 249000,
    sku: 'TSH-001-BLK',
    description: '<p>High quality cotton t-shirt...</p>',
    specifications: {
      material: '100% Cotton',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy'],
    },
    images: ['/uploads/tshirt-1.jpg', '/uploads/tshirt-2.jpg'],
    inStock: true,
    stockQuantity: 50,
  },
  rating: 4.5,
};
```

### Contoh 3: Team Members Collection

```typescript
// Setup team collection
const teamCollection = {
  slug: 'team',
  name: 'Team Members',
  icon: 'mdi-account-group',
  supportsCategories: false,
  supportsTags: false,
  fields: [
    {
      name: 'position',
      label: 'Position',
      type: FieldType.TEXT,
      isRequired: true,
      isTranslatable: true,
    },
    {
      name: 'bio',
      label: 'Biography',
      type: FieldType.TEXTAREA,
      isTranslatable: true,
    },
    {
      name: 'photo',
      label: 'Photo',
      type: FieldType.IMAGE,
      isRequired: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: FieldType.EMAIL,
    },
    {
      name: 'phone',
      label: 'Phone',
      type: FieldType.TEXT,
    },
    {
      name: 'socialLinks',
      label: 'Social Media Links',
      type: FieldType.JSON,
    },
  ],
};
```

---

## 6. Media Library

### 6.1 MediaFile Entity

```typescript
// media-file.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { MediaTranslation } from './media-translation.entity';

@Entity('media_files')
export class MediaFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalFilename: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number; // in bytes

  // For images
  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  // Storage
  @Column({ type: 'text' })
  storagePath: string; // S3 or local path

  @Column({ type: 'text' })
  publicUrl: string;

  // Metadata
  @Column({ nullable: true })
  altText: string;

  @Column({ type: 'text', nullable: true })
  caption: string;

  // Organization
  @Column({ nullable: true })
  @Index()
  folder: string; // '/images/blog', '/images/products'

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;

  @Column({ name: 'uploaded_by' })
  @Index()
  uploadedById: string;

  // Usage tracking
  @Column({ default: 0 })
  usageCount: number;

  @OneToMany(() => MediaTranslation, (translation) => translation.mediaFile, {
    cascade: true,
  })
  translations: MediaTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 6.2 MediaTranslation Entity

```typescript
// media-translation.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { MediaFile } from './media-file.entity';
import { Language } from './language.entity';

@Entity('media_translations')
@Unique(['mediaFileId', 'languageId'])
export class MediaTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MediaFile, (file) => file.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'media_file_id' })
  mediaFile: MediaFile;

  @Column({ name: 'media_file_id' })
  mediaFileId: string;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column({ name: 'language_id' })
  languageId: string;

  @Column({ nullable: true })
  altText: string;

  @Column({ type: 'text', nullable: true })
  caption: string;
}
```

---

## Query Examples

### 1. Ambil Page dengan Blocks dan Translations

```typescript
// page.repository.ts
async findPageBySlug(slug: string, lang?: string) {
  const queryBuilder = this.createQueryBuilder('page')
    .leftJoinAndSelect('page.template', 'template')
    .leftJoinAndSelect('page.blocks', 'blocks')
    .leftJoinAndSelect('page.translations', 'translations')
    .leftJoinAndSelect('translations.language', 'language')
    .leftJoinAndSelect('page.author', 'author')
    .where('page.slug = :slug', { slug })
    .andWhere('page.status = :status', { status: PageStatus.PUBLISHED })
    .orderBy('blocks.sortOrder', 'ASC');

  if (lang) {
    queryBuilder.andWhere('language.id = :lang', { lang });
  }

  return await queryBuilder.getOne();
}
```

### 2. Ambil Menu dengan Nested Items dan Translations

```typescript
// menu.repository.ts
async findMenuWithItems(menuKey: string, lang?: string) {
  const menu = await this.createQueryBuilder('menu')
    .leftJoinAndSelect('menu.items', 'items')
    .leftJoinAndSelect('items.translations', 'translations')
    .leftJoinAndSelect('translations.language', 'language')
    .leftJoinAndSelect('items.children', 'children')
    .leftJoinAndSelect('children.translations', 'childrenTranslations')
    .where('menu.key = :menuKey', { menuKey })
    .andWhere('menu.isActive = :isActive', { isActive: true })
    .andWhere('items.parentId IS NULL') // Only root items
    .orderBy('items.sortOrder', 'ASC')
    .addOrderBy('children.sortOrder', 'ASC')
    .getOne();

  if (lang) {
    // Filter translations by language
    menu.items = menu.items.map(item => ({
      ...item,
      translations: item.translations.filter(t => t.languageId === lang)
    }));
  }

  return menu;
}
```

### 3. Query Collection Items dengan Filter (DYNAMIC)

````typescript
// collection-item.repository.ts
async findCollectionItems(options: {
  collectionSlug: string;
  status?: ItemStatus;
  categoryId?: string;
  tagId?: string;
  search?: string;
  lang?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}) {
  const {
    collectionSlug,
    status = ItemStatus.PUBLISHED,
    categoryId,
    tagId,
    search,
    lang,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
  } = options;

  // Get collection config
  const collection = await this.collectionConfigRepository.findOne({
    where: { slug: collectionSlug },
    relations: ['fields'],
  });

  if (!collection) {
    throw new NotFoundException('Collection not found');
  }

  const queryBuilder = this.createQueryBuilder('item')
    .leftJoinAndSelect('item.collection', 'collection')
    .leftJoinAndSelect('item.author', 'author')
    .leftJoinAndSelect('item.translations', 'translations')
    .leftJoinAndSelect('translations.language', 'language')
    .leftJoinAndSelect('item.categories', 'categories')
    .leftJoinAndSelect('item.tags', 'tags')
    .where('collection.slug = :collectionSlug', { collectionSlug })
    .andWhere('item.status = :status', { status });

  // Filter by category
  if (categoryId) {
    queryBuilder.andWhere('categories.id = :categoryId', { categoryId });
## Best Practices

### 1. Indexes

- Tambahkan index pada kolom yang sering di-query (`slug`, `status`, `publishedAt`)
- Gunakan composite index untuk query multi-kolom
- **PENTING untuk JSONB**: Tambahkan GIN index untuk query JSONB field
  ```sql
  CREATE INDEX idx_collection_items_data ON collection_items USING GIN (data);
````

- Index foreign keys untuk JOIN performance

### 2. JSONB vs Relational

- ✅ Gunakan JSONB untuk:
  - Custom fields yang berbeda tiap collection
  - Data yang struktur-nya sering berubah
  - Data yang tidak perlu complex query
- ✅ Gunakan relational columns untuk:
  - Data yang perlu index (slug, status, dates)
  - Data yang perlu foreign key constraints
  - Data yang sering di-query dengan complex conditions

### 3. JSONB Query Optimization

```typescript
// BAD: N+1 query problem
for (const item of items) {
  const price = item.data.price; // Accessing JSONB in loop
}

// GOOD: Select JSONB fields in query
const items = await this.createQueryBuilder('item')
  .select([
    'item.id',
    'item.title',
    "item.data->>'price' as price",
    "item.data->>'sku' as sku",
  ])
  .getRawMany();
```

### 4. Validation Strategy

- Validate data structure menggunakan field definitions dari CollectionField
- Implementasi validation di service layer, bukan di entity
- Contoh:

```typescript
// collection-item.service.ts
## Kesimpulan

Struktur database ini menyediakan:

✅ **Fleksibilitas Maksimal** - JSONB untuk data dinamis, relational untuk structured data
✅ **Dynamic Collections** - **TIDAK perlu entity baru** untuk setiap collection type
✅ **Multi-bahasa** - Translation tables untuk semua konten
✅ **Hierarki** - Support untuk nested menus dan blocks
✅ **Scalability** - Proper indexing dan query optimization
✅ **Type Safety** - TypeORM entities dengan TypeScript
✅ **Schema Evolution** - Tambah field baru tanpa migration
✅ **Audit Trail** - Tracking user actions dan timestamps

### Keuntungan Pendekatan Dynamic Collections

| Aspek | Approach Lama (Per-Entity) | Approach Baru (Dynamic) |
|-------|---------------------------|-------------------------|
| **Menambah Collection Baru** | Buat entity baru + migration | Insert config data saja |
| **Menambah Field** | Alter table + migration | Update field definition |
| **Database Tables** | 1 table per collection (10+ tables) | 1 table untuk semua (3 tables) |
| **Backend Code** | 1 entity + repository per collection | 1 generic entity untuk semua |
| **Maintenance** | High (banyak file) | Low (reusable code) |
| **Type Safety** | Strong (TypeScript types) | Medium (validation runtime) |
| **Query Complexity** | Simple (SQL columns) | Medium (JSONB queries) |
| **Performance** | Excellent (indexed columns) | Good (GIN indexed JSONB) |

### Kapan Menggunakan Dynamic vs Static Entity?

**Gunakan Dynamic Collections untuk:**
- ✅ Content yang struktur field-nya sering berubah
- ✅ Content yang dibuat oleh non-developer via admin UI
- ✅ Content yang banyak variasinya (blog, products, portfolio, team, etc)
- ✅ Prototype/MVP yang perlu cepat iterate

**Gunakan Static Entity untuk:**
- ✅ Core system tables (users, languages, menus)
- ✅ Data dengan business logic complex
- ✅ Data yang perlu strict type safety
- ✅ Data dengan many-to-many relationships complex

### File Terkait

- `CMS_DATABASE_ERD.drawio` - Diagram ERD visual
- `IMPLEMENTATION_ROADMAP.md` - Task breakdown
- `DYNAMIC_CMS_GUIDE.md` - Panduan lengkap sistem CMS ${field.name}`);
    }

    // Validation rules
    if (field.validationRules) {
      this.applyValidationRules(field.name, value, field.validationRules);
    }
  }
}
```

### 5. Soft Delete

- Tambahkan `deletedAt` column untuk soft delete
- Implementasi global scope untuk filter deleted records

### 6. Audit Trail

- Tambahkan `createdBy`, `updatedBy` untuk tracking changes
- Implementasi event listeners untuk log perubahan

### 7. Performance

- Eager load relations yang sering digunakan
- Lazy load relations yang jarang digunakan
- Gunakan pagination untuk listing
- **Implementasi caching untuk collection configs** (jarang berubah)
- Cache rendered pages dengan Redis/Memcached
- Gunakan database views untuk complex queries

### 8. Migration Strategy untuk Dynamic Collections

```typescript
// Ketika menambah collection baru, TIDAK perlu migration!
// Cukup insert data ke collection_configs dan collection_fields

async createNewCollection(dto: CreateCollectionDto) {
  // 1. Create collection config
  const config = await this.collectionConfigRepository.save({
    slug: dto.slug,
    name: dto.name,
    // ... other config
  });

  // 2. Create field definitions
  for (const field of dto.fields) {
    await this.collectionFieldRepository.save({
      collectionId: config.id,
      name: field.name,
      label: field.label,
      type: field.type,
      // ... other field config
    });
  }

  return config;
}
```

    }

}

// Filter by language
if (lang) {
queryBuilder.andWhere('language.id = :lang', { lang });
}

// Sorting
if (sortBy === 'title' || sortBy === 'createdAt' || sortBy === 'publishedAt') {
queryBuilder.orderBy(`item.${sortBy}`, sortOrder);
} else {
// Sort by custom field in JSONB
queryBuilder.orderBy(`item.data->>'${sortBy}'`, sortOrder);
}

const [items, total] = await queryBuilder
.skip((page - 1) \* limit)
.take(limit)
.getManyAndCount();

return {
data: items,
total,
page,
limit,
totalPages: Math.ceil(total / limit),
collection,
};
}

````

### 4. Query Single Collection Item dengan Translations

```typescript
// collection-item.repository.ts
async findCollectionItemBySlug(
  collectionSlug: string,
  itemSlug: string,
  lang?: string
) {
  const queryBuilder = this.createQueryBuilder('item')
    .leftJoinAndSelect('item.collection', 'collection')
    .leftJoinAndSelect('collection.fields', 'fields')
    .leftJoinAndSelect('item.author', 'author')
    .leftJoinAndSelect('item.translations', 'translations')
    .leftJoinAndSelect('translations.language', 'language')
    .leftJoinAndSelect('item.categories', 'categories')
    .leftJoinAndSelect('item.tags', 'tags')
    .where('collection.slug = :collectionSlug', { collectionSlug })
    .andWhere('item.slug = :itemSlug', { itemSlug })
    .andWhere('item.status = :status', { status: ItemStatus.PUBLISHED });

  if (lang) {
    queryBuilder.andWhere('language.id = :lang', { lang });
  }

  const item = await queryBuilder.getOne();

  if (item) {
    // Increment view count
    await this.increment({ id: item.id }, 'viewCount', 1);
  }

  return item;
}
````

### 5. Filter Collection Items dengan JSONB Query

```typescript
// Contoh: Filter products dengan price range
async findProductsInPriceRange(minPrice: number, maxPrice: number) {
  return await this.createQueryBuilder('item')
    .leftJoinAndSelect('item.collection', 'collection')
    .where('collection.slug = :slug', { slug: 'products' })
    .andWhere(
      `(item.data->>'price')::numeric BETWEEN :minPrice AND :maxPrice`,
      { minPrice, maxPrice }
    )
    .andWhere('item.status = :status', { status: ItemStatus.PUBLISHED })
    .orderBy(`(item.data->>'price')::numeric`, 'ASC')
    .getMany();
}

// Contoh: Filter items dengan boolean field
async findInStockProducts() {
  return await this.createQueryBuilder('item')
    .leftJoinAndSelect('item.collection', 'collection')
    .where('collection.slug = :slug', { slug: 'products' })
    .andWhere(`(item.data->>'inStock')::boolean = true`)
    .andWhere('item.status = :status', { status: ItemStatus.PUBLISHED })
    .getMany();
}

// Contoh: Filter dengan JSON contains
async findProductsBySpecification(spec: Record<string, any>) {
  return await this.createQueryBuilder('item')
    .leftJoinAndSelect('item.collection', 'collection')
    .where('collection.slug = :slug', { slug: 'products' })
    .andWhere(`item.data->'specifications' @> :spec`, {
      spec: JSON.stringify(spec),
    })
    .getMany();
}
```

---

## Best Practices

### 1. Indexes

- Tambahkan index pada kolom yang sering di-query (`slug`, `status`, `publishedAt`)
- Gunakan composite index untuk query multi-kolom
- Index foreign keys untuk JOIN performance

### 2. JSONB vs Relational

- Gunakan JSONB untuk data yang fleksibel dan jarang di-query
- Gunakan relational tables untuk data yang perlu di-filter/search

### 3. Soft Delete

- Tambahkan `deletedAt` column untuk soft delete
- Implementasi global scope untuk filter deleted records

### 4. Audit Trail

- Tambahkan `createdBy`, `updatedBy` untuk tracking changes
- Implementasi event listeners untuk log perubahan

### 5. Performance

- Eager load relations yang sering digunakan
- Lazy load relations yang jarang digunakan
- Gunakan pagination untuk listing
- Implementasi caching untuk data yang jarang berubah

---

## Migration Commands

```bash
# Generate migration
npm run typeorm migration:generate -- -n CreateUsersTable

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert

# Show migrations
npm run typeorm migration:show
```

---

## Kesimpulan

Struktur database ini menyediakan:

✅ **Fleksibilitas** - JSONB untuk data dinamis, relational untuk structured data
✅ **Multi-bahasa** - Translation tables untuk semua konten
✅ **Hierarki** - Support untuk nested menus dan blocks
✅ **Scalability** - Proper indexing dan query optimization
✅ **Type Safety** - TypeORM entities dengan TypeScript
✅ **Audit Trail** - Tracking user actions dan timestamps

### File Terkait

- `CMS_DATABASE_ERD.drawio` - Diagram ERD visual
- `IMPLEMENTATION_ROADMAP.md` - Task breakdown
- `DYNAMIC_CMS_GUIDE.md` - Panduan lengkap sistem CMS

export interface ComponentContent {
  [key: string]: any;
}

export interface ComponentConfig {
  name: string;
  component: string;
  props?: Record<string, any>;
  content?: ComponentContent;
  components?: ComponentConfig[]; // Support nested components (e.g., for BaseLayout children)
  children?: ComponentConfig[]; // For wrapper-style blocks that have a single child component
}

export interface BlockConfig {
  id?: string; // Unique block identifier
  name: string;
  type?: 'predefined' | 'custom'; // Optional: defaults to 'custom' for backward compatibility
  component?: string; // For predefined widgets: 'HeroWidget', 'FeaturesWidget', etc.
  components?: ComponentConfig[]; // For custom blocks: array of field components,
  child?: ComponentConfig; // For custom blocks with a single child component (e.g., wrapper)

  // CLEAR SEPARATION:
  props?: Record<string, any>; // Component configuration (class, style, layout settings)
  content?: Record<string, any>; // Actual content/data (text, images, data to display)

  // HTML override capability
  html?: string; // Custom HTML override for the block
  sortOrder?: number; // Display order
}

// Block definition for management
export interface BlockDefinition {
  id?: string;
  name: string;
  slug: string;
  category: 'layout' | 'content' | 'media' | 'interactive' | 'custom';
  description?: string;
  icon?: string;
  component: string;

  // Default configuration
  defaultProps?: Record<string, any>;
  defaultContent?: Record<string, any>;

  // Configuration schema for admin UI
  propsSchema?: BlockPropsSchema;
  contentSchema?: BlockContentSchema;

  // Preview
  previewHtml?: string;
  thumbnail?: string;

  // Metadata
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Schema definitions for dynamic form generation
export interface BlockPropsSchema {
  [key: string]: {
    type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'json';
    label: string;
    default?: any;
    options?: Array<{ label: string; value: any }>;
    description?: string;
  };
}

export interface BlockContentSchema {
  [key: string]: {
    type: 'text' | 'textarea' | 'richtext' | 'image' | 'number' | 'json';
    label: string;
    default?: any;
    description?: string;
    required?: boolean;
  };
}

// Page type classification
export type PageType =
  | 'static' // Regular page (about, contact)
  | 'collection-list' // Shows list of items
  | 'collection-detail' // Shows single item
  | 'landing' // Marketing landing page
  | 'custom'; // Custom template

// Page category classification
export type PageCategory =
  | 'content' // Blog, articles
  | 'commerce' // Products, services
  | 'portfolio' // Projects, work
  | 'community' // Forums, members
  | 'utility'; // Search, 404, etc.

// Collection metadata for list and detail pages
export interface CollectionMeta {
  type: string; // 'blog', 'product', 'project'
  isDetail: boolean; // true for detail pages
  itemId?: string | number; // ID of specific item
  itemSlug?: string; // Slug of specific item
  parentPage?: string; // Link back to listing

  // For listing pages
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;

  // For detail pages - navigation between items
  previousItem?: {
    slug: string;
    title: string;
  };
  nextItem?: {
    slug: string;
    title: string;
  };
}

// Enhanced SEO metadata
export interface SEOMeta {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;

  // For detail pages
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  type?: 'website' | 'article' | 'product';

  // Additional fields
  [key: string]: any;
}

// Page metadata - explicit page type and category
export interface PageMeta {
  type: PageType; // Explicit page type
  category?: PageCategory; // Optional category
  template?: string; // Optional template name
  collection?: CollectionMeta; // Collection-specific data
}

// Main page configuration
export interface PageConfig {
  id?: string; // Unique page identifier
  name: string; // Page name (legacy)
  path: string; // URL path
  title?: string; // Page title

  meta: PageMeta; // Enhanced page metadata
  seoMeta?: SEOMeta; // Enhanced SEO metadata
  blocks: BlockConfig[]; // Content blocks
}

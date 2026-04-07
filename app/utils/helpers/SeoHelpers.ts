/**
 * SEO Helpers Utility
 * Collection of functions for managing SEO meta tags and structured data
 */

import type { PageConfig } from '#shared/types';

/**
 * Page type enumeration
 */
export enum PageType {
  Static = 'static',
  Landing = 'landing',
  CollectionList = 'collection-list',
  CollectionDetail = 'collection-detail',
}

/**
 * Check if page is a collection detail page
 */
export function isDetailPage(pageConfig: PageConfig): boolean {
  return pageConfig.meta.type === PageType.CollectionDetail;
}

/**
 * Check if page is a collection listing page
 */
export function isListingPage(pageConfig: PageConfig): boolean {
  return pageConfig.meta.type === PageType.CollectionList;
}

/**
 * Check if page is a static page
 */
export function isStaticPage(pageConfig: PageConfig): boolean {
  return pageConfig.meta.type === PageType.Static;
}

/**
 * Check if page is a landing page
 */
export function isLandingPage(pageConfig: PageConfig): boolean {
  return pageConfig.meta.type === PageType.Landing;
}

/**
 * Get page type classes for styling
 * 
 * @param pageConfig - Page configuration object
 * @returns Object with CSS class flags
 * 
 * @example
 * const classes = getPageTypeClasses(pageConfig);
 * // Returns: { 'page-detail': true, 'page-listing': false, ... }
 */
export function getPageTypeClasses(pageConfig: PageConfig): Record<string, boolean> {
  console.log('[SEO Helpers] Determining page type classes for page:', pageConfig);
  return {
    'page-detail': isDetailPage(pageConfig),
    'page-listing': isListingPage(pageConfig),
    'page-static': isStaticPage(pageConfig),
    'page-landing': isLandingPage(pageConfig),
  };
}

/**
 * Schema.org type definitions
 */
export enum SchemaType {
  Article = 'Article',
  Product = 'Product',
  WebSite = 'WebSite',
  Organization = 'Organization',
  Person = 'Person',
  Event = 'Event',
  Recipe = 'Recipe',
  VideoObject = 'VideoObject',
  Course = 'Course',
  JobPosting = 'JobPosting',
}

/**
 * Field mapping configuration for schema types
 * Maps PageConfig fields to Schema.org properties
 */
interface SchemaFieldMapping {
  /** Required fields that must be present */
  required: Record<string, string | ((config: PageConfig) => any)>;
  /** Optional fields that are added if present */
  optional?: Record<string, string | ((config: PageConfig) => any)>;
}

/**
 * Schema type mappings - defines how to build each schema type
 * Easily extensible for new schema types
 */
const SCHEMA_MAPPINGS: Record<string, SchemaFieldMapping> = {
  [SchemaType.Article]: {
    required: {
      headline: 'seoMeta.title',
      description: 'seoMeta.description',
    },
    optional: {
      image: 'seoMeta.ogImage',
      datePublished: 'seoMeta.publishedDate',
      dateModified: 'seoMeta.modifiedDate',
      author: (config) => config.seoMeta?.author ? {
        '@type': 'Person',
        name: config.seoMeta.author,
      } : undefined,
    },
  },
  [SchemaType.Product]: {
    required: {
      name: 'seoMeta.title',
      description: 'seoMeta.description',
    },
    optional: {
      image: 'seoMeta.ogImage',
      brand: (config) => {
        const product = (config.meta as any).product;
        return product?.brand ? {
          '@type': 'Brand',
          name: product.brand,
        } : undefined;
      },
      offers: (config) => {
        const product = (config.meta as any).product;
        return product?.price ? {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency || 'USD',
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        } : undefined;
      },
    },
  },
  [SchemaType.WebSite]: {
    required: {
      name: 'seoMeta.title',
      description: 'seoMeta.description',
      url: 'path',
    },
  },
  [SchemaType.Event]: {
    required: {
      name: 'seoMeta.title',
      description: 'seoMeta.description',
    },
    optional: {
      startDate: 'meta.event.startDate',
      endDate: 'meta.event.endDate',
      location: (config) => {
        const event = (config.meta as any).event;
        return event?.location ? {
          '@type': 'Place',
          name: event.location,
        } : undefined;
      },
      image: 'seoMeta.ogImage',
    },
  },
  [SchemaType.Recipe]: {
    required: {
      name: 'seoMeta.title',
      description: 'seoMeta.description',
    },
    optional: {
      image: 'seoMeta.ogImage',
      author: (config) => config.seoMeta?.author ? {
        '@type': 'Person',
        name: config.seoMeta.author,
      } : undefined,
      prepTime: 'meta.recipe.prepTime',
      cookTime: 'meta.recipe.cookTime',
      recipeIngredient: 'meta.recipe.ingredients',
      recipeInstructions: 'meta.recipe.instructions',
    },
  },
};

/**
 * Get nested value from object using dot notation path
 * Safely traverses object properties
 * 
 * @param obj - Source object
 * @param path - Dot-separated path (e.g., 'seoMeta.title')
 * @returns Value at path or undefined
 */
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Build structured data dynamically based on schema type and field mappings
 * Flexible and extensible for any Schema.org type
 * 
 * @param schemaType - Schema.org type to build
 * @param pageConfig - Page configuration
 * @returns Structured data object
 * 
 * @example
 * const articleSchema = buildStructuredData(SchemaType.Article, pageConfig);
 * const productSchema = buildStructuredData(SchemaType.Product, pageConfig);
 */
export function buildStructuredData(
  schemaType: SchemaType,
  pageConfig: PageConfig
): Record<string, any> {
  if (!pageConfig.seoMeta) return {};

  const mapping = SCHEMA_MAPPINGS[schemaType];
  if (!mapping) {
    console.warn(`[SEO] No schema mapping found for type: ${schemaType}`);
    return {};
  }

  // Initialize with context and type
  const structuredData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
  };

  // Process required fields
  for (const [schemaField, source] of Object.entries(mapping.required)) {
    const value = typeof source === 'function'
      ? source(pageConfig)
      : getValueByPath(pageConfig, source);

    if (value !== undefined && value !== null && value !== '') {
      structuredData[schemaField] = value;
    } else {
      console.warn(`[SEO] Missing required field '${schemaField}' for ${schemaType}`);
    }
  }

  // Process optional fields
  if (mapping.optional) {
    for (const [schemaField, source] of Object.entries(mapping.optional)) {
      const value = typeof source === 'function'
        ? source(pageConfig)
        : getValueByPath(pageConfig, source);

      if (value !== undefined && value !== null && value !== '') {
        structuredData[schemaField] = value;
      }
    }
  }

  return structuredData;
}

/**
 * Register a custom schema type mapping
 * Allows extending with custom schema types at runtime
 * 
 * @param schemaType - Schema type name
 * @param mapping - Field mapping configuration
 * 
 * @example
 * registerSchemaType('CustomType', {
 *   required: { name: 'seoMeta.title' },
 *   optional: { customField: 'meta.custom.field' }
 * });
 */
export function registerSchemaType(schemaType: string, mapping: SchemaFieldMapping): void {
  SCHEMA_MAPPINGS[schemaType] = mapping;
}

/**
 * Collection type to Schema.org type mapping
 * Maps CMS collection types to appropriate schema types
 */
const COLLECTION_SCHEMA_MAP: Record<string, SchemaType> = {
  blog: SchemaType.Article,
  article: SchemaType.Article,
  news: SchemaType.Article,
  product: SchemaType.Product,
  event: SchemaType.Event,
  recipe: SchemaType.Recipe,
  video: SchemaType.VideoObject,
  course: SchemaType.Course,
  job: SchemaType.JobPosting,
};

/**
 * Get structured data based on page type and collection type
 * Automatically determines the appropriate schema type
 * 
 * @param pageConfig - Page configuration
 * @returns Structured data object
 * 
 * @example
 * const structuredData = getStructuredData(pageConfig);
 * // Returns article/product/website schema based on page type
 */
export function getStructuredData(pageConfig: PageConfig): Record<string, any> {
  const collectionType = pageConfig.meta.collection?.type;

  // Detail pages - use collection-specific schema
  if (isDetailPage(pageConfig) && collectionType) {
    const schemaType = COLLECTION_SCHEMA_MAP[collectionType] || SchemaType.Article;
    return buildStructuredData(schemaType, pageConfig);
  }

  // Default to website schema for listing/static/landing pages
  return buildStructuredData(SchemaType.WebSite, pageConfig);
}

/**
 * Register a custom collection to schema type mapping
 * Allows extending with custom mappings at runtime
 * 
 * @param collectionType - Collection type name
 * @param schemaType - Schema.org type to use
 * 
 * @example
 * registerCollectionSchema('portfolio', SchemaType.Article);
 */
export function registerCollectionSchema(collectionType: string, schemaType: SchemaType): void {
  COLLECTION_SCHEMA_MAP[collectionType] = schemaType;
}

/**
 * Build meta tags array from SEO config
 * 
 * @param pageConfig - Page configuration with SEO meta
 * @returns Array of meta tag objects
 * 
 * @example
 * const metaTags = buildMetaTags(pageConfig);
 * // Returns: [{ name: 'description', content: '...' }, ...]
 */
export function buildMetaTags(pageConfig: PageConfig): Array<Record<string, string>> {
  if (!pageConfig.seoMeta) return [];

  const tags: Array<Record<string, string>> = [
    { name: 'description', content: pageConfig.seoMeta.description || '' },
    { property: 'og:type', content: pageConfig.seoMeta.type || 'website' },
    { property: 'og:title', content: pageConfig.seoMeta.title || '' },
    {
      property: 'og:description',
      content: pageConfig.seoMeta.description || '',
    },
  ];

  // Optional meta tags
  if (pageConfig.seoMeta.ogImage) {
    tags.push({ property: 'og:image', content: pageConfig.seoMeta.ogImage });
  }

  if (pageConfig.seoMeta.author) {
    tags.push({ name: 'author', content: pageConfig.seoMeta.author });
  }

  if (pageConfig.seoMeta.keywords) {
    const keywords = Array.isArray(pageConfig.seoMeta.keywords)
      ? pageConfig.seoMeta.keywords.join(', ')
      : pageConfig.seoMeta.keywords;
    tags.push({ name: 'keywords', content: keywords });
  }

  // Twitter Card meta tags
  if (pageConfig.seoMeta.twitterCard) {
    tags.push({ name: 'twitter:card', content: pageConfig.seoMeta.twitterCard });
  }

  if (pageConfig.seoMeta.twitterSite) {
    tags.push({ name: 'twitter:site', content: pageConfig.seoMeta.twitterSite });
  }

  return tags;
}

/**
 * Build link tags array from SEO config
 * 
 * @param pageConfig - Page configuration with SEO meta
 * @returns Array of link tag objects
 */
export function buildLinkTags(pageConfig: PageConfig): Array<Record<string, string>> {
  if (!pageConfig.seoMeta) return [];

  const links: Array<Record<string, string>> = [];

  if (pageConfig.seoMeta.canonical) {
    links.push({ rel: 'canonical', href: pageConfig.seoMeta.canonical });
  }

  return links;
}

/**
 * Build complete SEO head configuration
 * Combines title, meta tags, link tags, and structured data
 * 
 * @param pageConfig - Page configuration
 * @returns Head configuration object for useHead()
 * 
 * @example
 * const headConfig = buildSeoHead(pageConfig);
 * useHead(headConfig);
 */
export function buildSeoHead(pageConfig: PageConfig): Record<string, any> {
  if (!pageConfig.seoMeta) return {};

  const structuredData = getStructuredData(pageConfig);

  return {
    title: pageConfig.seoMeta.title,
    meta: buildMetaTags(pageConfig),
    link: buildLinkTags(pageConfig),
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData),
      },
    ],
  };
}

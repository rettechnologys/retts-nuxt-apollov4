import { createError, getMethod, getRouterParams, readBody } from 'h3';
import {
  getCollectionSchemaStore,
  getItemsForCollection,
} from '~~/server/utils/collectionStore';

type PreviewBindingMode = 'config' | 'flat';
type DemoPageStatus = 'draft' | 'published' | 'scheduled' | 'archived';
type DemoPageType =
  | 'static'
  | 'collection-list'
  | 'collection-detail'
  | 'landing'
  | 'custom';
type DemoPageCategory =
  | 'content'
  | 'commerce'
  | 'portfolio'
  | 'community'
  | 'utility';

interface DemoField {
  key: string;
  type: string;
  defaultValue?: any;
  fields?: DemoField[];
  of?: DemoField[];
  itemShape?: 'primitive' | 'object';
}

interface DemoSection {
  key: string;
  label: string;
  description?: string;
  fields: DemoField[];
}

interface DemoBlockSchema {
  global: DemoSection[];
  content: DemoSection[];
}

interface DemoDataSource {
  collection: string;
  mode: 'list' | 'single';
  fieldMappings: Record<string, string>;
}

interface DemoBlockDefinition {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  category: string;
  defaultConfig: DemoBlockSchema;
  previewMode: PreviewBindingMode;
  dataSource?: DemoDataSource;
}

interface DemoPageSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

interface DemoPageSettings {
  isHomepage: boolean;
  requireAuth: boolean;
  allowComments: boolean;
  showInMenu: boolean;
  menuOrder: number;
  parentPageId: number | null;
  customCSS: string;
  customJS: string;
}

interface DemoPagePayload {
  id?: string;
  title: string;
  slug: string;
  status: DemoPageStatus;
  type: string;
  blocks: DemoBlockDefinition[];
  seo: DemoPageSEO;
  settings: DemoPageSettings;
  publishedAt?: string;
  scheduledAt?: string;
}

interface DemoComponentContent {
  [key: string]: any;
}

interface DemoComponentConfig {
  name: string;
  component: string;
  props?: Record<string, any>;
  content?: DemoComponentContent;
  components?: DemoComponentConfig[];
  children?: DemoComponentConfig[];
}

interface DemoBlockConfig {
  id?: string;
  name: string;
  type?: 'predefined' | 'custom';
  component?: string;
  components?: DemoComponentConfig[];
  child?: DemoComponentConfig;
  props?: Record<string, any>;
  content?: Record<string, any>;
  html?: string;
  sortOrder?: number;
  dataSource?: DemoDataSource;
  collectionItems?: Array<Record<string, any>>;
}

interface DemoCollectionMeta {
  type: string;
  isDetail: boolean;
  itemId?: string | number;
  itemSlug?: string;
  parentPage?: string;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
}

interface DemoSEOMeta {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  type?: 'website' | 'article' | 'product';
}

interface DemoPageMeta {
  type: DemoPageType;
  category?: DemoPageCategory;
  template?: string;
  collection?: DemoCollectionMeta;
}

interface DemoPageConfig {
  id?: string;
  name: string;
  path: string;
  title?: string;
  meta: DemoPageMeta;
  seoMeta?: DemoSEOMeta;
  blocks: DemoBlockConfig[];
}

interface DemoStoredPage {
  payload: DemoPagePayload;
  pageConfig: DemoPageConfig;
  savedAt: string;
}

type DemoPageStore = Map<string, DemoStoredPage>;

const getDemoPageStore = (): DemoPageStore => {
  const globalState = globalThis as typeof globalThis & {
    __demoPageStore?: DemoPageStore;
  };

  if (!globalState.__demoPageStore) {
    globalState.__demoPageStore = new Map();
  }

  return globalState.__demoPageStore;
};

const cloneValue = <T>(value: T): T => {
  if (value === undefined || value === null) return value;

  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value)) as T;
  }
};

const normalizeSlugPath = (slugPath: string): string => {
  const normalized = slugPath.replace(/^\/+|\/+$/g, '');
  return normalized || 'home';
};

const mapPageType = (type: string): DemoPageType => {
  switch (type) {
    case 'home':
    case 'landing':
      return 'landing';
    default:
      return 'static';
  }
};

const mapPageCategory = (type: string): DemoPageCategory => {
  switch (type) {
    case 'blog':
      return 'content';
    default:
      return 'utility';
  }
};

const parseJsonIfPossible = (value: any): any => {
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const buildDefaultValueFromField = (field: DemoField): any => {
  if (field.defaultValue !== undefined) {
    return field.type === 'json'
      ? parseJsonIfPossible(cloneValue(field.defaultValue))
      : cloneValue(field.defaultValue);
  }

  if (field.type === 'object') {
    return buildValuesFromFields(field.fields ?? []);
  }

  if (field.type === 'array') {
    return [];
  }

  if (field.type === 'checkbox' || field.type === 'toggle') {
    return false;
  }

  if (field.type === 'multiselect') {
    return [];
  }

  if (field.type === 'number') {
    return null;
  }

  if (field.type === 'file') {
    return null;
  }

  return '';
};

const buildValuesFromFields = (fields: DemoField[]): Record<string, any> => {
  return Object.fromEntries(
    fields.map((field) => [field.key, buildDefaultValueFromField(field)]),
  );
};

const buildSectionValues = (sections: DemoSection[]): Record<string, any> => {
  return Object.assign(
    {},
    ...sections.map((section) => buildValuesFromFields(section.fields)),
  );
};

const buildBlockValuesFromSchema = (schema: DemoBlockSchema) => {
  return {
    globalProps: buildSectionValues(schema.global),
    content: buildSectionValues(schema.content),
  };
};

const mergeBlockValues = (values: {
  globalProps: Record<string, any>;
  content: Record<string, any>;
}) => ({
  ...cloneValue(values.globalProps),
  ...cloneValue(values.content),
});

const applyFieldMappings = (
  items: Array<{ id: string; data: Record<string, any> }>,
  mappings: Record<string, string>,
  mode: 'list' | 'single',
): Array<Record<string, any>> => {
  const hasMappings = Object.keys(mappings).length > 0;
  const mapped = items.map((item) => {
    if (hasMappings) {
      const out: Record<string, any> = {};
      for (const [colField, blockKey] of Object.entries(mappings)) {
        out[blockKey] = item.data[colField];
      }
      return out;
    }
    return { ...item.data };
  });
  return mode === 'single' ? mapped.slice(0, 1) : mapped;
};

const resolveCollectionItems = (
  dataSource: DemoDataSource,
): Array<Record<string, any>> => {
  const schemaStore = getCollectionSchemaStore();
  if (!schemaStore.has(dataSource.collection)) return [];
  const raw = Array.from(getItemsForCollection(dataSource.collection).values());
  return applyFieldMappings(
    raw,
    dataSource.fieldMappings ?? {},
    dataSource.mode,
  );
};

const normalizeBlock = (
  block: DemoBlockDefinition,
  index: number,
): DemoBlockConfig => {
  const values = buildBlockValuesFromSchema(block.defaultConfig);
  const merged = mergeBlockValues(values);
  const base: DemoBlockConfig = {
    id: `${block.id}-${index}`,
    name: block.name,
    type: 'predefined',
    component: block.type,
    props: block.previewMode === 'config' ? { config: merged } : merged,
    content: values.content,
    sortOrder: index,
  };
  if (block.dataSource?.collection) {
    base.dataSource = block.dataSource;
    base.collectionItems = resolveCollectionItems(block.dataSource);
  }
  return base;
};

const buildPageConfigFromPayload = (
  payload: DemoPagePayload,
): DemoPageConfig => {
  const slugPath = normalizeSlugPath(payload.slug);

  return {
    id: payload.id ?? slugPath,
    name: payload.slug || payload.title || slugPath,
    title: payload.title,
    path: slugPath === 'home' ? '/' : `/${slugPath}`,
    meta: {
      type: mapPageType(payload.type),
      category: mapPageCategory(payload.type),
    },
    seoMeta: {
      title: payload.seo.metaTitle || payload.title,
      description: payload.seo.metaDescription || '',
      ogImage: payload.seo.ogImage,
      canonical: payload.seo.canonical,
      keywords: payload.seo.keywords,
      noindex: payload.seo.noIndex,
      nofollow: payload.seo.noFollow,
      type: 'website',
    },
    blocks: (payload.blocks ?? []).map(normalizeBlock),
  };
};

const createFallbackHomePage = (): DemoPageConfig => ({
  id: 'landing',
  name: 'landing',
  title: 'landing',
  path: '/',
  meta: {
    type: 'landing',
    category: 'utility',
  },
  seoMeta: {
    title: 'Home',
    description: 'Demo home page',
    type: 'website',
  },
  blocks: [],
});

export default defineEventHandler(async (event) => {
  const method = event.method;
  const params = getRouterParams(event);
  const rawSlug = params.slug || '';
  const slugPath = normalizeSlugPath(
    Array.isArray(rawSlug) ? rawSlug.join('/') : rawSlug,
  );
  const pageStore = getDemoPageStore();

  console.log(`[API Pages] ${method}:`, slugPath);

  // if (method === 'POST') {
  //   const payload = await readBody<DemoPagePayload>(event);

  //   if (!payload?.title?.trim()) {
  //     throw createError({
  //       statusCode: 400,
  //       message: 'Title is required',
  //     });
  //   }

  //   if (!payload?.slug?.trim()) {
  //     throw createError({
  //       statusCode: 400,
  //       message: 'Slug is required',
  //     });
  //   }

  //   if (!Array.isArray(payload.blocks) || payload.blocks.length === 0) {
  //     throw createError({
  //       statusCode: 400,
  //       message: 'At least one block is required',
  //     });
  //   }

  //   const normalizedSlug = normalizeSlugPath(payload.slug);
  //   const pageConfig = buildPageConfigFromPayload(payload);

  //   pageStore.set(normalizedSlug, {
  //     payload: cloneValue(payload),
  //     pageConfig,
  //     savedAt: new Date().toISOString(),
  //   });

  //   return toJSOn
  // }

  if (method === 'GET') {
    const storedPage = pageStore.get(slugPath);
    console.log(`Page config for "${slugPath}":`, storedPage?.pageConfig); // Debug log
    if (storedPage) {
      return storedPage.pageConfig;
    }

    if (slugPath === 'home') {
      return createFallbackHomePage();
    }

    throw createError({
      statusCode: 404,
      message: `Page not found: ${slugPath}`,
    });
  }

  throw createError({
    statusCode: 405,
    message: `Method ${method} is not allowed`,
  });
});

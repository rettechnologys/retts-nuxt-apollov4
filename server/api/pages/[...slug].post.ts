import {
  createError,
  getHeader,
  getRouterParams,
  type H3Event,
  readBody,
  readMultipartFormData,
} from 'h3';
import {
  getCollectionSchemaStore,
  getItemsForCollection,
} from '~~/server/utils/collectionStore';
import { drizzleDb } from '../../db/client';
import { pages } from '../../db/schema';

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
  parentSlug: string | null;
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

type DemoMultipartPart = {
  name?: string;
  filename?: string;
  type?: string;
  data?: Uint8Array;
};

const FILE_TOKEN_KEY = '__pageFormFileToken';
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

const parseMultipartJsonPart = (part?: DemoMultipartPart) => {
  if (!part?.data) {
    throw createError({
      statusCode: 400,
      message: 'Multipart payload is missing the payload field',
    });
  }

  try {
    return JSON.parse(Buffer.from(part.data).toString('utf8'));
  } catch {
    throw createError({
      statusCode: 400,
      message: 'Multipart payload is not valid JSON',
    });
  }
};

const createFileFromPart = (part: DemoMultipartPart) => {
  if (!part.data) {
    throw createError({
      statusCode: 400,
      message: `Uploaded file is empty: ${part.name || 'unknown'}`,
    });
  }

  return new File([Buffer.from(part.data)], part.filename || 'upload.bin', {
    type: part.type || 'application/octet-stream',
  });
};

const isFileInstance = (value: unknown): value is File => {
  return typeof File !== 'undefined' && value instanceof File;
};

const isBlobInstance = (value: unknown): value is Blob => {
  return typeof Blob !== 'undefined' && value instanceof Blob;
};

const blobToDataUrl = async (value: Blob): Promise<string> => {
  const buffer = Buffer.from(await value.arrayBuffer());
  const mimeType = value.type || 'application/octet-stream';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
};

const serializeResponseValue = async (value: any): Promise<any> => {
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => serializeResponseValue(item)));
  }

  if (isFileInstance(value) || isBlobInstance(value)) {
    return blobToDataUrl(value);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const entries = await Promise.all(
    Object.entries(value).map(async ([key, nestedValue]) => [
      key,
      await serializeResponseValue(nestedValue),
    ]),
  );

  return Object.fromEntries(entries);
};

const reviveMultipartFiles = (
  value: any,
  multipartFiles: Map<string, DemoMultipartPart>,
): any => {
  if (Array.isArray(value)) {
    return value.map((item) => reviveMultipartFiles(item, multipartFiles));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const fileToken = value[FILE_TOKEN_KEY];
  if (typeof fileToken === 'string') {
    const filePart = multipartFiles.get(fileToken);

    if (!filePart) {
      throw createError({
        statusCode: 400,
        message: `Missing uploaded file for token: ${fileToken}`,
      });
    }

    return createFileFromPart(filePart);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      reviveMultipartFiles(nestedValue, multipartFiles),
    ]),
  );
};

const readDemoPagePayload = async (
  event: H3Event,
): Promise<DemoPagePayload> => {
  const contentType = getHeader(event, 'content-type') || '';

  if (!contentType.includes('multipart/form-data')) {
    return (await readBody(event)) as DemoPagePayload;
  }

  const parts = ((await readMultipartFormData(event)) ||
    []) as DemoMultipartPart[];
  const payloadPart = parts.find((part) => part.name === 'payload');
  const payload = parseMultipartJsonPart(payloadPart);
  const multipartFiles = new Map(
    parts
      .filter((part) => part.name && part.name !== 'payload')
      .map((part) => [part.name as string, part]),
  );

  return reviveMultipartFiles(payload, multipartFiles) as DemoPagePayload;
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
  finalSlug?: string,
): DemoPageConfig => {
  const slugPath = finalSlug ?? normalizeSlugPath(payload.slug);

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
  // persistence moved to SQLite DB (see server/db/client.ts)

  console.log(`[API Pages] ${method}:`, slugPath);

  if (method === 'POST') {
    const payload = await readDemoPagePayload(event);

    console.log('[API Pages] Received payload:', payload);

    if (!payload?.title?.trim()) {
      throw createError({
        statusCode: 400,
        message: 'Title is required',
      });
    }

    if (!payload?.slug?.trim()) {
      throw createError({
        statusCode: 400,
        message: 'Slug is required',
      });
    }

    if (!Array.isArray(payload.blocks) || payload.blocks.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'At least one block is required',
      });
    }

    const parentSlug = payload.settings?.parentSlug
      ? normalizeSlugPath(payload.settings.parentSlug)
      : null;
    const normalizedSlug = parentSlug
      ? `${parentSlug}/${normalizeSlugPath(payload.slug)}`
      : normalizeSlugPath(payload.slug);
    const pageConfig = await serializeResponseValue(
      buildPageConfigFromPayload(payload, normalizedSlug),
    );

    // Persist page into SQLite via Drizzle
    try {
      const payloadStr = JSON.stringify(cloneValue(payload));
      const pageConfigStr = JSON.stringify(pageConfig);
      const settingsStr = JSON.stringify(payload.settings ?? {});
      const now = new Date().toISOString();

      await drizzleDb
        .insert(pages)
        .values({
          slug: normalizedSlug,
          title: payload.title,
          status: payload.status,
          type: payload.type,
          payload: payloadStr,
          page_config: pageConfigStr,
          settings: settingsStr,
          published_at: payload.publishedAt ?? null,
          scheduled_at: payload.scheduledAt ?? null,
          saved_at: now,
          created_at: now,
        })
        .onConflictDoUpdate({
          target: pages.slug,
          set: {
            title: payload.title,
            status: payload.status,
            type: payload.type,
            payload: payloadStr,
            page_config: pageConfigStr,
            settings: settingsStr,
            published_at: payload.publishedAt ?? null,
            scheduled_at: payload.scheduledAt ?? null,
            saved_at: now,
          },
        });

      return {
        success: true,
        data: pageConfig,
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to persist page:', err);
      throw createError({ statusCode: 500, message: 'Failed to save page' });
    }
  }

  // if (method === 'GET') {
  //   const storedPage = pageStore.get(slugPath);
  //   if (storedPage) {
  //     return storedPage.pageConfig;
  //   }

  //   if (slugPath === 'home') {
  //     return createFallbackHomePage();
  //   }

  //   throw createError({
  //     statusCode: 404,
  //     message: `Page not found: ${slugPath}`,
  //   });
  // }

  throw createError({
    statusCode: 405,
    message: `Method ${method} is not allowed`,
  });
});

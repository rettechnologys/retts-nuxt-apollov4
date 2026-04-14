/**
 * Collection Management Types
 * A "collection" is a named, schema-driven set of structured data items
 * (e.g. Posts, Products, Team Members).
 */

// ─── Field Types ──────────────────────────────────────────────────────────────

export type CollectionFieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'checkbox'
  | 'toggle'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'color'
  | 'date'
  | 'datetime'
  | 'url'
  | 'image'
  | 'file'
  | 'json'
  | 'object'
  | 'array';

export interface CollectionFieldOption {
  label: string;
  value: any;
}

export interface CollectionFieldDef {
  key: string;
  label: string;
  type: CollectionFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  /** For select/multiselect/radio */
  options?: CollectionFieldOption[];
  /** For file fields */
  accept?: string;
  /** For array fields - child field definitions */
  of?: CollectionFieldDef[];
  /** For object fields - child field definitions */
  fields?: CollectionFieldDef[];
  /** Whether to show in the list/table view */
  showInList?: boolean;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

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

// ─── Form Data ────────────────────────────────────────────────────────────────

export interface CollectionSchemaFormData {
  name: string;
  slug: string;
  icon: string;
  description: string;
  fields: CollectionFieldDef[];
}

// ─── Items ────────────────────────────────────────────────────────────────────

export interface CollectionItem {
  id: string;
  collectionSlug: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response shapes ──────────────────────────────────────────────────────

export interface CollectionItemListResponse {
  items: CollectionItem[];
  total: number;
  page: number;
  perPage: number;
}

/** Schema as returned by GET /api/collections (includes runtime itemCount) */
export interface CollectionSchemaWithCount extends CollectionSchema {
  itemCount: number;
}

// ─── Field type options for UI selects ────────────────────────────────────────

export const FIELD_TYPE_OPTIONS: Array<{
  label: string;
  value: CollectionFieldType;
}> = [
  { label: 'Text', value: 'text' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Rich Text', value: 'richtext' },
  { label: 'URL', value: 'url' },
  { label: 'Number', value: 'number' },
  { label: 'Toggle', value: 'toggle' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Select', value: 'select' },
  { label: 'Multi-Select', value: 'multiselect' },
  { label: 'Image URL', value: 'image' },
  { label: 'File Upload', value: 'file' },
  { label: 'Date', value: 'date' },
  { label: 'Date & Time', value: 'datetime' },
  { label: 'Color', value: 'color' },
  { label: 'JSON', value: 'json' },
];

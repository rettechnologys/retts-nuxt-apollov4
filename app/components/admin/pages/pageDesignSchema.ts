import cloneDeepWith from 'lodash/cloneDeepWith';

export type PageDesignFieldOption = {
  label: string;
  value: any;
};

export type PageDesignFieldRules = {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  pattern?: string;
  url?: boolean;
};

export type PageDesignFieldVisibility = {
  field: string;
  equals?: any;
  notEquals?: any;
};

type BaseField<TType extends string> = {
  key: string;
  type: TType;
  label: string;
  helpText?: string;
  defaultValue?: any;
  placeholder?: string;
  rules?: PageDesignFieldRules;
  primeProps?: Record<string, any>;
  visibleWhen?: PageDesignFieldVisibility;
};

export type PageDesignTextField = BaseField<
  'text' | 'textarea' | 'url' | 'image' | 'richtext' | 'json'
>;

export type PageDesignNumberField = BaseField<'number'>;

export type PageDesignBooleanField = BaseField<'checkbox' | 'toggle'>;

export type PageDesignChoiceField = BaseField<
  'select' | 'multiselect' | 'radio'
> & {
  options: PageDesignFieldOption[];
};

export type PageDesignColorField = BaseField<'color'>;

export type PageDesignDateField = BaseField<'date' | 'datetime'>;

export type PageDesignFileField = BaseField<'file'> & {
  accept?: string;
  multiple?: boolean;
};

export type PageDesignObjectField = BaseField<'object'> & {
  fields: PageDesignFormField[];
};

export type PageDesignArrayField = BaseField<'array'> & {
  of: PageDesignFormField[];
  itemLabel?: string;
  itemShape?: 'primitive' | 'object';
};

export type PageDesignFormField =
  | PageDesignTextField
  | PageDesignNumberField
  | PageDesignBooleanField
  | PageDesignChoiceField
  | PageDesignColorField
  | PageDesignDateField
  | PageDesignFileField
  | PageDesignObjectField
  | PageDesignArrayField;

export type PageDesignFormSection = {
  key: string;
  label: string;
  description?: string;
  fields: PageDesignFormField[];
};

export type PageDesignBlockSchema = {
  global: PageDesignFormSection[];
  content: PageDesignFormSection[];
};

export type PageDesignBlockValues = {
  globalProps: Record<string, any>;
  content: Record<string, any>;
};

const DEFAULT_TEXT_VALUE = '';

const isFileInstance = (value: unknown): value is File => {
  return typeof File !== 'undefined' && value instanceof File;
};

const isBlobInstance = (value: unknown): value is Blob => {
  return typeof Blob !== 'undefined' && value instanceof Blob;
};

const cloneCustomizer = (value: unknown) => {
  if (isFileInstance(value) || isBlobInstance(value)) {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  return undefined;
};

const structuredCloneSafe = <T>(value: T): T => {
  if (value === undefined) return value;

  // if (typeof value === 'object' && value !== null) {
  //   // check each property to ensure there are no proxy, ref, or readonly objects and circular references. then fix the value to be the raw version if it's a proxy
  //   const seen = new WeakSet();
  //   const checkValue = (obj: any) => {
  //     if (obj === null || typeof obj !== 'object') return;
  //     if (seen.has(obj)) {
  //       throw new Error('Cannot clone circular structure');
  //     }
  //     seen.add(obj);

  //     for (const key in obj) {
  //       const prop = obj[key];
  //       if (isRef(prop) || isProxy(prop) || isReadonly(prop)) {
  //         console.log(`Converting property ${key} to raw value`);
  //         obj[key] = toRaw(prop);
  //       } else if (typeof prop === 'object' && prop !== null) {
  //         checkValue(prop);
  //       }
  //     }
  //   };

  //   try {
  //     checkValue(value);
  //   } catch (error) {
  //     console.warn('Failed to clone value, returning original. Error:', error);
  //     return value;
  //   }
  // }

  // const rawValue =
  //   value !== null && typeof value === 'object' ? toRaw(value) : value;

  // console.log('Raw Value:', rawValue);
  const rawValue = cloneDeepWith(value, cloneCustomizer);
  return structuredClone(rawValue);
};

const isEmptyValue = (value: any): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Date) return false;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

const defaultValueForField = (field: PageDesignFormField): any => {
  if (field.defaultValue !== undefined) {
    return structuredCloneSafe(field.defaultValue);
  }

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'url':
    case 'image':
    case 'richtext':
    case 'json':
    case 'color':
      return DEFAULT_TEXT_VALUE;
    case 'number':
      return null;
    case 'checkbox':
    case 'toggle':
      return false;
    case 'select':
    case 'radio':
      return null;
    case 'multiselect':
      return [];
    case 'date':
    case 'datetime':
      return null;
    case 'file':
      return field.multiple ? [] : null;
    case 'object':
      return buildValuesFromFields(field.fields);
    case 'array':
      return [];
    default:
      return null;
  }
};

export const buildValuesFromFields = (
  fields: PageDesignFormField[],
): Record<string, any> => {
  return Object.fromEntries(
    fields.map((field) => [field.key, defaultValueForField(field)]),
  );
};

const buildSectionValues = (
  sections: PageDesignFormSection[],
): Record<string, any> => {
  return Object.assign(
    {},
    ...sections.map((section) => buildValuesFromFields(section.fields)),
  );
};

export const createBlockValues = (
  schema: PageDesignBlockSchema,
): PageDesignBlockValues => ({
  globalProps: buildSectionValues(schema.global),
  content: buildSectionValues(schema.content),
});

const applyValuesToSections = (
  sections: PageDesignFormSection[],
  values: Record<string, any>,
): PageDesignFormSection[] => {
  return sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      if (!(field.key in values)) return field;

      return {
        ...field,
        defaultValue: structuredCloneSafe(values[field.key]),
      };
    }),
  }));
};

export const applyBlockValuesToSchema = (
  schema: PageDesignBlockSchema,
  values: PageDesignBlockValues,
): PageDesignBlockSchema => ({
  global: applyValuesToSections(schema.global, values.globalProps),
  content: applyValuesToSections(schema.content, values.content),
});

export const cloneBlockValues = (
  values: PageDesignBlockValues,
): PageDesignBlockValues => structuredCloneSafe(values);

export const mergeBlockValues = (
  values: PageDesignBlockValues,
): Record<string, any> => ({
  ...structuredCloneSafe(values.globalProps),
  ...structuredCloneSafe(values.content),
});

const resolveFieldValue = (field: PageDesignFormField, value: any): any => {
  if (field.type === 'json') {
    if (typeof value !== 'string') return value;
    if (!value.trim()) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  if (field.type === 'object') {
    const objectValue = value ?? {};
    return Object.fromEntries(
      field.fields.map((childField) => [
        childField.key,
        resolveFieldValue(childField, objectValue?.[childField.key]),
      ]),
    );
  }

  if (field.type === 'array') {
    const arrayValue = Array.isArray(value) ? value : [];
    return arrayValue.map((item) => {
      if (field.itemShape === 'primitive') {
        return resolveFieldValue(field.of[0], item);
      }

      return Object.fromEntries(
        field.of.map((childField) => [
          childField.key,
          resolveFieldValue(childField, item?.[childField.key]),
        ]),
      );
    });
  }

  return value;
};

const resolveSectionValues = (
  sections: PageDesignFormSection[],
  rawValues: Record<string, any>,
) => {
  return Object.fromEntries(
    sections.flatMap((section) =>
      section.fields.map((field) => [
        field.key,
        resolveFieldValue(field, rawValues?.[field.key]),
      ]),
    ),
  );
};

export const resolveBlockValues = (
  schema: PageDesignBlockSchema,
  values: PageDesignBlockValues,
): PageDesignBlockValues => ({
  globalProps: resolveSectionValues(schema.global, values.globalProps),
  content: resolveSectionValues(schema.content, values.content),
});

export const createArrayItemValue = (field: PageDesignArrayField): any => {
  if (field.itemShape === 'primitive') {
    return defaultValueForField(field.of[0]);
  }

  return buildValuesFromFields(field.of);
};

const getVisibleWhenValue = (
  values: Record<string, any>,
  fieldKey: string,
): any => {
  const segments = fieldKey.split('.');
  let current: any = values;

  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment];
  }

  return current;
};

export const isFieldVisible = (
  field: PageDesignFormField,
  values: Record<string, any>,
): boolean => {
  if (!field.visibleWhen) return true;

  const currentValue = getVisibleWhenValue(values, field.visibleWhen.field);

  if (field.visibleWhen.equals !== undefined) {
    return currentValue === field.visibleWhen.equals;
  }

  if (field.visibleWhen.notEquals !== undefined) {
    return currentValue !== field.visibleWhen.notEquals;
  }

  return true;
};

const validatePrimitiveField = (
  field: Exclude<
    PageDesignFormField,
    PageDesignArrayField | PageDesignObjectField
  >,
  value: any,
): string | undefined => {
  const rules = field.rules;
  if (!rules) return undefined;

  if (rules.required && isEmptyValue(value)) {
    return `${field.label} is required.`;
  }

  if (isEmptyValue(value)) return undefined;

  if (field.type === 'number') {
    if (rules.min !== undefined && Number(value) < rules.min) {
      return `${field.label} must be at least ${rules.min}.`;
    }
    if (rules.max !== undefined && Number(value) > rules.max) {
      return `${field.label} must be at most ${rules.max}.`;
    }
  }

  if (typeof value === 'string') {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      return `${field.label} must be at least ${rules.minLength} characters.`;
    }

    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      return `${field.label} must be at most ${rules.maxLength} characters.`;
    }

    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      return `${field.label} format is invalid.`;
    }

    if (rules.url) {
      try {
        new URL(value);
      } catch {
        return `${field.label} must be a valid URL.`;
      }
    }

    if (field.type === 'json') {
      try {
        JSON.parse(value);
      } catch {
        return `${field.label} must contain valid JSON.`;
      }
    }
  }

  return undefined;
};

const validateFieldAtPath = (
  field: PageDesignFormField,
  value: any,
  path: string,
  errors: Record<string, string>,
): void => {
  if (field.type === 'object') {
    const objectValue = value ?? {};
    const fieldError =
      field.rules?.required && isEmptyValue(objectValue)
        ? `${field.label} is required.`
        : undefined;

    if (fieldError) {
      errors[path] = fieldError;
      return;
    }

    for (const childField of field.fields) {
      validateFieldAtPath(
        childField,
        objectValue?.[childField.key],
        `${path}.${childField.key}`,
        errors,
      );
    }
    return;
  }

  if (field.type === 'array') {
    const arrayValue = Array.isArray(value) ? value : [];

    if (field.rules?.required && arrayValue.length === 0) {
      errors[path] = `${field.label} must contain at least one item.`;
      return;
    }

    if (
      field.rules?.minItems !== undefined &&
      arrayValue.length < field.rules.minItems
    ) {
      errors[path] =
        `${field.label} must contain at least ${field.rules.minItems} items.`;
    }

    if (
      field.rules?.maxItems !== undefined &&
      arrayValue.length > field.rules.maxItems
    ) {
      errors[path] =
        `${field.label} must contain at most ${field.rules.maxItems} items.`;
    }

    arrayValue.forEach((itemValue, index) => {
      if (field.itemShape === 'primitive') {
        validateFieldAtPath(field.of[0], itemValue, `${path}.${index}`, errors);
        return;
      }

      field.of.forEach((itemField) => {
        validateFieldAtPath(
          itemField,
          itemValue?.[itemField.key],
          `${path}.${index}.${itemField.key}`,
          errors,
        );
      });
    });

    return;
  }

  const error = validatePrimitiveField(field, value);
  if (error) {
    errors[path] = error;
  }
};

const validateSections = (
  sections: PageDesignFormSection[],
  sectionKey: 'globalProps' | 'content',
  values: Record<string, any>,
  errors: Record<string, string>,
) => {
  sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (!isFieldVisible(field, values)) return;
      validateFieldAtPath(
        field,
        values[field.key],
        `${sectionKey}.${field.key}`,
        errors,
      );
    });
  });
};

export const validateBlockValues = (
  schema: PageDesignBlockSchema,
  values: PageDesignBlockValues,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  validateSections(schema.global, 'globalProps', values.globalProps, errors);
  validateSections(schema.content, 'content', values.content, errors);

  return errors;
};

const section = (
  key: string,
  label: string,
  fields: PageDesignFormField[],
  description?: string,
): PageDesignFormSection => ({
  key,
  label,
  description,
  fields,
});

const textField = (
  key: string,
  label: string,
  defaultValue = '',
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'text',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const textareaField = (
  key: string,
  label: string,
  defaultValue = '',
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'textarea',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const richtextField = (
  key: string,
  label: string,
  defaultValue = '',
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'richtext',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const urlField = (
  key: string,
  label: string,
  defaultValue = '',
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'url',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const imageField = (
  key: string,
  label: string,
  defaultValue = '',
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'image',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const numberField = (
  key: string,
  label: string,
  defaultValue: number,
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'number',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const checkboxField = (
  key: string,
  label: string,
  defaultValue = false,
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'checkbox',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const selectField = (
  key: string,
  label: string,
  options: { label: string; value: any }[],
  defaultValue: any,
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'select',
    label,
    options,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const multiselectField = (
  key: string,
  label: string,
  options: { label: string; value: any }[],
  defaultValue: any[] = [],
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'multiselect',
    label,
    options,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const radioField = (
  key: string,
  label: string,
  options: { label: string; value: any }[],
  defaultValue: any,
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'radio',
    label,
    options,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const toggleField = (
  key: string,
  label: string,
  defaultValue = false,
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'toggle',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const colorField = (
  key: string,
  label: string,
  defaultValue = '#3b82f6',
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'color',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const dateField = (
  key: string,
  label: string,
  defaultValue: Date | null = null,
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'date',
    label,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const jsonField = (
  key: string,
  label: string,
  defaultValue: any,
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'json',
    label,
    defaultValue:
      typeof defaultValue === 'string'
        ? defaultValue
        : JSON.stringify(defaultValue, null, 2),
    ...extra,
  }) as PageDesignFormField;

const objectField = (
  key: string,
  label: string,
  fields: PageDesignFormField[],
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'object',
    label,
    fields,
    ...extra,
  }) as PageDesignFormField;

const arrayField = (
  key: string,
  label: string,
  of: PageDesignFormField[],
  defaultValue: any[] = [],
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'array',
    label,
    of,
    defaultValue,
    ...extra,
  }) as PageDesignFormField;

const fileField = (
  key: string,
  label: string,
  extra: Record<string, any> = {},
): PageDesignFormField =>
  ({
    key,
    type: 'file',
    label,
    defaultValue: null,
    ...extra,
  }) as PageDesignFormField;

const columnOptions = [
  { label: '1 Column', value: '1' },
  { label: '2 Columns', value: '2' },
  { label: '3 Columns', value: '3' },
  { label: '4 Columns', value: '4' },
];

const alignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const sizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Full Width', value: 'full' },
];

const buttonVariantOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Success', value: 'success' },
  { label: 'Info', value: 'info' },
  { label: 'Warn', value: 'warn' },
  { label: 'Danger', value: 'danger' },
];

export const fieldBuilder = {
  section,
  textField,
  textareaField,
  richtextField,
  urlField,
  imageField,
  numberField,
  checkboxField,
  selectField,
  multiselectField,
  radioField,
  toggleField,
  colorField,
  dateField,
  jsonField,
  objectField,
  arrayField,
  fileField,
};

export const predefinedOptions = {
  columnOptions,
  alignmentOptions,
  sizeOptions,
  buttonVariantOptions,
};

export const primeVueConfig = {
  primevue: {
    filterMatchModeOptions: {
      text: [
        'startsWith',
        'contains',
        'notContains',
        'endsWith',
        'equals',
        'notEquals',
      ],
      numeric: [
        'equals',
        'notEquals',
        'lessThan',
        'lessThanOrEqualTo',
        'greaterThan',
        'greaterThanOrEqualTo',
      ],
      date: [
        'dateIs',
        'dateIsNot',
        'dateBefore',
        'dateAfter',
        'lessThan',
        'lessThanOrEqualTo',
        'greaterThan',
        'greaterThanOrEqualTo',
      ],
    },
    theme: {
      preset: 'aura',
      options: {
        darkModeSelector: '.app-dark',
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue',
        },
      },
    },
  },
};

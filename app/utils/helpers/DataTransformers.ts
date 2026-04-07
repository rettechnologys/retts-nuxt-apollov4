/**
 * Data Transformers Utility
 * Collection of functions for transforming and normalizing data structures
 */

/**
 * Field mapping type definition
 * Maps template field names to source field names or transformer functions
 */
export type FieldMapping = {
  [templateField: string]: string | ((item: any) => any);
};

/**
 * Normalize item data using field mapping
 * Transforms raw API/CMS data into the expected template structure
 * 
 * @param rawItem - Raw item data from API/CMS
 * @param fieldMapping - Mapping configuration for field transformation
 * @returns Normalized item with mapped fields
 * 
 * @example
 * const rawItem = { post_title: 'Hello', author_name: 'John' };
 * const mapping = { title: 'post_title', author: 'author_name' };
 * const result = normalizeItem(rawItem, mapping);
 * // Returns: { title: 'Hello', author: 'John', ...originalFields }
 */
export function normalizeItem(rawItem: any, fieldMapping?: FieldMapping): any {
  if (!fieldMapping) return rawItem;

  const normalized: any = { ...rawItem };

  for (const [templateField, sourceField] of Object.entries(fieldMapping)) {
    if (typeof sourceField === 'function') {
      // Custom transformer function
      normalized[templateField] = sourceField(rawItem);
    } else {
      // Simple field mapping
      normalized[templateField] = rawItem[sourceField];
    }
  }

  return normalized;
}

/**
 * Replace template tokens in a value with actual data
 * Supports dot notation for nested properties
 * 
 * @param template - Template string, object, or array containing tokens
 * @param item - Data object to extract values from
 * @returns Template with tokens replaced by actual values
 * 
 * @example
 * replaceTokens('{{item.title}}', { title: 'Hello' }) // Returns: 'Hello'
 * replaceTokens({ src: '{{item.image}}' }, { image: '/path' }) // Returns: { src: '/path' }
 */
export function replaceTokens(template: any, item: any): any {
  if (typeof template === 'string') {
    return template.replace(
      /\{\{item\.(\w+)\}\}/g,
      (_, key) => item[key] || '',
    );
  }

  if (Array.isArray(template)) {
    return template.map((t) => replaceTokens(t, item));
  }

  if (typeof template === 'object' && template !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(template)) {
      result[key] = replaceTokens(value, item);
    }
    return result;
  }

  return template;
}

/**
 * Get nested property from object using dot notation
 * Safely traverses object properties without throwing errors
 * 
 * @param obj - Source object
 * @param path - Dot-separated path to the property (e.g., 'user.profile.name')
 * @returns Value at the specified path, or undefined if not found
 * 
 * @example
 * const obj = { user: { profile: { name: 'John' } } };
 * getNestedProperty(obj, 'user.profile.name') // Returns: 'John'
 * getNestedProperty(obj, 'user.missing.field') // Returns: undefined
 */
export function getNestedProperty(obj: any, path: string): any {
  if (!path) return obj;

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined;
    }
    result = result[key];
  }

  return result;
}

/**
 * Process template value and replace variables with actual data
 * Supports both single variable replacement and inline variable interpolation
 * 
 * @param value - Template string containing variables
 * @param item - Data object to extract values from
 * @returns Processed value with variables replaced
 * 
 * @example
 * processTemplateValue('{{item.title}}', { title: 'Hello' }) // Returns: 'Hello'
 * processTemplateValue('By {{item.author.name}}', { author: { name: 'John' } }) // Returns: 'By John'
 */
export function processTemplateValue(value: string, item: any): any {
  if (!value || typeof value !== 'string') {
    return value;
  }

  // Check if entire value is a variable
  const singleVarMatch = value.match(/^\{\{\s*item\.(.+?)\s*\}\}$/);
  if (singleVarMatch) {
    return getNestedProperty(item, singleVarMatch[1]);
  }

  // Replace multiple variables in string
  return value.replace(/\{\{\s*item\.(.+?)\s*\}\}/g, (match, path) => {
    const val = getNestedProperty(item, path);
    return val !== undefined ? String(val) : match;
  });
}

/**
 * Process template props recursively and replace variables with actual data
 * Handles strings, arrays, and nested objects
 * 
 * @param props - Template props containing variables
 * @param item - Data object to extract values from
 * @returns Props with all variables replaced
 * 
 * @example
 * const props = {
 *   title: '{{item.title}}',
 *   nested: { author: '{{item.author.name}}' }
 * };
 * processTemplateProps(props, { title: 'Hello', author: { name: 'John' } })
 * // Returns: { title: 'Hello', nested: { author: 'John' } }
 */
export function processTemplateProps(props: any, item: any): any {
  if (!props) return {};

  if (Array.isArray(props)) {
    return props.map(prop => processTemplateProps(prop, item));
  }

  if (typeof props === 'object') {
    const processed: any = {};

    for (const [key, value] of Object.entries(props)) {
      processed[key] = processTemplateProps(value, item);
    }

    return processed;
  }

  if (typeof props === 'string') {
    return processTemplateValue(props, item);
  }

  return props;
}

/**
 * Extract unique values from an array of objects for a specific field
 * Useful for generating filter options from data
 * 
 * @param items - Array of data items
 * @param fieldName - Name of the field to extract unique values from
 * @returns Array of unique values
 * 
 * @example
 * const items = [{ category: 'Tech' }, { category: 'Design' }, { category: 'Tech' }];
 * extractUniqueValues(items, 'category') // Returns: ['Tech', 'Design']
 */
export function extractUniqueValues(items: any[], fieldName: string): any[] {
  return [...new Set(items.map(item => item[fieldName]).filter(Boolean))];
}

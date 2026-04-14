export interface CollectionDataSource {
  collection: string;
  mode: 'list' | 'single';
  fieldMappings: Record<string, string>;
}

/**
 * Strips a namespaced blockKey prefix (e.g. "items.title" → "title").
 * Top-level keys (e.g. "title") are returned as-is.
 */
export function stripKeyPrefix(blockKey: string): string {
  return blockKey.includes('.')
    ? blockKey.split('.').slice(1).join('.')
    : blockKey;
}

/**
 * Applies fieldMappings to raw collection items.
 * - If mappings exist: renames fields using the mapping, stripping any array prefix.
 * - If no mappings: unwraps item.data if present, otherwise returns the item as-is.
 */
export function applyMappingsToItems(
  items: Array<Record<string, any>>,
  dataSource: CollectionDataSource | undefined,
): Array<Record<string, any>> {
  if (!dataSource) return items;
  const mappings = dataSource.fieldMappings ?? {};
  const hasMappings = Object.keys(mappings).length > 0;

  return items.map((item) => {
    if (hasMappings) {
      const mapped: Record<string, any> = {};
      for (const [colField, blockKey] of Object.entries(mappings)) {
        const targetKey = stripKeyPrefix(blockKey);
        mapped[targetKey] = item.data?.[colField] ?? item[colField];
      }
      return mapped;
    }
    return item.data ? { ...item.data } : { ...item };
  });
}

import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';
import {
  applyMappingsToItems,
  type CollectionDataSource,
} from '~/utils/helpers/CollectionDataSource';

/**
 * Reactive composable that applies field mappings to raw collection items.
 * Returns a computed `mappedItems` ref.
 */
export function useCollectionDataSource(
  items: MaybeRefOrGetter<Array<Record<string, any>>>,
  dataSource: MaybeRefOrGetter<CollectionDataSource | undefined>,
) {
  const mappedItems = computed(() =>
    applyMappingsToItems(toValue(items), toValue(dataSource)),
  );

  return { mappedItems };
}

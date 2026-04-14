import { computed, onBeforeUnmount, ref, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';

export type ResolvedMediaSourceInput = string | File | null | undefined;

export type UseResolvedMediaSourceResult = {
  resolvedSource: Ref<string>;
  isObjectUrl: Readonly<Ref<boolean>>;
};

export const useResolvedMediaSource = (
  source: MaybeRefOrGetter<ResolvedMediaSourceInput>,
  fallback = '',
): UseResolvedMediaSourceResult => {
  const resolvedSource = ref(fallback);
  const objectUrl = ref<string | null>(null);

  const revokeObjectUrl = () => {
    if (!objectUrl.value) return;
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = null;
  };

  const updateResolvedSource = (value: ResolvedMediaSourceInput) => {
    revokeObjectUrl();

    if (value instanceof File) {
      objectUrl.value = URL.createObjectURL(value);
      resolvedSource.value = objectUrl.value;
      return;
    }

    if (typeof value === 'string' && value.trim()) {
      resolvedSource.value = value;
      return;
    }

    resolvedSource.value = fallback;
  };

  watch(() => toValue(source), updateResolvedSource, { immediate: true });
  onBeforeUnmount(revokeObjectUrl);

  return {
    resolvedSource,
    isObjectUrl: computed(() => objectUrl.value !== null),
  };
};

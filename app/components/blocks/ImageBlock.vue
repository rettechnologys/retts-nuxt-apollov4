<template>
  <section class="image-block py-8 px-6">
    <figure class="flex w-full flex-col gap-3" :class="alignmentClass">
      <img
        :src="resolvedImageSource"
        :alt="imageConfig.altText"
        :class="sizeClass"
        class="block h-auto rounded-lg object-contain shadow-sm"
      />
      <figcaption
        v-if="imageConfig.caption"
        class="text-sm text-surface-600 dark:text-surface-400"
      >
        {{ imageConfig.caption }}
      </figcaption>
    </figure>
  </section>
</template>

<script setup lang="ts">
// #region Imports
import { useResolvedMediaSource } from '~/composables/useResolvedMediaSource';
// #endregion Imports

// #region Types
interface ImageConfig {
  imageUrl?: string;
  imageFile?: File | null;
  altText?: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  alignment?: 'left' | 'center' | 'right';
}

type ResolvedImageConfig = {
  imageUrl: string;
  imageFile: File | null;
  altText: string;
  caption: string;
  size: NonNullable<ImageConfig['size']>;
  alignment: NonNullable<ImageConfig['alignment']>;
};
// #endregion Types

// #region Constants
const IMAGE_CONFIG_DEFAULTS: ResolvedImageConfig = {
  imageUrl: 'https://placehold.co/800x400',
  imageFile: null,
  altText: 'Image',
  caption: '',
  size: 'medium',
  alignment: 'center',
};
// #endregion Constants

// #region Props & Emits
const props = defineProps<{
  config?: ImageConfig;
}>();
// #endregion Props & Emits

// #region Composables
const { resolvedSource: resolvedImageSource } = useResolvedMediaSource(
  () =>
    props.config?.imageFile ??
    props.config?.imageUrl ??
    IMAGE_CONFIG_DEFAULTS.imageUrl,
  IMAGE_CONFIG_DEFAULTS.imageUrl,
);
// #endregion Composables

// #region State / Ref
const imageConfig = computed<ResolvedImageConfig>(() => ({
  ...IMAGE_CONFIG_DEFAULTS,
  ...props.config,
}));

const sizeClass = computed(() => {
  const size = imageConfig.value.size;
  return {
    'w-full max-w-sm': size === 'small',
    'w-full max-w-2xl': size === 'medium',
    'w-full max-w-4xl': size === 'large',
    'w-full': size === 'full',
  };
});

const alignmentClass = computed(() => {
  const alignment = imageConfig.value.alignment;
  return {
    'items-start': alignment === 'left',
    'items-center': alignment === 'center',
    'items-end': alignment === 'right',
  };
});
// #endregion State / Ref

// #region Lifecycle Hooks
// #endregion Lifecycle Hooks

// #region Methods / Functions
// #endregion Methods / Functions

// #region Watcher
// #endregion Watcher
</script>

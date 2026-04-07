<template>
  <section class="image-block py-8 px-6" :class="alignmentClass">
    <img
      :src="config.imageUrl || 'https://placehold.co/800x400'"
      :alt="config.altText || 'Image'"
      :class="sizeClass"
      class="rounded-lg"
    />
    <p
      v-if="config.caption"
      class="text-sm text-surface-600 dark:text-surface-400 mt-2"
    >
      {{ config.caption }}
    </p>
  </section>
</template>

<script setup lang="ts">
interface ImageConfig {
  imageUrl?: string;
  altText?: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  alignment?: 'left' | 'center' | 'right';
}

const props = defineProps<{
  config?: ImageConfig;
}>();

const sizeClass = computed(() => {
  const size = props.config?.size || 'medium';
  return {
    'max-w-sm': size === 'small',
    'max-w-2xl': size === 'medium',
    'max-w-4xl': size === 'large',
    'w-full': size === 'full',
  };
});

const alignmentClass = computed(() => {
  const alignment = props.config?.alignment || 'center';
  return {
    'flex justify-start': alignment === 'left',
    'flex justify-center': alignment === 'center',
    'flex justify-end': alignment === 'right',
  };
});
</script>

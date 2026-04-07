<template>
  <section class="heading-block py-6 px-6" :class="alignmentClass">
    <component :is="headingTag" class="font-bold" :class="sizeClass">
      {{ config.text || 'Heading Text' }}
    </component>
  </section>
</template>

<script setup lang="ts">
interface HeadingConfig {
  text?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  alignment?: 'left' | 'center' | 'right';
}

const props = defineProps<{
  config?: HeadingConfig;
}>();

const headingTag = computed(() => `h${props.config?.level || 2}`);

const sizeClass = computed(() => {
  const level = props.config?.level || 2;
  const sizes = {
    1: 'text-5xl',
    2: 'text-4xl',
    3: 'text-3xl',
    4: 'text-2xl',
    5: 'text-xl',
    6: 'text-lg',
  };
  return sizes[level as keyof typeof sizes];
});

const alignmentClass = computed(() => {
  const alignment = props.config?.alignment || 'left';
  return {
    'text-left': alignment === 'left',
    'text-center': alignment === 'center',
    'text-right': alignment === 'right',
  };
});
</script>

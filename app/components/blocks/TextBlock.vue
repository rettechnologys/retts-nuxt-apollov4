<template>
  <section class="text-block py-8 px-6" :class="alignmentClass">
    <div
      class="prose dark:prose-invert max-w-none"
      v-html="props.config?.content || '<p>Enter your text content here...</p>'"
    ></div>
  </section>
</template>

<script setup lang="ts">
interface TextConfig {
  content?: string;
  alignment?: 'left' | 'center' | 'right';
}

const props = defineProps<{
  config?: TextConfig;
}>();

const alignmentClass = computed(() => {
  const alignment = props.config?.alignment || 'left';
  return {
    'text-left': alignment === 'left',
    'text-center': alignment === 'center',
    'text-right': alignment === 'right',
  };
});
</script>

<template>
  <div class="container mx-auto px-4 py-8" :class="maxWidthClass">
    <div
      v-if="format === 'html'"
      :class="{ 'prose prose-lg dark:prose-invert max-w-none': prose }"
      v-html="content"
    ></div>

    <div
      v-else-if="format === 'markdown'"
      :class="{ 'prose prose-lg dark:prose-invert max-w-none': prose }"
    >
      <ContentRenderer v-if="parsedMarkdown" :value="parsedMarkdown" />
    </div>

    <div v-else class="whitespace-pre-wrap">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string;
  format?: 'html' | 'markdown' | 'text';
  prose?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  format: 'html',
  prose: false,
  maxWidth: '4xl',
});

console.log(props.content);

const maxWidthClass = computed(() => {
  const widths: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };
  return widths[props.maxWidth];
});

const parsedMarkdown = computed(() => {
  if (props.format === 'markdown') {
    // If you have @nuxt/content, it will parse markdown
    return props.content;
  }
  return null;
});
</script>

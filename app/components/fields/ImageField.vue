<template>
  <div class="image-field" :class="class">
    <NuxtImg :src="src" :alt="alt" :class="imageClass" :style="imageStyle" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  class?: string;
  src: string;
  alt?: string;
  width?: string;
  height?: string;
}

const props = defineProps<Props>();

const imageClass = computed(() => {
  const classes = ['rounded-lg'];

  // Only add Tailwind classes if not using custom dimensions
  if (!props.width && !props.height) {
    classes.push('w-full', 'h-full');
  }

  if (props.class) {
    classes.push(props.class);
  }

  return classes.join(' ');
});

const imageStyle = computed(() => {
  const styles: Record<string, string> = {};

  if (props.width) styles.width = props.width;
  if (props.height) styles.height = props.height;

  return styles;
});
</script>

<style scoped>
.image-field {
  width: 100%;
}
</style>

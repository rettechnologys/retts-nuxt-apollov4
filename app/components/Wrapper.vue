<template>
  <div :class="class" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
  style?: Record<string, string>;
  children?: any[];
}>();

console.log('Wrapper component received props:', { ...props });
</script>

<style scoped></style>

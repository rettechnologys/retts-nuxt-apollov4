<template>
  <component :is="tag" v-bind="props">
    {{ content }}
  </component>
</template>

<script setup lang="ts">
defineProps<{
  props?: any;
  tag: string;
  content?: string;
}>();
</script>

<style scoped></style>

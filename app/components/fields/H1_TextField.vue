<template>
  <div class="text-field">
    <h1 v-if="title" class="text-4xl font-bold mb-4 text-surface-900 dark:text-surface-0">
      {{ title }}
    </h1>
    <p v-if="description" class="text-lg text-surface-700 dark:text-surface-100">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}

defineProps<Props>();
</script>

<style scoped>
.text-field {
  width: 100%;
}
</style>

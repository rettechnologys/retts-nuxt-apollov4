<template>
  <div class="image-field">
    <NuxtImg
      :src="src"
      :alt="alt"
      class="w-full h-auto rounded-lg"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt?: string;
}

defineProps<Props>();
</script>

<style scoped>
.image-field {
  width: 100%;
}
</style>

<script setup lang="ts">
// This route uses the same component as create
// The create.vue component automatically detects edit mode from route.params.id
import CreateBlock from '../create.vue';
</script>

<template>
  <CreateBlock />
</template>

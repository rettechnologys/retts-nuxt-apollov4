<template>
  <Button
    :label="label"
    :icon="icon"
    :rounded="rounded"
    :text="text"
    :outlined="outlined"
    :severity="severity"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :as="as"
    :to="to"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
// PrimeVue v4 Button props
interface Props {
  label?: string;
  icon?: string;
  rounded?: boolean;
  text?: boolean;
  outlined?: boolean;
  severity?: 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';
  size?: 'small' | 'large';
  disabled?: boolean;
  loading?: boolean;
  as?: string;
  to?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <section class="button-block py-8 px-6" :class="alignmentClass">
    <Button
      :label="config.text || 'Click Me'"
      :size="config.size || 'medium'"
      :severity="config.variant || 'primary'"
      :outlined="config.outlined"
      :raised="config.raised"
      @click="handleClick"
    />
  </section>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

interface ButtonConfig {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';
  outlined?: boolean;
  raised?: boolean;
  alignment?: 'left' | 'center' | 'right';
  action?: string;
}

const props = defineProps<{
  config?: ButtonConfig;
}>();

const alignmentClass = computed(() => {
  const alignment = props.config?.alignment || 'center';
  return {
    'flex justify-start': alignment === 'left',
    'flex justify-center': alignment === 'center',
    'flex justify-end': alignment === 'right',
  };
});

const handleClick = () => {
  if (props.config?.action) {
    console.log('Button action:', props.config.action);
  }
};
</script>

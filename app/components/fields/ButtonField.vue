<template>
  <Button
    v-if="to || link"
    as-child
    v-slot="slotProps"
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
    :to="to || link"
  >
    <NuxtLink :to="to || link" v-bind="slotProps">
      {{ label }}
    </NuxtLink>
  </Button>
  <Button
    v-else
    :label="props.label"
    :icon="props.icon"
    :rounded="props.rounded"
    :text="props.text"
    :outlined="props.outlined"
    :severity="props.severity"
    :size="props.size"
    :disabled="props.disabled"
    :loading="props.loading"
    :as="props.as"
    @click="handleClick"
    v-bind="{
      ...props.class,
      ...props.style,
    }"
  >
  </Button>
</template>

<script setup lang="ts">
import { ButtonProps } from 'primevue/button';

// PrimeVue v4 Button props
type Props = {
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
  link?: string; // Alias for 'to' prop
} & {
  // Allow passing any additional PrimeVue Button props
  [key: string]: any;
  pv: ButtonProps;
};
// interface Props {
//   label?: string;
//   icon?: string;
//   rounded?: boolean;
//   text?: boolean;
//   outlined?: boolean;
//   severity?: 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';
//   size?: 'small' | 'large';
//   disabled?: boolean;
//   loading?: boolean;
//   as?: string;
//   to?: string;
//   link?: string; // Alias for 'to' prop
//   pv: ButtonProps; // To allow passing any additional PrimeVue Button props
// }

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

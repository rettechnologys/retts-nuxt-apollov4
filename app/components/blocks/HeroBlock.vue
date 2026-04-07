<template>
  <section
    class="hero-block relative min-h-[400px] flex items-center justify-center text-white"
    :style="heroStyle"
  >
    <div class="hero-content text-center max-w-4xl px-6">
      <h1 class="text-5xl font-bold mb-4">
        {{ props.config?.heading || 'Hero Heading' }}
      </h1>
      <p class="text-xl mb-6">
        {{ props.config?.subheading || 'Your compelling subheading goes here' }}
      </p>
      <Button
        v-if="props.config?.showButton"
        :label="props.config?.buttonText || 'Get Started'"
        size="large"
      />
    </div>
    <div
      v-if="props.config?.backgroundImage"
      class="absolute inset-0 bg-black opacity-40"
    ></div>
  </section>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

interface HeroConfig {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  showButton?: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
}

const props = defineProps<{
  config?: HeroConfig;
}>();

const heroStyle = computed(() => ({
  backgroundImage: props.config?.backgroundImage
    ? `url(${props.config.backgroundImage})`
    : 'none',
  backgroundColor: props.config?.backgroundColor || '#3b82f6',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));
</script>

<style scoped>
.hero-content {
  position: relative;
  z-index: 1;
}
</style>

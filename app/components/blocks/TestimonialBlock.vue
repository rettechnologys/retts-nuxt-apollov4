<template>
  <section
    class="testimonial-block py-12 px-6 bg-surface-50 dark:bg-surface-800"
  >
    <div class="max-w-4xl mx-auto text-center">
      <i class="pi pi-quote-left text-4xl text-primary mb-4"></i>
      <blockquote class="text-xl italic mb-6">
        "{{
          config.quote ||
          'This is an amazing testimonial that will inspire trust and confidence in your visitors.'
        }}"
      </blockquote>
      <div class="flex items-center justify-center gap-4">
        <img
          v-if="config.avatar"
          :src="config.avatar"
          :alt="config.author"
          class="w-16 h-16 rounded-full"
        />
        <div
          v-else
          class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold"
        >
          {{ initials }}
        </div>
        <div class="text-left">
          <div class="font-semibold">{{ config.author || 'John Doe' }}</div>
          <div class="text-sm text-surface-600 dark:text-surface-400">
            {{ config.role || 'Happy Customer' }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface TestimonialConfig {
  quote?: string;
  author?: string;
  role?: string;
  avatar?: string;
}

const props = defineProps<{
  config?: TestimonialConfig;
}>();

const initials = computed(() => {
  const author = props.config?.author || 'JD';
  return author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});
</script>

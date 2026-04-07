<template>
  <BaseLayout
    container="section"
    padding="section"
    bg="custom"
    custom-bg="bg-primary-50"
    class="text-center relative overflow-hidden dark:bg-surface-950 rounded-2xl"
  >
    <!-- Optional Headline Decorator -->
    <div v-if="headlineImage" class="absolute -top-10 sm:top-0 right-1/2 h-24">
      <img :src="headlineImage" :alt="headlineImageAlt" class="h-full w-auto" />
    </div>

    <!-- Title Section -->
    <div class="mb-4 font-bold text-4xl md:text-5xl max-w-4xl mx-auto">
      <span class="dark:text-white mr-2">{{ titlePrefix }} </span>
      <span class="text-primary-500">{{ titleHighlight }}</span>
    </div>
    <div
      class="text-surface-400 dark:text-surface-400 mb-16 max-w-3xl mx-auto text-lg"
    >
      {{ description }}
    </div>

    <!-- Testimonials Grid -->
    <BaseLayout
      layout="grid"
      :cols="columns"
      gap="md"
      class="max-w-7xl mx-auto"
      :full-height="false"
    >
      <div
        v-for="(testimonial, index) in testimonials"
        :key="index"
        class="bg-primary-200 dark:bg-primary-600 rounded-xl p-8 text-left flex flex-col justify-between min-h-[280px]"
      >
        <!-- Quote -->
        <p class="dark:text-surface-100 leading-relaxed mb-6">
          "{{ testimonial.quote }}"
        </p>

        <!-- User Info -->
        <div class="flex items-center gap-3 mt-auto">
          <img
            v-if="testimonial.user.avatar"
            :src="testimonial.user.avatar"
            :alt="testimonial.user.name"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div
            v-else
            class="w-12 h-12 rounded-full bg-primary-300 dark:bg-primary-700 flex items-center justify-center font-semibold"
          >
            {{ getInitials(testimonial.user.name) }}
          </div>
          <div>
            <div class="font-medium">
              {{ testimonial.user.name }}
            </div>
            <div class="text-surface-500 dark:text-surface-200 text-sm">
              {{ testimonial.user.role }}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
interface User {
  name: string;
  role?: string;
  avatar?: string;
}

interface Testimonial {
  quote: string;
  user: User;
}

interface Props {
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  testimonials?: Testimonial[];
  columns?: '1' | '2' | '3' | '4';
  headlineImage?: string;
  headlineImageAlt?: string;
}

withDefaults(defineProps<Props>(), {
  titlePrefix: 'Join thousands of productive',
  titleHighlight: 'developers',
  description:
    'See how developers are transforming their coding workflow and achieving more with our AI-powered platform.',
  columns: '3',
  headlineImageAlt: 'Decorative element',
  testimonials: () => [
    {
      quote:
        'Since using this tool, my productivity has doubled. The AI insights helped me find my perfect coding rhythm and now I ship features twice as fast.',
      user: {
        name: 'Sarah Moriceau',
        role: 'Brand Designer',
        avatar: '',
      },
    },
    {
      quote:
        'Game-changer for our team. The focus tracking and smart alerts helped us reduce meeting interruptions by 40% and increased our sprint velocity.',
      user: {
        name: 'Sébastien Chopin',
        role: 'Lead Software Engineer',
        avatar: '',
      },
    },
    {
      quote:
        'Finally, a productivity tool that understands developers. The AI features helped me identify my peak coding hours and now I accomplish more in less time.',
      user: {
        name: 'Benjamin Canac',
        role: 'Senior Frontend Developer',
        avatar: '',
      },
    },
  ],
});

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
</script>

<style scoped></style>

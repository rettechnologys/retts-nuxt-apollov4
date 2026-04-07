<template>
  <BaseLayout
    container="section"
    padding="section"
    bg="default"
    class="text-center my-auto"
  >
    <div class="mb-4 font-bold text-4xl md:text-5xl max-w-4xl mx-auto">
      <span class="text-surface-900 dark:text-surface-0 mr-2"
        >{{ title }}
      </span>
      <span class="text-primary-600">{{ titleHighlight }}</span>
    </div>
    <div class="text-surface-700 dark:text-surface-100 mb-12">
      {{ subtitle }}
    </div>

    <BaseLayout layout="grid" cols="3" gap="none" :full-height="false">
      <BaseLayout
        v-for="(feature, index) in features"
        :key="index"
        layout="flex"
        direction="column"
        align="center"
        gap="none"
        padding="md"
        :full-height="false"
      >
        <span
          class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900"
          style="border-radius: 10px"
        >
          <i :class="['pi !text-4xl text-primary-500', feature.icon]"></i>
        </span>
        <div
          class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium"
        >
          {{ feature.title }}
        </div>
        <span class="text-surface-700 dark:text-surface-100 leading-normal">
          {{ feature.description }}
        </span>
      </BaseLayout>
    </BaseLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Props {
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  features?: Feature[];
}

withDefaults(defineProps<Props>(), {
  title: 'One Product,',
  titleHighlight: 'Many Solutions',
  subtitle:
    'Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.',
  features: () => [
    {
      icon: 'pi-desktop',
      title: 'Built for Developers',
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
      icon: 'pi-lock',
      title: 'End-to-End Encryption',
      description:
        'Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.',
    },
    {
      icon: 'pi-check-circle',
      title: 'Easy to Use',
      description:
        'Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.',
    },
    {
      icon: 'pi-globe',
      title: 'Fast & Global Support',
      description:
        'Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.',
    },
    {
      icon: 'pi-github',
      title: 'Open Source',
      description:
        'Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.',
    },
    {
      icon: 'pi-shield',
      title: 'Trusted Security',
      description:
        'Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.',
    },
  ],
});
</script>

<style scoped></style>

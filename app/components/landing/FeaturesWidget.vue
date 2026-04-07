<template>
  <BaseLayout
    id="features"
    container="section"
    padding="section"
    class="text-center items-center flex flex-col"
  >
    <!-- Title Section -->
    <div class="mt-20 mb-24 max-w-4xl mx-auto">
      <div class="mb-2 font-bold text-4xl md:text-5xl">
        {{ title }}
      </div>
      <span class="text-muted-color text-2xl">{{ subtitle }}</span>
    </div>

    <!-- Features Grid -->
    <BaseLayout
      layout="grid"
      cols="3"
      gap="lg"
      class="max-w-7xl mx-auto"
      :full-height="false"
    >
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="mt-6 lg:mt-0 pb-4"
        :full-height="false"
      >
        <div
          :style="`height: 240px; padding: 2px; border-radius: 10px; background: ${feature.gradient}`"
        >
          <BaseLayout
            layout="flex"
            direction="column"
            padding="md"
            class="bg-surface-0 dark:bg-surface-900 h-full rounded-lg"
            :full-height="false"
          >
            <div
              :class="[
                'flex items-center justify-center mb-4',
                feature.bgColor,
              ]"
              style="width: 3.5rem; height: 3.5rem; border-radius: 10px"
            >
              <i
                :class="['pi pi-fw !text-2xl', feature.icon, feature.iconColor]"
              />
            </div>
            <h5 class="mb-2 text-surface-900 dark:text-surface-0 text-left">
              {{ feature.title }}
            </h5>
            <span class="text-surface-600 dark:text-surface-200 text-left">{{
              feature.description
            }}</span>
          </BaseLayout>
        </div>
      </div>
    </BaseLayout>
  </BaseLayout>
</template>
<script setup lang="ts">
interface Feature {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
  gradient: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

const _props = withDefaults(defineProps<Props>(), {
  title: 'Marvelous Features',
  subtitle: 'Placerat in egestas erat...',
  features: () => [
    {
      icon: 'pi-users',
      title: 'Easy to Use',
      description: 'Posuere morbi leo urna molestie.',
      bgColor: 'bg-yellow-200',
      iconColor: 'text-yellow-700',
      gradient:
        'linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))',
    },
    {
      icon: 'pi-palette',
      title: 'Fresh Design',
      description: 'Semper risus in hendrerit.',
      bgColor: 'bg-cyan-200',
      iconColor: 'text-cyan-700',
      gradient:
        'linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))',
    },
    {
      icon: 'pi-map',
      title: 'Well Documented',
      description: 'Non arcu risus quis varius quam quisque.',
      bgColor: 'bg-indigo-200',
      iconColor: 'text-indigo-700',
      gradient:
        'linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))',
    },
    {
      icon: 'pi-id-card',
      title: 'Responsive Layout',
      description: 'Nulla malesuada pellentesque elit.',
      bgColor: 'bg-slate-200',
      iconColor: 'text-slate-700',
      gradient:
        'linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(145, 210, 204, 0.2))',
    },
    {
      icon: 'pi-star',
      title: 'Clean Code',
      description: 'Condimentum lacinia quis vel eros.',
      bgColor: 'bg-orange-200',
      iconColor: 'text-orange-700',
      gradient:
        'linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2), rgba(160, 210, 250, 0.2))',
    },
    {
      icon: 'pi-moon',
      title: 'Dark Mode',
      description: 'Convallis tellus id interdum velit laoreet.',
      bgColor: 'bg-pink-200',
      iconColor: 'text-pink-700',
      gradient:
        'linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))',
    },
  ],
});
</script>

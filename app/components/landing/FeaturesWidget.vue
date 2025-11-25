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

<template>
  <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
    <div class="grid grid-cols-12 gap-4 justify-center">
      <div class="col-span-12 text-center mt-20 mb-6">
        <div
          class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl"
        >
          {{ title }}
        </div>
        <span class="text-muted-color text-2xl">{{ subtitle }}</span>
      </div>

      <div
        v-for="(feature, index) in features"
        :key="index"
        class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0"
      >
        <div
          :style="`height: 160px; padding: 2px; border-radius: 10px; background: ${feature.gradient}`"
        >
          <div
            class="p-4 bg-surface-0 dark:bg-surface-900 h-full"
            style="border-radius: 8px"
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
            <h5 class="mb-2 text-surface-900 dark:text-surface-0">
              {{ feature.title }}
            </h5>
            <span class="text-surface-600 dark:text-surface-200">{{
              feature.description
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

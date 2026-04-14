<template>
  <BaseLayout
    layout="grid"
    cols="2"
    gap="none"
    bg="default"
    class="text-surface-800 @container dark:text-surface-50 relative min-h-[600px] lg:min-h-screen"
  >
    <!-- Background Image for small/medium screens -->
    <div
      class="absolute inset-0 @3xs:absolute! lg:hidden"
      :style="{
        backgroundImage: `url(${resolvedImageSource})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: '0.60',
      }"
    ></div>

    <BaseLayout
      layout="flex"
      align="center"
      padding="lg"
      class="text-center @container lg:text-left z-10 relative col-span-2 lg:col-span-1 px-6 lg:px-20"
    >
      <section class="mx-6 md:mx-20">
        <span class="block text-4xl md:text-6xl font-bold mb-1">{{
          title
        }}</span>
        <div class="text-4xl md:text-6xl text-primary font-bold mb-4">
          {{ subtitle }}
        </div>
        <p
          class="mt-0 mb-6 text-surface-700 dark:text-surface-100 leading-normal"
        >
          {{ description }}
        </p>

        <Button
          :label="primaryButtonLabel"
          type="button"
          class="mr-4"
          raised
          @click="handlePrimaryClick"
        ></Button>
        <Button
          :label="secondaryButtonLabel"
          type="button"
          outlined
          @click="handleSecondaryClick"
        ></Button>
      </section>
    </BaseLayout>

    <!-- Regular Image for large screens -->
    <BaseLayout class="overflow-hidden hidden lg:block relative">
      <img
        :src="resolvedImageSource"
        :alt="imageAlt"
        class="ml-auto block h-full w-full object-cover"
        style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)"
      />
    </BaseLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
// #region Imports
import { useResolvedMediaSource } from '~/composables/useResolvedMediaSource';
// #endregion Imports

// #region Types
interface Props {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonLabel?: string;
  primaryButtonLink?: string;
  secondaryButtonLabel?: string;
  secondaryButtonLink?: string;
  image?: string | File;
  imageAlt?: string;
  calledFromPreview?: boolean;
}
// #endregion Types

// #region Constants
const HERO_IMAGE_DEFAULT = '/demo/images/blocks/hero/hero-1.png';
// #endregion Constants

// #region Props & Emits
const props = withDefaults(defineProps<Props>(), {
  title: 'Create the screens',
  subtitle: 'your visitors deserve to see',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  primaryButtonLabel: 'Learn More',
  secondaryButtonLabel: 'Live Demo',
  image: HERO_IMAGE_DEFAULT,
  imageAlt: 'Hero Image',
});
// #endregion Props & Emits

// #region Composables
const { resolvedSource: resolvedImageSource } = useResolvedMediaSource(
  () => props.image,
  HERO_IMAGE_DEFAULT,
);
// #endregion Composables

// #region State / Ref
// #endregion State / Ref

// #region Lifecycle Hooks
// #endregion Lifecycle Hooks

// #region Methods / Functions
const handlePrimaryClick = () => {
  if (props.primaryButtonLink) {
    navigateTo(props.primaryButtonLink);
  }
};

const handleSecondaryClick = () => {
  if (props.secondaryButtonLink) {
    navigateTo(props.secondaryButtonLink);
  }
};
// #endregion Methods / Functions

// #region Watcher
watch(
  () => props,
  (newVal) => {
    console.log('HeroSection_2 props updated:', newVal);
  },
  { deep: true },
);
// #endregion Watcher
</script>

<style scoped></style>

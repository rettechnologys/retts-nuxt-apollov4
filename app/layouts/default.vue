<template>
  <div class="bg-surface-0 dark:bg-surface-900">
    <div id="home" class="landing-wrapper">
     
        <TopbarWidget :menus="menus" />
        <slot />
      <!-- <main class="min-h-screen py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20">

      </main> -->
      <!-- <HeroWidget />
      <FeaturesWidget />
      <HighlightsWidget />
      <PricingWidget /> -->
      <FooterWidget />
    </div>
  </div>
</template>

<script setup lang="ts">
import FooterWidget from '~/components/landing/FooterWidget.vue';
import TopbarWidget from '~/components/landing/TopbarWidget.vue';

const configs = await useFetch('/api/global-configs');
console.log('App Loaded', configs.data.value);
const menus = configs.data.value?.menus || [];

</script>

<style scoped>

</style>
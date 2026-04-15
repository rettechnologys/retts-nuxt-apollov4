<template>
  <div class="bg-surface-0 dark:bg-surface-900">
    <div id="home" class="landing-wrapper">
      <TopbarWidgetClient :menus="menus" />
      <slot />
      <!-- <main class="min-h-screen py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20">

      </main> -->
      <!-- <HeroWidget />
      <FeaturesWidget />
      <HighlightsWidget />
      <PricingWidget /> -->
      <FooterWidget :footer="resolvedFooter" />
    </div>
    <ScrollTop />
  </div>
</template>

<script setup lang="ts">
import ScrollTop from 'primevue/scrolltop';
import FooterWidget from '~/components/landing/FooterWidget.vue';
import TopbarWidgetClient from '~/components/landing/TopbarWidget.client.vue';
import type { SiteConfig, FooterConfig, SiteInfo } from '~~/shared';

const DEFAULT_FOOTER: FooterConfig = {
  layout: 'columns',
  columns: 0,
  showSocial: false,
  showNewsletter: false,
  copyright: '',
  columnData: [],
  socialLinks: [],
};

const { data: siteConfig } = await useFetch<SiteConfig>('/api/config');
const menus = computed(() => siteConfig.value?.navigation ?? []);
const resolvedFooter = computed<FooterConfig & { site?: SiteInfo }>(() => ({
  ...(siteConfig.value?.footer ?? DEFAULT_FOOTER),
  site: siteConfig.value?.site ?? { name: '' },
}));
</script>

<style scoped></style>

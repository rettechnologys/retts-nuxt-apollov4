<template>
  <div class="language-switcher">
    <Select
      v-model="selectedLanguage"
      :options="availableLanguages"
      option-label="name"
      placeholder="Select Language"
      class="w-fit"
      size="small"
      :pt="{
        root: {
          class: 'bg-transparent',
        },
      }"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center gap-2">
          <img
            :alt="slotProps.value.label"
            :src="flagPlaceholder"
            :class="`flag flag-${slotProps.value.icon.toLowerCase()}`"
            style="width: 18px"
          />
          <span>{{ slotProps.value.code.toUpperCase() }}</span>
        </div>
        <span v-else>{{ slotProps.placeholder }}</span>
      </template>

      <template #option="slotProps">
        <div class="flex items-center gap-2">
          <i v-if="slotProps.option.icon" :class="slotProps.option.icon" />
          <span>{{ slotProps.option.name }}</span>
        </div>
      </template>
    </Select>
  </div>
</template>
<script setup lang="ts">
import { useAppGCStore } from '~/stores/AppGCStore';
import flagPlaceholder from '@/assets/images/flag_placeholder.png';
const { locale } = useI18n({
  useScope: 'global',
});
const switchLocalePath = useSwitchLocalePath();
const gcStore = useAppGCStore();

// Get available languages from backend
const availableLanguages = computed(() => {
  const backendLangs = gcStore.getLangs || [];
  console.log('Backend Languages:', backendLangs);
  // Map backend languages to i18n format
  return backendLangs.map((lang) => ({
    code: lang.id,
    name: lang.name,
    icon: lang.iconName.split('.')[0], // Assuming iconName is like 'flag-us'
  }));
});

// Selected language model
const selectedLanguage = computed({
  get: () =>
    availableLanguages.value.find((lang) => lang.code === locale.value),
  set: async (lang) => {
    if (lang) {
      // Get the path for the new locale
      const newPath = switchLocalePath(lang.code);

      // Navigate to the new localized path
      navigateTo(newPath || '/', { replace: true });

      // Store preference
      if (import.meta.client) {
        localStorage.setItem('preferred_language', lang.code);
      }
    }
  },
});
</script>

<style scoped>
.language-switcher {
  @apply inline-block;
}
</style>

<template>
  <div class="py-6 px-6 mx-0 mt-20 lg:mx-20">
    <div class="grid grid-cols-12 gap-4">
      <!-- Logo / Brand -->
      <div class="col-span-12 md:col-span-2">
        <NuxtLink
          to="/"
          class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-4 cursor-pointer"
        >
          <img
            v-if="footer.site?.logoUrl"
            :src="footer.site.logoUrl"
            :alt="footer.site?.name"
            class="h-14 mr-2"
          />
          <svg
            v-else
            viewBox="0 0 54 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="h-14 mr-2"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.1637 19.2467C17.1566 19.4033 17.1529 19.561 17.1529 19.7194C17.1529 25.3503 21.7203 29.915 27.3546 29.915C32.9887 29.915 37.5561 25.3503 37.5561 19.7194C37.5561 19.5572 37.5524 19.3959 37.5449 19.2355C38.5617 19.0801 39.5759 18.9013 40.5867 18.6994L40.6926 18.6782C40.7191 19.0218 40.7326 19.369 40.7326 19.7194C40.7326 27.1036 34.743 33.0896 27.3546 33.0896C19.966 33.0896 13.9765 27.1036 13.9765 19.7194C13.9765 19.374 13.9896 19.0316 14.0154 18.6927L14.0486 18.6994C15.0837 18.9062 16.1223 19.0886 17.1637 19.2467ZM33.3284 11.4538C31.6493 10.2396 29.5855 9.52381 27.3546 9.52381C25.1195 9.52381 23.0524 10.2421 21.3717 11.4603C20.0078 11.3232 18.6475 11.1387 17.2933 10.907C19.7453 8.11308 23.3438 6.34921 27.3546 6.34921C31.36 6.34921 34.9543 8.10844 37.4061 10.896C36.0521 11.1292 34.692 11.3152 33.3284 11.4538ZM43.826 18.0518C43.881 18.6003 43.9091 19.1566 43.9091 19.7194C43.9091 28.8568 36.4973 36.2642 27.3546 36.2642C18.2117 36.2642 10.8 28.8568 10.8 19.7194C10.8 19.1615 10.8276 18.61 10.8816 18.0663L7.75383 17.4411C7.66775 18.1886 7.62354 18.9488 7.62354 19.7194C7.62354 30.6102 16.4574 39.4388 27.3546 39.4388C38.2517 39.4388 47.0855 30.6102 47.0855 19.7194C47.0855 18.9439 47.0407 18.1789 46.9536 17.4267L43.826 18.0518ZM44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743Z"
              fill="var(--primary-color)"
            />
          </svg>
          <h4 class="font-medium text-3xl text-surface-900 dark:text-surface-0">
            {{ footer.site?.name ?? 'SAKAI' }}
          </h4>
        </NuxtLink>
      </div>

      <!-- Columns -->
      <div class="col-span-12 md:col-span-10">
        <div class="grid grid-cols-12 gap-8 text-center md:text-left">
          <div
            v-for="(column, i) in footer.columnData"
            :key="i"
            class="col-span-12 md:col-span-3"
          >
            <h4
              class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0"
            >
              {{ column.title }}
            </h4>

            <!-- Links column -->
            <template v-if="column.type === 'links'">
              <NuxtLink
                v-for="link in column.links"
                :key="link.id"
                :to="link.url"
                class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </template>

            <!-- Text column -->
            <p
              v-else-if="column.type === 'text'"
              class="leading-normal text-xl text-surface-700 dark:text-surface-100"
            >
              {{ column.content }}
            </p>

            <!-- Contact column -->
            <template v-else-if="column.type === 'contact'">
              <p
                v-if="column.email"
                class="leading-normal text-xl mb-2 text-surface-700 dark:text-surface-100"
              >
                <i class="pi pi-envelope mr-2 text-primary-500" />{{
                  column.email
                }}
              </p>
              <p
                v-if="column.phone"
                class="leading-normal text-xl mb-2 text-surface-700 dark:text-surface-100"
              >
                <i class="pi pi-phone mr-2 text-primary-500" />{{
                  column.phone
                }}
              </p>
              <p
                v-if="column.address"
                class="leading-normal text-xl text-surface-700 dark:text-surface-100"
              >
                <i class="pi pi-map-marker mr-2 text-primary-500" />{{
                  column.address
                }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Social links -->
    <div
      v-if="footer.showSocial && activeSocials.length"
      class="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-surface-200 dark:border-surface-700"
    >
      <a
        v-for="social in activeSocials"
        :key="social.platform"
        :href="social.url || '#'"
        target="_blank"
        rel="noopener noreferrer"
        class="text-surface-500 hover:text-primary-500 transition-colors text-2xl"
        :aria-label="social.platform"
      >
        <i :class="social.icon" />
      </a>
    </div>

    <!-- Copyright -->
    <div
      class="text-center mt-6 text-sm text-surface-400 dark:text-surface-500"
    >
      {{ footer.copyright }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FooterConfig, SiteInfo } from '~~/shared';

const props = defineProps<{
  footer: FooterConfig & { site?: SiteInfo };
}>();

const activeSocials = computed(() =>
  (props.footer.socialLinks ?? []).filter((s) => s.enabled),
);

console.log('FooterWidget received config:', props.footer);
</script>

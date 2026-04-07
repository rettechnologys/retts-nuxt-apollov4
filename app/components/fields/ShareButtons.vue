<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="border-y border-gray-200 dark:border-gray-700 py-6">
      <h3 class="text-sm font-semibold mb-4">Share this {{ contentType }}</h3>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="platform in platforms"
          :key="platform"
          @click="share(platform)"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon :name="getIcon(platform)" class="text-lg" />
          <span class="text-sm capitalize">{{ platform }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  url?: string;
  contentType?: string;
  platforms?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  contentType: 'article',
  platforms: () => ['twitter', 'facebook', 'linkedin'],
});

const route = useRoute();

const shareUrl = computed(() => {
  if (props.url) {
    return props.url.startsWith('http')
      ? props.url
      : `${window.location.origin}${props.url}`;
  }
  return window.location.href;
});

const getIcon = (platform: string) => {
  const icons: Record<string, string> = {
    twitter: 'mdi:twitter',
    facebook: 'mdi:facebook',
    linkedin: 'mdi:linkedin',
    whatsapp: 'mdi:whatsapp',
    telegram: 'mdi:telegram',
    reddit: 'mdi:reddit',
    email: 'mdi:email',
  };
  return icons[platform] || 'mdi:share-variant';
};

const share = (platform: string) => {
  const encodedUrl = encodeURIComponent(shareUrl.value);
  const encodedTitle = encodeURIComponent(props.title);

  const urls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };

  if (urls[platform]) {
    if (platform === 'email') {
      window.location.href = urls[platform];
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  }
};
</script>

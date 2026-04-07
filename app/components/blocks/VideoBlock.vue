<template>
  <section class="video-block py-8 px-6 flex justify-center">
    <div :class="sizeClass">
      <div class="aspect-video rounded-lg overflow-hidden">
        <iframe
          v-if="embedUrl"
          :src="embedUrl"
          :title="config.title || 'Video'"
          frameborder="0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
          "
          allowfullscreen
          class="w-full h-full"
        ></iframe>
        <div
          v-else
          class="w-full h-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center"
        >
          <i class="pi pi-video text-6xl text-surface-400"></i>
        </div>
      </div>
      <p
        v-if="config.caption"
        class="text-sm text-surface-600 dark:text-surface-400 mt-2 text-center"
      >
        {{ config.caption }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface VideoConfig {
  videoUrl?: string;
  title?: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
}

const props = defineProps<{
  config?: VideoConfig;
}>();

const embedUrl = computed(() => {
  if (!props.config?.videoUrl) return null;

  const url = props.config.videoUrl;
  // Convert YouTube URLs to embed format
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : new URLSearchParams(url.split('?')[1]).get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  return url;
});

const sizeClass = computed(() => {
  const size = props.config?.size || 'medium';
  return {
    'max-w-2xl': size === 'small',
    'max-w-4xl': size === 'medium',
    'max-w-6xl': size === 'large',
    'w-full': size === 'full',
  };
});
</script>

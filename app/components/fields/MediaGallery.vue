<template>
  <div class="container mx-auto px-4 py-8" :class="maxWidthClass">
    <!-- Single Image -->
    <div
      v-if="variant === 'single' && images?.[0]"
      class="rounded-lg overflow-hidden"
    >
      <img
        :src="getImageUrl(images[0])"
        :alt="getImageAlt(images[0]) || title"
        :class="imageClass"
      />
    </div>

    <!-- Grid Gallery -->
    <div
      v-else-if="variant === 'grid' && images?.length"
      class="grid gap-4"
      :class="gridClass"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        @click="openLightbox(index)"
      >
        <img
          :src="getImageUrl(image)"
          :alt="getImageAlt(image) || title"
          class="w-full h-64 object-cover"
        />
      </div>
    </div>

    <!-- Carousel/Slider -->
    <div v-else-if="variant === 'carousel' && images?.length" class="relative">
      <div class="overflow-hidden rounded-lg">
        <div
          class="flex transition-transform duration-300"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(image, index) in images"
            :key="index"
            class="w-full flex-shrink-0"
          >
            <img
              :src="getImageUrl(image)"
              :alt="getImageAlt(image) || title"
              :class="imageClass"
            />
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <button
        v-if="images.length > 1"
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
        aria-label="Previous"
      >
        <Icon name="mdi:chevron-left" class="text-2xl" />
      </button>
      <button
        v-if="images.length > 1"
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
        aria-label="Next"
      >
        <Icon name="mdi:chevron-right" class="text-2xl" />
      </button>

      <!-- Indicators -->
      <div
        v-if="showIndicators && images.length > 1"
        class="flex justify-center gap-2 mt-4"
      >
        <button
          v-for="(_, index) in images"
          :key="index"
          @click="currentSlide = index"
          class="w-2 h-2 rounded-full transition-colors"
          :class="currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MediaItem {
  url: string;
  alt?: string;
  caption?: string;
}

interface Props {
  images?: (string | MediaItem)[];
  variant?: 'single' | 'grid' | 'carousel';
  title?: string;
  columns?: number;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  showIndicators?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'single',
  columns: 3,
  aspectRatio: 'auto',
  showIndicators: true,
  maxWidth: 'full',
});

const currentSlide = ref(0);

const maxWidthClass = computed(() => {
  const widths: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };
  return widths[props.maxWidth];
});

const gridClass = computed(() => {
  const classes: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };
  return classes[props.columns] || 'md:grid-cols-3';
});

const imageClass = computed(() => {
  const ratios: Record<string, string> = {
    square: 'w-full aspect-square object-cover',
    video: 'w-full aspect-video object-cover',
    wide: 'w-full aspect-[21/9] object-cover',
    auto: 'w-full h-auto',
  };
  return ratios[props.aspectRatio];
});

const getImageUrl = (image: string | MediaItem): string => {
  return typeof image === 'string' ? image : image.url;
};

const getImageAlt = (image: string | MediaItem): string | undefined => {
  return typeof image === 'string' ? undefined : image.alt;
};

const nextSlide = () => {
  if (props.images) {
    currentSlide.value = (currentSlide.value + 1) % props.images.length;
  }
};

const prevSlide = () => {
  if (props.images) {
    currentSlide.value =
      currentSlide.value === 0
        ? props.images.length - 1
        : currentSlide.value - 1;
  }
};

const openLightbox = (index: number) => {
  // TODO: Implement lightbox modal
  console.log('Open lightbox at index:', index);
};
</script>

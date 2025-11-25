<template>
    <div
        id="hero"
        class="flex flex-col pt-24 px-6 lg:px-20 h-screen items-center overflow-hidden"
        style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
    >
        <div class="mx-6 md:mx-20 mt-0 md:mt-6">
            <h1 class="text-6xl font-bold text-gray-900 leading-tight">
                <span v-if="subtitle" class="font-light block">{{ subtitle }}</span>
                {{ title || 'eget magna fermentum' }}
            </h1>
            <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">
                {{ description || 'Sed blandit libero volutpat sed cras. Fames ac turpis egestas integer. Placerat in egestas erat...' }}
            </p>
            <Button 
                :label="buttonLabel || 'Get Started'" 
                :as="buttonLink ? 'router-link' : 'button'" 
                :to="buttonLink || '/'" 
                rounded 
                class="!text-xl mt-8 !px-4"
            />
        </div>
        <div class="flex justify-center md:justify-end">
            <img :src="image || '/demo/images/landing/screen-1.png'" :alt="imageAlt || 'Hero Image'" class="w-9/12 md:w-auto">
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonLabel?: string;
    buttonLink?: string;
    image?: string;
    imageAlt?: string;
}

withDefaults(defineProps<Props>(), {
    title: 'eget magna fermentum',
    subtitle: 'Eu sem integer',
    description: 'Sed blandit libero volutpat sed cras. Fames ac turpis egestas integer. Placerat in egestas erat...',
    buttonLabel: 'Get Started',
    buttonLink: '/',
    image: '/demo/images/landing/screen-1.png',
    imageAlt: 'Hero Image'
});
</script>

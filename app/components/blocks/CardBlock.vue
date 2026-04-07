<template>
  <section class="card-block py-8 px-6 flex justify-center">
    <div class="max-w-md">
      <Card>
        <template #header>
          <img
            v-if="config.image"
            :src="config.image"
            :alt="config.title"
            class="rounded-t-lg"
          />
        </template>
        <template #title>
          {{ config.title || 'Card Title' }}
        </template>
        <template #content>
          <p>
            {{
              config.content ||
              'Card content goes here. Add your description and details.'
            }}
          </p>
        </template>
        <template #footer>
          <Button
            v-if="config.showButton"
            :label="config.buttonText || 'Learn More'"
            @click="handleClick"
          />
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';

interface CardConfig {
  title?: string;
  content?: string;
  image?: string;
  buttonText?: string;
  showButton?: boolean;
  action?: string;
}

const props = defineProps<{
  config?: CardConfig;
}>();

const handleClick = () => {
  if (props.config?.action) {
    console.log('Card action:', props.config.action);
  }
};
</script>

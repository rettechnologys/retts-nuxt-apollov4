<template>
  <section class="form-block py-8 px-6">
    <div class="max-w-2xl mx-auto">
      <h3 v-if="config.title" class="text-2xl font-bold mb-6 text-center">
        {{ config.title }}
      </h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-for="field in fields" :key="field.name" class="form-field">
          <label :for="field.name" class="block text-sm font-medium mb-2">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <InputText
            v-if="field.type === 'text' || field.type === 'email'"
            :id="field.name"
            v-model="formData[field.name]"
            :type="field.type"
            :placeholder="field.placeholder"
            :required="field.required"
            class="w-full"
          />

          <Textarea
            v-else-if="field.type === 'textarea'"
            :id="field.name"
            v-model="formData[field.name]"
            :placeholder="field.placeholder"
            :required="field.required"
            rows="4"
            class="w-full"
          />
        </div>

        <div class="flex justify-center pt-4">
          <Button type="submit" :label="config.submitText || 'Submit'" />
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

interface FormConfig {
  title?: string;
  fields?: FormField[];
  submitText?: string;
}

const props = defineProps<{
  config?: FormConfig;
}>();

const fields = computed(
  () =>
    props.config?.fields || [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
    ],
);

const formData = ref<Record<string, string>>({});

const handleSubmit = () => {
  console.log('Form submitted:', formData.value);
};
</script>

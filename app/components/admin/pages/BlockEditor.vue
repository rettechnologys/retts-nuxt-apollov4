<template>
  <Dialog
    v-model:visible="visible"
    :header="`Edit ${blockData?.name || blockData?.type || 'Block'}`"
    :modal="true"
    :style="{ width: '700px' }"
    :closable="true"
  >
    <div v-if="blockData" class="block-editor">
      <!-- Hero Block Config -->
      <div v-if="blockData.type === 'hero'" class="space-y-4">
        <div class="field">
          <label for="heroHeading" class="block font-medium mb-2"
            >Heading</label
          >
          <InputText
            id="heroHeading"
            v-model="localConfig.heading"
            placeholder="Enter heading"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="heroSubheading" class="block font-medium mb-2"
            >Subheading</label
          >
          <Textarea
            id="heroSubheading"
            v-model="localConfig.subheading"
            placeholder="Enter subheading"
            rows="2"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="heroButtonText" class="block font-medium mb-2"
            >Button Text</label
          >
          <InputText
            id="heroButtonText"
            v-model="localConfig.buttonText"
            placeholder="Get Started"
            class="w-full"
          />
        </div>
        <div class="field">
          <div class="flex items-center gap-2">
            <Checkbox
              inputId="heroShowButton"
              v-model="localConfig.showButton"
              :binary="true"
            />
            <label for="heroShowButton" class="cursor-pointer"
              >Show Button</label
            >
          </div>
        </div>
        <div class="field">
          <label for="heroBackground" class="block font-medium mb-2"
            >Background Color</label
          >
          <InputText
            id="heroBackground"
            v-model="localConfig.backgroundColor"
            placeholder="#3b82f6"
            class="w-full"
          />
        </div>
      </div>

      <!-- Text Block Config -->
      <div v-else-if="blockData.type === 'text'" class="space-y-4">
        <div class="field">
          <label for="textContent" class="block font-medium mb-2"
            >Content</label
          >
          <Textarea
            id="textContent"
            v-model="localConfig.content"
            placeholder="Enter your text content"
            rows="6"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="textAlignment" class="block font-medium mb-2"
            >Alignment</label
          >
          <Select
            id="textAlignment"
            v-model="localConfig.alignment"
            :options="alignmentOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
      </div>

      <!-- Heading Block Config -->
      <div v-else-if="blockData.type === 'heading'" class="space-y-4">
        <div class="field">
          <label for="headingText" class="block font-medium mb-2"
            >Heading Text</label
          >
          <InputText
            id="headingText"
            v-model="localConfig.text"
            placeholder="Enter heading"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="headingLevel" class="block font-medium mb-2"
            >Heading Level</label
          >
          <Select
            id="headingLevel"
            v-model="localConfig.level"
            :options="headingLevels"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="headingAlignment" class="block font-medium mb-2"
            >Alignment</label
          >
          <Select
            id="headingAlignment"
            v-model="localConfig.alignment"
            :options="alignmentOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
      </div>

      <!-- Image Block Config -->
      <div v-else-if="blockData.type === 'image'" class="space-y-4">
        <div class="field">
          <label for="imageUrl" class="block font-medium mb-2">Image URL</label>
          <div class="flex gap-2">
            <InputText
              id="imageUrl"
              v-model="localConfig.imageUrl"
              placeholder="https://example.com/image.jpg"
              class="flex-1"
            />
            <Button icon="pi pi-upload" outlined />
          </div>
        </div>
        <div class="field">
          <label for="imageAlt" class="block font-medium mb-2">Alt Text</label>
          <InputText
            id="imageAlt"
            v-model="localConfig.altText"
            placeholder="Image description"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="imageCaption" class="block font-medium mb-2"
            >Caption (Optional)</label
          >
          <InputText
            id="imageCaption"
            v-model="localConfig.caption"
            placeholder="Image caption"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="imageSize" class="block font-medium mb-2">Size</label>
          <Select
            id="imageSize"
            v-model="localConfig.size"
            :options="sizeOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
      </div>

      <!-- Button Block Config -->
      <div v-else-if="blockData.type === 'button'" class="space-y-4">
        <div class="field">
          <label for="buttonText" class="block font-medium mb-2"
            >Button Text</label
          >
          <InputText
            id="buttonText"
            v-model="localConfig.text"
            placeholder="Click Me"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="buttonVariant" class="block font-medium mb-2"
            >Style</label
          >
          <Select
            id="buttonVariant"
            v-model="localConfig.variant"
            :options="buttonVariants"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="buttonSize" class="block font-medium mb-2">Size</label>
          <Select
            id="buttonSize"
            v-model="localConfig.size"
            :options="buttonSizes"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        <div class="field">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <Checkbox
                inputId="buttonOutlined"
                v-model="localConfig.outlined"
                :binary="true"
              />
              <label for="buttonOutlined" class="cursor-pointer"
                >Outlined</label
              >
            </div>
            <div class="flex items-center gap-2">
              <Checkbox
                inputId="buttonRaised"
                v-model="localConfig.raised"
                :binary="true"
              />
              <label for="buttonRaised" class="cursor-pointer"
                >Raised (shadow)</label
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Grid Block Config -->
      <div v-else-if="blockData.type === 'grid'" class="space-y-4">
        <div class="field">
          <label for="gridColumns" class="block font-medium mb-2"
            >Number of Columns</label
          >
          <InputNumber
            id="gridColumns"
            v-model="localConfig.columns"
            :min="1"
            :max="4"
            showButtons
            class="w-full"
          />
        </div>
        <div class="field">
          <label class="block font-medium mb-2">Grid Items</label>
          <div class="space-y-3">
            <div
              v-for="(item, index) in localConfig.items"
              :key="index"
              class="grid-item-editor"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">Item {{ +index + 1 }}</span>
                <Button
                  icon="pi pi-trash"
                  text
                  size="small"
                  severity="danger"
                  @click="removeGridItem(+index)"
                />
              </div>
              <InputText
                v-model="item.title"
                placeholder="Title"
                class="w-full mb-2"
              />
              <Textarea
                v-model="item.description"
                placeholder="Description"
                rows="2"
                class="w-full"
              />
            </div>
          </div>
          <Button
            label="Add Item"
            icon="pi pi-plus"
            outlined
            size="small"
            class="mt-3"
            @click="addGridItem"
          />
        </div>
      </div>

      <!-- Video Block Config -->
      <div v-else-if="blockData.type === 'video'" class="space-y-4">
        <div class="field">
          <label for="videoUrl" class="block font-medium mb-2">Video URL</label>
          <InputText
            id="videoUrl"
            v-model="localConfig.videoUrl"
            placeholder="https://youtube.com/watch?v=..."
            class="w-full"
          />
          <small class="text-surface-500"
            >YouTube, Vimeo, or direct video URL</small
          >
        </div>
        <div class="field">
          <label for="videoTitle" class="block font-medium mb-2"
            >Title (Optional)</label
          >
          <InputText
            id="videoTitle"
            v-model="localConfig.title"
            placeholder="Video title"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="videoSize" class="block font-medium mb-2">Size</label>
          <Select
            id="videoSize"
            v-model="localConfig.size"
            :options="sizeOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
      </div>

      <!-- Card Block Config -->
      <div v-else-if="blockData.type === 'card'" class="space-y-4">
        <div class="field">
          <label for="cardTitle" class="block font-medium mb-2">Title</label>
          <InputText
            id="cardTitle"
            v-model="localConfig.title"
            placeholder="Card title"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="cardContent" class="block font-medium mb-2"
            >Content</label
          >
          <Textarea
            id="cardContent"
            v-model="localConfig.content"
            placeholder="Card content"
            rows="4"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="cardImage" class="block font-medium mb-2"
            >Image URL (Optional)</label
          >
          <InputText
            id="cardImage"
            v-model="localConfig.image"
            placeholder="https://example.com/image.jpg"
            class="w-full"
          />
        </div>
        <div class="field">
          <div class="flex items-center gap-2 mb-2">
            <Checkbox
              inputId="cardShowButton"
              v-model="localConfig.showButton"
              :binary="true"
            />
            <label for="cardShowButton" class="cursor-pointer"
              >Show Button</label
            >
          </div>
          <InputText
            v-if="localConfig.showButton"
            v-model="localConfig.buttonText"
            placeholder="Button text"
            class="w-full"
          />
        </div>
      </div>

      <!-- Generic/Default Config -->
      <div v-else class="space-y-4">
        <Message severity="info" :closable="false">
          <p>Basic configuration for {{ blockData.type }} block</p>
        </Message>
        <div class="field">
          <label for="genericContent" class="block font-medium mb-2"
            >Content</label
          >
          <Textarea
            id="genericContent"
            v-model="localConfig.content"
            placeholder="Enter content"
            rows="6"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        severity="secondary"
        outlined
        @click="handleCancel"
      />
      <Button label="Save Changes" @click="handleSave" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import Message from 'primevue/message';

interface Props {
  visible: boolean;
  blockData: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  save: [config: any];
}>();

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const localConfig = ref<any>({});

watch(
  () => props.blockData,
  (newVal) => {
    if (newVal) {
      localConfig.value = { ...newVal.config };
    }
  },
  { immediate: true, deep: true },
);

// Options
const alignmentOptions = ref([
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]);

const headingLevels = ref([
  { label: 'H1 - Largest', value: 1 },
  { label: 'H2', value: 2 },
  { label: 'H3', value: 3 },
  { label: 'H4', value: 4 },
  { label: 'H5', value: 5 },
  { label: 'H6 - Smallest', value: 6 },
]);

const sizeOptions = ref([
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Full Width', value: 'full' },
]);

const buttonVariants = ref([
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Success', value: 'success' },
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warn' },
  { label: 'Danger', value: 'danger' },
]);

const buttonSizes = ref([
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]);

// Methods
const addGridItem = () => {
  if (!localConfig.value.items) {
    localConfig.value.items = [];
  }
  localConfig.value.items.push({
    title: `Item ${localConfig.value.items.length + 1}`,
    description: 'Description',
    icon: 'pi pi-star',
  });
};

const removeGridItem = (index: number) => {
  localConfig.value.items.splice(index, 1);
};

const handleSave = () => {
  emit('save', localConfig.value);
  visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
  // Reset to original config
  if (props.blockData) {
    localConfig.value = { ...props.blockData.config };
  }
};
</script>

<style scoped>
.block-editor {
  padding: 0.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.grid-item-editor {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
}

.field {
  margin-bottom: 1rem;
}
</style>

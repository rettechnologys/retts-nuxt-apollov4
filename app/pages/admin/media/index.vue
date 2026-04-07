<!-- Media Library -->
<template>
  <div class="media-library-page">
    <div class="page-header">
      <h1>Media Library</h1>
      <div class="header-actions">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Search media..." />
        </span>
        <Dropdown
          v-model="filterType"
          :options="mediaTypes"
          optionLabel="label"
          optionValue="value"
          placeholder="All Types"
        />
        <Button
          :icon="viewMode === 'grid' ? 'pi pi-list' : 'pi pi-th-large'"
          outlined
          @click="toggleViewMode"
        />
        <FileUpload
          mode="basic"
          :auto="true"
          chooseLabel="Upload"
          :customUpload="true"
          @uploader="uploadFiles"
          :multiple="true"
        />
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="upload-progress">
      <ProgressBar :value="uploadProgress" />
      <span>Uploading {{ uploadingFiles }} file(s)...</span>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="media-grid">
      <div
        v-for="item in filteredMedia"
        :key="item.id"
        class="media-item"
        :class="{ selected: selectedMedia.includes(item.id) }"
        @click="selectMedia(item)"
        @dblclick="openMediaDetail(item)"
      >
        <div class="media-preview">
          <!-- Image Preview -->
          <img v-if="item.type === 'image'" :src="item.url" :alt="item.name" />

          <!-- Video Preview -->
          <div v-else-if="item.type === 'video'" class="video-preview">
            <i class="pi pi-play-circle"></i>
          </div>

          <!-- Document Preview -->
          <div v-else class="document-preview">
            <i :class="getFileIcon(item.extension)"></i>
          </div>

          <div class="media-overlay">
            <Button
              icon="pi pi-eye"
              rounded
              text
              severity="contrast"
              @click.stop="openMediaDetail(item)"
            />
            <Button
              icon="pi pi-download"
              rounded
              text
              severity="contrast"
              @click.stop="downloadMedia(item)"
            />
            <Button
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              @click.stop="deleteMedia(item)"
            />
          </div>
        </div>

        <div class="media-info">
          <span class="media-name" :title="item.name">{{ item.name }}</span>
          <div class="media-meta">
            <small>{{ formatFileSize(item.size) }}</small>
            <Badge :value="item.extension.toUpperCase()" severity="secondary" />
          </div>
        </div>
      </div>

      <div v-if="filteredMedia.length === 0" class="empty-state">
        <i class="pi pi-images"></i>
        <p>No media files found</p>
        <FileUpload
          mode="basic"
          :auto="true"
          chooseLabel="Upload Files"
          :customUpload="true"
          @uploader="uploadFiles"
          :multiple="true"
        />
      </div>
    </div>

    <!-- Table View -->
    <div v-else class="media-table">
      <DataTable
        :value="filteredMedia"
        :paginator="true"
        :rows="20"
        v-model:selection="selectedMediaItems"
        dataKey="id"
        stripedRows
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

        <Column field="name" header="Name" sortable>
          <template #body="{ data }">
            <div class="table-media-name">
              <img
                v-if="data.type === 'image'"
                :src="data.url"
                :alt="data.name"
                class="table-thumb"
              />
              <div v-else class="table-thumb-placeholder">
                <i :class="getFileIcon(data.extension)"></i>
              </div>
              <span>{{ data.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="type" header="Type" sortable>
          <template #body="{ data }">
            <Badge :value="data.type" severity="info" />
          </template>
        </Column>

        <Column field="size" header="Size" sortable>
          <template #body="{ data }">
            {{ formatFileSize(data.size) }}
          </template>
        </Column>

        <Column field="dimensions" header="Dimensions">
          <template #body="{ data }">
            {{ data.dimensions || '-' }}
          </template>
        </Column>

        <Column field="uploadedAt" header="Uploaded" sortable>
          <template #body="{ data }">
            {{ formatDate(data.uploadedAt) }}
          </template>
        </Column>

        <Column header="Actions">
          <template #body="{ data }">
            <div class="table-actions">
              <Button
                icon="pi pi-eye"
                text
                rounded
                @click="openMediaDetail(data)"
                v-tooltip.top="'View'"
              />
              <Button
                icon="pi pi-download"
                text
                rounded
                @click="downloadMedia(data)"
                v-tooltip.top="'Download'"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                @click="deleteMedia(data)"
                v-tooltip.top="'Delete'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Bulk Actions -->
    <div
      v-if="selectedMedia.length > 0 || selectedMediaItems.length > 0"
      class="bulk-actions"
    >
      <span
        >{{ selectedMedia.length || selectedMediaItems.length }} file(s)
        selected</span
      >
      <Button
        label="Download"
        icon="pi pi-download"
        size="small"
        @click="bulkDownload"
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        severity="danger"
        size="small"
        @click="bulkDelete"
      />
    </div>

    <!-- Media Detail Dialog -->
    <Dialog
      v-model:visible="detailDialog"
      :header="selectedItem?.name"
      :modal="true"
      :style="{ width: '800px' }"
    >
      <div v-if="selectedItem" class="media-detail">
        <div class="detail-preview">
          <img
            v-if="selectedItem.type === 'image'"
            :src="selectedItem.url"
            :alt="selectedItem.name"
          />
          <video
            v-else-if="selectedItem.type === 'video'"
            :src="selectedItem.url"
            controls
          ></video>
          <div v-else class="detail-document">
            <i :class="getFileIcon(selectedItem.extension)"></i>
            <p>{{ selectedItem.name }}</p>
          </div>
        </div>

        <div class="detail-info">
          <div class="info-grid">
            <div class="info-item">
              <label>File Name</label>
              <InputText v-model="selectedItem.name" />
            </div>

            <div class="info-item">
              <label>Alt Text</label>
              <InputText
                v-model="selectedItem.altText"
                placeholder="Alternative text for accessibility"
              />
            </div>

            <div class="info-item">
              <label>File Type</label>
              <span
                >{{ selectedItem.type }} ({{ selectedItem.extension }})</span
              >
            </div>

            <div class="info-item">
              <label>File Size</label>
              <span>{{ formatFileSize(selectedItem.size) }}</span>
            </div>

            <div v-if="selectedItem.dimensions" class="info-item">
              <label>Dimensions</label>
              <span>{{ selectedItem.dimensions }}</span>
            </div>

            <div class="info-item">
              <label>Uploaded</label>
              <span>{{ formatDate(selectedItem.uploadedAt) }}</span>
            </div>

            <div class="info-item full-width">
              <label>URL</label>
              <div class="url-field">
                <InputText :value="selectedItem.url" readonly />
                <Button
                  icon="pi pi-copy"
                  @click="copyUrl(selectedItem.url)"
                  v-tooltip.top="'Copy URL'"
                />
              </div>
            </div>

            <div class="info-item full-width">
              <label>Caption</label>
              <Textarea
                v-model="selectedItem.caption"
                rows="3"
                placeholder="Optional caption"
              />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Close"
          severity="secondary"
          text
          @click="detailDialog = false"
        />
        <Button label="Save Changes" @click="saveMediaDetails" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

interface MediaItem {
  id: number;
  name: string;
  url: string;
  type: string;
  extension: string;
  size: number;
  dimensions?: string;
  altText?: string;
  caption?: string;
  uploadedAt: string;
}

const viewMode = ref<'grid' | 'table'>('grid');
const searchQuery = ref('');
const filterType = ref('all');
const selectedMedia = ref<number[]>([]);
const selectedMediaItems = ref<MediaItem[]>([]);
const detailDialog = ref(false);
const selectedItem = ref<MediaItem | null>(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadingFiles = ref(0);

const mediaTypes = ref([
  { label: 'All Types', value: 'all' },
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Documents', value: 'document' },
]);

const mediaFiles = ref<MediaItem[]>([
  {
    id: 1,
    name: 'hero-banner.jpg',
    url: '/demo/images/hero-banner.jpg',
    type: 'image',
    extension: 'jpg',
    size: 2457600,
    dimensions: '1920x1080',
    altText: 'Hero banner image',
    uploadedAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'product-photo.png',
    url: '/demo/images/product.png',
    type: 'image',
    extension: 'png',
    size: 1536000,
    dimensions: '1200x800',
    uploadedAt: '2024-01-14',
  },
  {
    id: 3,
    name: 'company-logo.svg',
    url: '/demo/images/logo.svg',
    type: 'image',
    extension: 'svg',
    size: 12400,
    uploadedAt: '2024-01-13',
  },
  {
    id: 4,
    name: 'presentation.pdf',
    url: '/demo/documents/presentation.pdf',
    type: 'document',
    extension: 'pdf',
    size: 5242880,
    uploadedAt: '2024-01-12',
  },
  {
    id: 5,
    name: 'intro-video.mp4',
    url: '/demo/videos/intro.mp4',
    type: 'video',
    extension: 'mp4',
    size: 15728640,
    dimensions: '1280x720',
    uploadedAt: '2024-01-11',
  },
]);

const filteredMedia = computed(() => {
  let result = mediaFiles.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((m) => m.name.toLowerCase().includes(query));
  }

  if (filterType.value !== 'all') {
    result = result.filter((m) => m.type === filterType.value);
  }

  return result;
});

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'table' : 'grid';
};

const selectMedia = (item: MediaItem) => {
  const index = selectedMedia.value.indexOf(item.id);
  if (index > -1) {
    selectedMedia.value.splice(index, 1);
  } else {
    selectedMedia.value.push(item.id);
  }
};

const openMediaDetail = (item: MediaItem) => {
  selectedItem.value = { ...item };
  detailDialog.value = true;
};

const uploadFiles = async (event: any) => {
  uploading.value = true;
  uploadingFiles.value = event.files.length;
  uploadProgress.value = 0;

  // Simulate upload progress
  const interval = setInterval(() => {
    uploadProgress.value += 10;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      uploading.value = false;
      uploadProgress.value = 0;
      // TODO: Refresh media list
    }
  }, 300);
};

const downloadMedia = (item: MediaItem) => {
  window.open(item.url, '_blank');
};

const deleteMedia = (item: MediaItem) => {
  // TODO: Confirm and delete
  console.log('Delete media:', item);
};

const bulkDownload = () => {
  console.log('Bulk download');
};

const bulkDelete = () => {
  console.log('Bulk delete');
};

const saveMediaDetails = () => {
  // TODO: Save media details
  detailDialog.value = false;
};

const copyUrl = (url: string) => {
  navigator.clipboard.writeText(url);
  // TODO: Show success toast
};

const getFileIcon = (extension: string) => {
  const iconMap: Record<string, string> = {
    pdf: 'pi pi-file-pdf',
    doc: 'pi pi-file-word',
    docx: 'pi pi-file-word',
    xls: 'pi pi-file-excel',
    xlsx: 'pi pi-file-excel',
    zip: 'pi pi-file',
    mp4: 'pi pi-video',
    mp3: 'pi pi-volume-up',
  };
  return iconMap[extension] || 'pi pi-file';
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>

<style scoped>
.media-library-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.media-item {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.media-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.media-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.media-preview {
  position: relative;
  width: 100%;
  height: 200px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.media-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-preview,
.document-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.video-preview i,
.document-preview i {
  font-size: 4rem;
  color: #9ca3af;
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.media-item:hover .media-overlay {
  opacity: 1;
}

.media-info {
  padding: 0.75rem;
}

.media-name {
  display: block;
  font-weight: 500;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.5rem;
}

.media-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.media-meta small {
  color: #6b7280;
  font-size: 0.75rem;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #9ca3af;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.table-media-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.table-thumb-placeholder {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 4px;
  color: #9ca3af;
}

.table-actions {
  display: flex;
  gap: 0.25rem;
}

.bulk-actions {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.bulk-actions span {
  font-weight: 500;
}

.media-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.detail-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  min-height: 300px;
}

.detail-preview img,
.detail-preview video {
  max-width: 100%;
  max-height: 400px;
  border-radius: 6px;
}

.detail-document {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #9ca3af;
}

.detail-document i {
  font-size: 4rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-weight: 500;
  font-size: 0.875rem;
  color: #6b7280;
}

.url-field {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .media-detail {
    grid-template-columns: 1fr;
  }
}
</style>

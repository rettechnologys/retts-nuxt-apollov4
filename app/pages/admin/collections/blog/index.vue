<!-- Collections - Blog Posts List -->
<template>
  <div class="blog-posts-page">
    <div class="page-header">
      <h1>Blog Posts</h1>
      <div class="header-actions">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Search posts..." />
        </span>
        <Dropdown
          v-model="categoryFilter"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          placeholder="All Categories"
        />
        <Button
          label="New Post"
          icon="pi pi-plus"
          @click="navigateTo('/admin/collections/blog/create')"
        />
      </div>
    </div>

    <div class="blog-content">
      <DataTable
        :value="filteredPosts"
        :paginator="true"
        :rows="15"
        :loading="loading"
        stripedRows
        v-model:selection="selectedPosts"
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

        <Column field="title" header="Title" sortable>
          <template #body="{ data }">
            <div class="post-title">
              <img
                v-if="data.featuredImage"
                :src="data.featuredImage"
                :alt="data.title"
                class="post-thumb"
              />
              <div class="post-placeholder-thumb" v-else>
                <i class="pi pi-image"></i>
              </div>
              <div>
                <div class="title-main">{{ data.title }}</div>
                <small class="post-excerpt">{{ data.excerpt }}</small>
              </div>
            </div>
          </template>
        </Column>

        <Column field="category" header="Category" sortable>
          <template #body="{ data }">
            <Badge :value="data.category" severity="info" />
          </template>
        </Column>

        <Column field="tags" header="Tags">
          <template #body="{ data }">
            <div class="tags-cell">
              <Badge
                v-for="tag in data.tags.slice(0, 2)"
                :key="tag"
                :value="tag"
                severity="secondary"
              />
              <Badge
                v-if="data.tags.length > 2"
                :value="`+${data.tags.length - 2}`"
                severity="contrast"
              />
            </div>
          </template>
        </Column>

        <Column field="author" header="Author" sortable>
          <template #body="{ data }">
            <div class="author-cell">
              <Avatar
                :label="data.author.initials"
                size="small"
                shape="circle"
              />
              <span>{{ data.author.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="status" header="Status" sortable>
          <template #body="{ data }">
            <Badge
              :value="data.status"
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </Column>

        <Column field="views" header="Views" sortable>
          <template #body="{ data }">
            {{ formatNumber(data.views) }}
          </template>
        </Column>

        <Column field="publishedAt" header="Published" sortable>
          <template #body="{ data }">
            {{ data.publishedAt ? formatDate(data.publishedAt) : '-' }}
          </template>
        </Column>

        <Column header="Actions">
          <template #body="{ data }">
            <div class="table-actions">
              <Button
                icon="pi pi-eye"
                text
                rounded
                severity="info"
                @click="viewPost(data)"
                v-tooltip.top="'View'"
              />
              <Button
                icon="pi pi-pencil"
                text
                rounded
                @click="editPost(data)"
                v-tooltip.top="'Edit'"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                @click="deletePost(data)"
                v-tooltip.top="'Delete'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: { name: string; initials: string };
  status: string;
  views: number;
  publishedAt?: string;
}

const loading = ref(false);
const searchQuery = ref('');
const categoryFilter = ref(null);
const selectedPosts = ref<BlogPost[]>([]);

const categories = ref([
  { id: null, name: 'All Categories' },
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Business' },
  { id: 3, name: 'Design' },
  { id: 4, name: 'Marketing' },
]);

const posts = ref<BlogPost[]>([
  {
    id: 1,
    title: 'Getting Started with Vue 3 and Nuxt 4',
    excerpt:
      'Learn the basics of building modern web applications with Vue 3 and Nuxt 4 framework.',
    featuredImage: '/demo/images/blog-1.jpg',
    category: 'Technology',
    tags: ['Vue', 'Nuxt', 'JavaScript'],
    author: { name: 'John Doe', initials: 'JD' },
    status: 'published',
    views: 1523,
    publishedAt: '2024-01-10',
  },
  {
    id: 2,
    title: 'Building a Modern CMS with Dynamic Collections',
    excerpt:
      'Discover how to create a flexible content management system using dynamic collection patterns.',
    category: 'Technology',
    tags: ['CMS', 'Architecture', 'Database'],
    author: { name: 'Jane Smith', initials: 'JS' },
    status: 'published',
    views: 892,
    publishedAt: '2024-01-08',
  },
  {
    id: 3,
    title: 'The Future of Web Development',
    excerpt:
      'Exploring upcoming trends and technologies that will shape the future of web development.',
    featuredImage: '/demo/images/blog-2.jpg',
    category: 'Technology',
    tags: ['Trends', 'Future', 'Web Dev'],
    author: { name: 'John Doe', initials: 'JD' },
    status: 'draft',
    views: 0,
  },
  {
    id: 4,
    title: 'UI/UX Best Practices for 2024',
    excerpt:
      'Essential design principles and practices every designer should know in 2024.',
    category: 'Design',
    tags: ['UI', 'UX', 'Design'],
    author: { name: 'Sarah Wilson', initials: 'SW' },
    status: 'published',
    views: 654,
    publishedAt: '2024-01-05',
  },
  {
    id: 5,
    title: 'Marketing Strategies for Startups',
    excerpt:
      'Effective marketing strategies that can help startups grow their audience and revenue.',
    category: 'Marketing',
    tags: ['Marketing', 'Startups', 'Growth'],
    author: { name: 'Jane Smith', initials: 'JS' },
    status: 'published',
    views: 432,
    publishedAt: '2024-01-03',
  },
]);

const filteredPosts = computed(() => {
  let result = posts.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  if (categoryFilter.value) {
    result = result.filter(
      (p) =>
        p.category ===
        categories.value.find((c) => c.id === categoryFilter.value)?.name,
    );
  }

  return result;
});

const getStatusSeverity = (status: string) => {
  const severityMap: Record<string, string> = {
    published: 'success',
    draft: 'warning',
    scheduled: 'info',
  };
  return severityMap[status] || 'secondary';
};

const formatNumber = (num: number) => {
  return num.toLocaleString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const viewPost = (post: BlogPost) => {
  window.open(`/blog/${post.id}`, '_blank');
};

const editPost = (post: BlogPost) => {
  navigateTo(`/admin/collections/blog/edit/${post.id}`);
};

const deletePost = (post: BlogPost) => {
  // TODO: Implement delete
  console.log('Delete post:', post);
};
</script>

<style scoped>
.blog-posts-page {
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

.post-title {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.post-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.post-placeholder-thumb {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 6px;
  color: #9ca3af;
}

.post-placeholder-thumb i {
  font-size: 1.5rem;
}

.title-main {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.post-excerpt {
  color: #6b7280;
  font-size: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.author-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-actions {
  display: flex;
  gap: 0.25rem;
}
</style>

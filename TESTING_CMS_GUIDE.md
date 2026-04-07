# Testing Dynamic CMS System

## Test the Collection Detail Page

### 1. Start your dev server

```bash
npm run dev
```

### 2. Visit a collection detail URL

Try these URLs (they use mock data):

```
http://localhost:3000/articles/sample-post
http://localhost:3000/blog/sample-post
http://localhost:3000/products/sample-product
http://localhost:3000/portfolio/sample-project
```

### 3. Check the console

You should see logs like:

```
[API Pages] Fetching: articles/sample-post
[CMS API] Fetching collection config: articles
[CMS API] Fetching collection item: blog sample-post
[CMS API] Fetching template: blog-detail-template
```

### 4. View the generated page

The page should render:

- Hero section with post title and cover image
- Metadata (author, date, reading time, tags)
- Full content
- Share buttons

## Test with Different Data

### Modify mock data in `/server/api/cms/collections/[type]/[slug].ts`:

```typescript
const mockItems = {
  blog: {
    'my-custom-post': {
      id: 2,
      slug: 'my-custom-post',
      title: 'My Custom Post Title',
      excerpt: 'This will appear in the hero subtitle',
      content: '<p>Your custom HTML content here</p>',
      coverImage: 'https://your-image-url.jpg',
      author: {
        name: 'Your Name',
        avatar: 'https://your-avatar.jpg',
      },
      publishedAt: new Date().toISOString(),
      readTime: 10,
      tags: ['custom', 'test', 'demo'],
      categories: ['Custom Category'],
    },
  },
};
```

Then visit: `http://localhost:3000/articles/my-custom-post`

## Test Template Modifications

### Modify the template in `/server/api/cms/templates/[id].ts`:

```typescript
const mockTemplates = {
  'blog-detail-template': {
    blocks: [
      // Remove hero if you don't want it
      // Add new blocks
      {
        name: 'custom-block',
        type: 'custom',
        components: [
          {
            name: 'custom-info',
            component: 'InfoList',
            props: {
              title: 'Article Information',
              items: [
                {
                  label: 'Reading Time',
                  value: '{{item.readTime}} minutes',
                  icon: 'mdi:clock',
                },
                {
                  label: 'Published',
                  value: '{{item.publishedAt}}',
                  icon: 'mdi:calendar',
                },
              ],
              layout: 'list',
            },
          },
        ],
      },
    ],
  },
};
```

## Test API Responses

### Check raw API response:

```bash
# Get page config
curl http://localhost:3000/api/pages/articles/sample-post | jq

# Get collection config
curl http://localhost:3000/api/cms/collections/articles/config | jq

# Get collection item
curl http://localhost:3000/api/cms/collections/blog/sample-post | jq

# Get template
curl http://localhost:3000/api/cms/templates/blog-detail-template | jq
```

## Connect to Real Database

### 1. Install Prisma (or your preferred ORM)

```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. Update `/server/api/cms/collections/[type]/[slug].ts`

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { type, slug } = getRouterParams(event);

  let item;
  switch (type) {
    case 'blog':
      item = await prisma.blogPost.findUnique({
        where: { slug },
        include: { author: true },
      });
      break;
    case 'product':
      item = await prisma.product.findUnique({ where: { slug } });
      break;
  }

  if (!item) {
    throw createError({
      statusCode: 404,
      message: `${type} not found: ${slug}`,
    });
  }

  return item;
});
```

### 3. Do the same for templates and collection configs

Replace all mock data with database queries.

## Create Admin Panel

### Example: Template Editor Component

```vue
<template>
  <div class="template-editor">
    <h1>Create Template</h1>

    <input v-model="template.name" placeholder="Template Name" />

    <div v-for="(block, index) in template.blocks" :key="index">
      <select v-model="block.component">
        <option value="HeroWidget">Hero</option>
        <option value="Metadata">Metadata</option>
        <option value="Content">Content</option>
      </select>

      <!-- Field mapper -->
      <div v-for="(value, key) in block.props" :key="key">
        <label>{{ key }}</label>
        <select v-model="block.props[key]">
          <option value="{{item.title}}">Title</option>
          <option value="{{item.excerpt}}">Excerpt</option>
          <option value="{{item.content}}">Content</option>
          <option value="{{item.author}}">Author</option>
        </select>
      </div>

      <button @click="removeBlock(index)">Remove Block</button>
    </div>

    <button @click="addBlock">Add Block</button>
    <button @click="saveTemplate">Save Template</button>
  </div>
</template>

<script setup>
const template = ref({
  name: '',
  blocks: [],
});

const addBlock = () => {
  template.value.blocks.push({
    name: `block-${Date.now()}`,
    component: 'Content',
    props: {},
  });
};

const saveTemplate = async () => {
  await $fetch('/api/cms/templates', {
    method: 'POST',
    body: template.value,
  });

  alert('Template saved!');
};
</script>
```

## Troubleshooting

### Page returns 404

- Check if collection config exists for that slug
- Check if item exists in database/mock data
- Check if template ID is correct

### Variables not replaced

- Ensure template uses `{{item.field}}` syntax
- Check if field exists in item data
- Check console for template processing logs

### Component not rendering

- Ensure component is registered in your components directory
- Check component name matches exactly (case-sensitive)
- Check if props are being passed correctly

## Next Features to Implement

1. **Template Inheritance** - Base templates that can be extended
2. **Conditional Rendering** - Show/hide blocks based on conditions
3. **Field Transformers** - Format dates, numbers, etc.
4. **Nested Variables** - Support `{{item.author.profile.bio}}`
5. **Array Iteration** - Loop through arrays in templates
6. **Custom Functions** - `{{uppercase(item.title)}}`

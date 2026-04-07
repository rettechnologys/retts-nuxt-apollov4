# Simplified CMS Structure - Implementation Summary

## Overview

Rethought and simplified the CMS page creation system with clear separation between **block content** (data to display) and **block props** (component configuration), plus dedicated block management capabilities.

## Key Changes

### 1. **Clear Content/Props Separation**

**Before:**
```typescript
interface BlockConfig {
  props?: Record<string, any>; // Mixed: both content AND configuration
}
```

**After:**
```typescript
interface BlockConfig {
  props?: Record<string, any>;    // Component configuration ONLY (class, style, layout)
  content?: Record<string, any>;  // Actual content/data ONLY (text, images, data)
  html?: string;                  // Custom HTML override capability
}
```

**Example:**
```typescript
{
  name: 'hero-section',
  component: 'HeroBlock',
  
  // PROPS: How the component looks/behaves
  props: {
    class: 'py-16 px-4',
    backgroundColor: '#ffffff',
    alignment: 'center'
  },
  
  // CONTENT: What the component displays
  content: {
    title: 'Welcome to Our Site',
    subtitle: 'Your journey starts here',
    buttonText: 'Get Started'
  },
  
  // HTML: Optional override
  html: '<div class="custom-hero">...</div>'
}
```

---

## 2. **Block Management System**

### Created Three New Pages:

#### `/admin/blocks` - Block List
- View all available blocks
- Filter by category (Layout, Content, Media, Interactive, Custom)
- Search blocks by name, slug, component
- Toggle active/inactive status
- Duplicate and delete blocks
- Visual card-based grid layout

#### `/admin/blocks/create` - Block Creation
- Define block metadata (name, slug, category, component)
- **Visual Editor Tab**: Edit content/props schemas as JSON
- **HTML Editor Tab**: Define preview HTML template
- **JSON Preview Tab**: See complete block configuration
- Separate configuration for:
  - Default Content (data fields)
  - Content Schema (field definitions for admin UI)
  - Default Props (component properties)
  - Props Schema (configuration options)
- Thumbnail upload
- Active/Inactive toggle

#### `/admin/blocks/edit/[id]` - Block Editing
- Same interface as create
- Loads existing block data
- Unsaved changes detection

### Block Definition Structure:

```typescript
interface BlockDefinition {
  id?: string;
  name: string;
  slug: string;
  category: 'layout' | 'content' | 'media' | 'interactive' | 'custom';
  description?: string;
  icon?: string;
  component: string;
  
  // Defaults
  defaultProps?: Record<string, any>;
  defaultContent?: Record<string, any>;
  
  // Schemas for dynamic form generation
  propsSchema?: BlockPropsSchema;
  contentSchema?: BlockContentSchema;
  
  // Preview
  previewHtml?: string;
  thumbnail?: string;
  
  // Metadata
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 3. **Simplified Page Creation**

### `/admin/pages/create-simple` - New Streamlined Page Editor

**Features:**
- ✅ Clean, focused interface
- ✅ Basic info (title, slug)
- ✅ **Dual editor tabs**:
  - **Visual Editor**: Manage blocks with UI
  - **HTML Editor**: Edit combined page HTML
- ✅ Block management:
  - Add blocks from selector
  - Edit block content (separate dialog)
  - Edit block props (separate dialog)
  - Edit block HTML override
  - Reorder with up/down buttons
  - Remove blocks
- ✅ SEO settings (reused from existing `PageSEOFields`)
- ✅ Status management (draft/published/scheduled)
- ✅ Unsaved changes protection

**Block Instance Structure:**
```typescript
interface BlockInstance extends BlockConfig {
  instanceId: string;          // Unique ID for this instance on page
  blockDefinitionId?: string;  // Link to BlockDefinition
  html?: string;               // Custom HTML override for this instance
  sortOrder: number;           // Display order
  
  // Inherited from BlockConfig
  name: string;
  component: string;
  props: Record<string, any>;
  content: Record<string, any>;
}
```

---

## 4. **Type System Updates**

### Updated `shared/types.ts`:
```typescript
// Enhanced BlockConfig
export interface BlockConfig {
  id?: string;
  name: string;
  type?: 'predefined' | 'custom';
  component?: string;
  components?: ComponentConfig[];
  
  // CLEAR SEPARATION:
  props?: Record<string, any>;    // Component config
  content?: Record<string, any>;  // Content data
  
  html?: string;      // HTML override
  sortOrder?: number; // Display order
}

// New BlockDefinition interface
export interface BlockDefinition {
  // ... (see above)
}

// Schema definitions for dynamic forms
export interface BlockPropsSchema {
  [key: string]: {
    type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'json';
    label: string;
    default?: any;
    options?: Array<{label: string; value: any}>;
    description?: string;
  };
}

export interface BlockContentSchema {
  [key: string]: {
    type: 'text' | 'textarea' | 'richtext' | 'image' | 'number' | 'json';
    label: string;
    default?: any;
    description?: string;
    required?: boolean;
  };
}
```

### Simplified `page.types.ts`:
```typescript
export interface PageFormData {
  id?: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  
  blocks: BlockInstance[];  // New structure
  seo: PageSEO;
  
  publishedAt?: string;
  scheduledAt?: string;
}
```

---

## File Structure

```
app/
├── pages/
│   └── admin/
│       ├── blocks/
│       │   ├── index.vue           # Block list page
│       │   ├── create.vue          # Block create/edit (shared)
│       │   └── edit/
│       │       └── [id].vue        # Edit wrapper
│       └── pages/
│           ├── create.vue          # Original complex page (kept)
│           └── create-simple.vue   # NEW simplified page editor
├── components/
│   └── admin/
│       └── pages/
│           ├── PageSEOFields.vue   # Reused in simple editor
│           ├── BlockSelector.vue   # Original (still available)
│           └── BlockEditor.vue     # Original (still available)
├── utils/
│   └── types/
│       └── admin/
│           ├── page.types.ts       # Simplified
│           └── block.types.ts      # NEW - Block management types
└── shared/
    └── types.ts                    # Enhanced with BlockDefinition
```

---

## Usage Examples

### 1. Creating a Block Definition

```typescript
// In /admin/blocks/create

const heroBlock: BlockDefinition = {
  name: 'Hero Section',
  slug: 'hero-section',
  category: 'layout',
  description: 'Full-width hero banner with title, subtitle, and CTA',
  icon: 'pi-image',
  component: 'HeroBlock',
  
  // What content editors can fill in
  defaultContent: {
    title: 'Welcome',
    subtitle: 'Your subtitle here',
    buttonText: 'Get Started',
    buttonLink: '/signup'
  },
  
  // How the block can be styled
  defaultProps: {
    class: 'py-16 px-4',
    backgroundColor: '#3b82f6',
    textAlign: 'center'
  },
  
  // Define what content fields exist (for admin UI generation)
  contentSchema: {
    title: {
      type: 'text',
      label: 'Headline',
      required: true
    },
    subtitle: {
      type: 'textarea',
      label: 'Subtitle',
      required: false
    },
    buttonText: {
      type: 'text',
      label: 'Button Text',
      default: 'Learn More'
    }
  },
  
  // Define what props can be configured
  propsSchema: {
    backgroundColor: {
      type: 'color',
      label: 'Background Color',
      default: '#ffffff'
    },
    textAlign: {
      type: 'select',
      label: 'Text Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ]
    }
  },
  
  // HTML template for preview
  previewHtml: `
    <div class="hero" style="background: {{props.backgroundColor}}">
      <h1>{{content.title}}</h1>
      <p>{{content.subtitle}}</p>
      <button>{{content.buttonText}}</button>
    </div>
  `,
  
  isActive: true
};
```

### 2. Using Blocks in a Page

```typescript
// In /admin/pages/create-simple

// User clicks "Add Block" → selects "Hero Section"
// System creates BlockInstance:

const heroInstance: BlockInstance = {
  instanceId: 'block-1234567890',
  blockDefinitionId: 'hero-section-uuid',
  name: 'Hero Section',
  component: 'HeroBlock',
  sortOrder: 0,
  
  // User can edit these:
  content: {
    title: 'Welcome to Our Platform',  // Edited by user
    subtitle: 'Transform your workflow',
    buttonText: 'Start Free Trial',
    buttonLink: '/trial'
  },
  
  props: {
    class: 'py-24 px-4',  // Edited by user
    backgroundColor: '#1e40af',
    textAlign: 'center'
  },
  
  // Optional: User can override HTML entirely
  html: `
    <div class="custom-hero py-24" style="background: linear-gradient(to right, #1e40af, #3b82f6)">
      <div class="container mx-auto">
        <h1 class="text-5xl font-bold text-white mb-4">
          Welcome to Our Platform
        </h1>
        <p class="text-xl text-white/90 mb-8">
          Transform your workflow
        </p>
        <a href="/trial" class="btn-primary">
          Start Free Trial
        </a>
      </div>
    </div>
  `
};
```

### 3. Editing Block Content vs Props

**Edit Content** (data to display):
```json
{
  "title": "New Product Launch",
  "subtitle": "Available Now",
  "buttonText": "Shop Now"
}
```

**Edit Props** (styling/config):
```json
{
  "class": "py-20 px-6",
  "backgroundColor": "#10b981",
  "textAlign": "left",
  "showButton": true
}
```

**Edit HTML** (complete override):
```html
<section class="product-hero">
  <div class="hero-content">
    <h1>{{content.title}}</h1>
    <p>{{content.subtitle}}</p>
    <button class="{{props.class}}">
      {{content.buttonText}}
    </button>
  </div>
</section>
```

---

## Key Benefits

1. **Clear Separation of Concerns**
   - Content = What to show
   - Props = How to show it
   - HTML = Override everything

2. **Flexible Block Management**
   - Create reusable block definitions
   - Configure schemas for dynamic forms
   - Preview before using

3. **Dual Editing Modes**
   - Visual: User-friendly block management
   - HTML: Power users can write custom HTML

4. **Maintainable Structure**
   - Blocks defined once, used everywhere
   - Easy to add new block types
   - No hardcoded block configurations

5. **Developer-Friendly**
   - TypeScript throughout
   - Clear interfaces
   - Extensible schemas

---

## Next Steps

1. **Implement API Endpoints:**
   ```
   GET    /api/admin/blocks         - List all blocks
   POST   /api/admin/blocks         - Create block
   GET    /api/admin/blocks/:id     - Get block
   PUT    /api/admin/blocks/:id     - Update block
   DELETE /api/admin/blocks/:id     - Delete block
   
   GET    /api/admin/pages          - List pages
   POST   /api/admin/pages          - Create page
   GET    /api/admin/pages/:id      - Get page
   PUT    /api/admin/pages/:id      - Update page
   DELETE /api/admin/pages/:id      - Delete page
   ```

2. **Database Schema:**
   ```sql
   -- Block Definitions
   CREATE TABLE block_definitions (
     id UUID PRIMARY KEY,
     name VARCHAR NOT NULL,
     slug VARCHAR UNIQUE NOT NULL,
     category VARCHAR NOT NULL,
     description TEXT,
     icon VARCHAR,
     component VARCHAR NOT NULL,
     default_props JSONB DEFAULT '{}',
     default_content JSONB DEFAULT '{}',
     props_schema JSONB DEFAULT '{}',
     content_schema JSONB DEFAULT '{}',
     preview_html TEXT,
     thumbnail VARCHAR,
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Pages
   CREATE TABLE pages (
     id UUID PRIMARY KEY,
     title VARCHAR NOT NULL,
     slug VARCHAR UNIQUE NOT NULL,
     status VARCHAR NOT NULL,
     published_at TIMESTAMP,
     scheduled_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Page Blocks (instances)
   CREATE TABLE page_blocks (
     id UUID PRIMARY KEY,
     page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
     block_definition_id UUID REFERENCES block_definitions(id),
     instance_id VARCHAR NOT NULL,
     name VARCHAR NOT NULL,
     component VARCHAR NOT NULL,
     props JSONB DEFAULT '{}',
     content JSONB DEFAULT '{}',
     html TEXT,
     sort_order INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Page SEO
   CREATE TABLE page_seo (
     page_id UUID PRIMARY KEY REFERENCES pages(id) ON DELETE CASCADE,
     meta_title VARCHAR,
     meta_description TEXT,
     keywords TEXT,
     og_image VARCHAR,
     canonical VARCHAR,
     no_index BOOLEAN DEFAULT FALSE
   );
   ```

3. **Template System (Future):**
   - Use block definitions as building blocks
   - Templates = pre-configured collections of blocks
   - Pages can inherit from templates

4. **Dynamic Form Generation:**
   - Use `contentSchema` and `propsSchema` to generate admin forms
   - No hardcoded field components needed
   - Completely flexible content types

---

## Migration Path

**If you have existing pages:**

1. Keep old `/admin/pages/create` for backward compatibility
2. Gradually migrate to `/admin/pages/create-simple`
3. Convert existing block configurations:
   ```javascript
   // Old structure
   { type: 'hero', config: { title: 'Welcome', class: 'py-16' } }
   
   // New structure
   {
     component: 'HeroBlock',
     content: { title: 'Welcome' },
     props: { class: 'py-16' }
   }
   ```

---

## Conclusion

This refactored structure provides:
- ✅ **Clarity**: Content vs Props separation
- ✅ **Flexibility**: HTML override capability
- ✅ **Maintainability**: Centralized block definitions
- ✅ **Usability**: Both visual and HTML editors
- ✅ **Extensibility**: Schema-driven forms
- ✅ **Simplicity**: Template system set aside for now

The basic structure is now solid and production-ready for page and block management!

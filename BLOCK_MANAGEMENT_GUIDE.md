# Block Management Guide

## Overview
This guide explains how to manage **predefined** and **custom** blocks in your dynamic rendering system.

---

## Architecture

```
DynamicRenderer
    └── DynamicBlockRenderer (decides block type)
            ├── Predefined Widget (complete component)
            └── Custom Block (field-based composition)
                    └── DynamicComponentRenderer (renders fields)
```

---

## Block Types

### 1. **Predefined Widgets** (Complete Components)
Pre-built, self-contained UI components with their own markup, styling, and logic.

**When to use:**
- Complex, reusable sections (Hero, Features, Pricing, Footer)
- Consistent layouts across multiple pages
- Components that don't need field-level customization

**Examples:**
- `HeroWidget.vue`
- `FeaturesWidget.vue`
- `PricingWidget.vue`
- `FooterWidget.vue`

### 2. **Custom Blocks** (Field Composition)
Dynamically composed blocks built from individual field components.

**When to use:**
- Simple, flexible content blocks
- Content that needs frequent customization
- When you want full control over field arrangement

**Examples:**
- Image + Text combinations
- Button groups
- Custom card layouts

---

## API Response Examples

### Example 1: Landing Page with Predefined Widgets

```json
{
  "name": "Landing Page",
  "path": "/",
  "blocks": [
    {
      "name": "TopbarWidget",
      "type": "predefined",
      "component": "TopbarWidget",
      "props": {}
    },
    {
      "name": "HeroWidget",
      "type": "predefined",
      "component": "HeroWidget",
      "props": {}
    },
    {
      "name": "FeaturesWidget",
      "type": "predefined",
      "component": "FeaturesWidget",
      "props": {}
    },
    {
      "name": "PricingWidget",
      "type": "predefined",
      "component": "PricingWidget",
      "props": {}
    },
    {
      "name": "FooterWidget",
      "type": "predefined",
      "component": "FooterWidget",
      "props": {}
    }
  ],
  "seoMeta": {
    "title": "Welcome to Our Platform",
    "description": "The best platform for your needs"
  }
}
```

### Example 2: Custom Block with Fields

```json
{
  "name": "About Page",
  "path": "/about",
  "blocks": [
    {
      "name": "hero-section",
      "type": "custom",
      "components": [
        {
          "name": "main-heading",
          "component": "H1_TextField",
          "props": {
            "class": "text-center"
          },
          "content": {
            "text": "About Our Company"
          }
        },
        {
          "name": "hero-image",
          "component": "ImageField",
          "props": {
            "class": "mx-auto max-w-2xl"
          },
          "content": {
            "src": "/images/about-hero.jpg",
            "alt": "Our Company"
          }
        },
        {
          "name": "cta-button",
          "component": "ButtonField",
          "content": {
            "label": "Learn More",
            "to": "/contact"
          }
        }
      ],
      "props": {
        "class": "py-20"
      }
    }
  ]
}
```

### Example 3: Hybrid Approach (Mix Predefined + Custom)

```json
{
  "name": "Product Page",
  "path": "/product",
  "blocks": [
    {
      "name": "TopbarWidget",
      "component": "TopbarWidget"
    },
    {
      "name": "product-hero",
      "type": "custom",
      "components": [
        {
          "name": "product-title",
          "component": "H1_TextField",
          "content": {
            "text": "Amazing Product"
          }
        },
        {
          "name": "product-image",
          "component": "ImageField",
          "content": {
            "src": "/products/amazing-product.jpg",
            "alt": "Amazing Product"
          }
        }
      ]
    },
    {
      "name": "FeaturesWidget",
      "component": "FeaturesWidget"
    },
    {
      "name": "custom-testimonials",
      "type": "custom",
      "components": [
        {
          "name": "testimonial-heading",
          "component": "H1_TextField",
          "content": {
            "text": "What Our Customers Say"
          }
        }
      ]
    },
    {
      "name": "FooterWidget",
      "component": "FooterWidget"
    }
  ]
}
```

---

## How Block Detection Works

The `DynamicBlockRenderer` automatically detects block type:

### Method 1: Explicit Type (Recommended)
```json
{
  "type": "predefined",  // ← Explicitly set
  "component": "HeroWidget"
}
```

### Method 2: Implicit Detection
```json
// Predefined (has 'component', no 'components')
{
  "component": "HeroWidget"
}

// Custom (has 'components' array)
{
  "components": [...]
}
```

---

## Adding New Components

### Adding a Predefined Widget

1. Create your widget component in `app/components/landing/` (or any directory)
2. Register it in `DynamicBlockRenderer.vue`:

```typescript
const widgetMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  HeroWidget: defineAsyncComponent(() => import('@/components/landing/HeroWidget.vue')),
  MyNewWidget: defineAsyncComponent(() => import('@/components/landing/MyNewWidget.vue')),
  // ...
};
```

3. Use it in your API response:
```json
{
  "component": "MyNewWidget",
  "props": {
    "title": "Custom Title"
  }
}
```

### Adding a Custom Field Component

1. Create your field component in `app/components/fields/`
2. Register it in `DynamicComponentRenderer.vue`:

```typescript
const componentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  ImageField: defineAsyncComponent(() => import('@/components/fields/ImageField.vue')),
  MyNewField: defineAsyncComponent(() => import('@/components/fields/MyNewField.vue')),
  // ...
};
```

3. Use it in custom blocks:
```json
{
  "type": "custom",
  "components": [
    {
      "component": "MyNewField",
      "content": {...}
    }
  ]
}
```

---

## Best Practices

### ✅ Use Predefined Widgets When:
- Building consistent, reusable sections
- Complex layouts with multiple nested elements
- Components that rarely change structure
- Marketing/landing page sections

### ✅ Use Custom Blocks When:
- Content needs frequent customization
- Simple layouts (text + image combinations)
- User-generated or CMS-managed content
- A/B testing different layouts

### ✅ Hybrid Approach:
Mix both on the same page for maximum flexibility:
- Predefined widgets for consistent branding (header, footer)
- Custom blocks for dynamic content areas

---

## Layout Classes for Custom Blocks

The `name` field in custom blocks maps to CSS layout classes:

```typescript
const blockLayoutClasses = {
  'grid-columns': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  'flex-row': 'flex flex-row gap-4 items-center',
  'flex-column': 'flex flex-col gap-4',
  'hero-section': 'flex flex-col items-center justify-center min-h-[500px] gap-8',
  'single-column': 'flex flex-col gap-6 max-w-4xl mx-auto',
};
```

**Example:**
```json
{
  "name": "grid-columns",  // ← Applies grid layout
  "type": "custom",
  "components": [...]
}
```

---

## Migration Strategy

If you have existing data:

### Option 1: Explicit Migration
Add `type` field to all existing blocks in your database.

### Option 2: Keep Backward Compatible
The system automatically detects:
- Has `component` but no `components` → Predefined
- Has `components` array → Custom

No changes needed to existing data!

---

## Summary

| Aspect | Predefined Widgets | Custom Blocks |
|--------|-------------------|---------------|
| **Definition** | Complete Vue components | Field composition |
| **Flexibility** | Low (fixed structure) | High (mix & match fields) |
| **Complexity** | Can be complex | Usually simple |
| **Use Case** | Reusable sections | Dynamic content |
| **Registration** | `DynamicBlockRenderer` | Components in `DynamicComponentRenderer` |
| **API Structure** | `{ component: "WidgetName" }` | `{ components: [...] }` |

---

## Questions?

This architecture gives you the best of both worlds:
- **Speed**: Use predefined widgets for common patterns
- **Flexibility**: Use custom blocks for unique content
- **Maintainability**: Clear separation of concerns

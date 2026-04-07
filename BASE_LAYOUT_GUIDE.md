# BaseLayout Component Guide

A flexible and dynamic layout wrapper component for wrapping blocks with various container types, padding, backgrounds, and more.

---

## Props

| Prop            | Type                                                                          | Default         | Description                                      |
| --------------- | ----------------------------------------------------------------------------- | --------------- | ------------------------------------------------ |
| `tag`           | `string`                                                                      | `'div'`         | HTML tag to render (div, section, article, etc.) |
| `container`     | `'full' \| 'narrow' \| 'wide' \| 'section' \| 'none'`                         | `'none'`        | Container width preset                           |
| `padding`       | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'section'`                         | `'none'`        | Padding preset                                   |
| `customPadding` | `string`                                                                      | -               | Custom padding classes (overrides preset)        |
| `margin`        | `string`                                                                      | -               | Custom margin classes                            |
| `bg`            | `'transparent' \| 'default' \| 'surface' \| 'muted' \| 'primary' \| 'custom'` | `'transparent'` | Background color variant                         |
| `customBg`      | `string`                                                                      | -               | Custom background (CSS value)                    |
| `center`        | `boolean`                                                                     | `false`         | Center content using flexbox                     |
| `fullHeight`    | `boolean`                                                                     | `false`         | Make container full viewport height              |
| `class`         | `string`                                                                      | -               | Additional CSS classes                           |
| `style`         | `Record<string, string>`                                                      | -               | Custom inline styles                             |

---

## Container Types

### `full`

Full width container

```vue
<BaseLayout container="full">
  <YourContent />
</BaseLayout>
```

### `narrow`

Max width 4xl, centered (good for content/articles)

```vue
<BaseLayout container="narrow">
  <BlogPost />
</BaseLayout>
```

### `wide`

Max width 7xl, centered (good for dashboards)

```vue
<BaseLayout container="wide">
  <Dashboard />
</BaseLayout>
```

### `section`

Responsive padding with margins (matches your site's main content area)

```vue
<BaseLayout container="section">
  <PageSection />
</BaseLayout>
```

---

## Padding Presets

```vue
<!-- No padding -->
<BaseLayout padding="none" />

<!-- Small padding: 1rem -->
<BaseLayout padding="sm" />

<!-- Medium padding: 1.5rem -->
<BaseLayout padding="md" />

<!-- Large padding: 2rem on mobile, 3rem on desktop -->
<BaseLayout padding="lg" />

<!-- Extra large padding: 3rem on mobile, 4rem on md, 5rem on lg -->
<BaseLayout padding="xl" />

<!-- Section padding: Vertical spacing for page sections -->
<BaseLayout padding="section" />
```

---

## Background Presets

```vue
<!-- Transparent (no background) -->
<BaseLayout bg="transparent" />

<!-- Default surface color (white/dark) -->
<BaseLayout bg="default" />

<!-- Surface 50/800 -->
<BaseLayout bg="surface" />

<!-- Surface 100/700 (more contrast) -->
<BaseLayout bg="muted" />

<!-- Primary color variant -->
<BaseLayout bg="primary" />

<!-- Custom background -->
<BaseLayout
  bg="custom"
  customBg="linear-gradient(to right, #667eea 0%, #764ba2 100%)"
/>
```

---

## Usage Examples

### Example 1: Hero Section

```vue
<BaseLayout
  tag="section"
  container="section"
  padding="section"
  bg="default"
  center
>
  <h1>Welcome to Our Platform</h1>
  <p>Amazing features await you</p>
  <Button label="Get Started" />
</BaseLayout>
```

### Example 2: Content Block

```vue
<BaseLayout
  container="narrow"
  padding="lg"
  bg="surface"
  class="rounded-lg shadow-md"
>
  <Article />
</BaseLayout>
```

### Example 3: Full Height Landing

```vue
<BaseLayout
  container="section"
  fullHeight
  center
  bg="custom"
  customBg="radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1), transparent)"
>
  <HeroContent />
</BaseLayout>
```

### Example 4: Grid Section

```vue
<BaseLayout tag="section" container="wide" padding="xl">
  <h2 class="text-3xl mb-8">Features</h2>
  <div class="grid grid-cols-3 gap-6">
    <FeatureCard />
    <FeatureCard />
    <FeatureCard />
  </div>
</BaseLayout>
```

### Example 5: Custom Styling

```vue
<BaseLayout
  container="section"
  customPadding="py-24 px-8"
  margin="mt-12 mb-20"
  class="border-t border-b"
  :style="{ borderColor: 'var(--primary-color)' }"
>
  <CustomContent />
</BaseLayout>
```

---

## Using with DynamicBlockRenderer

You can wrap custom blocks with BaseLayout:

```vue
<template>
  <BaseLayout
    :container="blockConfig.layout?.container || 'section'"
    :padding="blockConfig.layout?.padding || 'md'"
    :bg="blockConfig.layout?.bg || 'transparent'"
  >
    <DynamicComponentRenderer
      v-for="(component, index) in blockConfig.components"
      :key="`${component.name}-${index}`"
      :component-config="component"
    />
  </BaseLayout>
</template>
```

### API Response with Layout Config

```json
{
  "name": "custom-block",
  "type": "custom",
  "layout": {
    "container": "narrow",
    "padding": "xl",
    "bg": "surface"
  },
  "components": [...]
}
```

---

## Advanced Examples

### Sticky Header

```vue
<BaseLayout
  tag="header"
  container="section"
  padding="md"
  class="sticky top-0 z-50 backdrop-blur-md"
  bg="custom"
  customBg="rgba(255, 255, 255, 0.8)"
>
  <Navigation />
</BaseLayout>
```

### Gradient Background Section

```vue
<BaseLayout
  tag="section"
  container="full"
  padding="section"
  bg="custom"
  customBg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  class="text-white"
>
  <CallToAction />
</BaseLayout>
```

### Card Container

```vue
<BaseLayout
  container="narrow"
  padding="lg"
  bg="default"
  class="rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700"
>
  <FormContent />
</BaseLayout>
```

### Split Layout

```vue
<BaseLayout container="wide" padding="section">
  <div class="grid md:grid-cols-2 gap-12">
    <BaseLayout bg="surface" padding="xl" class="rounded-xl">
      <LeftContent />
    </BaseLayout>
    <BaseLayout bg="muted" padding="xl" class="rounded-xl">
      <RightContent />
    </BaseLayout>
  </div>
</BaseLayout>
```

---

## Tips

1. **Nesting**: You can nest BaseLayouts for complex layouts
2. **Responsive**: All presets are responsive by default
3. **Dark Mode**: Background presets automatically support dark mode
4. **Composition**: Combine with Tailwind utilities for maximum flexibility
5. **Performance**: Uses computed properties for optimal reactivity

---

## Common Patterns

### Page Wrapper

```vue
<BaseLayout container="section" padding="md" bg="default" class="min-h-screen">
  <slot />
</BaseLayout>
```

### Section Divider

```vue
<BaseLayout
  container="wide"
  padding="section"
  class="border-t border-surface-200 dark:border-surface-700"
>
  <SectionContent />
</BaseLayout>
```

### Feature Showcase

```vue
<BaseLayout
  tag="section"
  container="wide"
  padding="xl"
  bg="surface"
  class="rounded-3xl"
>
  <h2 class="text-4xl font-bold mb-12 text-center">Features</h2>
  <div class="grid md:grid-cols-3 gap-8">
    <!-- Features -->
  </div>
</BaseLayout>
```

---

## Integration with Your Dynamic System

Update `BlockConfig` type to include layout options:

```typescript
export interface BlockConfig {
  name: string;
  type?: 'predefined' | 'custom';
  component?: string;
  components?: ComponentConfig[];
  props?: Record<string, any>;
  layout?: {
    container?: 'full' | 'narrow' | 'wide' | 'section' | 'none';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'section';
    bg?: 'transparent' | 'default' | 'surface' | 'muted' | 'primary' | 'custom';
    customBg?: string;
    center?: boolean;
    fullHeight?: boolean;
  };
}
```

This makes your blocks fully configurable from the API! 🎉

/**
 * Component Resolvers Utility
 * Collection of functions for resolving and managing dynamic components
 */

import { defineAsyncComponent, type Component } from 'vue';
import type { BlockConfig } from '#shared/types';

/**
 * Widget/Block component registry
 * Maps component names to their async imports
 */
type ComponentRegistry = Record<
  string,
  ReturnType<typeof defineAsyncComponent>
>;

/**
 * Default predefined widget registry
 * Contains commonly used widgets and blocks
 */
const DEFAULT_WIDGET_MAP: ComponentRegistry = {
  // Landing Widgets
  HeroWidget: defineAsyncComponent(
    () => import('@/components/landing/HeroWidget.vue'),
  ),
  FeaturesWidget: defineAsyncComponent(
    () => import('@/components/landing/FeaturesWidget.vue'),
  ),
  HighlightsWidget: defineAsyncComponent(
    () => import('@/components/landing/HighlightsWidget.vue'),
  ),
  PricingWidget: defineAsyncComponent(
    () => import('@/components/landing/PricingWidget.vue'),
  ),
  FooterWidget: defineAsyncComponent(
    () => import('@/components/landing/FooterWidget.vue'),
  ),
  TopbarWidget: defineAsyncComponent(
    () => import('~/components/landing/TopbarWidget.client.vue'),
  ),

  // Content Blocks
  HeroWidget_2: defineAsyncComponent(
    () => import('@/components/blocks/HeroSection_2.vue'),
  ),
  hero: defineAsyncComponent(
    () => import('@/components/blocks/HeroSection_2.vue'),
  ),
  text: defineAsyncComponent(() => import('@/components/blocks/TextBlock.vue')),
  heading: defineAsyncComponent(
    () => import('@/components/blocks/HeadingBlock.vue'),
  ),
  image: defineAsyncComponent(
    () => import('@/components/blocks/ImageBlock.vue'),
  ),
  button: defineAsyncComponent(
    () => import('@/components/blocks/ButtonBlock.vue'),
  ),
  grid: defineAsyncComponent(() => import('@/components/blocks/GridBlock.vue')),
  columns: defineAsyncComponent(
    () => import('@/components/blocks/ColumnsBlock.vue'),
  ),
  FeatureBlock: defineAsyncComponent(
    () => import('@/components/blocks/FeatureBlock.vue'),
  ),
  feature: defineAsyncComponent(
    () => import('@/components/blocks/FeatureBlock.vue'),
  ),
  video: defineAsyncComponent(
    () => import('@/components/blocks/VideoBlock.vue'),
  ),
  card: defineAsyncComponent(() => import('@/components/blocks/CardBlock.vue')),
  testimonial: defineAsyncComponent(
    () => import('@/components/blocks/TestimonialBlock.vue'),
  ),
  TestimonialsBlock: defineAsyncComponent(
    () => import('@/components/blocks/TestimonialsBlock.vue'),
  ),
  testimonials: defineAsyncComponent(
    () => import('@/components/blocks/TestimonialsBlock.vue'),
  ),
  GridViewBlock: defineAsyncComponent(
    () => import('@/components/blocks/GridViewBlock.vue'),
  ),
  'grid-view': defineAsyncComponent(
    () => import('@/components/blocks/GridViewBlock.vue'),
  ),
  CTABlock: defineAsyncComponent(
    () => import('@/components/blocks/CTABlock.vue'),
  ),
  cta: defineAsyncComponent(() => import('@/components/blocks/CTABlock.vue')),
  ContentListingBlock: defineAsyncComponent(
    () => import('@/components/blocks/ContentListingBlock.vue'),
  ),
  'content-listing': defineAsyncComponent(
    () => import('@/components/blocks/ContentListingBlock.vue'),
  ),
  form: defineAsyncComponent(() => import('@/components/blocks/FormBlock.vue')),
};

/**
 * Mutable widget registry for runtime registration
 */
let widgetRegistry: ComponentRegistry = { ...DEFAULT_WIDGET_MAP };

/**
 * Register a custom widget/block component
 * Allows extending the component registry at runtime
 *
 * @param name - Component name
 * @param component - Async component or import function
 *
 * @example
 * registerWidget('CustomHero', defineAsyncComponent(() => import('./CustomHero.vue')));
 */
export function registerWidget(
  name: string,
  component: ReturnType<typeof defineAsyncComponent>,
): void {
  widgetRegistry[name] = component;
}

/**
 * Register multiple widgets at once
 *
 * @param widgets - Object mapping widget names to components
 *
 * @example
 * registerWidgets({
 *   Hero: defineAsyncComponent(() => import('./Hero.vue')),
 *   Features: defineAsyncComponent(() => import('./Features.vue'))
 * });
 */
export function registerWidgets(widgets: ComponentRegistry): void {
  widgetRegistry = { ...widgetRegistry, ...widgets };
}

/**
 * Get registered widget component by name
 *
 * @param name - Widget/component name
 * @returns Component or undefined if not found
 */
export function getWidget(
  name: string,
): ReturnType<typeof defineAsyncComponent> | undefined {
  return widgetRegistry[name];
}

/**
 * Get all registered widgets
 *
 * @returns Copy of the widget registry
 */
export function getWidgetRegistry(): ComponentRegistry {
  return { ...widgetRegistry };
}

/**
 * Reset widget registry to default
 * Useful for testing or clearing custom registrations
 */
export function resetWidgetRegistry(): void {
  widgetRegistry = { ...DEFAULT_WIDGET_MAP };
}

/**
 * Check if a block is a predefined widget
 * Uses explicit type checking or implicit component structure
 *
 * @param blockConfig - Block configuration
 * @returns True if block is a predefined widget
 *
 * @example
 * isPredefinedBlock({ type: 'predefined', component: 'HeroWidget' }) // true
 * isPredefinedBlock({ component: 'HeroWidget' }) // true (implicit)
 * isPredefinedBlock({ components: [...] }) // false (custom block)
 */
export function isPredefinedBlock(blockConfig: BlockConfig): boolean {
  // Explicit type check
  if (blockConfig.type === 'predefined') return true;

  // Implicit check: has component property but no components array
  if (blockConfig.component && !blockConfig.components) return true;

  return false;
}

/**
 * Resolve widget component from block configuration
 * Returns the component if found, or fallback 'div' with warning
 *
 * @param blockConfig - Block configuration
 * @returns Resolved component or 'div' fallback
 *
 * @example
 * const component = resolveWidget(blockConfig);
 * // Returns registered component or 'div' with console warning
 */
export function resolveWidget(blockConfig: BlockConfig): Component | string {
  if (!isPredefinedBlock(blockConfig)) {
    return 'div';
  }

  const widgetName = blockConfig.component || blockConfig.name;
  const widget = widgetRegistry[widgetName];
  console.log(
    `Resolving widget "${widgetName}" for block "${blockConfig.name}"`,
  );

  if (!widget) {
    console.warn(
      `[ComponentResolver] Predefined widget "${widgetName}" not found in registry`,
    );
    return 'div';
  }

  return widget;
}

/**
 * Block layout class mappings
 * Maps block names to their default CSS classes
 */
const DEFAULT_BLOCK_LAYOUTS: Record<string, string> = {
  'grid-columns': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  'flex-row': 'flex flex-row gap-4 items-center',
  'flex-column': 'flex flex-col gap-4',
  'hero-section':
    'flex flex-col items-center justify-center min-h-[500px] gap-8',
  'single-column': 'flex flex-col gap-6 max-w-4xl mx-auto',
  'two-columns': 'grid grid-cols-1 md:grid-cols-2 gap-6',
  'three-columns': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  'four-columns': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
};

/**
 * Mutable block layout registry
 */
let blockLayoutRegistry: Record<string, string> = { ...DEFAULT_BLOCK_LAYOUTS };

/**
 * Register a custom block layout class mapping
 *
 * @param name - Block name
 * @param classes - CSS classes for the layout
 *
 * @example
 * registerBlockLayout('custom-grid', 'grid grid-cols-5 gap-8');
 */
export function registerBlockLayout(name: string, classes: string): void {
  blockLayoutRegistry[name] = classes;
}

/**
 * Register multiple block layouts at once
 *
 * @param layouts - Object mapping layout names to CSS classes
 */
export function registerBlockLayouts(layouts: Record<string, string>): void {
  blockLayoutRegistry = { ...blockLayoutRegistry, ...layouts };
}

/**
 * Get CSS classes for a block based on its name
 * Returns registered classes or default fallback
 *
 * @param blockName - Block name from configuration
 * @param fallback - Optional fallback classes
 * @returns CSS class string
 *
 * @example
 * const classes = getBlockClasses('grid-columns');
 * // Returns: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
 */
export function getBlockClasses(
  blockName: string,
  fallback = 'flex flex-col gap-4 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20',
): string {
  return blockLayoutRegistry[blockName] || fallback;
}

/**
 * Reset block layout registry to default
 */
export function resetBlockLayoutRegistry(): void {
  blockLayoutRegistry = { ...DEFAULT_BLOCK_LAYOUTS };
}

/**
 * Get all registered block layouts
 *
 * @returns Copy of the layout registry
 */
export function getBlockLayoutRegistry(): Record<string, string> {
  return { ...blockLayoutRegistry };
}

// ========================================
// Field Component Registry
// ========================================

/**
 * Default field component registry
 * Contains commonly used field and utility components
 */
const DEFAULT_FIELD_MAP: ComponentRegistry = {
  // Layout Components
  BaseLayout: defineAsyncComponent(() => import('@/components/BaseLayout.vue')),
  wrapper: defineAsyncComponent(() => import('@/components/Wrapper.vue')),

  // Field Components
  text: defineAsyncComponent(() => import('~/components/fields/TextField.vue')),
  button: defineAsyncComponent(
    () => import('@/components/fields/ButtonField.vue'),
  ),
  ImageField: defineAsyncComponent(
    () => import('@/components/fields/ImageField.vue'),
  ),
  H1_TextField: defineAsyncComponent(
    () => import('@/components/fields/H1_TextField.vue'),
  ),
  ButtonField: defineAsyncComponent(
    () => import('@/components/fields/ButtonField.vue'),
  ),
  Content: defineAsyncComponent(
    () => import('@/components/fields/Content.vue'),
  ),
  InfoList: defineAsyncComponent(
    () => import('@/components/fields/InfoList.vue'),
  ),
  MediaGallery: defineAsyncComponent(
    () => import('@/components/fields/MediaGallery.vue'),
  ),
  ShareButtons: defineAsyncComponent(
    () => import('@/components/fields/ShareButtons.vue'),
  ),
  Metadata: defineAsyncComponent(
    () => import('@/components/fields/Metadata.vue'),
  ),

  // Block Components (for nested usage)
  ContentListingBlock: defineAsyncComponent(
    () => import('@/components/blocks/ContentListingBlock.vue'),
  ),

  // Dynamic Components
  DynamicRenderer: defineAsyncComponent(
    () => import('@/components/dynamic/DynamicRenderer.vue'),
  ),
};

/**
 * Mutable field component registry
 */
let fieldRegistry: ComponentRegistry = { ...DEFAULT_FIELD_MAP };

/**
 * Register a custom field component
 * Allows extending the field component registry at runtime
 *
 * @param name - Component name
 * @param component - Async component or import function
 *
 * @example
 * registerFieldComponent('CustomField', defineAsyncComponent(() => import('./CustomField.vue')));
 */
export function registerFieldComponent(
  name: string,
  component: ReturnType<typeof defineAsyncComponent>,
): void {
  fieldRegistry[name] = component;
}

/**
 * Register multiple field components at once
 *
 * @param components - Object mapping component names to components
 *
 * @example
 * registerFieldComponents({
 *   TextField: defineAsyncComponent(() => import('./TextField.vue')),
 *   ImageField: defineAsyncComponent(() => import('./ImageField.vue'))
 * });
 */
export function registerFieldComponents(components: ComponentRegistry): void {
  fieldRegistry = { ...fieldRegistry, ...components };
}

/**
 * Get registered field component by name
 *
 * @param name - Component name
 * @returns Component or undefined if not found
 */
export function getFieldComponent(
  name: string,
): ReturnType<typeof defineAsyncComponent> | undefined {
  return fieldRegistry[name];
}

/**
 * Get all registered field components
 *
 * @returns Copy of the field component registry
 */
export function getFieldRegistry(): ComponentRegistry {
  return { ...fieldRegistry };
}

/**
 * Reset field component registry to default
 * Useful for testing or clearing custom registrations
 */
export function resetFieldRegistry(): void {
  fieldRegistry = { ...DEFAULT_FIELD_MAP };
}

/**
 * Resolve field component by name
 * Returns the component if found, or fallback 'div' with warning
 *
 * @param componentName - Component name to resolve
 * @param silent - If true, don't log warning (default: false)
 * @returns Resolved component or 'div' fallback
 *
 * @example
 * const component = resolveFieldComponent('ImageField');
 * // Returns registered ImageField component or 'div' with console warning
 */
export function resolveFieldComponent(
  componentName: string,
  silent = false,
): Component | string {
  const component = fieldRegistry[componentName];

  if (!component) {
    if (!silent) {
      console.info(
        `[ComponentResolver] Field component "${componentName}" not found in registry`,
      );
    }
    return 'div';
  }

  return component;
}

/**
 * Check if component exists in field registry
 *
 * @param componentName - Component name to check
 * @returns True if component is registered
 */
export function hasFieldComponent(componentName: string): boolean {
  return componentName in fieldRegistry;
}

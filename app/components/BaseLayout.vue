<template>
  <component :is="tag" :class="layoutClasses" :style="customStyle">
    <!-- Background Image Layer -->
    <div
      v-if="backgroundImage"
      class="absolute inset-0 z-0 pointer-events-none"
      :class="backgroundImageClass"
      :style="backgroundImageStyle"
    />

    <!-- Overlay Layer -->
    <div
      v-if="overlay"
      class="absolute inset-0 pointer-events-none"
      :class="[overlayClass, backgroundImage ? 'z-5' : 'z-0']"
      :style="overlayStyle"
    />

    <!-- Content (with relative positioning to appear above background/overlay) -->
    <div v-if="hasBackgroundOrOverlay" :class="contentWrapperClass">
      <slot />
    </div>
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
interface Props {
  /** HTML tag to render */
  tag?: string;
  /** Layout type */
  layout?: 'flex' | 'grid' | 'block' | 'inline-flex' | 'inline-block';
  /** Flex/Grid direction */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Grid columns (e.g., '1', '2', '3', '4', 'auto-fit', 'auto-fill') */
  cols?: string;
  /** Grid rows */
  rows?: string;
  /** Gap between items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
  /** Justify content (flex/grid) */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  /** Align items (flex/grid) */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /** Flex wrap */
  wrap?: boolean | 'reverse';
  /** Container type preset */
  container?: 'full' | 'narrow' | 'wide' | 'section' | 'none';
  /** Padding preset */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'section' | string;
  /** Custom margin */
  margin?: string;
  /** Background color variant */
  bg?: 'transparent' | 'default' | 'surface' | 'muted' | 'primary' | 'custom';
  /** Custom background color/gradient */
  customBg?: string;

  // Background Image Properties
  /** Background image URL */
  backgroundImage?: string;
  /** Background size: cover, contain, auto, or custom */
  backgroundSize?: 'cover' | 'contain' | 'auto' | string;
  /** Background position */
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | string;
  /** Background repeat */
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  /** Background attachment */
  backgroundAttachment?: 'scroll' | 'fixed' | 'local';
  /** Background opacity (0-100) */
  backgroundOpacity?: number;
  /** Additional background image classes */
  backgroundImageClass?: string;

  // Overlay Properties
  /** Enable overlay */
  overlay?: boolean;
  /** Overlay color (any valid CSS color) */
  overlayColor?: string;
  /** Overlay opacity (0-100) */
  overlayOpacity?: number;
  /** Overlay gradient (overrides overlayColor) */
  overlayGradient?: string;
  /** Additional overlay classes */
  overlayClass?: string;

  // Dimensions
  /** Width */
  width?: string;
  /** Height */
  height?: string;
  /** Min height */
  minHeight?: string;
  /** Max height */
  maxHeight?: string;
  /** Full height */
  fullHeight?: boolean;
  /** Full width */
  fullWidth?: boolean;

  /** Additional CSS classes */
  class?: string | string[];
  /** Custom inline styles */
  style?: Record<string, string>;
  /** Content wrapper classes (used when background/overlay exists) */
  contentClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  layout: 'block',
  direction: 'row',
  gap: 'none',
  container: 'none',
  padding: 'none',
  bg: 'transparent',
  wrap: false,
  fullHeight: false,
  fullWidth: false,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'scroll',
  backgroundOpacity: 100,
  overlay: false,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  overlayOpacity: 50,
});

const slots = useSlots();

// Layout type classes
const layoutTypeClasses: Record<string, string> = {
  flex: 'flex',
  grid: 'grid',
  block: 'block',
  'inline-flex': 'inline-flex',
  'inline-block': 'inline-block',
};

// Direction classes
const directionClasses: Record<string, string> = {
  row: props.layout === 'flex' ? 'flex-row' : '',
  column: props.layout === 'flex' ? 'flex-col' : '',
  'row-reverse': props.layout === 'flex' ? 'flex-row-reverse' : '',
  'column-reverse': props.layout === 'flex' ? 'flex-col-reverse' : '',
};

// Grid columns classes
const getGridColsClass = (cols?: string) => {
  if (!cols) return '';

  const presets: Record<string, string> = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '5': 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    '6': 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    'auto-fit': 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
    'auto-fill': 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
  };

  return presets[cols] || cols;
};

// Grid rows classes
const getGridRowsClass = (rows?: string) => {
  if (!rows) return '';

  const presets: Record<string, string> = {
    '1': 'grid-rows-1',
    '2': 'grid-rows-2',
    '3': 'grid-rows-3',
    '4': 'grid-rows-4',
    '5': 'grid-rows-5',
    '6': 'grid-rows-6',
  };

  return presets[rows] || rows;
};

// Gap classes
const gapClasses: Record<string, string> = {
  none: '',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

// Justify classes
const justifyClasses: Record<string, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

// Align classes
const alignClasses: Record<string, string> = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

// Wrap classes
const getWrapClass = () => {
  if (props.wrap === true) return 'flex-wrap';
  if (props.wrap === 'reverse') return 'flex-wrap-reverse';
  return '';
};

// Container width classes
const containerClasses: Record<string, string> = {
  full: 'w-full',
  narrow: 'max-w-4xl mx-auto',
  wide: 'max-w-7xl mx-auto',
  section: 'px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20',
  none: '',
};

// Padding classes
const paddingClasses: Record<string, string> = {
  none: '',
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 md:p-12',
  xl: 'p-12 md:p-16 lg:p-20',
  section: 'py-16 lg:py-24',
};

// Background classes
const bgClasses: Record<string, string> = {
  transparent: 'bg-transparent',
  default: 'bg-surface-0 dark:bg-surface-900',
  surface: 'bg-surface-50 dark:bg-surface-800',
  muted: 'bg-surface-100 dark:bg-surface-700',
  primary: 'bg-primary-50 dark:bg-primary-900',
  custom: '',
};

const layoutClasses = computed(() => {
  const classes = [
    'relative', // Always relative for background/overlay positioning
    layoutTypeClasses[props.layout],
    props.layout === 'flex' ? directionClasses[props.direction] : '',
    props.layout === 'flex' ? getWrapClass() : '',
    props.layout === 'grid' ? getGridColsClass(props.cols) : '',
    props.layout === 'grid' ? getGridRowsClass(props.rows) : '',
    typeof props.gap === 'string' && gapClasses[props.gap]
      ? gapClasses[props.gap]
      : props.gap,
    props.justify ? justifyClasses[props.justify] : '',
    props.align ? alignClasses[props.align] : '',
    containerClasses[props.container],
    typeof props.padding === 'string' && paddingClasses[props.padding]
      ? paddingClasses[props.padding]
      : props.padding,
    props.margin,
    props.customBg || bgClasses[props.bg],
    props.fullHeight ? 'min-h-screen' : '',
    props.fullWidth ? 'w-full' : '',
    props.backgroundImage ? 'overflow-hidden' : '', // Clip background
  ];

  // Handle class prop as string or array
  if (Array.isArray(props.class)) {
    classes.push(...props.class);
  } else if (props.class) {
    classes.push(props.class);
  }

  return classes.filter(Boolean).join(' ');
});

const hasBackgroundOrOverlay = computed(() => {
  return props.backgroundImage || props.overlay;
});

const contentWrapperClass = computed(() => {
  // If user provides custom contentClass, use it
  if (props.contentClass) {
    return 'relative z-10 w-full h-full ' + props.contentClass;
  }

  // Use 'contents' for grid to preserve grid layout, otherwise use relative positioning
  if (props.layout === 'grid') {
    return 'contents';
  }
  return 'relative z-10 w-full h-full';
});

const backgroundImageStyle = computed(() => {
  if (!props.backgroundImage) return {};

  return {
    backgroundImage: `url(${props.backgroundImage})`,
    backgroundSize: props.backgroundSize,
    backgroundPosition: props.backgroundPosition,
    backgroundRepeat: props.backgroundRepeat,
    backgroundAttachment: props.backgroundAttachment,
    opacity: (props.backgroundOpacity / 100).toString(),
  };
});

const overlayStyle = computed(() => {
  if (!props.overlay) return {};

  const opacity = props.overlayOpacity / 100;

  if (props.overlayGradient) {
    return {
      background: props.overlayGradient,
      opacity: opacity.toString(),
      zIndex: '5',
    };
  }

  return {
    backgroundColor: props.overlayColor,
    opacity: opacity.toString(),
    zIndex: '5',
  };
});

const customStyle = computed(() => {
  const styles: Record<string, string> = {};

  // Custom background color/gradient
  if (props.customBg && props.bg === 'custom') {
    styles.background = props.customBg;
  }

  // Dimensions
  if (props.width) styles.width = props.width;
  if (props.height) styles.height = props.height;
  if (props.minHeight) styles.minHeight = props.minHeight;
  if (props.maxHeight) styles.maxHeight = props.maxHeight;

  return { ...styles, ...props.style };
});
</script>

<style scoped>
/* Optional: Add any default styles here */
</style>

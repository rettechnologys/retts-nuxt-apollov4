export interface ComponentContent {
  [key: string]: any;
}

export interface ComponentConfig {
  name: string;
  component: string;
  props?: Record<string, any>;
  content?: ComponentContent;
}

export interface BlockConfig {
  name: string;
  type?: 'predefined' | 'custom'; // Optional: defaults to 'custom' for backward compatibility
  component?: string; // For predefined widgets: 'HeroWidget', 'FeaturesWidget', etc.
  components?: ComponentConfig[]; // For custom blocks: array of field components
  props?: Record<string, any>;
}

export interface PageConfig {
  name: string;
  path: string;
  blocks: BlockConfig[];
  seoMeta?: {
    title?: string;
    description?: string;
    ogImage?: string;
    [key: string]: any;
  };
}

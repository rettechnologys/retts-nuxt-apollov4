/**
 * Block Management Types
 * Types for managing block definitions, configurations, and instances
 */

import type {
  BlockDefinition,
  BlockConfig,
  BlockPropsSchema,
  BlockContentSchema,
} from '#shared/types';

export interface BlockFormData {
  id?: string;
  name: string;
  slug: string;
  category: 'layout' | 'content' | 'media' | 'interactive' | 'custom';
  description?: string;
  icon?: string;
  component: string;

  // Default configuration
  defaultProps: Record<string, any>;
  defaultContent: Record<string, any>;

  // Schema definitions
  propsSchema: BlockPropsSchema;
  contentSchema: BlockContentSchema;

  // Preview and display
  previewHtml?: string;
  thumbnail?: string;
  isActive: boolean;
}

export interface BlockInstance extends BlockConfig {
  instanceId: string; // Unique ID for this instance on a page
  blockDefinitionId?: string; // Link to BlockDefinition
  sortOrder: number;
}

export interface BlockCategory {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    id: 'layout',
    label: 'Layout',
    icon: 'pi-th-large',
    description: 'Structural blocks for page layout',
  },
  {
    id: 'content',
    label: 'Content',
    icon: 'pi-file',
    description: 'Text and content blocks',
  },
  {
    id: 'media',
    label: 'Media',
    icon: 'pi-image',
    description: 'Images, videos, galleries',
  },
  {
    id: 'interactive',
    label: 'Interactive',
    icon: 'pi-sliders-h',
    description: 'Forms, buttons, interactive elements',
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: 'pi-code',
    description: 'Custom HTML blocks',
  },
];

export interface BlockValidationErrors {
  name?: string;
  slug?: string;
  category?: string;
  component?: string;
  propsSchema?: string;
  contentSchema?: string;
}

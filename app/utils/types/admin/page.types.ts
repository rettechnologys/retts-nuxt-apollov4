/**
 * Page Management Types (Simplified)
 * Basic structure for page creation and management
 */

import { BlockConfig } from '~~/shared/types';
import type { BlockInstance } from './block.types';

export interface PageSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string; // Comma-separated string
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export interface PageFormData {
  id?: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  type: string;

  // Content - using new block structure
  blocks: BlockInstance[];
  content: BlockConfig;

  // SEO
  seo: PageSEO;

  // Publishing
  publishedAt?: string;
  scheduledAt?: string;
}

export interface PageValidationErrors {
  title?: string;
  slug?: string;
  blocks?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

/**
 * Page Management Types (Simplified)
 * Basic structure for page creation and management
 */

import type { BlockConfig } from '~~/shared/types';
import type { BlockDefinition } from '~/components/admin/pages/pageDesign.types';

export interface PageSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface PageSettings {
  isHomepage: boolean;
  requireAuth: boolean;
  allowComments: boolean;
  showInMenu: boolean;
  menuOrder: number;
  parentPageId: number | null;
  customCSS: string;
  customJS: string;
}

export interface PageFormData {
  id?: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  type: string;

  // Content - using new block structure
  blocks: BlockDefinition[];
  content?: BlockConfig;

  // SEO
  seo: PageSEO;

  // Page settings
  settings: PageSettings;

  // Publishing
  publishedAt?: string;
  scheduledAt?: string;
}

export interface PageValidationErrors {
  title?: string;
  slug?: string;
  type?: string;
  blocks?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

import type { PageDesignBlockSchema } from './pageDesignSchema';

export type PreviewBindingMode = 'config' | 'flat';

export interface BlockDefinition {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  category: string;
  defaultConfig: PageDesignBlockSchema;
  previewMode: PreviewBindingMode;
}

/**
 * Page Form Composable
 * Reusable composable for page form logic and validation
 */

import type { PageFormData, PageValidationErrors } from '~/utils/types/admin/page.types';

export const usePageForm = () => {
  const errors = ref<PageValidationErrors>({});
  const isSaving = ref(false);
  const hasChanges = ref(false);

  /**
   * Generate URL-friendly slug from title
   */
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  /**
   * Validate page form data
   */
  const validateForm = (formData: PageFormData): boolean => {
    errors.value = {};
    let isValid = true;

    // Title validation
    if (!formData.title || formData.title.trim().length === 0) {
      errors.value.title = 'Title is required';
      isValid = false;
    } else if (formData.title.length > 200) {
      errors.value.title = 'Title must be less than 200 characters';
      isValid = false;
    }

    // Slug validation
    if (!formData.slug || formData.slug.trim().length === 0) {
      errors.value.slug = 'Slug is required';
      isValid = false;
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.value.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
      isValid = false;
    }

    // Type validation
    if (!formData.type) {
      errors.value.type = 'Page type is required';
      isValid = false;
    }

    // SEO validation
    if (formData.seo.metaTitle && formData.seo.metaTitle.length > 60) {
      errors.value.seo = errors.value.seo || {};
      errors.value.seo.metaTitle = 'Meta title should be less than 60 characters';
      isValid = false;
    }

    if (formData.seo.metaDescription && formData.seo.metaDescription.length > 160) {
      errors.value.seo = errors.value.seo || {};
      errors.value.seo.metaDescription = 'Meta description should be less than 160 characters';
      isValid = false;
    }

    return isValid;
  };

  /**
   * Check if slug is unique (mock implementation)
   */
  const checkSlugUniqueness = async (slug: string, pageId?: number): Promise<boolean> => {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return true; // Mock: assume slug is unique
  };

  /**
   * Save page (create or update)
   */
  const savePage = async (formData: PageFormData, isDraft = false): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (!validateForm(formData)) {
      return { success: false, error: 'Validation failed' };
    }

    isSaving.value = true;

    try {
      // Check slug uniqueness
      const isUnique = await checkSlugUniqueness(formData.slug);
      if (!isUnique) {
        errors.value.slug = 'This slug is already in use';
        return { success: false, error: 'Slug already exists' };
      }

      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      hasChanges.value = false;
      return { success: true, data: formData };
    } catch (error) {
      console.error('Error saving page:', error);
      return { success: false, error: 'Failed to save page' };
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Reset form state
   */
  const resetForm = () => {
    errors.value = {};
    hasChanges.value = false;
  };

  return {
    errors,
    isSaving,
    hasChanges,
    generateSlug,
    validateForm,
    checkSlugUniqueness,
    savePage,
    resetForm,
  };
};

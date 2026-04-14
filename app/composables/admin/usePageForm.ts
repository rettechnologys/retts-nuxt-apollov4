/**
 * Page Form Composable
 * Reusable async helpers and submit state for the page form.
 */

import type { PageFormData } from '~/utils/types/admin/page.types';

const FILE_TOKEN_KEY = '__pageFormFileToken';

const serializeFilesForFormData = (
  value: unknown,
  formData: FormData,
  state: { index: number },
): unknown => {
  if (value instanceof File) {
    const token = `upload-${state.index++}`;
    formData.append(token, value, value.name);
    return { [FILE_TOKEN_KEY]: token };
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      serializeFilesForFormData(item, formData, state),
    );
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      serializeFilesForFormData(nestedValue, formData, state),
    ]),
  );
};

const buildPageMultipartFormData = (payload: PageFormData): FormData => {
  const formData = new FormData();
  const serializedPayload = serializeFilesForFormData(payload, formData, {
    index: 0,
  });

  formData.append('payload', JSON.stringify(serializedPayload));

  return formData;
};

export const usePageForm = () => {
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
   * Check if slug is unique (mock implementation)
   */
  const checkSlugUniqueness = async (
    slug: string,
    pageId?: number,
  ): Promise<boolean> => {
    if (!slug?.trim()) return false;

    try {
      const res = await $fetch(`/api/pages/${slug}`);

      // return !(res && typeof res === 'object');
      return res.title !== slug;
    } catch (error: any) {
      if (error?.statusCode === 404 || error?.response?.status === 404) {
        return true;
      }

      console.error('Error checking slug uniqueness:', error);
      return true;
    }
  };

  /**
   * Save page (create or update)
   */
  const savePage = async (
    formData: PageFormData,
    isDraft = false,
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    isSaving.value = true;

    try {
      // Check slug uniqueness
      const isUnique = await checkSlugUniqueness(formData.slug);
      if (!isUnique) {
        return { success: false, error: 'Slug already exists' };
      }

      const response = await $fetch<{
        success: boolean;
        data: unknown;
        message?: string;
      }>(`/api/pages/${formData.slug}`, {
        method: 'POST',
        body: buildPageMultipartFormData({
          ...formData,
          status: isDraft ? 'draft' : formData.status,
        }),
      });

      hasChanges.value = false;
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error saving page:', error);
      return { success: false, error: 'Failed to save page' };
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Update an existing page (skips slug uniqueness check)
   */
  const updatePage = async (
    formData: PageFormData,
    isDraft = false,
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    isSaving.value = true;

    try {
      const response = await $fetch<{
        success: boolean;
        data: unknown;
        message?: string;
      }>(`/api/pages/${formData.slug}`, {
        method: 'POST',
        body: buildPageMultipartFormData({
          ...formData,
          status: isDraft ? 'draft' : formData.status,
        }),
      });

      hasChanges.value = false;
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating page:', error);
      return { success: false, error: 'Failed to update page' };
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Reset form state
   */
  const resetForm = () => {
    hasChanges.value = false;
  };

  return {
    isSaving,
    hasChanges,
    generateSlug,
    checkSlugUniqueness,
    savePage,
    updatePage,
    resetForm,
  };
};

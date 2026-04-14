/**
 * Collection Form Composable
 * Mirrors usePageForm.ts — slug helpers, save/update, loading state.
 */

import type {
  CollectionSchemaFormData,
  CollectionSchema,
} from '~/utils/types/admin/collection.types';

export const useCollectionForm = () => {
  const isSaving = ref(false);
  const hasChanges = ref(false);

  /**
   * Generate a URL-friendly slug from a collection name
   */
  const generateSlug = (name: string): string =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  /**
   * Returns true when the slug is available (not yet taken).
   * 404 = available, anything else = taken.
   */
  const checkSlugUniqueness = async (
    slug: string,
    currentSlug?: string,
  ): Promise<boolean> => {
    if (!slug?.trim()) return false;
    // Editing the same collection – slug hasn't changed, always valid
    if (currentSlug && slug === currentSlug) return true;

    try {
      await $fetch(`/api/collections/${slug}`);
      return false; // 200 → already exists
    } catch (error: any) {
      if (error?.statusCode === 404 || error?.response?.status === 404) {
        return true; // Not found → available
      }
      console.error('Error checking collection slug:', error);
      return true;
    }
  };

  /**
   * Create a new collection schema
   */
  const createCollection = async (
    formData: CollectionSchemaFormData,
  ): Promise<{ success: boolean; data?: CollectionSchema; error?: string }> => {
    isSaving.value = true;

    try {
      const response = await $fetch<{
        success: boolean;
        data: CollectionSchema;
      }>('/api/collections', {
        method: 'POST',
        body: formData,
      });

      hasChanges.value = false;
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Error creating collection:', error);
      const message =
        error?.data?.message || error?.message || 'Failed to create collection';
      return { success: false, error: message };
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Update an existing collection schema
   */
  const updateCollection = async (
    slug: string,
    formData: Partial<CollectionSchemaFormData>,
  ): Promise<{ success: boolean; data?: CollectionSchema; error?: string }> => {
    isSaving.value = true;

    try {
      const response = await $fetch<{
        success: boolean;
        data: CollectionSchema;
      }>(`/api/collections/${slug}`, {
        method: 'PUT',
        body: formData,
      });

      hasChanges.value = false;
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Error updating collection:', error);
      const message =
        error?.data?.message || error?.message || 'Failed to update collection';
      return { success: false, error: message };
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Delete a collection schema along with its items
   */
  const deleteCollection = async (
    slug: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await $fetch(`/api/collections/${slug}`, { method: 'DELETE' });
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting collection:', error);
      const message =
        error?.data?.message || error?.message || 'Failed to delete collection';
      return { success: false, error: message };
    }
  };

  const resetForm = () => {
    hasChanges.value = false;
  };

  return {
    isSaving,
    hasChanges,
    generateSlug,
    checkSlugUniqueness,
    createCollection,
    updateCollection,
    deleteCollection,
    resetForm,
  };
};

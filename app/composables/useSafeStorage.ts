import type { StorageLike } from '@vueuse/core';

/**
 * Extended storage interface that includes the custom clear method
 */
export interface SafeStorageLike extends StorageLike {
  clear?: (type: string, key: string) => void;
}

/**
 * Returns a safe storage implementation that works in both SSR and client contexts.
 * - On the server: Returns a no-op in-memory storage
 * - On the client: Returns localStorage
 */
export function useSafeStorage(): SafeStorageLike {
  // Server-side: Return a no-op storage that doesn't persist
  if (import.meta.server) {
    const memoryStorage = new Map<string, string>();

    return {
      getItem: (key: string) => memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memoryStorage.set(key, value);
      },
      removeItem: (key: string) => {
        memoryStorage.delete(key);
      },
      clear: (type: string, key: string) => {
        // No-op on server
        memoryStorage.delete(key);
      },
    };
  }

  // Client-side: Return localStorage
  return localStorage;
}

import { APP } from '~/utils/config';

// Create a type-safe interface
interface SecureStorage {
  setItem(key: string, value: object | string | number | boolean | [] | null): void;
  setItemLocalS(key: string, value: string): void;
  getItem(key: string): any;
  getItemLocalS(key: string): Promise<string | null>;
  removeItem(key: string): void;
  clear(type?: 'session' | 'local' | 'all'): void;
}

// Create a mock storage for SSR
const createMockStorage = (): SecureStorage => ({
  setItem: () => {},
  setItemLocalS: () => {},
  getItem: () => null,
  getItemLocalS: () => Promise.resolve(null),
  removeItem: () => {},
  clear: () => {},
});

// Create the actual storage function
async function createSecureStorage(): Promise<SecureStorage> {
  // Only run on client-side
  if (import.meta.client) {
    try {
      // Dynamic import to avoid SSR issues - use import() instead of require()
      const SecureLS = (await import('secure-ls')).default;
      const secureLS = new SecureLS();
      

      const clearLocal = () => {
        if (typeof localStorage !== 'undefined') {
          Object.keys(localStorage)
            .filter((x) => x.startsWith(APP.STORAGE_KEY))
            .forEach((x) => localStorage.removeItem(x));
        }
      };

      const clearSession = () => {
        if (typeof sessionStorage !== 'undefined') {
          Object.keys(sessionStorage)
            .filter((x) => x.startsWith(APP.STORAGE_KEY))
            .forEach((x) => sessionStorage.removeItem(x));
        }
      };

      return {
        setItem: (
          key: string,
          value: object | string | number | boolean | [] | null,
        ): void => {
          secureLS.set(key, value);
        },
        setItemLocalS: (key: string, value: string): void => {
          secureLS.setDataToLocalStorage(key, value);
        },
        getItem: (key: string) => {
          return secureLS.get(key);
        },
        getItemLocalS: async (key: string) => {

          return  secureLS.getDataFromLocalStorage(key);
        },
        removeItem: (key: string): void => {
          secureLS.remove(key);
        },
        clear: (type: 'session' | 'local' | 'all' = 'local') => {
          if (type === 'session') {
            clearSession();
          } else if (type === 'local') {
            clearLocal();
          } else {
            clearSession();
            clearLocal();
          }
        },
      };
    } catch (error) {
      console.warn('SecureLS initialization failed, falling back to mock storage:', error);
      return createMockStorage();
    }
  }
  
  // Return mock storage for SSR
  return createMockStorage();
}

// Create a promise-based storage instance
let storageInstance: SecureStorage | null = null;

export const getSecureStorage = async (): Promise<SecureStorage> => {
  if (!storageInstance) {
    storageInstance = await createSecureStorage();
  }
  return storageInstance;
};

// For backward compatibility, create a synchronous version that uses a fallback
export const secureStorage: SecureStorage = {
  setItem: (key: string, value: object | string | number | boolean | [] | null): void => {
    getSecureStorage().then(storage => storage.setItem(key, value));
  },
  setItemLocalS: (key: string, value: string): void => {
    getSecureStorage().then(storage => storage.setItemLocalS(key, value));
  },
  getItem: (key: string) => {
    // This is problematic as it can't be async, so we return null for now
    // You should use getSecureStorage() instead for proper async handling
    return  getSecureStorage().then(storage => storage.getItem(key));
  },
  getItemLocalS: (key: string): Promise<string | null> => {
    console.warn('secureStorage.getItemLocalS is deprecated, use getSecureStorage() instead');
    return getSecureStorage().then(storage => storage.getItemLocalS(key));
  },
  removeItem: (key: string): void => {
    getSecureStorage().then(storage => storage.removeItem(key));
  },
  clear: (type: 'session' | 'local' | 'all' = 'local') => {
    getSecureStorage().then(storage => storage.clear(type));
  },
};

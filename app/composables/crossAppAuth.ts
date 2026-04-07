// composables/useCrossAppAuth.ts (Fixed version)
export type AuthAction = 'login' | 'logout';

export interface AuthSyncData {
  action: AuthAction;
  token?: string;
  refreshToken?: string;
  sysMenuAcls?: any[];
  sysUser?: any;
  timestamp: number;
  source: 'nuxt-app' | 'vue-app';
}

export interface AuthSyncOptions {
  timeout?: number;
  windowFeatures?: string;
}

export const useCrossAppAuth = () => {
  const config = useRuntimeConfig();
  const appAdStore = useAppADStore();

  let messageListener: ((event: MessageEvent) => void) | null = null;

  /**
   * Generic method to open session window and sync auth data
   */
  const openSessionWindow = (
    targetAppUrl: string,
    data: AuthSyncData,
    options: AuthSyncOptions = {}
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const {
        timeout = 30000,
        windowFeatures = 'width=600,height=400,left=100,top=100'
      } = options;

      // Build URL params
      const params = new URLSearchParams({
        action: data.action,
        source: data.source,
        timestamp: data.timestamp.toString(),
        ...(data.token && { token: data.token }),
        ...(data.refreshToken && { refreshToken: data.refreshToken }),
        ...(data.sysMenuAcls && { sysMenuAcls: JSON.stringify(data.sysMenuAcls) }),
        ...(data.sysUser && { sysUser: JSON.stringify(data.sysUser) })
      });

      const url = `${targetAppUrl}/session?${params.toString()}`;

      // Open popup window
      const popup = window.open(url, 'cross-app-auth-window', windowFeatures);

      if (!popup) {
        reject(new Error('Popup blocked by browser'));
        return;
      }

      // Cleanup function
      let timeoutId: ReturnType<typeof setTimeout>;
      let checkClosedInterval: ReturnType<typeof setInterval>;
      let messageHandler: ((event: MessageEvent) => void) | null = null;

      const cleanup = () => {
        if (messageHandler) {
          window.removeEventListener('message', messageHandler);
          messageHandler = null;
        }
        if (timeoutId) clearTimeout(timeoutId);
        if (checkClosedInterval) clearInterval(checkClosedInterval);
      };

      // Listen for message from target app
      messageHandler = (event: MessageEvent) => {
        // Verify origin
        const allowedOrigins = [
          config.public.vueAppUrl,
          config.public.nuxtAppUrl,
          'http://localhost:5173',
          'http://localhost:3000'
        ].filter(Boolean);

        if (!allowedOrigins.includes(event.origin)) {
          console.warn('[CrossAppAuth] Invalid origin:', event.origin);
          return;
        }

        console.log('[CrossAppAuth] Received message:', event.data);

        if (event.data.type === 'SSO_SUCCESS') {
          cleanup();
          // Don't close popup immediately, let the session page handle it
          resolve(event.data);
        } else if (event.data.type === 'SSO_ERROR') {
          cleanup();
          // Close popup on error
          setTimeout(() => {
            if (popup && !popup.closed) {
              popup.close();
            }
          }, 1000);
          reject(new Error(event.data.error || 'Unknown error'));
        }
      };

      window.addEventListener('message', messageHandler);

      // Timeout handler
      timeoutId = setTimeout(() => {
        if (popup && !popup.closed) {
          popup.close();
        }
        cleanup();
        reject(new Error(`Authentication sync timeout after ${timeout}ms`));
      }, timeout);

      // Check if popup closed manually
      checkClosedInterval = setInterval(() => {
        if (popup.closed) {
          cleanup();
          reject(new Error('Window closed by user'));
        }
      }, 500);
    });
  };

  /**
   * Sync login from Nuxt to Vue
   */
  const syncLoginToVue = async () => {
    const authState = appAdStore.getState;

    if (!authState?.accessToken) {
      throw new Error('No authentication data found');
    }

    try {
      console.log('[CrossAppAuth] Syncing login to Vue app...');

      const vueAppUrl = config.public.vueAppUrl || 'http://localhost:5173';

      const result = await openSessionWindow(vueAppUrl as string, {
        action: 'login',
        token: authState.accessToken,
        refreshToken: undefined,
        sysMenuAcls: authState.sysMenuAcls || [],
        sysUser: authState.sysUser,
        timestamp: Date.now(),
        source: 'nuxt-app'
      });

      console.log('[CrossAppAuth] Login synced to Vue successfully:', result);
      return result;
    } catch (error) {
      console.error('[CrossAppAuth] Failed to sync login to Vue:', error);
      throw error;
    }
  };

  /**
   * Sync logout from Nuxt to Vue
   */
  const syncLogoutToVue = async () => {
    try {
      console.log('[CrossAppAuth] Syncing logout to Vue app...');

      const vueAppUrl = config.public.vueAppUrl || 'http://localhost:5173';

      const result = await openSessionWindow(vueAppUrl as string, {
        action: 'logout',
        timestamp: Date.now(),
        source: 'nuxt-app'
      });

      console.log('[CrossAppAuth] Logout synced to Vue successfully:', result);
      return result;
    } catch (error) {
      console.error('[CrossAppAuth] Failed to sync logout to Vue:', error);
      throw error;
    }
  };

  /**
   * Listen for auth changes from Vue app
   * Use this in Nuxt to receive auth updates from Vue
   */
  // In crossAppAuth.ts - Update the listenToVueAuth function

  const listenToVueAuth = (callback?: (data: AuthSyncData) => void) => {
    if (messageListener) {
      window.removeEventListener('message', messageListener);
    }

    const vueAppUrl = config.public.vueAppUrl || 'http://localhost:5173';

    // Method 1: postMessage listener
    messageListener = (event: MessageEvent) => {
      // Ignore extension messages
      if (!event.data || typeof event.data !== 'object') {
        return;
      }

      // Verify origin for security
      if (event.origin !== vueAppUrl) {
        // Don't log for every message (extensions send many)
        return;
      }

      console.log('[CrossAppAuth] Received postMessage:', event.data);

      const { type, data } = event.data;

      if (type === 'AUTH_SYNC_FROM_VUE') {
        console.log('[CrossAppAuth] Processing auth sync from Vue:', data);

        // Handle sync synchronously, don't return promise
        try {
          handleAuthSync(data, callback);
        } catch (error) {
          console.error('[CrossAppAuth] Error handling auth sync:', error);
        }
      }

      // Important: Don't return anything (no return true, no return promise)
      // This prevents "async response" error
    };

    window.addEventListener('message', messageListener);
    console.log('[CrossAppAuth] postMessage listener added for origin:', vueAppUrl);

    // Method 2: BroadcastChannel listener (for same-origin)
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel('cross-app-auth');
        broadcastChannel.onmessage = (event) => {
          console.log('[CrossAppAuth] Received broadcast:', event.data);

          if (event.data?.type === 'AUTH_SYNC_FROM_VUE') {
            try {
              handleAuthSync(event.data.data, callback);
            } catch (error) {
              console.error('[CrossAppAuth] Error handling broadcast:', error);
            }
          }
        };
        console.log('[CrossAppAuth] BroadcastChannel listener added');
      }
    } catch (error) {
      console.warn('[CrossAppAuth] BroadcastChannel not available:', error);
    }

    // Method 3: localStorage listener (for same-origin cross-tab)
    const storageListener = (e: StorageEvent) => {
      if (e.key === 'vue-to-nuxt-auth-sync' && e.newValue) {
        console.log('[CrossAppAuth] Received storage event:', e.newValue);

        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.type === 'AUTH_SYNC_FROM_VUE') {
            handleAuthSync(parsed.data, callback);
          }
        } catch (error) {
          console.error('[CrossAppAuth] Failed to parse storage event:', error);
        }
      }
    };

    window.addEventListener('storage', storageListener);
    console.log('[CrossAppAuth] Storage listener added');

    // Return cleanup function
    return () => {
      if (messageListener) {
        window.removeEventListener('message', messageListener);
      }
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      window.removeEventListener('storage', storageListener);
      console.log('[CrossAppAuth] All listeners removed');
    };
  };

  // Helper function to handle auth sync (SYNCHRONOUS)
  const handleAuthSync = (data: AuthSyncData, callback?: (data: AuthSyncData) => void) => {
    console.log('[CrossAppAuth] handleAuthSync:', data.action);

    if (data.action === 'login') {
      // Update Nuxt auth state (fire and forget)
      appAdStore.setState({
        accessToken: data.token,
        sysMenuAcls: data.sysMenuAcls,
        sysUser: data.sysUser
      }).catch(err => {
        console.error('[CrossAppAuth] Failed to update auth state:', err);
      });
      console.log('[CrossAppAuth] Nuxt auth state update triggered from Vue');
    } else if (data.action === 'logout') {
      // Clear Nuxt auth state (fire and forget)
      appAdStore.logout().catch(err => {
        console.error('[CrossAppAuth] Failed to logout:', err);
      });
      console.log('[CrossAppAuth] Nuxt logout triggered by Vue');
    }

    // Call custom callback
    if (callback) {
      try {
        callback(data);
      } catch (error) {
        console.error('[CrossAppAuth] Callback error:', error);
      }
    }
  };

  /**
   * Stop listening to Vue auth changes
   */
  const stopListening = () => {
    if (messageListener) {
      window.removeEventListener('message', messageListener);
      messageListener = null;
      console.log('[CrossAppAuth] Stopped listening to Vue auth changes');
    }
  };

  /**
   * Complete login flow with Vue sync
   */
  const loginWithSync = async (authData: {
    accessToken: string;
    refreshToken?: string;
    sysMenuAcls?: any[];
    sysUser?: any;
  }) => {
    try {
      // 1. Update Nuxt auth state
      await appAdStore.setState(authData);
      console.log('[CrossAppAuth] Nuxt auth state updated');

      // 2. Sync to Vue (don't fail if this errors)
      try {
        await syncLoginToVue();
        console.log('[CrossAppAuth] Login completed with sync');
      } catch (syncError) {
        console.error('[CrossAppAuth] Vue sync failed (non-critical):', syncError);
      }

      return true;
    } catch (error) {
      console.error('[CrossAppAuth] Login failed:', error);
      throw error;
    }
  };

  /**
   * Complete logout flow with Vue sync
   */
  const logoutWithSync = async () => {
    try {
      // 1. Sync logout to Vue first (don't fail if this errors)
      try {
        await syncLogoutToVue();
        console.log('[CrossAppAuth] Logout synced to Vue');
      } catch (syncError) {
        console.error('[CrossAppAuth] Vue sync failed (non-critical):', syncError);
      }

      // 2. Clear Nuxt auth state
      await appAdStore.logout();
      console.log('[CrossAppAuth] Logout completed');

      return true;
    } catch (error) {
      console.error('[CrossAppAuth] Logout failed:', error);
      throw error;
    }
  };

  return {
    // Core methods
    openSessionWindow,

    // Nuxt → Vue
    syncLoginToVue,
    syncLogoutToVue,

    // Vue → Nuxt (listener)
    listenToVueAuth,
    stopListening,

    // Convenience methods
    loginWithSync,
    logoutWithSync
  };
};
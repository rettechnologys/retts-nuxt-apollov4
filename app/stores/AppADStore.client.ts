import { APP } from "@/utils/config";
import { AuthEntity } from "@/modules/domain/internal/auth";
import { secureStorage } from "@retts-packages/utilities-helper";
import { PartialBy } from "@/utils/types/Type";
import { useStorage } from "@vueuse/core";

export const useAppADStore = defineStore('AppADStore', () => {
  const config = useRuntimeConfig();
  const storageKey = `${APP.STORAGE_KEY}${config.public.appEnv}_AppADState`;
  const state = useStorage<PartialBy<AuthEntity, 'sysUser'>>(
    storageKey,
    null,
    secureStorage,
    {
      serializer: {
        read: (v: any) => {
          let returnV: any = null;
          if (v) {
            try {
              returnV = JSON.parse(v);
            } catch (e) {
              console.error('[AppADStore] AppADState', 'read:error');
              returnV = secureStorage.getItem(storageKey);
              returnV = JSON.parse(returnV);
            }
          }
          return returnV;
        },
        write: (v: any) => {
          return JSON.stringify(v);
        },
      },
      listenToStorageChanges: false,
      mergeDefaults: true,
    },
  );



  //#region Computeds/Getters
  const getState = computed(() => state.value);
  const isLoggedIn = computed(() => {
    return Boolean(getState.value?.sysUser?.id);
  });
  //#endregion Computeds/Getters

  //#region Methods/Actions/Setters
  const setState = async (newState: Partial<AuthEntity>) => {
    const currentState = getState.value;

    state.value = {
      ...currentState,
      ...newState,
    };




    console.log(
      '[AppADStore] setState:',
      currentState?.accessToken,
      state.value?.accessToken,
    );

    return true;
  };

  const resetState = () => {
    state.value = null;

    console.log('[AppADStore] resetState:', state.value);
  };

  //* Custom
  const getSecureState = () => {
    let secureState;

    const appADState = secureStorage.getItem(storageKey);
    if (appADState) {
      secureState = JSON.parse(appADState) as AuthEntity;
    }

    console.log('[AppADStore] getSecureState:', secureState);
    return secureState;
  };

  const isAuthenticated = () => {
    let v = false;

    const secureState = getSecureState();
    if (secureState) {
      // v = secureState?.accessToken ? true : false;
      v = Boolean(secureState?.sysUser && secureState?.sysUser.id);
    }

    console.log('[AppADStore] isAuthenticated:', v);
    return v;
  };

  const logout = async () => {
    const currentState = getState.value;
    console.log(
      '[AppADStore] logout - before clear:',
      currentState.accessToken,
    );

    if (isAuthenticated()) {
      delete currentState?.sysUser;
      // const { AzureLogout } = useAzureOauth();
      // await AzureLogout();
    }

    console.log('[AppADStore] logout - clear:', currentState);

    state.value = {
      ...currentState,
    };

    secureStorage.clear('session', storageKey);


    console.log('[AppADStore] logout:', state.value);
  };

  const getUserName = () => {
    let userName;

    const secureState = getSecureState();
    if (secureState) {
      userName = secureState?.sysUser ? secureState?.sysUser.name : null;
    }

    console.log('[AppADStore] getUserName:', userName);
    return userName;
  };

  //#endregion Methods/Actions/Setters

  return {
    getState,
    setState,
    resetState,
    logout,
    isAuthenticated,
    isLoggedIn,
    getUserName,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppADStore, import.meta.hot));
}
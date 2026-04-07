import { APP } from "@/utils/config";
import { useStorage } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed } from 'vue';

/**
 * Layout Config Store
 */
export const useAppLCStore = defineStore('AppLCStore', () => {
  const config = useRuntimeConfig();
  const storageKey = `${APP.STORAGE_KEY}${config.public.appEnv}_AppLCState`;
  const state = useStorage<any>(storageKey, null, undefined, {
    serializer: {
      read: (v: any) => {
        let returnV: any = null;
        if (v) {
          try {
            returnV = JSON.parse(v);
          } catch (e) {
            console.error('[AppLCStore] AppLCState', 'read:error');
            returnV = JSON.parse(returnV);
          }
        }
        return returnV;
      },
      write: (v: any) => {
        return JSON.stringify(v);
      },
    },
    listenToStorageChanges: true,
    mergeDefaults: true,
  });

  //#region Computeds/Getters
  const getState = computed(() => state.value);

  //* Custom
  const isDarkTheme = computed(() => {
    console.log('[AppLCStore] isDarkTheme:getter', state.value);
    const v = state.value?.colorScheme === 'dark' ? true : false;
    console.log('[AppLCStore] isDarkTheme:', v);
    return v;
  });
  //#endregion Computeds/Getters

  //#region Methods/Actions/Setters
  const setState = (newState: Partial<any>) => {
    console.log('[AppLCStore] setState:', newState);
    // if ('theme' in newState) {
    //   newState.style = newState.theme?.split('/')[1];
    // }

    if ('colorScheme' in newState) {
      if (newState.colorScheme === 'auto') {
        //const { system } = useColorMode({ storageKey: null });
        newState.darkTheme = true; //system.value === 'dark' ? true : false;
      }
    }

    const currentState = getState.value;

    state.value = {
      ...currentState,
      ...newState,
    };

    console.log('[AppLCStore] setState:', state.value);
  };

  const resetState = () => {
    state.value = null;

    console.log('[AppLCStore] resetState:', state.value);
  };

  //* Custom
  const initState = (newState: any) => {
    if (!getState.value) {
      setState(newState);

      console.log('[AppLCStore] [Layout].initState:', 'load from remote');
    } else {
      console.log('[AppLCStore] [Layout].initState:', 'load from storage');
    }
  };
  //#endregion Methods/Actions/Setters

  return {
    getState,
    isDarkTheme,
    setState,
    resetState,
    initState,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppLCStore, import.meta.hot));
}

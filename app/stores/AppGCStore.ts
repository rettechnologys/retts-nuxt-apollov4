import { APP } from '@/utils/config';
import { decryptCrypto } from '@/utils/helpers/Crypto';
import { getObjByKeyValFromArray } from '@retts-packages/utilities-helper';
import { secureStorage } from '@retts-packages/utilities-helper';
import { GlobalConfigEntity } from '@/modules/domain/internal/global/GlobalConfigEntity';
import { SysConfigEntity } from '@/modules/domain/internal/sys/sys-config';
import { useStorage } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed } from 'vue';
import filter from 'lodash/filter';



/**
 * Global Config Store
 */
export const useAppGCStore = defineStore('AppGCStore', () => {
  const config = useRuntimeConfig();
  const storageKey = `${APP.STORAGE_KEY}${config.public.appEnv}_AppGCState`;
  const state = useStorage<GlobalConfigEntity>(
    storageKey,
    null,
    undefined,
    {
      serializer: {
        read: (v: any) => {
          let returnV: any = null;
          if (v) {
            try {
              returnV = JSON.parse(v);
            } catch (e) {
              console.error('[AppGCStore] AppGCState', 'read:error');
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
      listenToStorageChanges: true,
      mergeDefaults: true,
    }
  );
  const sysConfigs = ref<SysConfigEntity[]>([]);
  const isLoading = ref(true);
  //#region Computeds/Getters
  const getState = computed(() => state.value);

  //* Custom
  const getLangs = computed(() => state.value?.sysLangs);
  const getGroupParents = computed(() => state.value?.sysGroupParents);
  // const getConfigs = computed(() =>
  //   state.value?.sysConfigs
  //     ? JSON.parse(decryptCryptoSync(state.value.sysConfigs))
  //     : []
  // );
  const isEnableColorScheme = computed(() => {
    return getConfigsByKeywordValue('app_enable_color_scheme')?.value
      ? (getConfigsByKeywordValue('app_enable_color_scheme').value as boolean)
      : false;
  });
  const getLayoutConfig = computed(() => {
    return getConfigsByKeywordValue('app_layout_config')?.value
      ? (JSON.parse(
        getConfigsByKeywordValue('app_layout_config').value
      ) as any)
      : null;
  });

  const getNotifChannels = computed(() => {
    const channels = getConfigsByKeywordValue('notif_channels')?.value
      ? JSON.parse(getConfigsByKeywordValue('notif_channels').value)
      : [];

    return filter(channels, function (o) {
      return o.enable;
    });
  });
  // const isEnableColorScheme =  () => {
  //   const config =  getConfigsByKeywordValue('app_enable_color_scheme');
  //   return config?.value ? (config.value as boolean) : false;
  // };
  // const getLayoutConfig =  () => {
  //   const config =  getConfigsByKeywordValue('app_layout_config');
  //   return config?.value
  //     ? (JSON.parse(config.value) as ILayoutConfig)
  //     : null;
  // };

  // const getNotifChannels = async () => {
  //   const channels = await getConfigsByKeywordValue('notif_channels');
  //   if (!channels?.value) return [];

  //   return filter(channels, function (o) {
  //     return o.enable;
  //   });
  // };
  //#endregion Computeds/Getters

  //#region Methods/Actions/Setters
  const setState = (newState: Partial<GlobalConfigEntity>) => {
    const currentState = getState.value;

    state.value = {
      ...currentState,
      ...newState,
    };

    console.log('[AppGCStore] setState:', state.value);
  };

  const resetState = () => {
    state.value = null;

    console.log('[AppGCStore] resetState:', state.value);
  };

  //* Custom
  const getConfigsByKeywordValue = (valueToFind: string) => {
    return getObjByKeyValFromArray(sysConfigs.value, 'keyword', valueToFind);
  };
  // const getConfigsByKeywordValue =  async  (valueToFind: string) => {
  //   const configs: SysConfigEntity[] = state.value?.sysConfigs
  //     ? JSON.parse(  await decryptCrypto(state.value.sysConfigs))
  //     : [];
  //   console.log('[AppGCStore]: decryptCrypto:', configs);
  //   return getObjByKeyValFromArray(configs, 'keyword', valueToFind);
  // };

  const getConfigs = async () => {
    console.log('[AppGCStore]: getConfigs:state.value', state.value);
    return state.value?.sysConfigs
      ? JSON.parse(await decryptCrypto(state.value.sysConfigs))
      : []
  };

  const initConfigs = async () => {
    isLoading.value = true;
    try {
      const configs = await getConfigs();
      sysConfigs.value = configs;
      console.log('[AppGCStore] initConfigs:', sysConfigs.value);
    } catch (error) {
      console.error('[AppGCStore] initConfigs error:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // const getConfigsByKeywordValue = (valueToFind: string) => {
  //   // return getObjByKeyValFromArray(
  //   //   getState.value?.sysConfigs ? getState.value.sysConfigs : [],
  //   //   'keyword',
  //   //   valueToFind,
  //   // );
  //   console.log(
  //     '[AppGCStore]: decryptCrypto:',
  //     decryptCryptoSync(state.value.sysConfigs)
  //   );

  //   const configs: SysConfigEntity[] = state.value?.sysConfigs
  //     ? JSON.parse(decryptCryptoSync(state.value.sysConfigs))
  //     : [];

  //   return getObjByKeyValFromArray(
  //     //getConfigs.value as SysConfigEntity[],
  //     configs,
  //     'keyword',
  //     valueToFind
  //   );
  // };
  //#endregion Methods/Actions/Setters

  return {
    getState,
    getLangs,
    getGroupParents,
    getConfigs,
    isEnableColorScheme,
    getLayoutConfig,
    getNotifChannels,
    getConfigsByKeywordValue,
    setState,
    resetState,
    initConfigs,
    isLoading,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppGCStore, import.meta.hot));
}

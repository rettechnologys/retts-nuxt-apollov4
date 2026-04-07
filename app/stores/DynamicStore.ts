import { useStorage } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, watch, type Ref } from 'vue';
import { APP } from '@/utils/config';
import { ICommonState } from '@/utils/types/CommonState';

export const useDynamicStore = function <S extends ICommonState>(
  name: string,
  initialState: S,
  isPersist?: boolean,
  storage?: Storage,
) {
  const storeName = name + 'Store';
  const store = defineStore(storeName, () => {
    //#region State
    let states = ref(initialState) as Ref<S>;
    if (isPersist) {
      states = useStorage(
        `${APP.STORAGE_KEY}${name}State`,
        initialState,
        storage ? storage : sessionStorage,
      );
    }

    //#region Action
    const setState = (newState: S) => {
      console.log(`useDynamicStore:setState:${name}`, newState);
      states.value = newState;
    };

    //#region Watcher
    watch(states, (newVal, oldVal) => {
      console.log(`Watch${name}State:`, `${oldVal?.status} -> ${newVal.status}`);
    }, {
      immediate: true,
    });

    return { states, setState };
  });

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(store, import.meta.hot));
  }

  return store();
};

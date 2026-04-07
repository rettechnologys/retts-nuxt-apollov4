import {
  type DeepReadonly,
  type Ref,
  onMounted,
  onUnmounted,
  readonly,
  ref,
} from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { Ploc } from '~/utils/helpers/Ploc';

export function usePlocState<S>(ploc: Ploc<S>): DeepReadonly<Ref<S>> {
  
  const state = ref(ploc.state) as Ref<S>;

  const stateSubscription = (newState: S) => {
    console.log('newState', newState);
    state.value = newState;
  };

  onMounted(() => {
    console.log(`usePlocState:onMounted:`, ploc);
    ploc.subscribeToState(stateSubscription);
    console.log(`usePlocState:${ploc.storeId}:onMounted:subscribe`);
  });

  onUnmounted(() => {
    //ploc.dispose();
    //console.log(`usePlocState:${ploc.storeId}:onUnmounted`);
  });

  // Only register route guards on client side where router is active
  if (import.meta.client) {
    onBeforeRouteLeave(() => {
      ploc.dispose();
      console.log(`usePlocState:${ploc.storeId}:onBeforeRouteLeave:dispose`);
    });
  }

  return readonly(state);
}

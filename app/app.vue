<template>
  <NuxtLayout>
    <Toast />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
// import { globalUseCaseResolver } from '~/modules/domain/internal/global/usecase';
// import { mePlocResolver } from '~/modules/presentation/me';

// const configs = await useFetch('/api/global-configs');
// console.log('App Loaded', configs.data.value);
// const menus = configs.data.value?.menus || [];
// const appGCStore = useAppGCStore();
// const appLCStore = useAppLCStore();
// const { listenToVueAuth } = useCrossAppAuth();
// const mePloc = mePlocResolver.instanceMePloc();
// const meState = usePlocState(mePloc);

// const globalConfigUseCase = globalUseCaseResolver.instanceGlobalConfigUseCase();

// Use useAsyncData without await to prevent hydration mismatch
// The lazy: true option makes it non-blocking
useAsyncData(
  'global-config',
  async () => {
    // Only run on client
    if (!import.meta.client) return null;

    try {
      // const globalConfig = await globalConfigUseCase.call();
      // globalConfig.fold(
      //   (responseFailure) => {
      //     // nothing
      //     console.log(
      //       '[App] onBeforeMount:',
      //       'globalConfig.responseFailure:',
      //       responseFailure,
      //     );
      //   },
      //   (responseSuccees) => {
      //     const { ...data } = responseSuccees;
      //     // appGCStore.setState(data);
      //     //* Init Layout
      //     // const layoutConfig: ILayoutConfig = {
      //     //   colorScheme: 'auto',
      //     //   darkTheme: true,
      //     //   theme: '/aura/red-ret',
      //     //   style: 'aura',
      //     //   menuMode: 'horizontal',
      //     //   menuTheme: 'colorScheme',
      //     //   inputStyle: 'filled',
      //     //   ripple: true,
      //     //   scale: 12,
      //     // };
      //   },
      // );
      // await appGCStore.initConfigs();
      // if (appGCStore.getLayoutConfig) {
      //   appLCStore.initState(appGCStore.getLayoutConfig);
      // }
    } catch (e) {
      console.error('[App] Error loading global config:', e);
    }
  },
  {
    server: false,
    lazy: true, // Non-blocking, prevents hydration errors
  },
);

// onBeforeMount(async () => {
//   const globalConfig = await globalConfigUseCase.call();
//   globalConfig.fold(
//     (responseFailure) => {
//       // nothing
//       console.log(
//         '[App] onBeforeMount:',
//         'globalConfig.responseFailure:',
//         responseFailure,
//       );
//     },
//     (responseSuccees) => {
//       const { ...data } = responseSuccees;
//       // appGCStore.setState(data);
//       console.log('[GlobalConfig] onBeforeMount:', data);

//       //* Init Layout
//       // const layoutConfig: ILayoutConfig = {
//       //   colorScheme: 'auto',
//       //   darkTheme: true,
//       //   theme: '/aura/red-ret',
//       //   style: 'aura',
//       //   menuMode: 'horizontal',
//       //   menuTheme: 'colorScheme',
//       //   inputStyle: 'filled',
//       //   ripple: true,
//       //   scale: 12,
//       // };
//       // if (appGCStore.getLayoutConfig) {
//       //   appLCStore.initState(appGCStore.getLayoutConfig);
//       // }
//     },
//   );
// });
onMounted(async () => {
  console.log('[App] Setting up Vue auth listener...');
  try {
    // await mePloc.pMe();
    // console.log('[App] Me data fetched successfully:', meState.value);
  } catch (error) {
    console.error('[App] Error fetching me data:', error);
  }
});
</script>

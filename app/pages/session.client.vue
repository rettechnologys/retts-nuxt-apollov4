<!-- Nuxt: app/pages/session.client.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <div v-if="status === 'processing'" class="space-y-4">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <h2 class="text-xl font-semibold">{{ actionText }}...</h2>
      </div>
      <div v-else-if="status === 'success'" class="space-y-4">
        <div class="text-green-600 text-5xl">✓</div>
        <h2 class="text-xl font-semibold">Success!</h2>
        <p class="text-sm text-gray-500">Closing...</p>
      </div>
      <div v-else-if="status === 'error'" class="space-y-4">
        <div class="text-red-600 text-5xl">✕</div>
        <h2 class="text-xl font-semibold">Error</h2>
        <p class="text-sm">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const appAdStore = useAppADStore();

const status = ref<'processing' | 'success' | 'error'>('processing');
const errorMessage = ref('');
const actionText = ref('Processing');

onMounted(async () => {
  try {
    const action = route.query.action as string;
    const source = route.query.source as string;

    if (source !== 'vue-app') {
      throw new Error('Invalid source');
    }

    if (action === 'login') {
      actionText.value = 'Syncing login';

      const token = route.query.token as string;
      const sysMenuAcls = route.query.sysMenuAcls
        ? JSON.parse(route.query.sysMenuAcls as string)
        : [];

      if (!token) throw new Error('No token provided');

      await appAdStore.setState({
        accessToken: token,
        sysMenuAcls,
      });

      console.log('[Nuxt Session] Login synced from Vue');
    } else if (action === 'logout') {
      actionText.value = 'Syncing logout';

      await appAdStore.logout();
      console.log('[Nuxt Session] Logout synced from Vue');
    } else {
      throw new Error('Invalid action');
    }

    status.value = 'success';

    if (window.opener) {
      window.opener.postMessage({ type: 'SSO_SUCCESS', action }, '*');
    }

    setTimeout(() => window.close(), 2000);
  } catch (error: any) {
    status.value = 'error';
    errorMessage.value = error.message;

    if (window.opener) {
      window.opener.postMessage(
        { type: 'SSO_ERROR', error: error.message },
        '*',
      );
    }
  }
});
</script>

<!-- app/pages/test-broadcast.vue -->
<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">BroadcastChannel Test</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Control Panel -->
      <div class="border rounded-lg p-6 bg-blue-50">
        <h2 class="text-xl font-semibold mb-4">Control Panel</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Message:</label>
            <input
              v-model="testMessage"
              type="text"
              class="w-full px-3 py-2 border rounded"
              placeholder="Type a message..."
            />
          </div>

          <Button
            @click="sendTestMessage"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send via BroadcastChannel
          </Button>

          <Button
            @click="testAuthUpdate"
            class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test AUTH_UPDATE
          </Button>

          <Button
            @click="testLogout"
            class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Test LOGOUT
          </Button>
        </div>

        <div class="mt-6">
          <h3 class="font-semibold mb-2">Current Auth State:</h3>
          <pre class="bg-white p-3 rounded text-xs overflow-auto max-h-40">{{
            authState
          }}</pre>
        </div>
      </div>

      <!-- Message Log -->
      <div class="border rounded-lg p-6 bg-green-50">
        <h2 class="text-xl font-semibold mb-4">Received Messages</h2>

        <div class="space-y-2 max-h-96 overflow-auto">
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="bg-white p-3 rounded shadow-sm"
          >
            <div class="text-xs text-gray-500">{{ msg.timestamp }}</div>
            <div class="font-mono text-sm mt-1">
              <strong>{{ msg.type }}</strong>
              <pre class="text-xs mt-1">{{ msg.data }}</pre>
            </div>
          </div>

          <div
            v-if="messages.length === 0"
            class="text-gray-500 text-center py-8"
          >
            No messages received yet...
          </div>
        </div>

        <button
          @click="clearMessages"
          class="w-full mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Clear Log
        </button>
      </div>
    </div>

    <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
      <h3 class="font-semibold mb-2">📝 Instructions:</h3>
      <ol class="list-decimal list-inside space-y-1 text-sm">
        <li>Buka page ini di <strong>2 tabs/windows berbeda</strong></li>
        <li>Klik tombol "Send via BroadcastChannel" di salah satu tab</li>
        <li>Lihat apakah message muncul di tab lainnya</li>
        <li>Test juga dengan AUTH_UPDATE dan LOGOUT</li>
      </ol>

      <div class="mt-3 text-sm">
        <strong>Current URL:</strong>
        <code class="bg-white px-2 py-1 rounded">{{ currentUrl }}</code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const appAdStore = useAppADStore();

const testMessage = ref('Hello from tab!');
const messages = ref<Array<{ timestamp: string; type: string; data: any }>>([]);
const currentUrl = ref('');

// Test BroadcastChannel
let testChannel: BroadcastChannel | null = null;

onMounted(() => {
  currentUrl.value = window.location.href;

  // Create test channel
  testChannel = new BroadcastChannel('auth-sync-channel');

  // Listen to messages
  testChannel.onmessage = (event) => {
    console.log('[TEST] Received:', event.data);
    messages.value.unshift({
      timestamp: new Date().toLocaleTimeString(),
      type: event.data.type || 'CUSTOM',
      data: event.data,
    });
  };

  console.log('[TEST] BroadcastChannel initialized');
});

onUnmounted(() => {
  if (testChannel) {
    testChannel.close();
  }
});

// Computed
const authState = computed(() => appAdStore.getState);

// Methods
const sendTestMessage = () => {
  if (testChannel) {
    testChannel.postMessage({
      type: 'TEST_MESSAGE',
      message: testMessage.value,
      timestamp: new Date().toISOString(),
    });
    console.log('[TEST] Sent message:', testMessage.value);
  }
};

const testAuthUpdate = () => {
  appAdStore.setState({
    accessToken: `test_token_${Date.now()}`,
    sysUser: {
      name: 'Test User ' + Math.floor(Math.random() * 100),
      email: 'test@example.com',
    } as any,
  });
};

const testLogout = () => {
  appAdStore.logout();
};

const clearMessages = () => {
  messages.value = [];
};
</script>

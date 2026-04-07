<template>
  <div
    class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-4"
  >
    <Card class="w-full max-w-md">
      <template #header>
        <div class="text-center pt-6">
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">
            Welcome Back
          </h1>
          <p class="text-surface-600 dark:text-surface-400 mt-2">
            Sign in to your account
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- username Field -->
          <div class="flex flex-col gap-2">
            <label
              for="username"
              class="font-semibold text-surface-900 dark:text-surface-0"
              >username</label
            >
            <InputText
              id="username"
              v-model="username"
              type="username"
              placeholder="Enter your username"
              :invalid="!!errors.username"
              required
            />
            <small v-if="errors.username" class="text-red-500">{{
              errors.username
            }}</small>
          </div>

          <!-- Password Field -->
          <div class="flex flex-col gap-2">
            <label
              for="password"
              class="font-semibold text-surface-900 dark:text-surface-0"
              >Password</label
            >
            <Password
              id="password"
              v-model="password"
              placeholder="Enter your password"
              :feedback="false"
              toggleMask
              class="w-full"
              :pt="{
                pcInputText: {
                  root: {
                    class: 'w-full',
                  },
                },
              }"
              :invalid="!!errors.password"
              required
            />
            <small v-if="errors.password" class="text-red-500">{{
              errors.password
            }}</small>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center gap-2">
            <Checkbox v-model="rememberMe" inputId="remember" binary />
            <label for="remember" class="text-surface-700 dark:text-surface-300"
              >Remember me</label
            >
          </div>

          <!-- Error Message -->
          <Message v-if="errorMessage" severity="error" :closable="false">
            {{ errorMessage }}
          </Message>

          <!-- Success Message -->
          <Message v-if="successMessage" severity="success" :closable="false">
            {{ successMessage }}
          </Message>

          <!-- Submit Button -->
          <Button
            type="submit"
            label="Sign In"
            class="w-full"
            :loading="loading"
            icon="pi pi-sign-in"
          />

          <!-- Footer Links -->
          <div class="text-center space-y-2">
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm text-primary-500 hover:text-primary-600"
            >
              Forgot your password?
            </NuxtLink>
            <div class="text-sm text-surface-600 dark:text-surface-400">
              Don't have an account?
              <NuxtLink
                to="/auth/register"
                class="text-primary-500 hover:text-primary-600 font-semibold"
              >
                Sign up
              </NuxtLink>
            </div>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Message from 'primevue/message';
import {
  AUTH_STATE,
  authPlocResolver,
  EAuthNameState,
  EAuthStatusState,
} from '~/modules/presentation/auth';
import { APP, PRIME } from '~/utils/config';
import { useCrossAppAuth } from '#imports';

const authPloc = authPlocResolver.instanceAuthPloc();
const authState = usePlocState(authPloc);

// Form state
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const errors = ref({
  username: '',
  password: '',
});

// Composable
const toast = useToast();
const route = useRoute();
const crossAppAuth = useCrossAppAuth();

// Use loading from store
const loading = computed(() => {
  return (
    authState.value.name === `${AUTH_STATE}${EAuthNameState.Login}` &&
    authState.value.status === EAuthStatusState.FetchWaiting
  );
});

// Form validation
const validateForm = () => {
  errors.value = {
    username: '',
    password: '',
  };

  let isValid = true;

  if (!username.value) {
    errors.value.username = 'username is required';
    isValid = false;
  }

  if (!password.value) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else if (password.value.length < 3) {
    errors.value.password = 'Password must be at least 3 characters';
    isValid = false;
  }

  return isValid;
};

// Handle login
const handleLogin = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!validateForm()) {
    return;
  }
  await authPloc.pLogin({
    username: username.value,
    password: password.value,
  });

  try {
    // await authStore.login({
    //   username: username.value,
    //   password: password.value,
    //   rememberMe: rememberMe.value,
    // });

    // successMessage.value = 'Login successful! Redirecting...';
    if (authState.value.name === `${AUTH_STATE}${EAuthNameState.Login}`) {
      if (
        authState.value.status === EAuthStatusState.FetchFailure &&
        authState.value.failureMessage
      ) {
        //* Bad Request or Not Found
        if (
          authState.value.failureCode === 400 ||
          authState.value.failureCode === 404
        ) {
          errorMessage.value = authState.value.failureMessage
            ? Array.isArray(authState.value.failureMessage)
              ? authState.value.failureMessage.join(', ')
              : (authState.value.failureMessage as string)
            : 'Invalid username or password.';
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage.value,
            life: PRIME.TOAST_LIFE,
          });
        } else {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage.value,
            life: PRIME.TOAST_LIFE,
          });
        }
      } else if (authState.value.status === EAuthStatusState.FetchSuccess) {
        // await crossAppAuth.loginWithSync({
        //   accessToken: authState.value.data?.accessToken || '',
        //   sysMenuAcls: authState.value.data?.sysMenuAcls || [],
        //   sysUser: authState.value.data?.sysUser || {},
        // });
        successMessage.value = 'Login successful! Redirecting...';
        // await axios.post(
        //   'http://localhost:4000/auth/login',
        //   {
        //     username: tParams.username,
        //     password: tParams.password,
        //   },
        //   {
        //     withCredentials: true,
        //   },
        // );

        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!',
          life: PRIME.TOAST_LIFE,
        });

        const redirectPaath = route.query.redirect || APP.DEF_AUTH_PATH;
        navigateTo(redirectPaath as string);
      }
    }
  } catch (error: any) {
    console.error('Login error:', error);
    errorMessage.value =
      error.data?.message || 'Login failed. Please check your credentials.';
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

<template>
  <div v-if="isAuthenticated" class="flex items-center">
    <!-- User Avatar/Initials -->
    <Avatar
      v-if="adState.sysUser?.profile.avatarUrl"
      :image="adState.sysUser.profile.avatarUrl"
      shape="circle"
      size="normal"
    />
    <Avatar
      v-else
      :label="
        adState.sysUser
          ? getInitialName(
              adState.sysUser.profile.fullName.firstName +
                ' ' +
                adState.sysUser.profile.fullName.lastName,
            )
          : '?'
      "
      shape="circle"
      size="normal"
      class="bg-primary-500 text-white"
    />

    <!-- User Menu -->
    <Menu ref="menu" :model="menuItems" :popup="true">
      <template #item="{ item }">
        <a
          v-if="item.url && !item.labelOnly"
          :href="item.url"
          class="flex items-center gap-2 px-3 py-2"
        >
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
        <template v-else>
          <span v-if="item.labelOnly" :class="item.class">{{
            item.label
          }}</span>

          <Button
            v-else
            size="small"
            @click="
              item.command && item.command({ originalEvent: $event, item })
            "
            class="flex items-center gap-2 px-3 py-2 w-full text-left"
          >
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
          </Button>
        </template>
      </template>
    </Menu>

    <Button icon="pi pi-angle-down" text rounded @click="toggleMenu" />
  </div>

  <!-- Login Button (if not logged in) -->
  <Button
    v-else
    size="small"
    label="Sign In"
    icon="pi pi-sign-in"
    @click="navigateTo('/auth/login')"
  />
</template>

<script setup lang="ts">
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { ref } from 'vue';
import { AuthEntity } from '~/modules/domain/internal/auth';
import {
  AUTH_STATE,
  authPlocResolver,
  EAuthNameState,
  EAuthStatusState,
} from '~/modules/presentation/auth';
import { PRIME } from '~/utils/config';
import { getInitialName } from '~/utils/helpers/String';

const authPloc = authPlocResolver.instanceAuthPloc();
const authState = usePlocState(authPloc);

const toast = useToast();
const appAdStore = useAppADStore();
const adState = ref(appAdStore.getState as AuthEntity);
const isAuthenticated = ref(adState?.value?.sysUser?.id ? true : false);
console.log('UserIndicator:adState', adState);

//#region Datas
const menu = ref();

const menuItems = ref([
  // {
  //   label: 'Profile',
  //   icon: 'pi pi-user',
  //   url: '/profile',
  // },
  // {
  //   label: 'Settings',
  //   icon: 'pi pi-cog',
  //   url: '/settings',
  // },
  // {
  //   separator: true,
  // },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: async () => {
      await handleLogout();
      appAdStore.logout();
    },
  },
]);
console.log('UserIndicator:adState', adState);
//#region Methods

const toggleMenu = (event: Event) => {
  menu.value.toggle(event);
};

const handleLogout = async () => {
  await authPloc.pLogout();
  console.log('fnHandleLogout:authState:UserInfo', authState.value.status);

  if (authState.value.name === `${AUTH_STATE}${EAuthNameState.Logout}`) {
    if (authState.value.status === EAuthStatusState.FetchFailure) {
      console.log(
        'fnHandleLogout:FetchFailure:UserInfo',
        authState.value.failureCode,
      );
      if (
        authState.value.failureCode === 401 ||
        authState.value.failureCode === 404
      ) {
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error during logout. Please try again.',
          life: PRIME.TOAST_LIFE,
        });
      }
    } else if (authState.value.status === EAuthStatusState.FetchSuccess) {
      // await logoutWithSync();
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully logged out.',
        life: PRIME.TOAST_LIFE,
      });
    }
  }
};

watch(
  () => appAdStore.isLoggedIn,
  (newVal) => {
    console.log('UserIndicator:watcher:isAuth', appAdStore.isLoggedIn, newVal);
    console.log('UserIndicator:watcher:adState', adState);
    isAuthenticated.value = newVal ? true : false;
  },
);
watch(
  () => appAdStore.getState,
  (newVal) => {
    console.log('UserIndicator:watcher:adState', newVal);
    adState.value = newVal as AuthEntity;
  },
);
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

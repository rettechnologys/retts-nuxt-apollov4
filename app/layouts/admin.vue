<!-- Admin Layout -->
<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <img
          v-if="!sidebarCollapsed"
          src="/demo/images/logo.svg"
          alt="Logo"
          class="logo"
        />
        <Button
          icon="pi pi-bars"
          text
          rounded
          class="collapse-btn"
          @click="sidebarCollapsed = !sidebarCollapsed"
        />
      </div>

      <nav class="sidebar-nav">
        <template v-for="item in menuItems" :key="item.path">
          <NuxtLink
            v-if="!item.children"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
          >
            <i :class="item.icon"></i>
            <span v-if="!sidebarCollapsed" class="nav-label">{{
              item.label
            }}</span>
          </NuxtLink>

          <div v-else class="nav-group">
            <div class="nav-group-label" @click="toggleGroup(item.path)">
              <i :class="item.icon"></i>
              <span v-if="!sidebarCollapsed">{{ item.label }}</span>
              <i
                v-if="!sidebarCollapsed"
                :class="
                  expandedGroups.includes(item.path)
                    ? 'pi pi-chevron-down'
                    : 'pi pi-chevron-right'
                "
                class="nav-chevron"
              ></i>
            </div>
            <div
              v-if="expandedGroups.includes(item.path) && !sidebarCollapsed"
              class="nav-children"
            >
              <NuxtLink
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
                class="nav-child"
                :class="{ active: isActive(child.path) }"
              >
                <i
                  v-if="child.icon"
                  :class="child.icon"
                  class="nav-child-icon"
                />
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>
        </template>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Topbar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <Breadcrumb :model="breadcrumbItems" />
        </div>

        <div class="topbar-right">
          <Button
            icon="pi pi-bell"
            text
            rounded
            :badge="'3'"
            badgeSeverity="danger"
          />
          <Button
            icon="pi pi-cog"
            text
            rounded
            @click="navigateTo('/admin/settings')"
          />

          <div class="user-menu">
            <Avatar :label="userInitials" shape="circle" />
            <span class="user-name">{{ userName }}</span>
            <Button icon="pi pi-angle-down" text @click="toggleUserMenu" />

            <Menu ref="userMenuRef" :model="userMenuItems" :popup="true" />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const sidebarCollapsed = ref(false);
const expandedGroups = ref<string[]>(['/admin/settings', '/admin/collections']);
const userMenuRef = ref();

const userName = ref('John Doe');
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
});

// ─── Dynamic collections nav ──────────────────────────────────────────────────
const { data: collectionsData } = await useFetch<
  { slug: string; name: string; icon: string }[]
>('/api/collections', { default: () => [] });

const collectionsChildren = computed(() => [
  { path: '/admin/collections', label: 'All Collections', icon: 'pi pi-list' },
  {
    path: '/admin/collections/create',
    label: 'New Collection',
    icon: 'pi pi-plus',
  },
  ...(collectionsData.value ?? []).map((c) => ({
    path: `/admin/collections/${c.slug}/items`,
    label: c.name,
    icon: c.icon || 'pi pi-database',
  })),
]);

const menuItems = computed(() => [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: 'pi pi-home',
  },
  {
    path: '/admin/settings',
    label: 'Global Settings',
    icon: 'pi pi-cog',
    children: [
      // { path: '/admin/settings/theme', label: 'Theme/Layout' },
      // { path: '/admin/settings/menus', label: 'Menus' },
      { path: '/admin/settings/footer', label: 'Footer' },
      { path: '/admin/settings/seo', label: 'SEO Defaults' },
    ],
  },
  {
    path: '/admin/pages',
    label: 'Pages',
    icon: 'pi pi-file',
  },
  {
    path: '/admin/collections',
    label: 'Collections',
    icon: 'pi pi-database',
    children: collectionsChildren.value,
  },
  // {
  //   path: '/admin/media',
  //   label: 'Media Library',
  //   icon: 'pi pi-images',
  // },
]);

const userMenuItems = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => navigateTo('/admin/profile'),
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => navigateTo('/admin/settings'),
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => logout(),
  },
]);

const breadcrumbItems = computed(() => {
  const paths = route.path.split('/').filter(Boolean);
  return paths.map((path, index) => ({
    label: path.charAt(0).toUpperCase() + path.slice(1),
    to: '/' + paths.slice(0, index + 1).join('/'),
  }));
});

const isActive = (path: string) => {
  // Exact match for terminal pages (index-like paths that would over-match)
  if (
    path === '/admin' ||
    path === '/admin/collections' ||
    path === '/admin/collections/create'
  ) {
    return route.path === path;
  }
  return route.path.startsWith(path);
};

const toggleGroup = (path: string) => {
  const index = expandedGroups.value.indexOf(path);
  if (index > -1) {
    expandedGroups.value.splice(index, 1);
  } else {
    expandedGroups.value.push(path);
  }
};

const toggleUserMenu = (event: Event) => {
  userMenuRef.value.toggle(event);
};

const logout = () => {
  // Implement logout logic
  navigateTo('/');
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.admin-sidebar {
  width: 260px;
  background: #1f2937;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.admin-sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  height: 32px;
}

.collapse-btn {
  color: white;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-item,
.nav-group-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-item:hover,
.nav-group-label:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-left: 3px solid #3b82f6;
}

.nav-label {
  flex: 1;
}

.nav-group {
  margin-bottom: 0.5rem;
}

.nav-children {
  margin-left: 2.5rem;
}

.nav-child {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.nav-child-icon {
  font-size: 0.75rem;
  flex-shrink: 0;
  opacity: 0.7;
}

.nav-child:hover {
  color: white;
}

.nav-child.active {
  color: #60a5fa;
}

.nav-chevron {
  font-size: 0.75rem;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-topbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.user-name {
  font-weight: 500;
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  background: #f9fafb;
}
</style>

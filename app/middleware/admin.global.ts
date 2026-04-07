export default defineNuxtRouteMiddleware((to, from) => {
  // Apply admin layout to all /admin routes
  if (to.path.startsWith('/admin')) {
    console.log('Setting admin layout for:', to.path);
    setPageLayout('admin');
  }
});

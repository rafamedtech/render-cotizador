export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  if (user.value) {
    return;
  }
  return navigateTo('/login');
});

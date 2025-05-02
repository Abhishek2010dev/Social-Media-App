export default defineNuxtRouteMiddleware(async (to) => {
  if (to.matched.length === 0) return;
  const { data } = await useAuthClient().useSession(useFetch);

  const isAuthRoute = to.path.startsWith("/auth");

  if (!data.value && !isAuthRoute) {
    return navigateTo("/auth/login");
  }

  if (data.value && isAuthRoute) {
    return navigateTo("/");
  }
});

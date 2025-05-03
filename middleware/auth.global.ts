import { useAuthUserData } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authUserData = useAuthUserData();

  if (to.matched.length === 0) return;

  if (!authUserData.data) {
    await authUserData.fetchUser();
  }

  const isAuthRoute = to.path.startsWith("/auth");

  if (!authUserData.data && !isAuthRoute) {
    return navigateTo("/auth/login");
  }

  if (authUserData.data && isAuthRoute) {
    return navigateTo("/");
  }
});

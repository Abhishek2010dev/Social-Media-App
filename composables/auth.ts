import { createAuthClient } from "better-auth/vue";

export const useAuthClient = () => {
  return createAuthClient({
    plugins: [],
  });
};

export const useAuthUser = async () => {
  const authClient = useAuthClient();
  return (await authClient.useSession(useFetch)).data.value?.user;
};

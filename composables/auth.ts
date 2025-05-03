import { createAuthClient } from "better-auth/vue";

export const useAuthClient = () => {
  return createAuthClient({
    plugins: [],
  });
};

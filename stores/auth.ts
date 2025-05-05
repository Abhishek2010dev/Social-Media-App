import { defineStore } from "pinia";
import type { AuthUser } from "~/shared/types/auth";

export const useAuthUserData = defineStore("user-data", {
  state() {
    return {
      data: null as AuthUser | null | undefined,
    };
  },
  actions: {
    async fetchUser() {
      this.data = (await useAuthClient().useSession(useFetch)).data.value?.user;
    },
  },
});

import { defineStore } from "pinia";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

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

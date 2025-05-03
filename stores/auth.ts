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
      const { data } = await useAuthClient().useSession(useFetch);
      this.data = data.value?.user;
    },
  },
});

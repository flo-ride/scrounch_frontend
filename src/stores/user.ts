import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            connected: false,
            id: undefined as string | undefined,
            username: undefined as string | undefined,
            email: undefined as string | undefined,
            name: undefined as string | undefined,
        };
    },
});

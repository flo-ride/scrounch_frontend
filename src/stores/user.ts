import { User } from "@/types/User";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            connected: false,
            user: undefined as User | undefined,
        };
    },
});

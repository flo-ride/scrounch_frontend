import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            connected: false,
            id: undefined as typeof uuid | undefined,
            username: undefined as string | undefined,
            email: undefined as string | undefined,
            name: undefined as string | undefined,
            is_admin: undefined as boolean | undefined,
        };
    },
});

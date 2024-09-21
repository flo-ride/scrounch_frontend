<template>
    <v-app-bar>
        <template v-slot:prepend>
            <div v-if="theme.global.name.value == 'dark'">
                <v-img aspect-ratio="1/1" width="80" cover src="@/assets/logo-white.svg">
                    <template v-slot:placeholder>
                        <v-skeleton-loader
                            class="d-flex align-center justify-center fill-height"
                            type="list-item-avatar"
                        ></v-skeleton-loader>
                    </template>
                </v-img>
            </div>
            <div v-else>
                <v-img aspect-ratio="1/1" width="80" cover src="@/assets/logo.svg">
                    <template v-slot:placeholder>
                        <v-skeleton-loader
                            class="d-flex align-center justify-center fill-height"
                            type="list-item-avatar"
                        ></v-skeleton-loader>
                    </template>
                </v-img>
            </div>
        </template>
        <template v-slot:append>
            <v-btn
                :icon="themeName == `dark` ? `fa-solid fa-sun` : `fa-solid fa-moon`"
                @click="toggleTheme"
            >
            </v-btn>
            <v-btn
                v-if="!userStore.connected"
                @click="login"
                variant="tonal"
                prepend-icon="fa-brands fa-microsoft"
                :loading="loginLoading"
                :disabled="loginLoading"
                icon="fa-solid fa-right-to-bracket"
            >
            </v-btn>
            <v-avatar v-else color="blue">
                {{ nameInitials }}
            </v-avatar>
        </template>
    </v-app-bar>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/user";
import { useTheme } from "vuetify";
import { defineComponent } from "vue";

import type { AxiosInstance } from "axios";

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $backendUrl: string;
    }
}

export default defineComponent({
    data() {
        return {
            loginLoading: false,
        };
    },
    methods: {
        async login() {
            this.loginLoading = true;
            let res = await this.$axios.get("/me");
            if (res.status != 200) {
                window.location.href = `${this.$backendUrl}/login`;
            }
            this.loginLoading = false;
        },
    },
    computed: {
        userStore: () => useUserStore(),
        nameInitials() {
            return this.userStore.name
                ?.split(" ")
                .map((w: String) => w[0])
                .join("")
                .toUpperCase();
        },
        themeName(): string {
            return this.theme.global.name.value;
        },
    },
    setup() {
        const theme = useTheme();

        const toggleTheme = () => {
            theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
        };

        return {
            theme,
            toggleTheme,
        };
    },
});
</script>

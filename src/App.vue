<template>
    <v-app>
        <div v-if="serverIsUp">
            <v-app-bar>
                <template v-slot:prepend>
                    <v-img aspect-ratio="1/1" width="80" cover src="@/assets/logo.svg">
                        <template v-slot:placeholder>
                            <v-skeleton-loader
                                class="d-flex align-center justify-center fill-height"
                                type="list-item-avatar"
                            ></v-skeleton-loader>
                        </template>
                    </v-img>
                </template>
                <template v-slot:append>
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
        </div>
        <RouterView />
    </v-app>
</template>

<script lang="ts">
import type { AxiosInstance } from "axios";
import { useUserStore } from "@/stores/user";
import type { User } from "@/types/User";
import type { Router } from "vue-router";

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $backendUrl: string;
        $router: Router;
    }
}

export default {
    data() {
        return {
            serverIsUp: true,
            loginLoading: false,
            userStore: useUserStore(),
        };
    },
    methods: {
        isBackendUp() {
            this.$axios
                .get("/status")
                .then((res) => {
                    if (res.status != 200 || res.data != "UP") {
                        this.serverIsUp = false;
                        this.$router.push("/unavailable");
                    }
                })
                .catch((_err) => {
                    this.serverIsUp = false;
                    this.$router.push("/unavailable");
                });
        },
        isLoggedIn() {
            this.$axios
                .get<User>("/me")
                .then((res) => {
                    if (res.status == 200) {
                        this.userStore.connected = true;
                        this.userStore.username = res.data.username;
                        this.userStore.name = res.data.name;
                        this.userStore.email = res.data.email;
                        this.userStore.id = res.data.id;
                    } else {
                        this.userStore.connected = false;
                        this.userStore.username = undefined;
                        this.userStore.name = undefined;
                        this.userStore.email = undefined;
                        this.userStore.id = undefined;
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
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
        nameInitials() {
            return this.userStore.name
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase();
        },
    },
    mounted() {
        this.isBackendUp();
        this.isLoggedIn();
    },
};
</script>

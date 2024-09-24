<template>
    <v-app>
        <div v-if="serverIsUp">
            <MainToolbarVue />
        </div>
        <RouterView />
    </v-app>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/user";
import type { User } from "@/types/User";
import MainToolbarVue from "@/components/MainToolbar.vue";

export default {
    data() {
        return {
            serverIsUp: true,
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
                        this.userStore.is_admin = res.data.is_admin;
                    } else {
                        this.userStore.connected = false;
                        this.userStore.username = undefined;
                        this.userStore.name = undefined;
                        this.userStore.email = undefined;
                        this.userStore.id = undefined;
                        this.userStore.is_admin = undefined;
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    },
    components: {
        MainToolbarVue,
    },
    mounted() {
        this.isBackendUp();
        this.isLoggedIn();
    },
};
</script>

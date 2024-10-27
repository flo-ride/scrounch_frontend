<template>
    <v-app>
        <header>
            <div v-if="serverIsUp && userStore.is_banned != true">
                <MainToolbarVue />
            </div>
        </header>
        <v-main>
            <RouterView />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/user";
import { useProductStore } from "@/stores/product";
import type { User } from "@/types/User";
import MainToolbarVue from "@/components/MainToolbar.vue";

export default {
    data() {
        return {
            serverIsUp: true,
        };
    },
    computed: {
        userStore: () => useUserStore(),
        productStore: () => useProductStore(),
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
                        this.userStore.is_banned = res.data.is_banned;

                        if (this.userStore.is_banned) {
                            this.$router.push("/ban");
                        }
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
        this.productStore.fetch_all_products(this.$axios);
    },
};
</script>

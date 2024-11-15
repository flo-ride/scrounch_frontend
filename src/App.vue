<template>
    <v-app>
        <header>
            <div v-if="serverIsUp && userStore.user?.isBanned != true">
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
import MainToolbarVue from "@/components/MainToolbar.vue";
import { User } from "./types/User";

export default {
    data() {
        return {
            serverIsUp: true,
        };
    },
    computed: {
        userStore: () => useUserStore(),
    },
    methods: {
        isBackendUp() {
            this.$miscApi
                .getStatus()
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
            this.$userApi
                .getMe()
                .then((res) => {
                    if (res.status == 200) {
                        this.userStore.connected = true;
                        this.userStore.user = User.fromResponse(res.data);

                        if (this.userStore.user?.isBanned) {
                            this.$router.push("/ban");
                        }
                    } else {
                        this.userStore.connected = false;
                        this.userStore.user = undefined;
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

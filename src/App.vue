<script setup lang="ts">
import MainToolbarVue from "@/components/MainToolbar.vue";
import { inject, watch } from "vue";
import { MiscApi, UserApi } from "@/api";
import { useRouter } from "vue-router";
import { useQueryStatus } from "@/query/misc";
import { useQueryMe } from "./query/user";

const router = useRouter();
const userApi = inject("userApi", new UserApi());
const miscApi = inject("miscApi", new MiscApi());
const { isSuccess, isError } = useQueryStatus(miscApi);
const { data } = useQueryMe(userApi);

watch(isError, () => {
    router.push("/unavailable");
});

watch(data, (data) => {
    if (!data) return;
    if (data.isBanned) router.push("/ban");
});
</script>

<template>
    <v-app>
        <header>
            <div v-if="isSuccess && !data?.isBanned">
                <MainToolbarVue />
            </div>
        </header>
        <v-main>
            <RouterView />
        </v-main>
    </v-app>
</template>

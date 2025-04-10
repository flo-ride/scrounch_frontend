<script setup lang="ts">
import { inject, watch } from "vue";
import { MiscApi } from "@/api";
import { useRouter } from "vue-router";
import { useQueryStatus } from "@/query/misc";

const router = useRouter();
const miscApi = inject("miscApi", new MiscApi());
const { isSuccess } = useQueryStatus(miscApi);

watch(isSuccess, () => {
    router.push("/");
});
</script>

<template>
    <v-empty-state
        headline="Whoops"
        text="There might be a problem with your connection or our servers. Please check your internet connection or try again later. We appreciate your patience."
        title="Something Went Wrong"
    ></v-empty-state>
</template>

<script setup lang="ts">
import { UserApi } from "@/api";
import { useQueryMe } from "@/query/user";
import { inject, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userApi = inject("userApi", new UserApi());
const { data, isSuccess } = useQueryMe(userApi);

watch(isSuccess, () => {
    if (data.value?.isAdmin) return;
    router.push("/");
});

const select = ref("product");
</script>

<template>
    <v-tabs v-model="select" align-tabs="center" stacked class="position-sticky">
        <v-tab value="product" to="/admin/product">
            <v-icon icon="fa-solid fa-mug-hot"></v-icon>
            {{ $t("admin.product.toolbarTitle") }}
        </v-tab>
        <v-tab value="user" to="/admin/user">
            <v-icon icon="fa-solid fa-user"></v-icon>
            {{ $t("admin.user.toolbarTitle") }}
        </v-tab>
        <v-tab value="delivery" to="/admin/delivery">
            <v-icon icon="fa-solid fa-truck"></v-icon>
            {{ $t("admin.delivery.toolbarTitle") }}
        </v-tab>
        <v-tab value="warehouse" to="/admin/warehouse">
            <v-icon icon="fa-solid fa-warehouse"></v-icon>
            {{ $t("admin.warehouse.toolbarTitle") }}
        </v-tab>
        <v-tab value="order" to="/admin/order">
            <v-icon icon="fa-solid fa-basket-shopping"></v-icon>
            {{ $t("admin.order.toolbarTitle") }}
        </v-tab>
        <v-tab value="money" to="/admin/money">
            <v-icon icon="fa-solid fa-money-bill"></v-icon>
            {{ $t("admin.money.toolbarTitle") }}
        </v-tab>
        <v-tab value="location" to="/admin/location">
            <v-icon icon="fa-solid fa-location-dot"></v-icon>
            {{ $t("admin.location.toolbarTitle") }}
        </v-tab>
        <v-tab value="announcement" to="/admin/announcement">
            <v-icon icon="fa-solid fa-bullhorn"></v-icon>
            {{ $t("admin.announcement.toolbarTitle") }}
        </v-tab>
        <v-tab value="import" to="/admin/import">
            <v-icon icon="fa-solid fa-file-import"></v-icon>
            {{ $t("admin.import.toolbarTitle") }}
        </v-tab>
        <v-tab value="log" to="/admin/log">
            <v-icon icon="fa-solid fa-book"></v-icon>
            {{ $t("admin.log.toolbarTitle") }}
        </v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <router-view></router-view>
</template>

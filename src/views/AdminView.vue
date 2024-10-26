<template>
    <div v-if="userStore.is_admin == true">
        <v-tabs v-model="select" align-tabs="center" stacked>
            <v-tab value="product">
                <v-icon icon="fa-solid fa-mug-hot"></v-icon>
                {{ $t("admin.product.toolbarTitle") }}
            </v-tab>
            <v-tab value="user">
                <v-icon icon="fa-solid fa-user"></v-icon>
                {{ $t("admin.user.toolbarTitle") }}
            </v-tab>
            <v-tab value="delivery">
                <v-icon icon="fa-solid fa-truck"></v-icon>
                {{ $t("admin.delivery.toolbarTitle") }}
            </v-tab>
            <v-tab value="order">
                <v-icon icon="fa-solid fa-basket-shopping"></v-icon>
                {{ $t("admin.order.toolbarTitle") }}
            </v-tab>
            <v-tab value="location">
                <v-icon icon="fa-solid fa-location-dot"></v-icon>
                {{ $t("admin.location.toolbarTitle") }}
            </v-tab>
            <v-tab value="announcement">
                <v-icon icon="fa-solid fa-bullhorn"></v-icon>
                {{ $t("admin.announcement.toolbarTitle") }}
            </v-tab>
            <v-tab value="import">
                <v-icon icon="fa-solid fa-file-import"></v-icon>
                {{ $t("admin.import.toolbarTitle") }}
            </v-tab>
        </v-tabs>
        <v-divider></v-divider>
        <v-tabs-window v-model="select" class="pa-2">
            <v-tabs-window-item value="product">
                <ProductView />
            </v-tabs-window-item>

            <v-tabs-window-item value="user">
                <div class="d-flex justify-center align-center">TODO</div>
            </v-tabs-window-item>

            <v-tabs-window-item value="delivery">
                <div class="d-flex justify-center align-center">TODO</div>
            </v-tabs-window-item>

            <v-tabs-window-item value="order">
                <div class="d-flex justify-center align-center">TODO</div>
            </v-tabs-window-item>

            <v-tabs-window-item value="location">
                <div class="d-flex justify-center align-center">TODO</div>
            </v-tabs-window-item>

            <v-tabs-window-item value="announcement">
                <div class="d-flex justify-center align-center">TODO</div>
            </v-tabs-window-item>

            <v-tabs-window-item value="import">
                <ImportView />
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>

<script lang="ts">
import ProductView from "@/components/admin/product/ProductView.vue";
import ImportView from "@/components/admin/import/ImportView.vue";
import { useUserStore } from "@/stores/user";

export default {
    data() {
        return {
            select: String,
        };
    },
    computed: {
        userStore: () => useUserStore(),
    },
    components: {
        ProductView,
        ImportView,
    },
    mounted() {
        if (this.userStore.is_admin != true) {
            this.$router.push("/");
        }
    },
};
</script>

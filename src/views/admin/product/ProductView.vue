<script setup lang="ts">
import { ref } from "vue";

const type = ref("grid");
</script>

<template>
    <div>
        <v-tabs v-model="type" align-tabs="center" class="mb-5">
            <v-tab to="/admin/product/grid" value="grid">
                <v-icon icon="fa-solid fa-border-all"></v-icon>
                Grid
            </v-tab>
            <v-tab to="/admin/product/list" value="list">
                <v-icon icon="fa-solid fa-list"></v-icon>
                List
            </v-tab>
        </v-tabs>
        <v-row justify="center">
            <v-btn prepend-icon="fa-solid fa-circle-plus" to="/admin/product/new">
                {{ $t("admin.product.add.title") }}
            </v-btn>
        </v-row>
        <RouterView />
    </div>
</template>

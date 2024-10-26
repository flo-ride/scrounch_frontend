<template>
    <div>
        <v-tabs v-model="type" align-tabs="center" class="mb-5">
            <v-tab value="grid">
                <v-icon icon="fa-solid fa-border-all"></v-icon>
                Grid
            </v-tab>
            <v-tab value="list">
                <v-icon icon="fa-solid fa-list"></v-icon>
                List
            </v-tab>
        </v-tabs>
        <v-row>
            <v-col cols="6" offset="3">
                <CreateDialog v-model="createDialog" />
            </v-col>
            <v-col
                v-if="type == 'list'"
                v-for="product in productStore.products"
                :key="product.id"
                cols="12"
                sm="6"
                md="4"
            >
                <v-card
                    :color="product.disabled ? 'error' : undefined"
                    :variant="product.disabled ? 'outlined' : undefined"
                >
                    <v-card-title>{{ product.name }} ({{ product.price }}€)</v-card-title>
                    <v-card-subtitle>id: {{ product.id }}</v-card-subtitle>
                    <v-card-text>
                        <v-img
                            v-if="product.image"
                            :src="imageSrcUrl(product.image)"
                            height="200px"
                            aspect-ratio="1/1"
                        >
                            <template v-slot:placeholder>
                                <v-skeleton-loader :elevation="24" type="card"></v-skeleton-loader>
                            </template>
                        </v-img>
                        <p v-if="product.quantity">
                            {{ $t("admin.product.quantity") }}: {{ product.quantity }}
                        </p>
                        <p v-if="product.max_quantity_per_command">
                            {{ $t("admin.product.maxPerCommand") }}:
                            {{ product.max_quantity_per_command }}
                        </p>
                        <p v-if="product.sma_code">
                            {{ $t("admin.product.sma") }}: {{ product.sma_code }}
                        </p>
                        <p>
                            {{ $t("admin.product.creationDate") }}:
                            {{ product.creation_time.toLocaleString() }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" v-if="type == 'grid'">
                <v-text-field
                    v-model="search"
                    label="Search"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    hide-details
                    single-line
                ></v-text-field>
            </v-col>
            <v-col v-if="type == 'grid'">
                <v-data-table
                    v-model:search="search"
                    :items="productStore.products"
                    item-value="id"
                >
                    <template v-slot:item.image="{ item }">
                        <v-card class="my-2" elevation="2" rounded>
                            <v-img :src="imageSrcUrl(item.image)" height="64" cover></v-img>
                        </v-card>
                    </template>

                    <template v-slot:item.price="{ item }">
                        <span>{{ item.price.toFixed(2) }} €</span>
                    </template>

                    <template v-slot:item.quantity="{ item }">
                        <span>{{ item.quantity ?? $t("common.notSpecified") }}</span>
                    </template>

                    <template v-slot:item.max_quantity_per_command="{ item }">
                        <span>{{
                            item.max_quantity_per_command ?? $t("common.notSpecified")
                        }}</span>
                    </template>

                    <template v-slot:item.sma_code="{ item }">
                        <span>{{ item.sma_code ?? $t("common.none") }}</span>
                    </template>

                    <template v-slot:item.disabled="{ item }">
                        <v-chip
                            :color="item.disabled == true ? 'red' : 'green'"
                            :text="
                                item.disabled == true ? $t('common.disable') : $t('common.enable')
                            "
                            class="text-uppercase"
                            size="small"
                            label
                        ></v-chip>
                    </template>

                    <template v-slot:item.creation_time="{ item }">
                        <span>{{ item.creation_time.toLocaleString("fr-FR") }}</span>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import CreateDialog from "@/components/admin/product/CreateDialog.vue";
// @ts-ignore
import { useProductStore } from "@/stores/product";

export default {
    data() {
        return {
            createDialog: false,
            search: "",
            type: "list",
        };
    },
    computed: {
        productStore: () => useProductStore(),
    },
    methods: {
        imageSrcUrl: (imageName: string | undefined) => {
            // @ts-ignore
            let backendUrl = window.env.BACKEND_URL;
            return `${backendUrl}/download/${imageName}?type=product`;
        },
    },
    components: {
        CreateDialog,
    },
    mounted() {
        // @ts-ignore
        this.productStore.fetch_all_products(this.$axios);
    },
};
</script>

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
                <CreateDialog v-model="createItem" @is-done="refresh" />
            </v-col>
            <v-col cols="3"> </v-col>

            <v-col
                v-if="type == 'list'"
                v-for="product in serverItems"
                :key="product.id"
                cols="12"
                sm="6"
                md="4"
                lg="2"
            >
                <v-card
                    :color="product.disabled ? 'error' : undefined"
                    :variant="product.disabled ? 'outlined' : undefined"
                    @click="updateProduct(product)"
                >
                    <v-card-title>{{ product.name }} ({{ product.sellPrice }}€)</v-card-title>
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
                        <p v-if="product.maxQuantityPerCommand">
                            {{ $t("admin.product.maxPerCommand") }}:
                            {{ product.maxQuantityPerCommand }}
                        </p>
                        <p v-if="product.smaCode">
                            {{ $t("admin.product.sma") }}: {{ product.smaCode }}
                        </p>
                        <p>
                            {{ $t("admin.product.creationDate") }}:
                            {{ product.createdAt.toLocaleString() }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" v-if="type == 'list'">
                <v-pagination v-model="page" :length="totalPage" :total-visible="3"></v-pagination>
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
                <v-data-table-server
                    :headers="headers"
                    v-model:search="search"
                    v-model:items-per-page="itemsPerPage"
                    :page="page"
                    :items="serverItems"
                    :items-length="totalItems"
                    @update:options="loadItems"
                    item-value="id"
                >
                    <template v-slot:item.image="{ item }">
                        <v-card class="my-2" elevation="2" rounded>
                            <v-img :src="imageSrcUrl(item.image)" height="64" cover></v-img>
                        </v-card>
                    </template>

                    <template v-slot:item.price="{ item }">
                        <span
                            >{{ item.sellPrice.toFixed(2) }}
                            {{ $t("common.currency.symbol." + item.sellPriceCurrency.type) }}</span
                        >
                    </template>

                    <template v-slot:item.unit="{ item }">
                        <span>
                            {{ $t("common.unit." + item.unit.type) }} ({{
                                $t("common.unit.symbol." + item.unit.type)
                            }})
                        </span>
                    </template>

                    <template v-slot:item.max_quantity_per_command="{ item }">
                        <span>{{ item.maxQuantityPerCommand ?? $t("common.notSpecified") }}</span>
                    </template>

                    <template v-slot:item.sma_code="{ item }">
                        <span>{{ item.smaCode ?? $t("common.none") }}</span>
                    </template>

                    <template v-slot:item.params="{ item }">
                        <v-chip
                            :color="item.purchasable == false ? 'red' : 'green'"
                            :text="item.purchasable == true ? 'Purchasable' : 'Non Purchasable'"
                            class="text-uppercase"
                            size="small"
                            label
                        ></v-chip>
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

                    <template v-slot:item.created_at="{ item }">
                        <span>{{ item.createdAt.toLocaleString("fr-FR") }}</span>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-btn
                            icon="fa-solid fa-pen-to-square"
                            @click="updateProduct(item)"
                        ></v-btn>
                        <v-btn icon="fa-solid fa-trash" @click="deleteProduct(item)"></v-btn>
                    </template>
                </v-data-table-server>
            </v-col>
        </v-row>
    </div>
    <EditDialog v-model="editItem" :item="selected" @is-done="refresh" />
    <DeleteDialog v-model="deleteItem" :item="selected" @is-done="refresh" />
</template>

<script lang="ts">
import CreateDialog from "@/components/admin/product/CreateDialog.vue";
import EditDialog from "@/components/admin/product/EditDialog.vue";
import DeleteDialog from "@/components/admin/product/DeleteDialog.vue";
import { Product } from "@/types/Product";

export default {
    data() {
        return {
            createItem: false,
            loading: false,
            editItem: false,
            deleteItem: false,
            selected: undefined as undefined | Product,
            serverItems: [] as Product[],
            page: 1,
            totalPage: 1,
            totalItems: 0,
            itemsPerPage: 20,
            search: "",
            type: "grid",
            headers: [
                {
                    title: "Id",
                    sortable: true,
                    key: "id",
                },
                {
                    title: "Product Name",
                    sortable: true,
                    key: "name",
                },
                {
                    title: "Image",
                    key: "image",
                    sortable: false,
                },
                {
                    title: "Price",
                    key: "price",
                    sortable: true,
                },
                {
                    title: "Unit",
                    key: "unit",
                    sortable: true,
                },
                {
                    title: "Max Quantity per Order",
                    key: "max_quantity_per_command",
                    sortable: true,
                },
                {
                    title: "Sma Code",
                    key: "sma_code",
                    sortable: true,
                },
                {
                    title: "Creation Time",
                    key: "created_at",
                    sortable: true,
                },
                {
                    title: "Params",
                    key: "params",
                    sortable: false,
                },
                {
                    title: "Disable",
                    key: "disabled",
                    sortable: false,
                },
                {
                    title: "Actions",
                    key: "actions",
                    sortable: false,
                },
            ],
        };
    },
    computed: {},
    watch: {
        page(newPage, _oldPage) {
            this.loadItems({ page: newPage, itemsPerPage: this.itemsPerPage });
        },
    },
    methods: {
        loadItems({ page, itemsPerPage }: { page: number; itemsPerPage: number }): void {
            this.loading = true;
            this.$productApi.getAllProducts(page - 1, itemsPerPage).then((res) => {
                this.serverItems = res.data.products.map((x) => Product.fromResponse(x));
                this.totalItems = res.data.total_page * itemsPerPage;
                this.totalPage = res.data.total_page;
                this.loading = false;
            });
        },
        imageSrcUrl: (imageName: string | undefined) => {
            // @ts-ignore
            let backendUrl = window.env.BACKEND_URL;
            return `${backendUrl}/download/${imageName}?type=product`;
        },
        updateProduct(product: Product) {
            this.editItem = true;
            this.selected = product;
        },
        deleteProduct(product: Product) {
            this.deleteItem = true;
            this.selected = product;
        },
        refresh() {
            this.loadItems({ page: this.page, itemsPerPage: this.itemsPerPage });
        },
    },
    components: {
        CreateDialog,
        EditDialog,
        DeleteDialog,
    },
    mounted() {},
};
</script>

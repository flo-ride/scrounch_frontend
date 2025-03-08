<template>
    <div>
        <v-row align="center">
            <v-col cols="6" offset="3">
                <CreateDialog v-model="createItem" @is-done="refresh" />
            </v-col>
            <v-col cols="3"> </v-col>
        </v-row>
        <v-row>
            <v-col cols="6" offset="3">
                <div class="d-flex justify-center align-center">
                    <CreateDialogProduct
                        v-model="addItem"
                        :item="selectedWarehouse"
                        @is-done="refresh"
                    />
                    <EditDialog v-model="editItem" :item="selectedWarehouse" @is-done="refresh" />
                    <DeleteDialog
                        v-model="deleteItem"
                        :item="selectedWarehouse"
                        @is-done="refresh"
                    />
                </div>
            </v-col>
            <v-col cols="1"> </v-col>
            <v-col cols="10" offset="1">
                <div
                    key="title"
                    class="text-h6 font-weight-light pa-4 text-center"
                    v-if="items.length == 0"
                >
                    {{ $t("admin.warehouse.empty") }}
                </div>

                <v-treeview
                    min-width="200"
                    rounded="lg"
                    v-else
                    :items="items"
                    :load-children="fetchWarehouse"
                    activatable
                    active-strategy="single-independent"
                    transition
                    v-model:activated="active"
                >
                    <template v-slot:prepend="{ item }">
                        <v-icon>
                            {{
                                item.type == "warehouse"
                                    ? "fa-solid fa-warehouse"
                                    : item.type == "product"
                                      ? "fa-solid fa-carrot"
                                      : ""
                            }}
                        </v-icon>
                    </template>
                </v-treeview>
            </v-col>
            <v-col cols="12">
                <v-pagination v-model="page" :length="totalPage" :total-visible="3"></v-pagination>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import CreateDialogProduct from "@/components/admin/warehouse/product/CreateDialog.vue";
import CreateDialog from "@/components/admin/warehouse/CreateDialog.vue";
import EditDialog from "@/components/admin/warehouse/EditDialog.vue";
import DeleteDialog from "@/components/admin/warehouse/DeleteDialog.vue";
import { Warehouse } from "@/types/Warehouse";
import { WarehouseProduct } from "@/types/WarehouseProduct";

export default {
    data() {
        return {
            page: 1,
            totalPage: 1,

            createItem: false,
            loading: false,

            addItem: false,
            editItem: false,
            deleteItem: false,

            items: [] as { value: string; title: string; type: string }[],
            warehouses: [] as Warehouse[],
            totalItems: 0,
            itemsPerPage: 5,
            search: "",
            active: [],
        };
    },
    watch: {
        page(newPage, _oldPage) {
            this.loadWarehouse({ page: newPage, itemsPerPage: this.itemsPerPage });
        },
    },
    computed: {
        selectedWarehouse() {
            if (!this.active.length) return undefined;
            const warehouse = this.warehouses.find((recipe) => recipe.id == this.active[0]);

            return warehouse;
        },
    },
    methods: {
        async fetchWarehouse(item: any) {
            this.$warehouseApi
                .getAllWarehouseProducts({
                    warehouseId: item.value,
                    perPage: 1000, // TODO: Should an dynamic loading with an infinite scroller maybe ?
                })
                .then((res) =>
                    res.data.products.map((product) => WarehouseProduct.fromResponse(product)),
                )
                .then((products) =>
                    products.map((product) => {
                        return {
                            title: `${product.product.name} × ${product.quantity}`,
                            value: product.product.id,
                            type: "product",
                        };
                    }),
                )
                .then((product) => item.children.push(...product))
                .catch((err) => console.warn(err));
        },
        loadWarehouse({
            page,
            itemsPerPage,
        }: {
            page: number;
            itemsPerPage: number;
            sortBy?: any;
        }): void {
            this.loading = true;

            this.loading = true;
            this.$warehouseApi
                .getAllWarehouses({ page: page - 1, perPage: itemsPerPage })
                .then((res) => {
                    this.page = page;
                    this.totalPage = res.data.total_page;
                    this.totalItems = res.data.total_page * itemsPerPage;
                    this.warehouses = res.data.warehouses.map((x) => Warehouse.fromResponse(x));
                    this.items = this.warehouses.map((warehouse) => {
                        return {
                            title: warehouse.name,
                            value: warehouse.id,
                            type: "warehouse",
                            children: [],
                        };
                    });
                    this.loading = false;

                    if (res.data.warehouses.length == 0 && this.page > 1) {
                        this.page -= 1;
                        this.totalPage -= 1;
                        this.refresh();
                    }
                });
        },
        timeSinceCreation(creationTimeString: string) {
            const creationTime = new Date(creationTimeString);

            return creationTime.toLocaleString("fr-FR");
        },
        updateWarehouse(warehouse: Warehouse) {
            this.editItem = true;
            this.selectedWarehouse = warehouse;
        },
        deleteWarehouse(warehouse: Warehouse) {
            this.deleteItem = true;
            this.selectedWarehouse = warehouse;
        },
        refresh() {
            this.loadWarehouse({ page: this.page, itemsPerPage: this.itemsPerPage });
        },
    },
    components: {
        CreateDialogProduct,
        CreateDialog,
        EditDialog,
        DeleteDialog,
    },
    mounted() {
        this.loadWarehouse({ page: 1, itemsPerPage: this.itemsPerPage });
    },
};
</script>

<template>
    <CreateDialogForm
        v-model="show"
        :title="$t('common.add')"
        icon="fa-solid fa-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="createItem"
    >
        <template v-slot:activator="{ activator }">
            <v-btn
                class="ma-2"
                v-bind="activator"
                :disabled="item.id.length == 0"
                variant="tonal"
                append-icon="fa-solid fa-add"
                :text="$t('common.add')"
            ></v-btn>
        </template>
        <template #form-content>
            <v-autocomplete
                v-model="warehouseProduct.product.id"
                :label="$t('admin.warehouse.product.add.product')"
                :items="productItems"
                :custom-filter="customFilter"
                :rules="productRules"
                required
            ></v-autocomplete>

            <v-number-input
                class="ma-2"
                min-width="120"
                v-model="warehouseProduct.quantity"
                :min="0.0"
                :max="10000.0"
                :step="1"
                :label="$t('admin.warehouse.product.add.quantity')"
                :hideInput="false"
                controlVariant="stacked"
                :inset="false"
                required
            ></v-number-input>
        </template>
    </CreateDialogForm>
</template>

<script lang="ts">
import CreateDialogForm from "@/components/admin/CreateDialogForm.vue";
import type { Product } from "@/types/Product";
import { Warehouse } from "@/types/Warehouse";
import { WarehouseProduct } from "@/types/WarehouseProduct";

export default {
    data: () => ({
        loading: false,
        productItems: [] as any[],
        warehouseProduct: WarehouseProduct.default(),
        nameRules: [
            (value: String) =>
                value?.length > 32 ? "Name must not be longer than 32 characters" : true,
        ],
        productRules: [(value: String) => (value?.length == 0 ? "Product mut be present" : true)],
        ingredientRules: [
            (value: String) => (value?.length == 0 ? "Ingredient mut be present" : true),
        ],
    }),
    props: {
        modelValue: Boolean,
        item: {
            type: Warehouse,
            required: true,
            default: () => Warehouse.default() as Warehouse,
        },
    },
    computed: {
        show: {
            get(): boolean {
                return this.modelValue;
            },
            set(value: boolean) {
                this.$emit("update:modelValue", value);
            },
        },

        itemProduct(item: WarehouseProduct): Product | undefined {
            return this.productItems.find((x) => x.value == item.product.id);
        },
    },
    watch: {
        productId: {
            immediate: true,
            handler(item) {
                this.warehouseProduct.product.id = item;
            },
        },
    },
    emits: ["isDone", "update:modelValue"],
    methods: {
        getProductUnit(item: WarehouseProduct): string {
            if (item == undefined || item.product.id.length == 0) {
                return "";
            } else {
                let product = this.productItems.find((x) => x.value == item.product.id);
                if (product == undefined) {
                    return "";
                }
                return this.$t("common.unit.symbol." + product.product.unit) ?? "";
            }
        },
        async createItem() {
            this.loading = true;
            try {
                await this.$warehouseApi.postNewWarehouseProduct({
                    productId: this.warehouseProduct.product.id,
                    warehouseId: this.item.id,
                    newWarehouseProductRequest: this.warehouseProduct.toNewRequest(),
                });
                this.show = false;
                // @ts-ignore
                this.$refs.dialogRef.clearForm();
                this.$emit("isDone");
            } catch (err) {
                // @ts-ignore
                this.$refs.dialogRef.openError({});
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        customFilter(_itemTitle: string, queryText: string, item: any) {
            if (item.raw.value == this.warehouseProduct.product.id) return false;

            const textOne = item.raw.title.toLowerCase();
            const searchText = queryText.toLowerCase();

            return textOne.indexOf(searchText) > -1;
        },
        async searchProduct() {
            this.productItems = [];
            this.loading = true;
            this.$productApi.getAllProducts({ page: 0, perPage: 20 }).then((response) => {
                this.productItems = this.productItems.concat(
                    response.data.products.map((product) => {
                        return { title: product.name, value: product.id, product: product };
                    }),
                );
                let total_page = response.data.total_page;
                let futures = [];
                for (let i = 1; i < total_page; i++) {
                    futures.push(
                        this.$productApi
                            .getAllProducts({ page: i, perPage: 20 })
                            .then((response) => {
                                this.productItems = this.productItems.concat(
                                    response.data.products.map((product) => {
                                        return {
                                            title: product.name,
                                            value: product.id,
                                            product: product,
                                        };
                                    }),
                                );
                            }),
                    );
                }
                Promise.all(futures).finally(() => (this.loading = false));
            });
        },
    },
    mounted() {
        this.searchProduct();
    },
    components: {
        CreateDialogForm,
    },
};
</script>

<script setup lang="ts">
import { ProductApi, WarehouseApi, WarehouseProductSortEnum, WarehouseSortEnum } from "@/api";
import { Warehouse } from "@/types/Warehouse";
import { inject, ref, watch, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import {
    useDeleteWarehouse,
    useMutateWarehouse,
    useMutateWarehouseProduct,
    useQueryWarehouse,
    useQueryWarehouseProducts,
} from "@/query/warehouse";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import DetailLink from "@/components/admin/DetailLink.vue";
import WarehouseDetail from "@/components/admin/warehouse/WarehouseDetail.vue";
import { TypeEnum } from "@/types/Main";
import { useQueryProducts } from "@/query/product";
import { WarehouseProduct } from "@/types/WarehouseProduct";

const { id } = defineProps({ id: String });

const warehouseApi = inject("warehouseApi", new WarehouseApi());
const router = useRouter();

const { isLoading, isFetching, isError, data, refetch, error } = useQueryWarehouse(
    warehouseApi,
    id ?? "",
);
const {
    isPending: mutationPending,
    mutate: editWarehouse,
    isSuccess: isSuccessMutate,
} = useMutateWarehouse(warehouseApi);

const {
    isPending: deletionPending,
    mutate: deleteWarehouse,
    isSuccess: isSuccessDelete,
} = useDeleteWarehouse(warehouseApi);

let item = reactive(Warehouse.default());
let editing = ref(false);
let hasChanged = ref(false);
let isValid = ref(false);

const onUpdateEditing = (newEditing: boolean) => {
    editing.value = newEditing;
    hasChanged.value = false;
    if (newEditing == false && data.value) {
        onUpdateItem(data.value);
    }
};

const onUpdateItem = (value: Warehouse) => {
    Object.assign(item, value);
};

const onUpdateisValid = (value: boolean) => {
    isValid.value = value;
};

const saveItem = () => {
    editWarehouse(item);
};

const deleteItem = () => {
    if (!id) return;
    deleteWarehouse(id);
};

watch(isFetching, () => {
    if (!data.value) return;
    onUpdateItem(data.value);
});

watch(isSuccessDelete, () => {
    router.go(-1);
});

watch(item, (newValue) => {
    if (editing.value == true) {
        hasChanged.value = newValue != data.value;
    }
});

watch(isSuccessMutate, (isSuccess) => {
    if (isSuccess == false) return;
    editing.value = false;
});

watch(isError, () => {
    console.log(error.value);
});

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([WarehouseProductSortEnum.CreatedAtDesc]);

const { isLoading: isLoadingProducts, data: dataProducts } = useQueryWarehouseProducts(
    warehouseApi,
    id ?? "",
    page,
    itemsPerPage,
    sortBy,
);

const totalItems = computed(() => dataProducts.value.totalPage * itemsPerPage.value);

const loadItems = (options: { page: number; itemsPerPage: number; sortBy?: any }) => {
    page.value = options.page;
    itemsPerPage.value = options.itemsPerPage;

    if (!options.sortBy) return;
    const sort = options.sortBy.map(
        ({ key, order }: { key: string; order?: boolean | "asc" | "desc" }) => {
            if (order == undefined || order == false || order == "desc") {
                switch (key) {
                    case "product":
                        return WarehouseProductSortEnum.ProductIdDesc;
                    case "quantity":
                        return WarehouseProductSortEnum.QuantityDesc;
                    default:
                        return WarehouseProductSortEnum.CreatedAtDesc;
                }
            } else {
                switch (key) {
                    case "product":
                        return WarehouseProductSortEnum.ProductIdAsc;
                    case "quantity":
                        return WarehouseProductSortEnum.QuantityAsc;
                    default:
                        return WarehouseProductSortEnum.CreatedAtAsc;
                }
            }
        },
    );

    // sort.push(WarehouseProductSortEnum.CreatedAtDesc);
    sortBy.value = sort;
};

const headers = [
    {
        title: "Product",
        sortable: true,
        key: "product",
    },
    {
        title: "Quantity",
        sortable: true,
        key: "quantity",
    },
];

const dialog = ref(false);
let warehouseProductInit = WarehouseProduct.default();
warehouseProductInit.warehouseId = id ?? null;
const warehouseProduct = reactive(warehouseProductInit);

const { mutate, isSuccess: isSuccessProduct } = useMutateWarehouseProduct(warehouseApi, id ?? "");
const onSaveProduct = () => {
    mutate(warehouseProduct);
};

watch(isSuccessProduct, () => {
    dialog.value = false;
    refetch();
    Object.assign(warehouseProduct, warehouseProductInit);
});

const productApi = inject("productApi", new ProductApi());
const { data: dataProductsList } = useQueryProducts(productApi, 1, 1000, []);

const productItems = computed(() => {
    return dataProductsList.value.products.map((product) => {
        return {
            title: product.name,
            value: product.id,
            product: product,
        };
    });
});
</script>

<template>
    <v-overlay v-if="isLoading" v-model="isLoading" class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <v-empty-state
        v-else-if="isError"
        :headline="`Whoops`"
        :text="error?.message"
        title="Something Went Wrong"
        action-text="Go Back"
        @click:action="router.go(-1)"
    ></v-empty-state>
    <v-row v-else-if="item">
        <v-col cols="12">
            <DetailHeader
                :editing="editing"
                editable
                deletable
                refreshable
                exitable
                :refresh-loading="isFetching"
                :save-loading="mutationPending"
                :delete-loading="deletionPending"
                :is-saveable="hasChanged && isValid"
                @update:editing="onUpdateEditing"
                @on-delete="deleteItem"
                @on-refresh="refetch"
                @on-save="saveItem"
            />
        </v-col>
        <v-col cols="12">
            <WarehouseDetail
                class="ma-4"
                :item="item"
                :editing="editing"
                @update:item="onUpdateItem"
                @update:is-valid="onUpdateisValid"
            />
            <v-data-table-server
                :loading="isLoadingProducts"
                :headers="headers"
                v-model:search="search"
                v-model:items-per-page="itemsPerPage"
                :page="page"
                :items="dataProducts.products"
                :items-length="totalItems"
                @update:options="loadItems"
                item-value="id"
            >
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <v-icon
                                color="medium-emphasis"
                                icon="mdi-book-multiple"
                                size="x-small"
                                start
                            ></v-icon>

                            Products
                        </v-toolbar-title>

                        <v-btn
                            class="me-2"
                            prepend-icon="fa-solid fa-plus"
                            rounded="lg"
                            text="Add"
                            border
                            @click="dialog = true"
                        ></v-btn>
                    </v-toolbar>
                </template>

                <template v-slot:item.product="{ item }">
                    <DetailLink
                        v-if="item.productId"
                        :id="item.productId"
                        :type="TypeEnum.Product"
                    />
                </template>
            </v-data-table-server>
        </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="800">
        <v-card title="Add an Item">
            <template v-slot:text>
                <v-row>
                    <v-col cols="6">
                        <v-list-subheader class="mt-3">
                            {{ $t("admin.warehouse.field.selected") }}:
                        </v-list-subheader>
                    </v-col>

                    <v-col cols="6">
                        <v-autocomplete
                            v-model="warehouseProduct.productId"
                            :items="productItems"
                            required
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-list-subheader class="mt-3">
                            {{ $t("admin.warehouse.field.quantity") }}:
                        </v-list-subheader>
                    </v-col>

                    <v-col cols="6">
                        <v-number-input
                            v-model="warehouseProduct.quantity"
                            :min="0.0"
                            :max="10000.0"
                            :precision="2"
                            :step="0.01"
                            required
                        />
                    </v-col>
                </v-row>
            </template>

            <v-divider></v-divider>

            <v-card-actions class="bg-surface-light">
                <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

                <v-spacer></v-spacer>

                <v-btn text="Save" @click="onSaveProduct"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

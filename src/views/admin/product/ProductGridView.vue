<script setup lang="ts">
import { ProductApi, ProductSortEnum } from "@/api";
import { ImageApi } from "@/query/image";
import { useQueryProducts } from "@/query/product";
import { TypeEnum } from "@/types/Main";
import { computed } from "vue";
import { inject, ref } from "vue";
import DetailLink from "@/components/admin/DetailLink.vue";

const productApi = inject("productApi", new ProductApi());
const imageApi = inject("imageApi", new ImageApi());

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([ProductSortEnum.DisplayOrderDesc, ProductSortEnum.CreatedAtDesc]);

const { isLoading, data } = useQueryProducts(productApi, page, itemsPerPage, sortBy);

const totalItems = computed(() => data.value.totalPage * itemsPerPage.value);

const loadItems = (options: { page: number; itemsPerPage: number; sortBy?: any }) => {
    page.value = options.page;
    itemsPerPage.value = options.itemsPerPage;

    if (!options.sortBy) return;
    const sort = options.sortBy.map(
        ({ key, order }: { key: string; order?: boolean | "asc" | "desc" }) => {
            if (order == undefined || order == false || order == "desc") {
                switch (key) {
                    case "id":
                        return ProductSortEnum.IdDesc;
                    case "name":
                        return ProductSortEnum.NameDesc;
                    case "price":
                        return ProductSortEnum.SellPriceDesc;
                    case "unit":
                        return ProductSortEnum.UnitDesc;
                    case "max_quantity_per_command":
                        return ProductSortEnum.MaxQuantityPerCommandDesc;
                    case "created_at":
                        return ProductSortEnum.CreatedAtDesc;
                    default:
                        return ProductSortEnum.DisplayOrderDesc;
                }
            } else {
                switch (key) {
                    case "id":
                        return ProductSortEnum.IdAsc;
                    case "name":
                        return ProductSortEnum.NameAsc;
                    case "price":
                        return ProductSortEnum.SellPriceAsc;
                    case "unit":
                        return ProductSortEnum.UnitAsc;
                    case "max_quantity_per_command":
                        return ProductSortEnum.MaxQuantityPerCommandAsc;
                    case "created_at":
                        return ProductSortEnum.CreatedAtAsc;
                    default:
                        return ProductSortEnum.DisplayOrderAsc;
                }
            }
        },
    );

    sort.push(ProductSortEnum.DisplayOrderDesc);
    sort.push(ProductSortEnum.CreatedAtDesc);
    sortBy.value = sort;
};

const headers = [
    {
        title: "Product",
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
];
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
            ></v-text-field>
        </v-col>
        <v-col>
            <v-data-table-server
                :loading="isLoading"
                :headers="headers"
                v-model:search="search"
                v-model:items-per-page="itemsPerPage"
                :page="page"
                :items="data.products"
                :items-length="totalItems"
                @update:options="loadItems"
                item-value="id"
            >
                <template v-slot:item.name="{ item }">
                    <DetailLink v-if="item.id" :id="item.id" :type="TypeEnum.Product" />
                </template>
                <template v-slot:item.image="{ item }">
                    <v-card class="my-2" elevation="2" rounded>
                        <v-img
                            v-if="item.image"
                            :src="imageApi.getProductImageString(item.image)"
                            height="64"
                            cover
                        ></v-img>
                    </v-card>
                </template>

                <template v-slot:item.price="{ item }">
                    <span
                        >{{ item.sellPrice?.toFixed(2) }}
                        {{ $t("common.currency.symbol." + item.sellPriceCurrency?.type) }}</span
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
                        :text="item.disabled == true ? $t('common.disable') : $t('common.enable')"
                        class="text-uppercase"
                        size="small"
                        label
                    ></v-chip>
                </template>

                <template v-slot:item.created_at="{ item }">
                    <span>{{ item.createdAt.toLocaleString("fr-FR") }}</span>
                </template>
            </v-data-table-server>
        </v-col>
    </v-row>
</template>

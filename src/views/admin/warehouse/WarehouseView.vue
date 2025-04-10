<script setup lang="ts">
import { WarehouseApi, WarehouseSortEnum } from "@/api";
import { useQueryWarehouses } from "@/query/warehouse";
import { computed } from "vue";
import { inject, ref } from "vue";
import { TypeEnum } from "@/types/Main";
import DetailLink from "@/components/admin/DetailLink.vue";

const warehouseApi = inject("warehouseApi", new WarehouseApi());

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([WarehouseSortEnum.CreatedAtDesc]);

const { isLoading, data } = useQueryWarehouses(warehouseApi, page, itemsPerPage, sortBy);

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
                        return WarehouseSortEnum.IdDesc;
                    case "name":
                        return WarehouseSortEnum.NameDesc;
                    case "created_at":
                        return WarehouseSortEnum.CreatedAtDesc;
                    default:
                        return WarehouseSortEnum.CreatedAtDesc;
                }
            } else {
                switch (key) {
                    case "id":
                        return WarehouseSortEnum.IdAsc;
                    case "name":
                        return WarehouseSortEnum.NameAsc;
                    case "created_at":
                        return WarehouseSortEnum.CreatedAtAsc;
                    default:
                        return WarehouseSortEnum.CreatedAtAsc;
                }
            }
        },
    );

    sort.push(WarehouseSortEnum.CreatedAtDesc);
    sortBy.value = sort;
};

const headers = [
    {
        title: "Warehouse",
        sortable: true,
        key: "name",
    },
    {
        title: "Disabled",
        sortable: true,
        key: "disabled",
    },
    {
        title: "Number of Products",
        sortable: true,
        key: "product",
    },
];
</script>

<template>
    <div class="mt-8">
        <v-row justify="center">
            <v-btn prepend-icon="fa-solid fa-circle-plus" to="/admin/warehouse/new">
                {{ $t("admin.warehouse.add.title") }}
            </v-btn>
        </v-row>
        <v-row>
            <v-col>
                <v-data-table-server
                    :loading="isLoading"
                    :headers="headers"
                    v-model:search="search"
                    v-model:items-per-page="itemsPerPage"
                    :page="page"
                    :items="data.warehouses"
                    :items-length="totalItems"
                    @update:options="loadItems"
                    item-value="id"
                >
                    <template v-slot:item.name="{ item }">
                        <DetailLink v-if="item.id" :id="item.id" :type="TypeEnum.Warehouse" />
                    </template>
                </v-data-table-server>
            </v-col>
        </v-row>
    </div>
</template>

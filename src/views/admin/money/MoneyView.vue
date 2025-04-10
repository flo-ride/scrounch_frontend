<script setup lang="ts">
import { RefillApi, RefillSortEnum } from "@/api";
import { useQueryRefills } from "@/query/refill";
import { computed } from "vue";
import { inject, ref } from "vue";
import { TypeEnum } from "@/types/Main";
import DetailLink from "@/components/admin/DetailLink.vue";

const refillApi = inject("refillApi", new RefillApi());

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([RefillSortEnum.CreatedAtDesc]);

const { isLoading, data } = useQueryRefills(refillApi, page, itemsPerPage, sortBy);

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
                        return RefillSortEnum.IdDesc;
                    case "name":
                        return RefillSortEnum.NameDesc;
                    case "created_at":
                        return RefillSortEnum.CreatedAtDesc;
                    default:
                        return RefillSortEnum.CreatedAtDesc;
                }
            } else {
                switch (key) {
                    case "id":
                        return RefillSortEnum.IdAsc;
                    case "name":
                        return RefillSortEnum.NameAsc;
                    case "created_at":
                        return RefillSortEnum.CreatedAtAsc;
                    default:
                        return RefillSortEnum.CreatedAtAsc;
                }
            }
        },
    );

    sort.push(RefillSortEnum.CreatedAtDesc);
    sortBy.value = sort;
};

const headers = [
    {
        title: "Refill",
        sortable: true,
        key: "name",
    },
    {
        title: "Price",
        sortable: true,
        key: "price",
    },

    {
        title: "Credit",
        sortable: true,
        key: "credit",
    },
    {
        title: "Disabled",
        sortable: true,
        key: "disabled",
    },
];
</script>

<template>
    <div class="mt-8">
        <v-row justify="center">
            <v-btn prepend-icon="fa-solid fa-circle-plus" to="/admin/refill/new">
                {{ $t("admin.refill.add.title") }}
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
                    :items="data.refills"
                    :items-length="totalItems"
                    @update:options="loadItems"
                    item-value="id"
                >
                    <template v-slot:item.name="{ item }">
                        <DetailLink v-if="item.id" :id="item.id" :type="TypeEnum.Refill" />
                    </template>

                    <template v-slot:item.price="{ item }">
                        {{ item.price }}
                        {{ $t("common.currency.symbol." + item.priceCurrency.type) }}
                    </template>

                    <template v-slot:item.credit="{ item }">
                        {{ item.credit }}
                        {{ $t("common.currency.symbol." + item.creditCurrency.type) }}
                    </template>
                </v-data-table-server>
            </v-col>
        </v-row>
    </div>
</template>

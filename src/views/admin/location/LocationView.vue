<script setup lang="ts">
import { LocationApi, LocationSortEnum } from "@/api";
import { useQueryLocations } from "@/query/location";
import { computed } from "vue";
import { inject, ref } from "vue";
import { TypeEnum } from "@/types/Main";
import DetailLink from "@/components/admin/DetailLink.vue";

const locationApi = inject("locationApi", new LocationApi());

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([LocationSortEnum.CreatedAtDesc]);

const { isLoading, data } = useQueryLocations(locationApi, page, itemsPerPage, sortBy);

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
                        return LocationSortEnum.IdDesc;
                    case "name":
                        return LocationSortEnum.NameDesc;
                    case "created_at":
                        return LocationSortEnum.CreatedAtDesc;
                    default:
                        return LocationSortEnum.CreatedAtDesc;
                }
            } else {
                switch (key) {
                    case "id":
                        return LocationSortEnum.IdAsc;
                    case "name":
                        return LocationSortEnum.NameAsc;
                    case "created_at":
                        return LocationSortEnum.CreatedAtAsc;
                    default:
                        return LocationSortEnum.CreatedAtAsc;
                }
            }
        },
    );

    sort.push(LocationSortEnum.CreatedAtDesc);
    sortBy.value = sort;
};

const headers = [
    {
        title: "Location",
        sortable: true,
        key: "name",
    },

    {
        title: "Category",
        sortable: true,
        key: "category",
    },
    {
        title: "Hidden",
        sortable: true,
        key: "hidden",
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
            <v-btn prepend-icon="fa-solid fa-circle-plus" to="/admin/location/new">
                {{ $t("admin.location.add.title") }}
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
                    :items="data.locations"
                    :items-length="totalItems"
                    @update:options="loadItems"
                    item-value="id"
                >
                    <template v-slot:item.name="{ item }">
                        <DetailLink v-if="item.id" :id="item.id" :type="TypeEnum.Location" />
                    </template>
                </v-data-table-server>
            </v-col>
        </v-row>
    </div>
</template>

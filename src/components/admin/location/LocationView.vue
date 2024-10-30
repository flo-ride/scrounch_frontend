<template>
    <div>
        <v-row>
            <v-col cols="6" offset="3">
                <CreateDialog v-model="CreateDialog" @is-done="refresh" />
            </v-col>
            <v-col cols="3"> </v-col>
            <v-col>
                <v-data-table-server
                    :headers="headers"
                    v-model:search="search"
                    v-model:items-per-page="itemsPerPage"
                    :items="serverItems"
                    :items-length="totalItems"
                    @update:options="loadItems"
                    item-value="id"
                >
                    <template v-slot:item.creation_time="{ item }">
                        <span>{{ timeSinceCreation(item.creation_time.toString()) }}</span>
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

                    <template v-slot:item.actions="{ item }">
                        <v-btn
                            icon="fa-solid fa-pen-to-square"
                            @click="updateLocation(item)"
                        ></v-btn>
                        <v-btn icon="fa-solid fa-trash" @click="deleteLocation(item)"></v-btn>
                    </template>
                </v-data-table-server>
            </v-col>
        </v-row>
    </div>
    <EditDialog v-model="edit" :item="selected" @is-done="refresh" />
    <DeleteDialog v-model="delete" :item="selected" @is-done="refresh" />
</template>

<script lang="ts">
// @ts-ignore
import CreateDialog from "@/components/admin/location/CreateDialog.vue";
// @ts-ignore
import EditDialog from "@/components/admin/location/EditDialog.vue";
// @ts-ignore
import DeleteDialog from "@/components/admin/location/DeleteDialog.vue";
// @ts-ignore
import type { Location } from "@/types/Location";
// @ts-ignore
import type { LocationListResponse } from "@/types/request/location";
import type { AxiosResponse } from "axios";

export default {
    data() {
        return {
            CreateDialog: false,
            loading: false,
            edit: false,
            delete: false,
            selected: undefined as undefined | Object,
            serverItems: [] as Location[],
            totalItems: 0,
            itemsPerPage: 20,
            search: "",
            headers: [
                {
                    title: "Id",
                    sortable: true,
                    key: "id",
                },
                {
                    title: "Name",
                    sortable: true,
                    key: "name",
                },
                {
                    title: "Type",
                    sortable: true,
                    key: "category",
                },
                {
                    title: "Creation Time",
                    key: "creation_time",
                    sortable: true,
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
    methods: {
        loadItems({ page, itemsPerPage }: { page: number; itemsPerPage: number }): void {
            this.loading = true;
            // @ts-ignore
            let axios = this.$axios;
            axios
                .get<LocationListResponse>(`/location?page=${page - 1}&per_page=${itemsPerPage}`)
                .then((res: AxiosResponse<LocationListResponse, any>) => {
                    this.serverItems = res.data.locations;
                    this.totalItems = res.data.total_page * itemsPerPage;
                    this.loading = false;
                });
        },
        timeSinceCreation(creationTimeString: string) {
            const creationTime = new Date(creationTimeString);

            return creationTime.toLocaleString("fr-FR");
        },
        updateLocation(location: Location) {
            this.edit = true;
            this.selected = location;
        },
        deleteLocation(location: Location) {
            this.delete = true;
            this.selected = location;
        },
        refresh() {
            this.search = String(Date.now());
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

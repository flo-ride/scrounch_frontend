<template>
    <div>
        <v-row>
            <v-col cols="6" offset="3">
                <CreateDialog v-model="createItem" @is-done="refresh" />
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
                    <template v-slot:item.created_at="{ item }">
                        <span>{{ timeSinceCreation(item.createdAt.toString()) }}</span>
                    </template>

                    <template v-slot:item.category="{ item }">
                        <v-chip
                            v-if="item.category != undefined"
                            color="primary"
                            :text="item.category?.toString()"
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
    <EditDialog v-model="editItem" :item="selected" @is-done="refresh" />
    <DeleteDialog v-model="deleteItem" :item="selected" @is-done="refresh" />
</template>

<script lang="ts">
import CreateDialog from "@/components/admin/location/CreateDialog.vue";
import EditDialog from "@/components/admin/location/EditDialog.vue";
import DeleteDialog from "@/components/admin/location/DeleteDialog.vue";
import { Location } from "@/types/Location";

export default {
    data() {
        return {
            createItem: false,
            loading: false,
            editItem: false,
            deleteItem: false,
            selected: undefined as undefined | Location,
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
                    key: "createdAt",
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
            this.$locationApi.getAllLocations(page - 1, itemsPerPage).then((res) => {
                this.serverItems = res.data.locations.map((x) => Location.fromResponse(x));
                this.totalItems = res.data.total_page * itemsPerPage;
                this.loading = false;
            });
        },
        timeSinceCreation(creationTimeString: string) {
            const creationTime = new Date(creationTimeString);

            return creationTime.toLocaleString("fr-FR");
        },
        updateLocation(location: Location) {
            this.editItem = true;
            this.selected = location;
        },
        deleteLocation(location: Location) {
            this.deleteItem = true;
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

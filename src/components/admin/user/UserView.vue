<template>
    <div>
        <v-row>
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

                    <template v-slot:item.last_access_time="{ item }">
                        <span>{{ timeSinceLastConnection(item.last_access_time.toString()) }}</span>
                    </template>

                    <template v-slot:item.role="{ item }">
                        <v-chip
                            v-if="item.is_banned"
                            color="error"
                            text="BANNED"
                            class="text-uppercase"
                            size="small"
                            label
                        ></v-chip>
                        <v-chip
                            v-if="item.is_admin"
                            color="success"
                            text="ADMIN"
                            class="text-uppercase"
                            size="small"
                            label
                        ></v-chip>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-btn icon="fa-solid fa-pen-to-square" @click="updateUser(item)"> </v-btn>
                    </template>
                </v-data-table-server>
            </v-col>
        </v-row>
    </div>
    <EditDialog v-model="edit" :user="editUser" @is-done="refresh" />
</template>

<script lang="ts">
// @ts-ignore
import EditDialog from "@/components/admin/user/EditDialog.vue";
// @ts-ignore
import type { User } from "@/types/User";
// @ts-ignore
import type { UserListResponse } from "@/types/request/user";
import type { AxiosResponse } from "axios";

export default {
    data() {
        return {
            loading: false,
            edit: false,
            editUser: undefined as undefined | Object,
            serverItems: [] as User[],
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
                    title: "Email",
                    sortable: true,
                    key: "email",
                },
                {
                    title: "Username",
                    sortable: true,
                    key: "username",
                },
                {
                    title: "Creation Time",
                    key: "creation_time",
                    sortable: true,
                },
                {
                    title: "Last Access",
                    key: "last_access_time",
                    sortable: true,
                },
                {
                    title: "Role",
                    key: "role",
                    sortable: true,
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
                .get<UserListResponse>(`/user?page=${page - 1}&per_page=${itemsPerPage}`)
                .then((res: AxiosResponse<UserListResponse, any>) => {
                    this.serverItems = res.data.users;
                    this.totalItems = res.data.total_page * itemsPerPage;
                    this.loading = false;
                });
        },
        timeSinceLastConnection(lastConnectionString: string): string {
            const lastConnection = new Date(lastConnectionString);
            const now = new Date();
            const differenceMs = now.getTime() - lastConnection.getTime();

            const minutes = Math.floor(differenceMs / (1000 * 60));
            const hours = Math.floor(differenceMs / (1000 * 60 * 60));
            const days = Math.floor(hours / 24);

            if (days > 0) {
                return `${days} jour${days > 1 ? "s" : ""}`;
            } else if (hours > 0) {
                return `${hours} heure${hours > 1 ? "s" : ""}`;
            } else {
                return `${minutes} minute${minutes > 1 ? "s" : ""}`;
            }
        },
        timeSinceCreation(creationTimeString: string) {
            const creationTime = new Date(creationTimeString);

            return creationTime.toLocaleString("fr-FR");
        },
        updateUser(user: User) {
            this.edit = true;
            this.editUser = user;
        },
        refresh() {
            this.search = String(Date.now());
        },
    },
    components: {
        EditDialog,
    },
    mounted() {},
};
</script>

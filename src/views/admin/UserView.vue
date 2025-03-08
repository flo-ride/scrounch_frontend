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
                    <template v-slot:item.created_at="{ item }">
                        <span>{{ timeSinceCreation(item.createdAt.toString()) }}</span>
                    </template>

                    <template v-slot:item.last_access_at="{ item }">
                        <span>{{ timeSinceLastConnection(item.lastAccessAt.toString()) }}</span>
                    </template>

                    <template v-slot:item.role="{ item }">
                        <v-chip
                            v-if="item.isBanned"
                            color="error"
                            text="BANNED"
                            class="text-uppercase"
                            size="small"
                            label
                        ></v-chip>
                        <v-chip
                            v-if="item.isAdmin"
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
    <EditDialog v-model="edit" :item="editUser" @is-done="refresh" />
</template>

<script lang="ts">
import EditDialog from "@/components/admin/user/EditDialog.vue";
import { User } from "@/types/User";
import { UserSortEnum } from "@/api";

export default {
    data() {
        return {
            loading: false,
            edit: false,
            editUser: undefined as undefined | User,
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
                    key: "created_at",
                    sortable: true,
                },
                {
                    title: "Last Access",
                    key: "last_access_at",
                    sortable: true,
                },
                {
                    title: "Role",
                    key: "role",
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
        loadItems({
            page,
            itemsPerPage,
            sortBy,
        }: {
            page: number;
            itemsPerPage: number;
            sortBy?: any;
        }): void {
            this.loading = true;

            let sort: UserSortEnum[] = [];
            if (sortBy != undefined && sortBy.length) {
                sort = sortBy.map(
                    ({ key, order }: { key: string; order?: boolean | "asc" | "desc" }) => {
                        if (order == undefined || order == false || order == "desc") {
                            switch (key) {
                                case "id":
                                    return UserSortEnum.IdDesc;
                                case "name":
                                    return UserSortEnum.NameDesc;
                                case "email":
                                    return UserSortEnum.EmailDesc;
                                case "username":
                                    return UserSortEnum.UsernameDesc;
                                case "last_access_at":
                                    return UserSortEnum.LastAccessAtDesc;
                                case "created_at":
                                    return UserSortEnum.CreatedAtDesc;
                                default:
                                    return UserSortEnum.CreatedAtDesc;
                            }
                        } else {
                            switch (key) {
                                case "id":
                                    return UserSortEnum.IdAsc;
                                case "name":
                                    return UserSortEnum.NameAsc;
                                case "email":
                                    return UserSortEnum.EmailAsc;
                                case "username":
                                    return UserSortEnum.UsernameAsc;
                                case "last_access_at":
                                    return UserSortEnum.LastAccessAtAsc;
                                case "created_at":
                                    return UserSortEnum.CreatedAtAsc;
                                default:
                                    return UserSortEnum.CreatedAtAsc;
                            }
                        }
                    },
                );
            }

            sort.push(UserSortEnum.LastAccessAtDesc);
            sort.push(UserSortEnum.CreatedAtDesc);

            this.$userApi
                .getAllUsers({ page: page - 1, perPage: itemsPerPage, sort: sort })
                .then((res) => {
                    this.serverItems = res.data.users.map((x) => User.fromResponse(x));
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

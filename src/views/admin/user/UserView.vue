<script setup lang="ts">
import { UserApi, UserSortEnum } from "@/api";
import { useQueryUsers } from "@/query/user";
import { computed } from "vue";
import { inject, ref } from "vue";
import { TypeEnum } from "@/types/Main";
import DetailLink from "@/components/admin/DetailLink.vue";

const userApi = inject("userApi", new UserApi());

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([UserSortEnum.CreatedAtDesc]);

const { isLoading, data } = useQueryUsers(userApi, page, itemsPerPage, sortBy);

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

    sort.push(UserSortEnum.LastAccessAtDesc);
    sort.push(UserSortEnum.CreatedAtDesc);
    sortBy.value = sort;
};

const timeSinceLastConnection = (lastConnection: Date) => {
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
};
const timeSinceCreation = (creationTime: Date) => {
    return creationTime.toLocaleString("fr-FR");
};

const headers = [
    {
        title: "User",
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
];
</script>

<template>
    <div>
        <v-row>
            <v-col>
                <v-data-table-server
                    :loading="isLoading"
                    :headers="headers"
                    v-model:search="search"
                    v-model:items-per-page="itemsPerPage"
                    :page="page"
                    :items="data.users"
                    :items-length="totalItems"
                    @update:options="loadItems"
                    item-value="id"
                >
                    <template v-slot:item.name="{ item }">
                        <DetailLink v-if="item.id" :id="item.id" :type="TypeEnum.User" />
                    </template>
                    <template v-slot:item.created_at="{ item }">
                        <span>{{ timeSinceCreation(item.createdAt) }}</span>
                    </template>

                    <template v-slot:item.last_access_at="{ item }">
                        <span>{{ timeSinceLastConnection(item.lastAccessAt) }}</span>
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
                </v-data-table-server>
            </v-col>
        </v-row>
    </div>
</template>

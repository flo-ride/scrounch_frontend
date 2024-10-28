<template>
    <EditDialogForm
        v-model="show"
        :title="$t('admin.product.edit.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
        <template #form-content>
            <v-switch
                v-model="userIsAdmin"
                :label="$t('admin.user.edit.isAdmin')"
                required
            ></v-switch>

            <v-switch
                v-model="userIsBanned"
                :label="$t('admin.user.edit.isBanned')"
                required
            ></v-switch>
        </template>
    </EditDialogForm>
</template>

<script lang="ts">
// @ts-ignore
import EditDialogForm from "@/components/admin/EditDialogForm.vue";
import type { AxiosResponse } from "axios";

export default {
    data: () => ({
        loading: false,
        userId: "" as string,
        userIsAdmin: false,
        userIsBanned: false,
        nameRules: [
            (value: string) =>
                !value
                    ? "Name is required."
                    : value.length <= 32 || "Name must not be longer than 32 characters",
        ],
    }),
    emits: ["isDone", "update:modelValue"],
    computed: {
        show: {
            get(): boolean {
                return this.modelValue;
            },
            set(value: boolean) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    props: {
        modelValue: {
            type: Boolean,
        },
        item: {
            type: Object,
            required: true,
            default: () => ({}),
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.userId = item.id;
                this.userIsAdmin = item.is_admin;
                this.userIsBanned = item.is_banned;
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;

            // @ts-ignore
            let axios = this.$axios;

            axios
                .put(`/user/${this.userId}`, {
                    is_admin: this.userIsAdmin,
                    is_banned: this.userIsBanned,
                })
                .then((_res: AxiosResponse<any, any>) => {
                    this.show = false;
                    this.$emit("isDone");
                })
                .catch((err: any) => {
                    // @ts-ignore
                    this.$refs.dialogRef.openError({});
                    console.error(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    components: {
        EditDialogForm,
    },
};
</script>

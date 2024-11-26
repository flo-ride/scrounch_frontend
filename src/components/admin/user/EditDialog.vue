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
                v-model="user.isAdmin"
                :label="$t('admin.user.edit.isAdmin')"
                required
            ></v-switch>

            <v-switch
                v-model="user.isBanned"
                :label="$t('admin.user.edit.isBanned')"
                required
            ></v-switch>
        </template>
    </EditDialogForm>
</template>

<script lang="ts">
import EditDialogForm from "@/components/admin/EditDialogForm.vue";
import { User } from "@/types/User";

export default {
    data: () => ({
        loading: false,
        user: User.default() as User,
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
            type: User,
            required: true,
            default: () => User.default(),
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.user = item.clone();
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;

            this.$userApi
                .editUser({ id: this.user.id, editUserRequest: this.user.toEditRequest() })
                .then((_res) => {
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

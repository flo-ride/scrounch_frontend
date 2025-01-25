<template>
    <CreateDialogForm
        v-model="show"
        :title="$t('admin.warehouse.add.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="createItem"
    >
        <template #form-content>
            <v-text-field
                v-model="warehouse.name"
                :label="$t('admin.warehouse.add.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>
        </template>
    </CreateDialogForm>
</template>

<script lang="ts">
import CreateDialogForm from "@/components/admin/CreateDialogForm.vue";
import { Warehouse } from "@/types/Warehouse";

export default {
    data: () => ({
        loading: false,
        warehouse: Warehouse.default(),
        nameRules: [
            (value: String) =>
                !value
                    ? "Name is required."
                    : value.length > 32
                      ? "Name must not be longer than 32 characters"
                      : true,
        ],
    }),
    props: {
        modelValue: Boolean,
    },
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
    emits: ["isDone", "update:modelValue"],
    methods: {
        async createItem() {
            this.loading = true;
            try {
                await this.$warehouseApi.postNewWarehouse({
                    newWarehouseRequest: this.warehouse.toNewRequest(),
                });
                this.show = false;
                // @ts-ignore
                this.$refs.dialogRef.clearForm();
                this.$emit("isDone");
            } catch (err) {
                // @ts-ignore
                this.$refs.dialogRef.openError({});
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
    },
    components: {
        CreateDialogForm,
    },
};
</script>

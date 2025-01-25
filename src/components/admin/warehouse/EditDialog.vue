<template>
    <EditDialogForm
        v-model="show"
        :title="$t('admin.warehouse.edit.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
        <template v-slot:activator="{ activator }">
            <v-btn
                class="ma-2"
                v-bind="activator"
                :disabled="warehouse.id.length == 0"
                variant="tonal"
                append-icon="fa-solid fa-edit"
                :text="$t('common.edit')"
            ></v-btn>
        </template>
        <template #form-content>
            <v-text-field
                v-model="warehouse.name"
                :label="$t('admin.warehouse.edit.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <v-switch
                v-model="warehouse.disabled"
                :label="$t('admin.warehouse.edit.disabled')"
                required
            ></v-switch>
        </template>
    </EditDialogForm>
</template>

<script lang="ts">
import EditDialogForm from "@/components/admin/EditDialogForm.vue";
import { Warehouse } from "@/types/Warehouse";

export default {
    data: () => ({
        loading: false,
        warehouse: Warehouse.default() as Warehouse,
        nameRules: [
            (value: String) =>
                !value
                    ? "Name is required."
                    : value.length > 32
                      ? "Name must not be longer than 32 characters"
                      : true,
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
            type: Warehouse,
            required: true,
            default: () => Warehouse.default() as Warehouse,
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.warehouse = item.clone();
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                await this.$warehouseApi.editWarehouse({
                    id: this.warehouse.id,
                    editWarehouseRequest: this.warehouse.toEditRequest(),
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
        EditDialogForm,
    },
};
</script>

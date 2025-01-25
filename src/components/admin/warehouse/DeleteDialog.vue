<template>
    <DeleteDialogForm
        v-model="show"
        :title="$t('common.delete')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
        <template v-slot:activator="{ activator }">
            <v-btn
                class="ma-2"
                v-bind="activator"
                :disabled="warehouseId.length == 0"
                variant="tonal"
                append-icon="fa-solid fa-trash"
                :text="$t('common.delete')"
            ></v-btn>
        </template>
    </DeleteDialogForm>
</template>

<script lang="ts">
import DeleteDialogForm from "@/components/admin/DeleteDialogForm.vue";
import { Warehouse } from "@/types/Warehouse";

export default {
    data: () => ({
        loading: false,
        warehouseId: "",
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
            default: () => Warehouse.default(),
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.warehouseId = item.id;
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                await this.$warehouseApi.deleteWarehouse({ id: this.warehouseId });
                this.show = false;
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
        DeleteDialogForm,
    },
};
</script>

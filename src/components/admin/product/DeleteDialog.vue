<template>
    <DeleteDialogForm
        v-model="show"
        :title="$t('admin.product.delete.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
    </DeleteDialogForm>
</template>

<script lang="ts">
import DeleteDialogForm from "@/components/admin/DeleteDialogForm.vue";
import { Product } from "@/types/Product";

export default {
    data: () => ({
        loading: false,
        productId: "",
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
            type: Product,
            required: true,
            default: () => Product.default() as Product,
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.productId = item.id;
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                await this.$productApi.deleteProduct(this.productId);
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

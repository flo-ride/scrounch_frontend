<template>
    <DeleteDialogForm
        v-model="show"
        :title="$t('admin.money.delete.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
    </DeleteDialogForm>
</template>

<script lang="ts">
// @ts-ignore
import DeleteDialogForm from "@/components/admin/DeleteDialogForm.vue";

export default {
    data: () => ({
        loading: false,
        refillId: "",
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
            default: () => ({
                name: "",
            }),
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.refillId = item.id;
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                // @ts-ignore
                let axios = this.$axios;
                await axios.delete(`/refill/${this.refillId}`);
                // @ts-ignore
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

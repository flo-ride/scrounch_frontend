<template>
    <DeleteDialogForm
        v-model="show"
        :title="$t('admin.location.delete.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
    </DeleteDialogForm>
</template>

<script lang="ts">
import DeleteDialogForm from "@/components/admin/DeleteDialogForm.vue";
import { Location } from "@/types/Location";

export default {
    data: () => ({
        loading: false,
        locationId: "",
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
            type: Location,
            required: true,
            default: () => Location.default() as Location,
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.locationId = item.id;
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                await this.$locationApi.deleteLocation({ id: this.locationId });
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

<template>
    <EditDialogForm
        v-model="show"
        :title="$t('admin.location.edit.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
        <template #form-content>
            <v-text-field
                v-model="locationName"
                :label="$t('admin.location.edit.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <v-select
                v-model="locationCategory"
                :label="$t('admin.location.edit.category')"
                :items="locationCategoryItems"
                item-title="name"
                item-value="value"
                required
            ></v-select>

            <v-switch
                v-model="locationDisabled"
                :label="$t('admin.location.edit.disabled')"
                required
            ></v-switch>
        </template>
    </EditDialogForm>
</template>

<script lang="ts">
// @ts-ignore
import EditDialogForm from "@/components/admin/EditDialogForm.vue";

export default {
    data: () => ({
        loading: false,
        locationId: "",
        locationName: "",
        locationCategory: undefined as string | undefined,
        locationCategoryItems: [
            { name: "Dispenser", value: "dispenser" },
            { name: "Room", value: "room" },
        ],
        locationDisabled: false,
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
                this.locationId = item.id;
                this.locationName = item.name;
                this.locationCategory = item.category;
                this.locationDisabled = item.disabled;
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                // @ts-ignore
                let axios = this.$axios;
                await axios.put(`/location/${this.locationId}`, {
                    name: this.locationName,
                    category: this.locationCategory,
                    disabled: this.locationDisabled,
                });
                // @ts-ignore
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

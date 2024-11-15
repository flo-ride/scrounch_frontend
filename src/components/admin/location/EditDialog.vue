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
                v-model="location.name"
                :label="$t('admin.location.edit.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <v-select
                v-model="location.category"
                :label="$t('admin.location.edit.category')"
                :items="locationCategoryItems"
                item-title="name"
                item-value="value"
                required
            ></v-select>

            <v-switch
                v-model="location.disabled"
                :label="$t('admin.location.edit.disabled')"
                required
            ></v-switch>
        </template>
    </EditDialogForm>
</template>

<script lang="ts">
import EditDialogForm from "@/components/admin/EditDialogForm.vue";
import { Location, LocationCategory } from "@/types/Location";

export default {
    data: () => ({
        loading: false,
        location: Location.default() as Location,
        locationCategoryItems: [
            { name: "Dispenser", value: LocationCategory.Dispenser },
            { name: "Room", value: LocationCategory.Room },
        ],
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
            type: Location,
            required: true,
            default: () => Location.default() as Location,
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.location = item.clone();
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                await this.$locationApi.editLocation(
                    this.location.id,
                    this.location.toEditRequest(),
                );
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

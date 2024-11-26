<template>
    <CreateDialogForm
        v-model="show"
        :title="$t('admin.location.add.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="createItem"
    >
        <template #form-content>
            <v-text-field
                v-model="location.name"
                :label="$t('admin.location.add.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <v-select
                v-model="location.category"
                :label="$t('admin.location.add.category')"
                :items="locationCategoryItems"
                item-title="name"
                item-value="value"
            ></v-select>
        </template>
    </CreateDialogForm>
</template>

<script lang="ts">
import CreateDialogForm from "@/components/admin/CreateDialogForm.vue";
import { Location, LocationCategory } from "@/types/Location";

export default {
    data: () => ({
        loading: false,
        location: Location.default(),
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
                await this.$locationApi.postNewLocation({
                    newLocationRequest: this.location.toNewRequest(),
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

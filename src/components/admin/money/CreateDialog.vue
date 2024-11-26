<template>
    <CreateDialogForm
        v-model="show"
        :title="$t('admin.money.add.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="createItem"
    >
        <template #form-content>
            <v-text-field
                v-model="refill.name"
                :label="$t('admin.money.add.name')"
                :rules="nameRules"
                :counter="32"
            ></v-text-field>

            <p>{{ $t("admin.money.add.euro") }}</p>
            <v-number-input
                v-model="refill.price"
                controlVariant="split"
                :min="0.1"
                :max="100.0"
                :step="0.01"
                suffix="€"
                :hideInput="false"
                :inset="false"
                required
            ></v-number-input>

            <p>{{ $t("admin.money.add.epicoin") }}</p>
            <v-number-input
                v-model="refill.credit"
                controlVariant="split"
                :min="1"
                :max="100"
                :step="1"
                :hideInput="false"
                :inset="false"
                required
            ></v-number-input>
        </template>
    </CreateDialogForm>
</template>

<script lang="ts">
import CreateDialogForm from "@/components/admin/CreateDialogForm.vue";
import { Refill } from "@/types/Refill";

export default {
    data: () => ({
        loading: false,
        refill: Refill.default() as Refill,
        nameRules: [
            (value: String) =>
                value.length > 32 ? "Name must not be longer than 32 characters" : true,
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
                await this.$refillApi.postNewRefill({
                    newRefillRequest: this.refill.toNewRequest(),
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

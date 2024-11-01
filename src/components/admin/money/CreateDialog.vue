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
                v-model="refillName"
                :label="$t('admin.money.add.name')"
                :rules="nameRules"
                :counter="32"
            ></v-text-field>

            <p>{{ $t("admin.money.add.euro") }}</p>
            <v-number-input
                v-model="refillInEuro"
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
                v-model="refillInEpicoin"
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
// @ts-ignore
import CreateDialogForm from "@/components/admin/CreateDialogForm.vue";

export default {
    data: () => ({
        loading: false,
        refillName: undefined as undefined | string,
        refillInEuro: 0.0,
        refillInEpicoin: 0,
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
                if (this.refillName != undefined) {
                    if (this.refillName.length == 0) {
                        this.refillName = undefined;
                    }
                }

                // @ts-ignore
                let axios = this.$axios;
                await axios.post("/refill", {
                    name: this.refillName,
                    amount_in_euro: this.refillInEuro,
                    amount_in_epicoin: this.refillInEpicoin,
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
        CreateDialogForm,
    },
};
</script>

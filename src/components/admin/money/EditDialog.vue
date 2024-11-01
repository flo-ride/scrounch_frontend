<template>
    <EditDialogForm
        v-model="show"
        :title="$t('admin.money.edit.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
        <template #form-content>
            <v-text-field
                v-model="refillName"
                :label="$t('admin.money.edit.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <p>{{ $t("admin.money.edit.euro") }}</p>
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

            <p>{{ $t("admin.money.edit.epicoin") }}</p>
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

            <v-switch
                v-model="refillDisabled"
                :label="$t('admin.money.edit.disabled')"
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
        refillId: "",
        refillName: "",
        refillInEuro: 0.0,
        refillInEpicoin: 0,
        refillDisabled: false,
        nameRules: [
            (value: String) =>
                value.length > 32 ? "Name must not be longer than 32 characters" : true,
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
                this.refillId = item.id;
                this.refillName = item.name;
                this.refillInEuro = item.amount_in_euro;
                this.refillInEpicoin = item.amount_in_epicoin;
                this.refillDisabled = item.disabled;
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                // @ts-ignore
                let axios = this.$axios;
                await axios.put(`/refill/${this.refillId}`, {
                    name: this.refillName,
                    amount_in_euro: this.refillInEuro,
                    amount_in_epicoin: this.refillInEpicoin,
                    disabled: this.refillDisabled,
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

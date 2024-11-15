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
                v-model="refill.name"
                :label="$t('admin.money.edit.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <p>{{ $t("admin.money.edit.euro") }}</p>
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

            <p>{{ $t("admin.money.edit.epicoin") }}</p>
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

            <v-switch
                v-model="refill.disabled"
                :label="$t('admin.money.edit.disabled')"
                required
            ></v-switch>
        </template>
    </EditDialogForm>
</template>

<script lang="ts">
import EditDialogForm from "@/components/admin/EditDialogForm.vue";
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
            type: Refill,
            required: true,
            default: () => Refill.default(),
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.refill = item.clone();
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                await this.$refillApi.editRefill(this.refill.id, this.refill.toEditRequest());
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

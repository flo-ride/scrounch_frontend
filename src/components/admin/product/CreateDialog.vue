<template>
    <CreateDialogForm
        v-model="show"
        :title="$t('admin.product.add.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="createItem"
    >
        <template #form-content>
            <v-file-input
                v-model="productImage"
                :label="$t('admin.product.add.image')"
                accept="image/*"
                :rules="imageRules"
                prepend-icon=""
            ></v-file-input>

            <v-text-field
                v-model="product.name"
                :label="$t('admin.product.add.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <p>{{ $t("admin.product.add.price") }}</p>
            <v-number-input
                v-model="product.price"
                controlVariant="split"
                :min="0.1"
                :max="100.0"
                :step="0.01"
                suffix="€"
                :hideInput="false"
                :inset="false"
                required
            ></v-number-input>

            <p :class="product.maxQuantityPerCommand != 0 ? '' : 'text-disabled'">
                {{ $t("admin.product.add.max") }}{{ product.maxQuantityPerCommand != 0 ? ": " : ""
                }}{{ displayProductMax }}
            </p>
            <v-slider
                v-model="product.maxQuantityPerCommand"
                type="number"
                show-ticks="always"
                :ticks="tickLabels"
                step="1"
                :max="10"
                :min="0"
                required
            ></v-slider>
        </template>
    </CreateDialogForm>
</template>

<script lang="ts">
import { FileType } from "@/api";
import CreateDialogForm from "@/components/admin/CreateDialogForm.vue";
import { Product } from "@/types/Product";

export default {
    data: () => ({
        loading: false,
        productImage: undefined,
        product: Product.default() as Product,
        tickLabels: { 0: "None", 2: "2", 4: "4", 6: "6", 8: "8", 10: "10" },
        imageRules: [
            (value: File[]) =>
                !value || !value.length
                    ? true
                    : value[0].size >= 64000000
                      ? "Image size must be lower than 64 MB."
                      : true,
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
        displayProductMax(): string {
            if (this.product.maxQuantityPerCommand == 0) return "";
            return this.product.maxQuantityPerCommand?.toString() ?? "";
        },
    },
    methods: {
        async createItem() {
            this.loading = true;
            try {
                if (this.productImage) {
                    const res = await this.$miscApi.postUploadFiles(
                        FileType.Product,
                        this.productImage,
                    );
                    const filename = res.data[0][1];
                    this.product.image = filename;
                }
                await this.$productApi.postNewProduct(this.product.toNewRequest());
                this.show = false;
                // @ts-ignore
                this.$refs.dialogRef.clearForm();
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

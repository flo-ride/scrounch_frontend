<template>
    <EditDialogForm
        v-model="show"
        :title="$t('admin.product.edit.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
        <template #form-content>
            <v-file-input
                v-model="productImage"
                :label="$t('admin.product.edit.image')"
                accept="image/*"
                :rules="imageRules"
                prepend-icon=""
            ></v-file-input>

            <v-text-field
                v-model="product.name"
                :label="$t('admin.product.edit.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <v-text-field
                v-model="product.smaCode"
                :label="$t('admin.product.edit.sma')"
            ></v-text-field>

            <p>{{ $t("admin.product.edit.price") }}</p>
            <v-number-input
                v-model="product.price"
                controlVariant="split"
                :min="0.0"
                :max="100.0"
                :step="0.01"
                suffix="€"
                :hideInput="false"
                :inset="false"
                required
            ></v-number-input>

            <p :class="product.maxQuantityPerCommand != 0 ? '' : 'text-disabled'">
                {{ $t("admin.product.edit.max") }}{{ product.maxQuantityPerCommand != 0 ? ": " : ""
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

            <v-switch
                v-model="product.disabled"
                :label="$t('admin.product.edit.disabled')"
                required
            ></v-switch>
        </template>
    </EditDialogForm>
</template>

<script lang="ts">
import { FileType } from "@/api";
import EditDialogForm from "@/components/admin/EditDialogForm.vue";
import { Currency, CurrencyValue } from "@/types/Currency";
import { Product } from "@/types/Product";
import type { AxiosResponse } from "axios";

export default {
    data: () => ({
        loading: false,
        product: Product.default() as Product,
        productImage: undefined as File | undefined,
        tickLabels: {
            0: "None",
            2: "2",
            4: "4",
            6: "6",
            8: "8",
            10: "10",
        },
        imageRules: [
            (value: File[]) => {
                if (value && value[0]?.size >= 64000000)
                    return "Image size must be lower then 64 MB.";
                return true;
            },
        ],
        nameRules: [
            (value: string) =>
                !value
                    ? "Name is required."
                    : value.length <= 32 || "Name must not be longer than 32 characters",
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
        displayProductMax(): string {
            if (this.product.maxQuantityPerCommand == undefined) return "";
            return this.product.maxQuantityPerCommand === 0
                ? ""
                : this.product.maxQuantityPerCommand.toString();
        },
    },
    props: {
        modelValue: {
            type: Boolean,
        },
        item: {
            type: Product,
            required: true,
            default: () => Product.default(),
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.product = item.clone();
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;

            if (this.productImage != undefined) {
                this.$miscApi
                    .postUploadFiles(FileType.Product, this.productImage)
                    .then((res) => {
                        let filename = res.data[0][1];
                        this.product.image = filename;

                        this.$productApi
                            .editProduct(this.product.id, this.product.toEditRequest())
                            .then((_res) => {
                                this.show = false;
                                // @ts-ignore
                                this.$emit("isDone");
                            })
                            .catch((err: any) => {
                                // @ts-ignore
                                this.$refs.dialogRef.openError({});
                                console.error(err);
                            })
                            .finally(() => {
                                this.loading = false;
                            });
                    })
                    .catch((err: any) => {
                        console.error(err);
                        // @ts-ignore
                        this.$refs.dialogRef.openError({});
                        this.loading = false;
                    });
            } else {
                this.$productApi
                    .editProduct(this.product.id, this.product.toEditRequest())
                    .then((_res) => {
                        this.show = false;
                        this.$emit("isDone");
                    })
                    .catch((err: any) => {
                        // @ts-ignore
                        this.$refs.dialogRef.openError({});
                        console.error(err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
    },
    components: {
        EditDialogForm,
    },
};
</script>

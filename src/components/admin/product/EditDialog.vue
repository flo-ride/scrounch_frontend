<template>
    <v-dialog v-model="show">
        <template v-slot:default="{ isActive }">
            <v-card class="mx-auto pa-5" min-width="500">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="text-h5 text-medium-emphasis ps-2">
                        {{ $t("admin.product.edit.title") }}
                    </div>
                    <v-btn
                        icon="fa-solid fa-xmark"
                        variant="text"
                        @click="isActive.value = false"
                    ></v-btn>
                </v-card-title>

                <v-form v-model="valid" fast-fail ref="form">
                    <v-card-text>
                        <v-file-input
                            v-model="productImage"
                            :label="$t('admin.product.edit.image')"
                            accept="image/*"
                            :rules="imageRules"
                            prepend-icon=""
                        ></v-file-input>

                        <v-text-field
                            v-model="productName"
                            :label="$t('admin.product.edit.name')"
                            :rules="nameRules"
                            :counter="32"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="productSma"
                            :label="$t('admin.product.edit.sma')"
                        ></v-text-field>

                        <p>{{ $t("admin.product.edit.price") }}</p>
                        <v-number-input
                            v-model="productPrice"
                            controlVariant="split"
                            :min="0.0"
                            :max="100.0"
                            :step="0.01"
                            suffix="€"
                            :hideInput="false"
                            :inset="false"
                            required
                        ></v-number-input>

                        <p>{{ $t("admin.product.edit.quantity") }}</p>
                        <v-number-input
                            v-model="productQuantity"
                            controlVariant="split"
                            :min="0"
                            :max="9999"
                            :step="1"
                            :hideInput="false"
                            :inset="false"
                            required
                        ></v-number-input>

                        <p :class="productMax != 0 ? '' : 'text-disabled'">
                            {{ $t("admin.product.edit.max") }}{{ productMax != 0 ? ": " : ""
                            }}{{ displayProductMax }}
                        </p>
                        <v-slider
                            v-model="productMax"
                            type="number"
                            show-ticks="always"
                            :ticks="tickLabels"
                            step="1"
                            :max="10"
                            :min="0"
                            required
                        ></v-slider>

                        <p :class="productMax != 0 ? '' : 'text-disabled'">{{}}</p>
                        <v-switch
                            v-model="productDisabled"
                            :label="$t('admin.product.edit.disabled')"
                            required
                        ></v-switch>
                    </v-card-text>

                    <v-card-actions class="d-flex justify-end">
                        <v-btn
                            variant="flat"
                            rounded="xl"
                            :text="$t('common.cancel')"
                            @click="isActive.value = false"
                        ></v-btn>
                        <v-btn
                            :disabled="!valid || loading"
                            variant="flat"
                            rounded="xl"
                            prepend-icon="fa-solid fa-check"
                            :text="$t('common.save')"
                            :color="valid ? 'primary' : 'none'"
                            @click="updateProduct"
                        >
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </template>
    </v-dialog>
    <AlertError v-model="error" :title="errorTitle" :message="errorMessage" />
</template>

<script lang="ts">
// @ts-ignore
import type { FileUploadResult } from "@/types/Upload";
import type { AxiosResponse } from "axios";
// @ts-ignore
import { useProductStore } from "@/stores/product";

// @ts-ignore
import AlertError from "@/components/AlertError.vue";

export default {
    props: {
        modelValue: {
            type: Boolean,
        },
        product: {
            type: Object,
            required: true,
            default: () => ({
                name: "",
                price: 0,
                quantity: 0,
                max_quantity_per_command: 0,
                image: undefined,
            }),
        },
    },
    data: () => ({
        valid: false,
        error: false,
        errorMessage: undefined as string | undefined,
        errorTitle: undefined as string | undefined,
        loading: false,
        productId: "" as string,
        productImage: undefined as File | undefined,
        productName: "" as string,
        productSma: "" as string | undefined,
        productPrice: 0 as number,
        productQuantity: undefined as number | undefined,
        productMax: undefined as number | undefined,
        productDisabled: false,
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
                if (value && value[0]?.size >= 32000000)
                    return "Image size must be lower then 32 MB.";
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
            if (this.productMax == undefined) return "";
            return this.productMax === 0 ? "" : this.productMax.toString();
        },
        productStore: () => useProductStore(),
    },
    watch: {
        product: {
            immediate: true,
            handler(newProduct) {
                this.productId = newProduct.id;
                this.productName = newProduct.name;
                this.productPrice = newProduct.price;
                this.productQuantity = newProduct.quantity;
                this.productMax = newProduct.max_quantity_per_command;
                this.productSma = newProduct.sma_code;
                this.productDisabled = newProduct.disabled;
                this.productImage = undefined; // Clear image input for edit mode
            },
        },
    },
    methods: {
        async updateProduct() {
            if (this.valid === false) return;
            this.loading = true;

            // @ts-ignore
            let axios = this.$axios;

            if (this.productImage != undefined) {
                let formData = new FormData();
                if (this.productImage) formData.append("image", this.productImage);
                axios
                    .post<FileUploadResult>("/upload", formData, {
                        params: {
                            type: "product",
                        },
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((res: AxiosResponse<FileUploadResult, any>) => {
                        let filename = res.data[0][1];
                        axios
                            .put(`/product/${this.productId}`, {
                                image: filename,
                                name: this.productName,
                                price: this.productPrice,
                                quantity: this.productQuantity,
                                max_quantity_per_command: this.productMax,
                                disabled: this.productDisabled,
                                sma_code: this.productSma,
                            })
                            .then((_res) => {
                                this.show = false;
                                this.productStore.fetch_all_products(axios);
                                // @ts-ignore
                                this.$refs.form.reset();
                            })
                            .catch((err: any) => {
                                this.error = true;
                                console.error(err);
                            })
                            .finally(() => {
                                this.loading = false;
                            });
                    })
                    .catch((err: any) => {
                        console.error(err);
                        this.error = true;
                        this.errorMessage = "Sorry but we cannot upload this image";
                        this.loading = false;
                    });
            } else {
                axios
                    .put(`/product/${this.productId}`, {
                        name: this.productName,
                        price: this.productPrice,
                        quantity: this.productQuantity,
                        max_quantity_per_command: this.productMax,
                        disabled: this.productDisabled,
                        sma_code: this.productSma,
                    })
                    .then((_res) => {
                        this.show = false;
                        this.productStore.fetch_all_products(axios);
                        // @ts-ignore
                        this.$refs.form.reset();
                    })
                    .catch((err: any) => {
                        this.error = true;
                        console.error(err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
    },
    components: {
        AlertError,
    },
};
</script>

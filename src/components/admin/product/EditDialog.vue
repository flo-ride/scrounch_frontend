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
                v-model="productName"
                :label="$t('admin.product.edit.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <v-text-field v-model="productSma" :label="$t('admin.product.edit.sma')"></v-text-field>

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

            <v-switch
                v-model="productDisabled"
                :label="$t('admin.product.edit.disabled')"
                required
            ></v-switch>
        </template>
    </EditDialogForm>
</template>

<script lang="ts">
// @ts-ignore
import EditDialogForm from "@/components/admin/EditDialogForm.vue";
// @ts-ignore
import type { FileUploadResult } from "@/types/Upload";
import type { AxiosResponse } from "axios";
// @ts-ignore
import { useProductStore } from "@/stores/product";

export default {
    data: () => ({
        loading: false,
        productId: "" as string,
        productImage: undefined as File | undefined,
        productName: "" as string,
        productSma: "" as string | undefined,
        productPrice: 0 as number,
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
            if (this.productMax == undefined) return "";
            return this.productMax === 0 ? "" : this.productMax.toString();
        },
        productStore: () => useProductStore(),
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
                price: 0,
                max_quantity_per_command: 0,
                image: undefined,
            }),
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.productId = item.id;
                this.productName = item.name;
                this.productPrice = item.price;
                this.productMax = item.max_quantity_per_command;
                this.productSma = item.sma_code;
                this.productDisabled = item.disabled;
                this.productImage = undefined; // Clear image input for edit mode
            },
        },
    },
    methods: {
        async updateItem() {
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
                                max_quantity_per_command: this.productMax,
                                disabled: this.productDisabled,
                                sma_code: this.productSma,
                            })
                            .then((_res: AxiosResponse<any, any>) => {
                                this.show = false;
                                this.productStore.fetch_all_products(axios);
                                // @ts-ignore
                                this.$refs.form.reset();
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
                axios
                    .put(`/product/${this.productId}`, {
                        name: this.productName,
                        price: this.productPrice,
                        max_quantity_per_command: this.productMax,
                        disabled: this.productDisabled,
                        sma_code: this.productSma,
                    })
                    .then((_res: AxiosResponse<any, any>) => {
                        this.show = false;
                        this.productStore.fetch_all_products(axios);
                        // @ts-ignore
                        this.$refs.form.reset();
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

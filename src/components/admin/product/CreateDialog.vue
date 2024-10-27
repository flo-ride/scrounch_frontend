<template>
    <v-dialog v-model="show">
        <template v-slot:activator="{ props: activatorProps }">
            <v-card
                v-bind="activatorProps"
                variant="tonal"
                class="d-flex justify-center align-center pa-5 rounded-lg"
                radis="xl"
                link
            >
                <v-icon x-large icon="fa-solid fa-circle-plus"></v-icon>
                <div class="text-h6 ml-2">{{ $t("admin.product.add.title") }}</div>
            </v-card>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card class="mx-auto pa-5" min-width="500">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="text-h5 text-medium-emphasis ps-2">
                        {{ $t("admin.product.add.title") }}
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
                            :label="$t('admin.product.add.image')"
                            accept="image/*"
                            :rules="imageRules"
                            prepend-icon=""
                            required
                        ></v-file-input>

                        <v-text-field
                            v-model="productName"
                            :label="$t('admin.product.add.name')"
                            :rules="nameRules"
                            :counter="32"
                            required
                        ></v-text-field>

                        <p>{{ $t("admin.product.add.price") }}</p>
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
                            {{ $t("admin.product.add.max") }}{{ productMax != 0 ? ": " : ""
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
                            :text="$t('common.add')"
                            :color="valid ? 'primary' : 'none'"
                            @click="createNewProduct"
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
import AlertError from "@/components/AlertError.vue";

export default {
    data: () => {
        return {
            show: false,
            valid: false,
            error: false,
            errorMessage: undefined as string | undefined,
            errorTitle: undefined as string | undefined,
            loading: false,
            productImage: undefined as File | undefined,
            productName: "" as string,
            productPrice: 0 as number,
            productMax: 0 as number,
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
                    if (!value || value.length == 0) return "Image is required.";
                    if (value[0].size >= 32000000) return "Image size must be lower then 32 MB.";
                    return true;
                },
            ],
            nameRules: [
                (value: String) => {
                    if (!value) return "Name is required.";
                    if (value.length > 32) return "Name must not be longer then 32 characters";
                    return true;
                },
            ],
        };
    },
    props: {
        value: Boolean,
    },
    computed: {
        displayProductMax(): string {
            if (this.productMax == 0) return "";
            return this.productMax.toString();
        },
    },
    methods: {
        async createNewProduct() {
            if (this.productImage == undefined || this.valid == false) return;
            this.loading = true;
            let formData = new FormData();
            formData.append(this.productName, this.productImage);

            // @ts-ignore
            let axios = this.$axios;

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
                        .post<string>("/product", {
                            image: filename,
                            name: this.productName,
                            price: this.productPrice,
                            max_quantity_per_command: this.productMax,
                        })
                        .then((_res: AxiosResponse<string, any>) => {
                            this.show = false;
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
        },
    },
    components: {
        AlertError,
    },
};
</script>

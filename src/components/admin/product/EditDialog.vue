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
            <v-container min-width="70vw">
                <v-row>
                    <v-col>
                        <v-img :src="imageSrcUrl(item.image)" max-height="400" cover></v-img>
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

                        <v-text-field
                            v-model="product.inventreeCode"
                            :label="$t('admin.product.edit.inventree')"
                        ></v-text-field>
                    </v-col>

                    <v-col>
                        <p>{{ $t("admin.product.edit.price") }}</p>
                        <v-number-input
                            v-model="product.sellPrice"
                            controlVariant="split"
                            :min="0.0"
                            :max="10000.0"
                            :step="0.01"
                            :hideInput="false"
                            :inset="false"
                            required
                        ></v-number-input>

                        <v-select
                            v-model="product.sellPriceCurrency"
                            :label="$t('admin.product.edit.price_currency')"
                            :items="sellPriceCurrencyItems"
                            required
                        >
                            <template v-slot:selection="data">
                                {{ $t("common.currency." + data.item.value.type) }}
                                ({{ $t("common.currency.symbol." + data.item.value.type) }})
                            </template>
                            <template v-slot:item="data">
                                <v-list-item v-bind="data.props">
                                    {{ $t("common.currency." + data.item.value.type) }}
                                    ({{ $t("common.currency.symbol." + data.item.value.type) }})
                                </v-list-item>
                            </template>
                        </v-select>

                        <!-- TODO: Add RECIPE safety in case of this type of edit -->
                        <v-select
                            v-model="product.unit"
                            :label="$t('admin.product.edit.unit')"
                            :items="unitItems"
                            required
                        >
                            <template v-slot:selection="data">
                                {{ $t("common.unit." + data.item.value.type) }}
                                ({{ $t("common.unit.symbol." + data.item.value.type) }})
                            </template>
                            <template v-slot:item="data">
                                <v-list-item v-bind="data.props">
                                    {{ $t("common.unit." + data.item.value.type) }}
                                    ({{ $t("common.unit.symbol." + data.item.value.type) }})
                                </v-list-item>
                            </template>
                        </v-select>

                        <p :class="product.maxQuantityPerCommand != 0 ? '' : 'text-disabled'">
                            {{ $t("admin.product.edit.max")
                            }}{{ product.maxQuantityPerCommand != 0 ? ": " : ""
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

                        <v-row>
                            <v-col cols="4">
                                <v-checkbox
                                    v-model="product.purchasable"
                                    :label="$t('admin.product.edit.purchasable')"
                                    required
                                ></v-checkbox>
                            </v-col>

                            <v-col cols="4">
                                <v-checkbox
                                    v-model="product.hidden"
                                    :label="$t('admin.product.edit.hidden')"
                                    required
                                ></v-checkbox>
                            </v-col>

                            <v-col cols="4">
                                <v-checkbox
                                    v-model="product.disabled"
                                    :label="$t('admin.product.edit.disabled')"
                                    required
                                ></v-checkbox>
                            </v-col>
                        </v-row>

                        <p>{{ $t("admin.product.edit.displayOrder") }}</p>
                        <v-number-input
                            v-model="product.displayOrder"
                            controlVariant="split"
                            :min="0"
                            :max="999"
                            :step="1"
                            :hideInput="false"
                            :inset="false"
                            required
                        ></v-number-input>

                        <RecipeView v-model="show_recipe" :product="product" />
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </EditDialogForm>
</template>

<script lang="ts">
import { FileType } from "@/api";
import EditDialogForm from "@/components/admin/EditDialogForm.vue";
import { Currency, CurrencyValue } from "@/types/Currency";
import { Product } from "@/types/Product";
import { Unit, UnitValue } from "@/types/Unit";
import RecipeView from "@/components/admin/recipe/RecipeView.vue";

export default {
    data: () => ({
        loading: false,
        show_recipe: false,
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
        sellPriceCurrencyItems: [
            { title: "", value: new Currency(CurrencyValue.Euro) },
            { title: "", value: new Currency(CurrencyValue.Epicoin) },
        ],
        unitItems: [
            { title: "", value: new Unit(UnitValue.Unit) },
            { title: "", value: new Unit(UnitValue.Liter) },
            { title: "", value: new Unit(UnitValue.Gram) },
            { title: "", value: new Unit(UnitValue.Meter) },
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
        "product.purchasable"(newValue: boolean) {
            console.log("purchasable ?");
            if (newValue == false) {
                this.product.hidden = true;
            }
        },
        "product.hidden"(newValue: boolean) {
            if (newValue == false) {
                this.product.purchasable = true;
            }
        },
        item: {
            immediate: true,
            handler(item) {
                this.product = item.clone();
            },
        },
    },
    methods: {
        imageSrcUrl: (imageName: string | undefined) => {
            // @ts-ignore
            let backendUrl = window.env.BACKEND_URL;
            return `${backendUrl}/download/${imageName}?type=product`;
        },
        async updateItem() {
            this.loading = true;

            if (this.productImage != undefined) {
                this.$miscApi
                    .postUploadFiles({ fileType: FileType.Product, file: this.productImage })
                    .then((res) => {
                        let filename = res.data[0][1];
                        this.product.image = filename;

                        this.$productApi
                            .editProduct({
                                id: this.product.id,
                                editProductRequest: this.product.toEditRequest(),
                            })
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
                    })
                    .catch((err: any) => {
                        console.error(err);
                        // @ts-ignore
                        this.$refs.dialogRef.openError({});
                        this.loading = false;
                    });
            } else {
                this.$productApi
                    .editProduct({
                        id: this.product.id,
                        editProductRequest: this.product.toEditRequest(),
                    })
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
        RecipeView,
    },
};
</script>

<script setup lang="ts">
import { Currency, CurrencyValue } from "@/types/Currency";
import { Product } from "@/types/Product";
import { Unit, UnitValue } from "@/types/Unit";
import { inject, ref, computed, watch, reactive } from "vue";
import { ImageApi } from "@/query/image";

const imageApi = inject("imageApi", new ImageApi());
const props = defineProps({ item: Product, loading: Boolean, editing: Boolean });

const emits = defineEmits<{
    (e: "update:item", value: Product): void;
    (e: "update:isValid", value: boolean): void;
}>();

let product = reactive(props.item.clone());
let isValid = ref(false);
let panel = ref(["identity", "price", "properties", "display"]);

watch(props.item, (value) => {
    Object.assign(product, value);
});

watch(product, (value) => {
    emits("update:item", value);
});

watch(isValid, (value) => {
    emits("update:isValid", value);
});

const editingVariant = "filled";
const nonEditingVariant = "underlined";

const tickLabels = {
    0: "None",
    2: "2",
    4: "4",
    6: "6",
    8: "8",
    10: "10",
};

const imageRules = [
    (value: File[]) => {
        if (value && value[0]?.size >= 64000000) return "Image size must be lower then 64 MB.";
        return true;
    },
];
const sellPriceCurrencyItems = [
    { title: "", value: new Currency(CurrencyValue.Euro) },
    { title: "", value: new Currency(CurrencyValue.Epicoin) },
];
const unitItems = [
    { title: "", value: new Unit(UnitValue.Unit) },
    { title: "", value: new Unit(UnitValue.Liter) },
    { title: "", value: new Unit(UnitValue.Gram) },
    { title: "", value: new Unit(UnitValue.Meter) },
];
const nameRules = [
    (value: string) =>
        !value
            ? "Name is required."
            : value.length <= 32 || "Name must not be longer than 32 characters",
];

watch(
    () => product.purchasable,
    (newValue) => {
        if (newValue == false) {
            product.hidden = true;
        }
    },
);

watch(
    () => product.hidden,
    (newValue) => {
        if (newValue == false) {
            product.purchasable = true;
        }
    },
);
</script>

<template>
    <v-form v-model="isValid">
        <v-expansion-panels multiple v-model="panel">
            <v-expansion-panel
                value="identity"
                :title="$t('admin.product.category.identity')"
                expand-icon="fa-solid fa-fingerprint"
                collapse-icon="fa-solid fa-fingerprint"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.name") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="product.name"
                                    :readonly="!editing"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                    :loading="loading"
                                    :rules="nameRules"
                                    :counter="32"
                                    required
                                />
                            </v-col>

                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.image") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-img
                                    v-if="!editing && product.image"
                                    :src="imageApi.getProductImageString(product.image)"
                                    max-height="300"
                                    cover
                                />
                                <v-file-upload
                                    v-model="product.imageFile"
                                    density="compact"
                                    variant="compact"
                                    v-else-if="editing"
                                    :rules="imageRules"
                                    accept="image/*"
                                ></v-file-upload>
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.sma") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="product.smaCode"
                                    :readonly="!editing"
                                    :hide-details="!editing"
                                    :loading="loading"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.inventree") }}
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="product.inventreeCode"
                                    :readonly="!editing"
                                    :hide-details="!editing"
                                    :loading="loading"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel
                value="price"
                :title="$t('admin.product.category.price')"
                expand-icon="fa-solid fa-money-bill-wave"
                collapse-icon="fa-solid fa-money-bill-wave"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.price") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-if="!editing"
                                    v-model="product.sellPrice"
                                    :suffix="
                                        $t(
                                            `common.currency.symbol.${product.sellPriceCurrency?.type}`,
                                        )
                                    "
                                    :loading="loading"
                                    readonly
                                    :variant="nonEditingVariant"
                                />
                                <v-number-input
                                    v-else
                                    v-model="product.sellPrice"
                                    controlVariant="split"
                                    :variant="editingVariant"
                                    :min="0.0"
                                    :max="10000.0"
                                    :precision="2"
                                    :step="0.01"
                                    :hideInput="false"
                                    :inset="false"
                                    required
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.price_currency") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-select
                                    v-model="product.sellPriceCurrency"
                                    :readonly="!editing"
                                    :loading="loading"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                    :items="sellPriceCurrencyItems"
                                    required
                                >
                                    <template v-slot:selection="item">
                                        {{ $t("common.currency." + item.item.value.type) }}
                                        ({{ $t("common.currency.symbol." + item.item.value.type) }})
                                    </template>
                                    <template v-slot:item="item">
                                        <v-list-item v-bind="item.props">
                                            {{ $t("common.currency." + item.item.value.type) }}
                                            ({{
                                                $t(
                                                    "common.currency.symbol." +
                                                        item.item.value.type,
                                                )
                                            }})
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel
                value="properties"
                :title="$t('admin.product.category.properties')"
                expand-icon="fa-solid fa-circle-info"
                collapse-icon="fa-solid fa-circle-info"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.unit") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-select
                                    v-model="product.unit"
                                    :readonly="!editing"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                    :items="unitItems"
                                    :loading="loading"
                                    required
                                >
                                    <template v-slot:selection="item">
                                        {{ $t("common.unit." + item.item.value.type) }}
                                        ({{ $t("common.unit.symbol." + item.item.value.type) }})
                                    </template>
                                    <template v-slot:item="item">
                                        <v-list-item v-bind="item.props">
                                            {{ $t("common.unit." + item.item.value.type) }}
                                            ({{ $t("common.unit.symbol." + item.item.value.type) }})
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </v-col>

                            <!-- TODO: Add RECIPE safety in case of this type of edit -->
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.max") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-if="!editing"
                                    v-model="product.maxQuantityPerCommand"
                                    readonly
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                />
                                <v-slider
                                    v-else
                                    v-model="product.maxQuantityPerCommand"
                                    :loading="loading"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                    type="number"
                                    show-ticks="always"
                                    :ticks="tickLabels"
                                    step="1"
                                    :max="10"
                                    :min="0"
                                    required
                                ></v-slider>
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.purchasable") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-checkbox
                                    required
                                    v-model="product.purchasable"
                                    :readonly="!editing"
                                    :loading="loading"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.hidden") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-checkbox
                                    required
                                    v-model="product.hidden"
                                    :readonly="!editing"
                                    :loading="loading"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.disabled") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-checkbox
                                    required
                                    v-model="product.disabled"
                                    :readonly="!editing"
                                    :loading="loading"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel
                value="display"
                :title="$t('admin.product.category.display')"
                expand-icon="fa-solid fa-display"
                collapse-icon="fa-solid fa-display"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.product.field.displayOrder") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-if="!editing"
                                    v-model="product.displayOrder"
                                    readonly
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                />
                                <v-number-input
                                    v-else
                                    v-model="product.displayOrder"
                                    :variant="editingVariant"
                                    controlVariant="split"
                                    :min="0"
                                    :max="999"
                                    :step="1"
                                    :hideInput="false"
                                    :inset="false"
                                    required
                                ></v-number-input>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-form>
</template>

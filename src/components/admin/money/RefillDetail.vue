<script setup lang="ts">
import { Currency, CurrencyValue } from "@/types/Currency";
import { Refill } from "@/types/Refill";
import { inject, ref, computed, watch, reactive } from "vue";

const props = defineProps({ item: Refill, loading: Boolean, editing: Boolean });

const emits = defineEmits<{
    (e: "update:item", value: Refill): void;
    (e: "update:isValid", value: boolean): void;
}>();

let refill = reactive(props.item.clone());
let isValid = ref(false);
let panel = ref(["identity", "price", "properties", "display"]);

watch(props.item, (value) => {
    Object.assign(refill, value);
});

watch(refill, (value) => {
    emits("update:item", value);
});

watch(isValid, (value) => {
    emits("update:isValid", value);
});

const editingVariant = "filled";
const nonEditingVariant = "underlined";

const sellPriceCurrencyItems = [
    { title: "", value: new Currency(CurrencyValue.Euro) },
    { title: "", value: new Currency(CurrencyValue.Epicoin) },
];
const nameRules = [
    (value: string) =>
        !value
            ? "Name is required."
            : value.length <= 32 || "Name must not be longer than 32 characters",
];

watch(
    () => refill.disabled,
    (newValue) => {
        if (newValue == false) {
            refill.hidden = false;
        }
    },
);

watch(
    () => refill.hidden,
    (newValue) => {
        if (newValue == true) {
            refill.disabled = true;
        }
    },
);
</script>

<template>
    <v-form v-model="isValid">
        <v-expansion-panels multiple v-model="panel">
            <v-expansion-panel
                value="identity"
                :title="$t('admin.refill.category.identity')"
                expand-icon="fa-solid fa-fingerprint"
                collapse-icon="fa-solid fa-fingerprint"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.refill.field.name") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="refill.name"
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
                                    {{ $t("admin.refill.field.price") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-if="!editing"
                                    v-model="refill.price"
                                    readonly
                                    hide-details
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                    :rules="nameRules"
                                    :counter="32"
                                    required
                                />
                                <v-number-input
                                    v-else
                                    v-model="refill.price"
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
                                    {{ $t("admin.refill.field.price_currency") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-if="!editing"
                                    :model-value="refill.priceCurrency.type"
                                    readonly
                                    hide-details
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                    :rules="nameRules"
                                    :counter="32"
                                    required
                                />
                                <v-select
                                    v-else
                                    v-model="refill.priceCurrency"
                                    disabled
                                    :loading="loading"
                                    :variant="editingVariant"
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
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.refill.field.credit") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-if="!editing"
                                    v-model="refill.credit"
                                    readonly
                                    hide-details
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                    :rules="nameRules"
                                    :counter="32"
                                    required
                                />
                                <v-number-input
                                    v-else
                                    v-model="refill.credit"
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
                                    {{ $t("admin.refill.field.credit_currency") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-if="!editing"
                                    :model-value="refill.creditCurrency.type"
                                    readonly
                                    hide-details
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                    :rules="nameRules"
                                    :counter="32"
                                    required
                                />
                                <v-select
                                    v-else
                                    v-model="refill.creditCurrency"
                                    disabled
                                    :loading="loading"
                                    :variant="editingVariant"
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
        </v-expansion-panels>
    </v-form>
</template>

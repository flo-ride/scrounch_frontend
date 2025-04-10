<script setup lang="ts">
import { Recipe, RecipeIngredient } from "@/types/Recipe";
import { TypeEnum } from "@/types/Main";
import { ref, watch, reactive } from "vue";
import { inject } from "vue";
import { ProductApi } from "@/api";
import { useQueryProducts } from "@/query/product";
import { computed } from "vue";
import DetailLink from "@/components/admin/DetailLink.vue";

const productApi = inject("productApi", new ProductApi());

const props = defineProps({
    item: Recipe,
    loading: Boolean,
    editing: Boolean,
    lockedOutput: Boolean,
});

const emits = defineEmits<{
    (e: "update:item", value: Recipe): void;
    (e: "update:isValid", value: boolean): void;
}>();

let recipe = reactive(props.item.clone());
let isValid = ref(false);
let panel = ref(["identity", "ingredients"]);

const { data, isLoading } = useQueryProducts(productApi, 1, 1000, []);

const productItems = computed(() => {
    return data.value.products.map((product) => {
        return {
            title: product.name,
            value: product.id,
            product: product,
        };
    });
});

watch(props.item, (value) => {
    Object.assign(recipe, value);
});

watch(recipe, (value) => {
    emits("update:item", value);
});

watch(isValid, (value) => {
    if (recipe.ingredients.length <= 0) value = false;
    emits("update:isValid", value);
});

const editingVariant = "filled";
const nonEditingVariant = "underlined";

const productRules = [(value: String) => (value?.length == 0 ? "Product mut be present" : true)];

const customFilter = (_itemTitle: string, queryText: string, item: any) => {
    const textOne = item.raw.title.toLowerCase();
    const searchText = queryText.toLowerCase();
    return textOne.indexOf(searchText) > -1;
};

const addIngredient = () => {
    recipe.ingredients = [...recipe.ingredients, RecipeIngredient.default()];
};
const deleteIngredient = (index: number) => {
    recipe.ingredients.splice(index, 1);
    if (recipe.ingredients.length <= 0) {
        isValid.value = false;
    }
};
</script>

<template>
    <v-form v-model="isValid">
        <v-expansion-panels multiple v-model="panel">
            <v-expansion-panel
                value="identity"
                :title="$t('admin.recipe.category.identity')"
                expand-icon="fa-solid fa-fingerprint"
                collapse-icon="fa-solid fa-fingerprint"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.recipe.field.name") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="recipe.name"
                                    :readonly="!editing"
                                    :hide-details="!editing"
                                    :loading="loading"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.recipe.field.output") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <DetailLink
                                    v-if="recipe.result_product_id && !editing"
                                    :id="recipe.result_product_id"
                                    :type="TypeEnum.Product"
                                />
                                <v-autocomplete
                                    v-model="recipe.result_product_id"
                                    v-if="editing"
                                    :disabled="lockedOutput"
                                    :loading="isLoading"
                                    :items="productItems"
                                    :custom-filter="customFilter"
                                    :rules="productRules"
                                    required
                                ></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel
                value="ingredients"
                :title="$t('admin.recipe.category.ingredients')"
                expand-icon="fa-solid fa-wheat-awn"
                collapse-icon="fa-solid fa-wheat-awn"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row
                            v-for="[index, ingredient] of recipe.ingredients.entries()"
                            :key="index"
                            v-if="!editing"
                        >
                            <v-col cols="3">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.recipe.field.ingredient.product") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="3">
                                <DetailLink
                                    v-if="ingredient.product_id"
                                    :id="ingredient.product_id"
                                    :type="TypeEnum.Product"
                                />
                            </v-col>
                            <v-col cols="3">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.recipe.field.ingredient.quantity") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                    v-model="ingredient.quantity"
                                    readonly
                                    hide-details
                                    :loading="loading"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>
                        </v-row>
                        <v-row
                            v-for="[index, ingredient] of recipe.ingredients.entries()"
                            :key="index"
                            v-if="editing"
                        >
                            <v-col cols="5">
                                <v-autocomplete
                                    v-model="ingredient.product_id"
                                    :loading="isLoading"
                                    :items="productItems"
                                    :custom-filter="customFilter"
                                    :rules="productRules"
                                    required
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols="5">
                                <v-number-input
                                    v-model="ingredient.quantity"
                                    :variant="editingVariant"
                                    :min="0.01"
                                    :max="100000.0"
                                    :precision="2"
                                    :step="0.01"
                                    :hideInput="false"
                                    :inset="false"
                                    required
                                />
                            </v-col>
                            <v-col cols="1">
                                <v-btn
                                    class="rounded"
                                    icon="fa-solid fa-close"
                                    @click="deleteIngredient(index)"
                                />
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col cols="3">
                                <v-btn
                                    v-if="editing"
                                    @click="addIngredient"
                                    prepend-icon="fa-solid fa-add"
                                >
                                    {{ $t("admin.recipe.add.ingredient") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-form>
</template>

<template>
    <CreateDialogForm
        v-model="show"
        :title="$t('common.add')"
        icon="fa-solid fa-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="createItem"
    >
        <template v-slot:activator="{ activator }">
            <v-btn
                class="ma-2"
                v-bind="activator"
                :disable="loading"
                variant="tonal"
                append-icon="fa-solid fa-plus"
                :text="$t('common.add')"
            ></v-btn>
        </template>
        <template #form-content>
            <v-text-field
                v-model="recipe.name"
                :label="$t('admin.recipe.add.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <v-autocomplete
                v-model="recipe.result_product_id"
                :label="$t('admin.recipe.add.product')"
                :items="productItems"
                :custom-filter="customFilter"
                :rules="productRules"
                required
            ></v-autocomplete>

            <v-card>
                <v-card-title> Ingredients: </v-card-title>
                <v-card-text>
                    <v-expansion-panels variant="accordion">
                        <v-virtual-scroll max-height="200" :items="recipe.ingredients">
                            <template v-slot:default="{ item, index }">
                                <v-expansion-panel
                                    :key="index"
                                    :title="getIngredientName(recipe.ingredients[index])"
                                >
                                    <template #text>
                                        <div class="d-xl-inline-flex justify-space-between">
                                            <v-autocomplete
                                                min-width="300"
                                                class="ma-2"
                                                :rules="ingredientRules"
                                                v-model="recipe.ingredients[index].product_id"
                                                :label="$t('admin.recipe.add.ingredient_product')"
                                                :items="productItems"
                                                :custom-filter="customFilter"
                                                required
                                            ></v-autocomplete>

                                            <v-number-input
                                                class="ma-2"
                                                min-width="120"
                                                v-model="recipe.ingredients[index].quantity"
                                                :min="0.1"
                                                :max="10000.0"
                                                :step="1"
                                                :label="$t('admin.recipe.add.ingredient_quantity')"
                                                :hideInput="false"
                                                controlVariant="stacked"
                                                :inset="false"
                                                required
                                            ></v-number-input>
                                            <v-checkbox
                                                class="ma-2"
                                                v-model="recipe.ingredients[index].disabled"
                                                :label="$t('admin.recipe.add.ingredient_disabled')"
                                                :suffix="item.product_id"
                                                required
                                            ></v-checkbox>
                                            <v-btn
                                                icon="fa-solid fa-trash"
                                                @click="deleteIngredient(index)"
                                            />
                                        </div>
                                    </template>
                                </v-expansion-panel>
                            </template>
                        </v-virtual-scroll>
                    </v-expansion-panels>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        :disable="loading"
                        variant="tonal"
                        icon="fa-solid fa-plus"
                        @click="addIngredient"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </CreateDialogForm>
</template>

<script lang="ts">
import CreateDialogForm from "@/components/admin/CreateDialogForm.vue";
import type { Product } from "@/types/Product";
import { Recipe, RecipeIngredient } from "@/types/Recipe";

export default {
    data: () => ({
        loading: false,
        productItems: [] as any[],
        recipe: Recipe.default(),
        nameRules: [
            (value: String) =>
                value?.length > 32 ? "Name must not be longer than 32 characters" : true,
        ],
        productRules: [(value: String) => (value?.length == 0 ? "Product mut be present" : true)],
        ingredientRules: [
            (value: String) => (value?.length == 0 ? "Ingredient mut be present" : true),
        ],
    }),
    props: {
        modelValue: Boolean,
        productId: String,
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

        itemProduct(item: RecipeIngredient): Product | undefined {
            return this.productItems.find((x) => x.value == item.product_id);
        },
    },
    watch: {
        productId: {
            immediate: true,
            handler(item) {
                this.recipe.result_product_id = item;
            },
        },
    },
    emits: ["isDone", "update:modelValue"],
    methods: {
        getIngredientName(item: RecipeIngredient): string {
            if (item == undefined || item.product_id == null || item.product_id.length == 0) {
                return "No Product";
            } else {
                let product = this.productItems.find((x) => x.value == item.product_id);
                if (product == undefined) {
                    return "Product Not Found";
                }
                return (
                    `${product.product.name} × ${item.quantity}${this.getIngredientUnit(item)}` ??
                    "Product Not Found"
                );
            }
        },
        getIngredientUnit(item: RecipeIngredient): string {
            if (item == undefined || item.product_id.length == 0) {
                return "";
            } else {
                let product = this.productItems.find((x) => x.value == item.product_id);
                if (product == undefined) {
                    return "";
                }
                return this.$t("common.unit.symbol." + product.product.unit) ?? "";
            }
        },
        addIngredient() {
            this.recipe.ingredients.push(RecipeIngredient.default());
        },
        deleteIngredient(index: number) {
            this.recipe.ingredients.splice(index, 1);
        },
        async createItem() {
            this.loading = true;
            try {
                await this.$recipeApi.postNewRecipe({
                    newRecipeRequest: this.recipe.toNewRequest(),
                });
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
        customFilter(_itemTitle: string, queryText: string, item: any) {
            const textOne = item.raw.title.toLowerCase();
            const searchText = queryText.toLowerCase();

            return textOne.indexOf(searchText) > -1;
        },
        async searchProduct() {
            this.productItems = [];
            this.loading = true;
            this.$productApi.getAllProducts({ page: 0, perPage: 20 }).then((response) => {
                this.productItems = this.productItems.concat(
                    response.data.products.map((product) => {
                        return { title: product.name, value: product.id, product: product };
                    }),
                );
                let total_page = response.data.total_page;
                let futures = [];
                for (let i = 1; i < total_page; i++) {
                    futures.push(
                        this.$productApi
                            .getAllProducts({ page: i, perPage: 20 })
                            .then((response) => {
                                this.productItems = this.productItems.concat(
                                    response.data.products.map((product) => {
                                        return {
                                            title: product.name,
                                            value: product.id,
                                            product: product,
                                        };
                                    }),
                                );
                            }),
                    );
                }
                Promise.all(futures).finally(() => (this.loading = false));
            });
        },
    },
    mounted() {
        this.searchProduct();
    },
    components: {
        CreateDialogForm,
    },
};
</script>

<template>
    <v-dialog v-model="show">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                class="w-100"
                min-height="40"
                variant="tonal"
                append-icon="fa-solid fa-blender"
            >
                {{ $t("admin.product.edit.recipe.recipe") }}
            </v-btn>
        </template>

        <v-card class="mx-auto pa-5" min-width="500">
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">
                    {{ $t("admin.product.edit.recipe.title") }}
                </div>
                <v-btn icon="fa-solid fa-xmark" variant="text" @click="show = false"></v-btn>
            </v-card-title>

            <v-form v-model="valid" fast-fail ref="form">
                <v-row>
                    <v-col :cols="items.length == 0 ? 6 : 8">
                        <v-card-text>
                            <div
                                key="title"
                                class="text-h6 font-weight-light pa-4 text-center"
                                v-if="items.length == 0"
                            >
                                {{ $t("admin.product.edit.recipe.empty") }}
                            </div>

                            <v-treeview
                                min-width="200"
                                v-else
                                :items="items"
                                activatable
                                active-strategy="single-independent"
                                transition
                                v-model:activated="active"
                            >
                            </v-treeview>
                        </v-card-text>
                    </v-col>
                    <v-divider :vertical="mdAndUp" class="my-md-3"></v-divider>
                    <v-col :cols="items.length == 0 ? 6 : 4">
                        <v-card-text>
                            <div key="title" class="text-h6 font-weight-light pa-4 text-center">
                                <CreateDialog
                                    v-model="createItem"
                                    @is-done="refresh"
                                    :product-id="product.id"
                                />

                                <EditDialog
                                    v-model="editItem"
                                    @is-done="refresh"
                                    :item="selected"
                                />

                                <DeleteDialog
                                    v-model="deleteItem"
                                    @is-done="refresh"
                                    :item="selected"
                                />
                            </div>
                        </v-card-text>
                    </v-col>
                </v-row>

                <v-card-actions class="d-flex justify-end"> </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";
import CreateDialog from "@/components/admin/recipe/CreateDialog.vue";
import EditDialog from "@/components/admin/recipe/EditDialog.vue";
import DeleteDialog from "@/components/admin/recipe/DeleteDialog.vue";

export default {
    data: () => ({
        createItem: false,
        editItem: false,
        deleteItem: false,
        valid: false,
        loading: false,
        recipes: [] as Recipe[],
        items: [] as any[],
        active: [],
    }),
    props: {
        modelValue: Boolean,
        product: {
            type: Product,
            required: true,
            default: () => Product.default(),
        },
    },
    computed: {
        mdAndUp(): boolean {
            // @ts-ignore
            return this.$vuetify.display.mdAndUp;
        },
        show: {
            get(): boolean {
                return this.modelValue;
            },
            set(value: boolean) {
                this.$emit("update:modelValue", value);
            },
        },
        selected() {
            if (!this.active.length) return undefined;
            const recipe = this.recipes.find((recipe) => recipe.id == this.active[0]);

            return recipe;
        },
    },
    watch: {
        product: {
            deep: true,
            handler() {
                this.loadItems();
            },
        },
    },
    emits: ["update:modelValue"],
    methods: {
        refresh() {
            this.loadItems();
        },
        loadItems() {
            if (this.product == undefined) return;
            this.loading = true;
            this.$recipeApi
                .getAllRecipes({ resultProductIdEq: this.product.id })
                .then(async (response) => {
                    let recipes = response.data.recipes.map((x) => Recipe.fromResponse(x));
                    let ingredientIds: string[] = [];
                    recipes.forEach((recipe) =>
                        ingredientIds.concat(
                            recipe.ingredients.map((recipe_product) => recipe_product.product_id),
                        ),
                    );
                    let response_products = await this.$productApi.getAllProducts({
                        idEq: ingredientIds,
                        perPage: 100,
                    });
                    const products = response_products.data.products
                        .map((x) => Product.fromResponse(x))
                        .reduce(
                            (acc, item) => {
                                acc[item.id] = item;
                                return acc;
                            },
                            {} as Record<string, Product>,
                        );

                    this.recipes = recipes;
                    this.items = recipes.map((recipe) => {
                        return {
                            value: recipe.id,
                            title: recipe.name ?? recipe.id,
                            children: recipe.ingredients.map((ingredient) => {
                                let product = products[ingredient.product_id];
                                return {
                                    value: ingredient.product_id,
                                    title: `${product.name} × ${ingredient.quantity} ${this.$t("common.unit.symbol." + product.unit.type)}`,
                                    quantity: ingredient.quantity,
                                };
                            }),
                        };
                    });
                });
        },
    },
    mounted() {
        this.loadItems();
    },
    components: {
        CreateDialog,
        EditDialog,
        DeleteDialog,
    },
};
</script>

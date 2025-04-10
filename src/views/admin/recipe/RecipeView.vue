<script setup lang="ts">
import { RecipeApi, RecipeSortEnum } from "@/api";
import { useQueryRecipes } from "@/query/recipe";
import { computed } from "vue";
import { inject, ref } from "vue";
import { TypeEnum } from "@/types/Main";
import DetailLink from "@/components/admin/DetailLink.vue";

const { id } = defineProps({ id: String });
const recipeApi = inject("recipeApi", new RecipeApi());

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([RecipeSortEnum.CreatedAtDesc]);

const { isLoading, data } = useQueryRecipes(recipeApi, !id ? [] : [id], page, itemsPerPage, sortBy);

const totalItems = computed(() => data.value.totalPage * itemsPerPage.value);

const loadItems = (options: { page: number; itemsPerPage: number; sortBy?: any }) => {
    page.value = options.page;
    itemsPerPage.value = options.itemsPerPage;

    if (!options.sortBy) return;
    const sort = options.sortBy.map(
        ({ key, order }: { key: string; order?: boolean | "asc" | "desc" }) => {
            if (order == undefined || order == false || order == "desc") {
                switch (key) {
                    case "id":
                        return RecipeSortEnum.IdDesc;
                    case "name":
                        return RecipeSortEnum.NameDesc;
                    case "created_at":
                        return RecipeSortEnum.CreatedAtDesc;
                    default:
                        return RecipeSortEnum.CreatedAtDesc;
                }
            } else {
                switch (key) {
                    case "id":
                        return RecipeSortEnum.IdAsc;
                    case "name":
                        return RecipeSortEnum.NameAsc;
                    case "created_at":
                        return RecipeSortEnum.CreatedAtAsc;
                    default:
                        return RecipeSortEnum.CreatedAtAsc;
                }
            }
        },
    );

    sort.push(RecipeSortEnum.CreatedAtDesc);
    sortBy.value = sort;
};

const headers = [
    {
        title: "Recipe",
        key: "name",
    },
    {
        title: "Output Products",
        key: "output",
    },
    {
        title: "Ingredients",
        key: "ingredients",
    },
];
</script>

<template>
    <div>
        <v-row justify="center">
            <v-btn
                prepend-icon="fa-solid fa-circle-plus"
                :to="id ? `/admin/product/${id}/recipe/new` : '/admin/recipe/new'"
            >
                {{ $t("admin.recipe.add.title") }}
            </v-btn>
        </v-row>
        <v-row>
            <v-col>
                <v-data-table-server
                    :loading="isLoading"
                    :headers="headers"
                    v-model:search="search"
                    v-model:items-per-page="itemsPerPage"
                    :page="page"
                    :items="data.recipes"
                    :items-length="totalItems"
                    @update:options="loadItems"
                    item-value="id"
                >
                    <template v-slot:item.name="{ item }">
                        <DetailLink v-if="item.id" :id="item.id" :type="TypeEnum.Recipe" />
                    </template>

                    <template v-slot:item.output="{ item }">
                        <DetailLink
                            v-if="item.result_product_id"
                            :id="item.result_product_id"
                            :type="TypeEnum.Product"
                        />
                    </template>

                    <template v-slot:item.ingredients="{ item }">
                        <span
                            v-for="[index, ingredient] of item.ingredients.entries()"
                            :key="index"
                        >
                            <DetailLink
                                v-if="ingredient.product_id"
                                :id="ingredient.product_id"
                                :type="TypeEnum.Product"
                            />
                        </span>
                    </template>
                </v-data-table-server>
            </v-col>
        </v-row>
    </div>
</template>

import { RecipeApi, RecipeSortEnum } from "@/api";
import { Recipe } from "@/types/Recipe";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toValue, type MaybeRefOrGetter } from "vue";

const recipeFetcher = (recipeApi: RecipeApi, productId: MaybeRefOrGetter<string>) => {
    if (toValue(productId).length == 0) return;
    return recipeApi
        .getRecipe({ id: toValue(productId) })
        .then((response) => Recipe.fromResponse(response.data));
};

export const useQueryRecipe = (recipeApi: RecipeApi, id: MaybeRefOrGetter<string>) => {
    return useQuery({
        queryKey: ["recipe", toValue(id)],
        queryFn: async () => recipeFetcher(recipeApi, id),
    });
};

const mutateRecipe = async (recipeApi: RecipeApi, recipe: MaybeRefOrGetter<Recipe>) => {
    const recipeValue = toValue(recipe);
    if (!recipeValue.id || recipeValue.id.length == 0) {
        return recipeApi
            .postNewRecipe({ newRecipeRequest: toValue(recipe).toNewRequest() })
            .then((response) => response.data);
    } else {
        return recipeApi
            .editRecipe({
                id: recipeValue.id,
                editRecipeRequest: toValue(recipe).toEditRequest(),
            })
            .then((_) => null);
    }
};

export const useMutateRecipe = (recipeApi: RecipeApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (recipe: Recipe) => mutateRecipe(recipeApi, recipe),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["recipe", data ?? variables.id], variables);
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
    });
};

const deleteRecipe = async (recipeApi: RecipeApi, id: string) => {
    return recipeApi.deleteRecipe({
        id,
    });
};

export const useDeleteRecipe = (recipeApi: RecipeApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteRecipe(recipeApi, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["recipe", variables] });
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
    });
};

const recipesFetcher = (
    recipeApi: RecipeApi,
    productId: MaybeRefOrGetter<string[]>,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sort: MaybeRefOrGetter<RecipeSortEnum[]>,
) =>
    recipeApi
        .getAllRecipes({
            resultProductIdEq: toValue(productId),
            page: toValue(page) - 1,
            perPage: toValue(itemsPerPage),
            sort: toValue(sort),
        })
        .then((response) => response.data)
        .then((data) => {
            return {
                totalPage: data.total_page,
                currentPage: data.current_page,
                recipes: data.recipes.map((recipe) => Recipe.fromResponse(recipe)),
            };
        });

export const useQueryRecipes = (
    recipeApi: RecipeApi,
    productId: MaybeRefOrGetter<string[]>,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sortBy: MaybeRefOrGetter<RecipeSortEnum[]>,
) =>
    useQuery({
        queryKey: ["recipes", productId, page, itemsPerPage, sortBy],
        queryFn: () => recipesFetcher(recipeApi, productId, page, itemsPerPage, sortBy),
        placeholderData: keepPreviousData,
        initialData: { totalPage: 1, currentPage: 1, recipes: [] },
    });

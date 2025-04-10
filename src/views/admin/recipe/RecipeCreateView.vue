<script setup lang="ts">
import { inject, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { RecipeApi } from "@/api";
import { useMutateRecipe } from "@/query/recipe";
import { Recipe } from "@/types/Recipe";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import RecipeDetail from "@/components/admin/recipe/RecipeDetail.vue";

const { id } = defineProps({ id: String });

const recipeApi = inject("recipeApi", new RecipeApi());
const router = useRouter();

let item = reactive(Recipe.default());
let isValid = ref(false);

item.result_product_id = id ?? "";

const {
    isPending: mutationPending,
    mutate,
    isSuccess: isSuccessMutate,
    data: mutationData,
} = useMutateRecipe(recipeApi);

const onUpdateItem = (value: Recipe) => {
    Object.assign(item, value);
};

const onUpdateIsValid = (value: boolean) => {
    isValid.value = value;
};

const onUpdateEditing = () => {
    router.go(-1);
};

const createItem = () => {
    mutate(item);
};

watch(isSuccessMutate, (isSuccessMutate) => {
    if (!isSuccessMutate || !mutationData.value) return;
    router.replace(`/admin/recipe/${mutationData.value}`);
});
</script>

<template>
    <v-row>
        <v-col cols="12">
            <DetailHeader
                editing
                editable
                :save-loading="mutationPending"
                :is-saveable="isValid"
                @update:editing="onUpdateEditing"
                @on-save="createItem"
            />
        </v-col>
        <v-col cols="12">
            <RecipeDetail
                class="ma-4"
                editing
                :item="item"
                :locked-output="id != undefined"
                @update:item="onUpdateItem"
                @update:is-valid="onUpdateIsValid"
            />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { RecipeApi } from "@/api";
import { Recipe } from "@/types/Recipe";
import { inject, ref, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { useDeleteRecipe, useMutateRecipe, useQueryRecipe } from "@/query/recipe";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import RecipeDetail from "@/components/admin/recipe/RecipeDetail.vue";

const { id } = defineProps({ id: String });

const recipeApi = inject("recipeApi", new RecipeApi());
const router = useRouter();

const { isLoading, isFetching, isError, data, refetch, error } = useQueryRecipe(
    recipeApi,
    id ?? "",
);
const {
    isPending: mutationPending,
    mutate: editRecipe,
    isSuccess: isSuccessMutate,
} = useMutateRecipe(recipeApi);

const {
    isPending: deletionPending,
    mutate: deleteRecipe,
    isSuccess: isSuccessDelete,
} = useDeleteRecipe(recipeApi);

let item = reactive(Recipe.default());
let editing = ref(false);
let hasChanged = ref(false);
let isValid = ref(false);

const onUpdateEditing = (newEditing: boolean) => {
    editing.value = newEditing;
    hasChanged.value = false;
    if (newEditing == false && data.value) {
        onUpdateItem(data.value);
    }
};

const onUpdateItem = (value: Recipe) => {
    Object.assign(item, value);
};

const onUpdateisValid = (value: boolean) => {
    isValid.value = value;
};

const saveItem = () => {
    editRecipe(item);
};

const deleteItem = () => {
    if (!id) return;
    deleteRecipe(id);
};

watch(isFetching, () => {
    if (!data.value) return;
    onUpdateItem(data.value);
});

watch(isSuccessDelete, () => {
    router.go(-1);
});

watch(item, (newValue) => {
    if (editing.value == true) {
        hasChanged.value = newValue != data.value;
    }
});

watch(isSuccessMutate, (isSuccess) => {
    if (isSuccess == false) return;
    editing.value = false;
});

watch(isError, () => {
    console.log(error.value);
});
</script>

<template>
    <v-overlay v-if="isLoading" v-model="isLoading" class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <v-empty-state
        v-else-if="isError"
        :headline="`Whoops`"
        :text="error?.message"
        title="Something Went Wrong"
        action-text="Go Back"
        @click:action="router.go(-1)"
    ></v-empty-state>
    <v-row v-else-if="item">
        <v-col cols="12">
            <DetailHeader
                :editing="editing"
                editable
                deletable
                refreshable
                exitable
                :refresh-loading="isFetching"
                :save-loading="mutationPending"
                :delete-loading="deletionPending"
                :is-saveable="hasChanged && isValid"
                @update:editing="onUpdateEditing"
                @on-delete="deleteItem"
                @on-refresh="refetch"
                @on-save="saveItem"
            />
        </v-col>
        <v-col cols="12">
            <RecipeDetail
                class="ma-4"
                :item="item"
                :editing="editing"
                @update:item="onUpdateItem"
                @update:is-valid="onUpdateisValid"
            >
            </RecipeDetail>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { MiscApi, ProductApi } from "@/api";
import { Product } from "@/types/Product";
import { inject, ref, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMutateImage } from "@/query/image";
import { useDeleteProduct, useMutateProduct, useQueryProduct } from "@/query/product";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import ProductDetail from "@/components/admin/product/ProductDetail.vue";
import RecipeView from "@/views/admin/recipe/RecipeView.vue";

const { id } = defineProps({ id: String });

const productApi = inject("productApi", new ProductApi());
const miscApi = inject("miscApi", new MiscApi());
const router = useRouter();

const { isLoading, isFetching, isError, data, refetch, error } = useQueryProduct(
    productApi,
    id ?? "",
);
const {
    isPending: mutationPending,
    mutate: editProduct,
    isSuccess: isSuccessMutate,
} = useMutateProduct(productApi);

const {
    isPending: deletionPending,
    mutate: deleteProduct,
    isSuccess: isSuccessDelete,
} = useDeleteProduct(productApi);

const { mutate: addImage, isSuccess: isSuccessImage, data: imageData } = useMutateImage(miscApi);

let item = reactive(Product.default());
let editing = ref(false);
let hasChanged = ref(false);
let isValid = ref(false);
let panel = ref(["product"]);

const onUpdateEditing = (newEditing: boolean) => {
    editing.value = newEditing;
    hasChanged.value = false;
    if (newEditing == false && data.value) {
        onUpdateItem(data.value);
    }
};

const onUpdateItem = (value: Product) => {
    Object.assign(item, value);
};

const onUpdateisValid = (value: boolean) => {
    isValid.value = value;
};

const saveItem = () => {
    if (item.imageFile) {
        addImage(item.imageFile);
    } else {
        editProduct(item);
    }
};

const deleteItem = () => {
    if (!id) return;
    deleteProduct(id);
};

watch(isFetching, () => {
    if (!data.value) return;
    onUpdateItem(data.value);
});

watch(isSuccessDelete, () => {
    router.go(-1);
});

watch(isSuccessImage, () => {
    item.image = imageData.value ?? null;
    editProduct(item);
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
        <v-expansion-panels multiple v-model="panel">
            <v-expansion-panel
                value="product"
                :title="$t('admin.product.category.product')"
                expand-icon="fa-solid fa-mug-hot"
                collapse-icon="fa-solid fa-mug-hot"
            >
                <v-expansion-panel-text>
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
                        <ProductDetail
                            class="ma-4"
                            :item="item"
                            :editing="editing"
                            @update:item="onUpdateItem"
                            @update:is-valid="onUpdateisValid"
                        />
                    </v-col>
                </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel
                value="recipe"
                :title="$t('admin.product.category.recipe')"
                expand-icon="fa-solid fa-mortar-pestle"
                collapse-icon="fa-solid fa-mortar-pestle"
            >
                <v-expansion-panel-text>
                    <v-col cols="12">
                        <RecipeView :id="id" />
                    </v-col>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-row>
</template>

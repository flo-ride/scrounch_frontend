<script setup lang="ts">
import { inject, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ProductApi } from "@/api";
import { useMutateProduct } from "@/query/product";
import { Product } from "@/types/Product";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import ProductDetail from "@/components/admin/product/ProductDetail.vue";

const productApi = inject("productApi", new ProductApi());
const router = useRouter();

let item = reactive(Product.default());
let isValid = ref(false);

const {
    isPending: mutationPending,
    mutate,
    isSuccess: isSuccessMutate,
    data: mutationData,
} = useMutateProduct(productApi);

const onUpdateItem = (value: Product) => {
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
    router.replace(`/admin/product/${mutationData.value}`);
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
            <ProductDetail
                class="ma-4"
                editing
                :item="item"
                @update:item="onUpdateItem"
                @update:is-valid="onUpdateIsValid"
            />
        </v-col>
    </v-row>
</template>

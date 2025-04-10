<script setup lang="ts">
import { ProductApi, ProductSortEnum } from "@/api";
import { ImageApi } from "@/query/image";
import { useQueryProducts } from "@/query/product";
import { inject, ref, type Ref } from "vue";

const productApi = inject("productApi", new ProductApi());
const imageApi = inject("imageApi", new ImageApi());

const page = ref(1);
const itemsPerPage = ref(20);
const sortBy = ref([ProductSortEnum.DisplayOrderDesc, ProductSortEnum.CreatedAtDesc]);

const { isLoading, isError, data } = useQueryProducts(productApi, page, itemsPerPage, sortBy);
</script>

<template>
    <v-progress-circular
        v-if="isLoading"
        color="primary"
        indeterminate
        :size="128"
        :width="12"
    ></v-progress-circular>
    <v-container v-else-if="isError"> Error </v-container>
    <div v-else-if="data" class="mt-2">
        <v-row>
            <v-col
                v-for="product in data.products"
                :key="product?.id ?? undefined"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
                <v-card
                    :color="product.disabled ? 'error' : undefined"
                    :variant="product.disabled ? 'outlined' : undefined"
                    :to="`/admin/product/${product.id}`"
                >
                    <v-card-title>{{ product.name }} ({{ product.sellPrice }}€)</v-card-title>
                    <v-card-text>
                        <v-img
                            v-if="product.image"
                            :src="imageApi.getProductImageString(product.image)"
                            height="200px"
                            aspect-ratio="1/1"
                            class="mb-2"
                        >
                            <template v-slot:placeholder>
                                <v-skeleton-loader :elevation="24" type="card"></v-skeleton-loader>
                            </template>
                        </v-img>
                        <p>
                            {{ product.createdAt.toLocaleString() }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12">
                <v-pagination
                    v-model="page"
                    :length="data.totalPage"
                    :total-visible="3"
                ></v-pagination>
            </v-col>
        </v-row>
    </div>
    >
</template>

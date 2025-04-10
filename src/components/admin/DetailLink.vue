<script setup lang="ts">
import { LocationApi, ProductApi, RecipeApi, RefillApi, UserApi, WarehouseApi } from "@/api";
import { useQueryLocation } from "@/query/location";
import { useQueryProduct } from "@/query/product";
import { useQueryRecipe } from "@/query/recipe";
import { useQueryRefill } from "@/query/refill";
import { useQueryUser } from "@/query/user";
import { useQueryWarehouse } from "@/query/warehouse";
import { Location } from "@/types/Location";
import { TypeEnum } from "@/types/Main";
import { Product } from "@/types/Product";
import { Refill } from "@/types/Refill";
import { User } from "@/types/User";
import { Warehouse } from "@/types/Warehouse";
import { inject } from "vue";
import { computed } from "vue";

const { id, type: linkType } = defineProps<{
    id: string;
    type: TypeEnum;
}>();

const productApi = inject("productApi", new ProductApi());
const recipeApi = inject("recipeApi", new RecipeApi());
const warehouseApi = inject("warehouseApi", new WarehouseApi());
const userApi = inject("userApi", new UserApi());
const refillApi = inject("refillApi", new RefillApi());
const locationApi = inject("locationApi", new LocationApi());

const useQuery = () => {
    switch (linkType) {
        case TypeEnum.Product:
            return useQueryProduct(productApi, id);
        case TypeEnum.Warehouse:
            return useQueryWarehouse(warehouseApi, id);
        case TypeEnum.User:
            return useQueryUser(userApi, id);
        case TypeEnum.Recipe:
            return useQueryRecipe(recipeApi, id);
        case TypeEnum.Location:
            return useQueryLocation(locationApi, id);
        case TypeEnum.Refill:
            return useQueryRefill(refillApi, id);
    }
};

const { data, isFetching, isSuccess, isError } = useQuery();

const icon = computed(() => {
    switch (linkType) {
        case TypeEnum.Product:
            return "fa-solid fa-mug-hot";
        case TypeEnum.Warehouse:
            return "fa-solid fa-warehouse";
        case TypeEnum.User:
            return "fa-solid fa-user";
        case TypeEnum.Recipe:
            return "fa-solid fa-mortar-pestle";
        case TypeEnum.Location:
            return "fa-solid fa-location-dot";
        case TypeEnum.Refill:
            return "fa-solid fa-money-bill-transfer";
    }
});

const link = computed(() => {
    switch (linkType) {
        case TypeEnum.Product:
            return `/admin/product/${id}`;
        case TypeEnum.Warehouse:
            return `/admin/warehouse/${id}`;
        case TypeEnum.User:
            return `/admin/user/${id}`;
        case TypeEnum.Recipe:
            return `/admin/recipe/${id}`;
        case TypeEnum.Location:
            return `/admin/location/${id}`;
        case TypeEnum.Refill:
            return `/admin/refill/${id}`;
    }
});

const nameComputed = computed(() => {
    if (!data.value) return id.substring(0, 10);

    let value = data.value;
    switch (linkType) {
        case TypeEnum.Product:
            if (value instanceof Product) return value.name;
            break;
        case TypeEnum.Warehouse:
            if (value instanceof Warehouse) return value.name;
            break;
        case TypeEnum.User:
            if (value instanceof User) {
                if (value.username) return value.username;
            }
            break;
        case TypeEnum.Recipe:
            if (value instanceof Refill) {
                if (value.name) return value.name;
            }
            break;
        case TypeEnum.Location:
            if (value instanceof Location) return value.name;
            break;
        case TypeEnum.Refill:
            if (value instanceof Refill) {
                if (value.name) return value.name;
            }
            break;
    }
    if (!value.name) return id.substring(0, 10);
    return value.name ?? "";
});

const color = computed(() => {
    if (isSuccess) return "primary";
    if (isError) return "error";
});
</script>

<template>
    <v-chip
        :text="nameComputed"
        :loading="isFetching"
        border="thin opacity-25"
        :disabled="isError"
        :prepend-icon="icon"
        :color="color"
        label
        :to="link"
    >
        <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
        </template>
    </v-chip>
</template>

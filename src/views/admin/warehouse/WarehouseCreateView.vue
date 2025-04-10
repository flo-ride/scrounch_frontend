<script setup lang="ts">
import { inject, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { WarehouseApi } from "@/api";
import { useMutateWarehouse } from "@/query/warehouse";
import { Warehouse } from "@/types/Warehouse";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import WarehouseDetail from "@/components/admin/warehouse/WarehouseDetail.vue";

const warehouseApi = inject("warehouseApi", new WarehouseApi());
const router = useRouter();

let item = reactive(Warehouse.default());
let isValid = ref(false);

const {
    isPending: mutationPending,
    mutate,
    isSuccess: isSuccessMutate,
    data: mutationData,
} = useMutateWarehouse(warehouseApi);

const onUpdateItem = (value: Warehouse) => {
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
    router.replace(`/admin/warehouse/${mutationData.value}`);
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
            <WarehouseDetail
                class="ma-4"
                editing
                :item="item"
                @update:item="onUpdateItem"
                @update:is-valid="onUpdateIsValid"
            />
        </v-col>
    </v-row>
</template>

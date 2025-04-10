<script setup lang="ts">
import { inject, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { RefillApi } from "@/api";
import { useMutateRefill } from "@/query/refill";
import { Refill } from "@/types/Refill";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import RefillDetail from "@/components/admin/money/RefillDetail.vue";

const refillApi = inject("refillApi", new RefillApi());
const router = useRouter();

let item = reactive(Refill.default());
let isValid = ref(false);

const {
    isPending: mutationPending,
    mutate,
    isSuccess: isSuccessMutate,
    data: mutationData,
} = useMutateRefill(refillApi);

const onUpdateItem = (value: Refill) => {
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
    router.replace(`/admin/refill/${mutationData.value}`);
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
            <RefillDetail
                class="ma-4"
                editing
                :item="item"
                @update:item="onUpdateItem"
                @update:is-valid="onUpdateIsValid"
            />
        </v-col>
    </v-row>
</template>

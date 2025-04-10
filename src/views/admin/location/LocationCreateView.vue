<script setup lang="ts">
import { inject, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { LocationApi } from "@/api";
import { useMutateLocation } from "@/query/location";
import { Location } from "@/types/Location";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import LocationDetail from "@/components/admin/location/LocationDetail.vue";

const locationApi = inject("locationApi", new LocationApi());
const router = useRouter();

let item = reactive(Location.default());
let isValid = ref(false);

const {
    isPending: mutationPending,
    mutate,
    isSuccess: isSuccessMutate,
    data: mutationData,
} = useMutateLocation(locationApi);

const onUpdateItem = (value: Location) => {
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
    router.replace(`/admin/location/${mutationData.value}`);
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
            <LocationDetail
                class="ma-4"
                editing
                :item="item"
                @update:item="onUpdateItem"
                @update:is-valid="onUpdateIsValid"
            />
        </v-col>
    </v-row>
</template>

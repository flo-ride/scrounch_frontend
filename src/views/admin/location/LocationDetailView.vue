<script setup lang="ts">
import { LocationApi } from "@/api";
import { Location } from "@/types/Location";
import { inject, ref, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { useDeleteLocation, useMutateLocation, useQueryLocation } from "@/query/location";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import LocationDetail from "@/components/admin/location/LocationDetail.vue";

const { id } = defineProps({ id: String });

const locationApi = inject("locationApi", new LocationApi());
const router = useRouter();

const { isLoading, isFetching, isError, data, refetch, error } = useQueryLocation(
    locationApi,
    id ?? "",
);
const {
    isPending: mutationPending,
    mutate: editLocation,
    isSuccess: isSuccessMutate,
} = useMutateLocation(locationApi);

const {
    isPending: deletionPending,
    mutate: deleteLocation,
    isSuccess: isSuccessDelete,
} = useDeleteLocation(locationApi);

let item = reactive(Location.default());
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

const onUpdateItem = (value: Location) => {
    Object.assign(item, value);
};

const onUpdateisValid = (value: boolean) => {
    isValid.value = value;
};

const saveItem = () => {
    editLocation(item);
};

const deleteItem = () => {
    if (!id) return;
    deleteLocation(id);
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
            <LocationDetail
                class="ma-4"
                :item="item"
                :editing="editing"
                @update:item="onUpdateItem"
                @update:is-valid="onUpdateisValid"
            >
            </LocationDetail>
        </v-col>
    </v-row>
</template>

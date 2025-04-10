<script setup lang="ts">
import { UserApi } from "@/api";
import { User } from "@/types/User";
import { inject, ref, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMutateUser, useQueryUser } from "@/query/user";
import DetailHeader from "@/components/admin/DetailHeader.vue";
import UserDetail from "@/components/admin/user/UserDetail.vue";

const { id } = defineProps({ id: String });

const userApi = inject("userApi", new UserApi());
const router = useRouter();

const { isLoading, isFetching, isError, data, refetch, error } = useQueryUser(userApi, id ?? "");
const {
    isPending: mutationPending,
    mutate: editUser,
    isSuccess: isSuccessMutate,
} = useMutateUser(userApi);

let item = reactive(User.default());
let editing = ref(false);
let hasChanged = ref(false);
let isValid = ref(false);
let userImage = ref<File | undefined>(undefined);

const onUpdateEditing = (newEditing: boolean) => {
    editing.value = newEditing;
    hasChanged.value = false;
    if (newEditing == false && data.value) {
        onUpdateItem(data.value);
    }
};

const onUpdateItem = (value: User) => {
    Object.assign(item, value);
};

const onUpdateisValid = (value: boolean) => {
    isValid.value = value;
};

const saveItem = () => {
    editUser(item);
};

watch(isFetching, () => {
    if (!data.value) return;
    onUpdateItem(data.value);
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
                refreshable
                exitable
                :refresh-loading="isFetching"
                :save-loading="mutationPending"
                :is-saveable="hasChanged && isValid"
                @update:editing="onUpdateEditing"
                @on-refresh="refetch"
                @on-save="saveItem"
            />
        </v-col>
        <v-col cols="12">
            <UserDetail
                class="ma-4"
                :item="item"
                :editing="editing"
                @update:item="onUpdateItem"
                @update:is-valid="onUpdateisValid"
            >
            </UserDetail>
        </v-col>
    </v-row>
</template>

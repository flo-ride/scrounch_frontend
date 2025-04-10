<script setup lang="ts">
import { computed, watch } from "vue";
import { ref } from "vue";

const {
    refreshLoading: refreshLoadingProps,
    saveLoading: saveLoadingProps,
    deleteLoading: deleteLoadingProps,
    editing: editingProps,
} = defineProps({
    refreshable: Boolean,
    editable: Boolean,
    deletable: Boolean,
    exitable: Boolean,
    refreshLoading: Boolean,
    saveLoading: Boolean,
    deleteLoading: Boolean,
    isSaveable: Boolean,
    editing: Boolean,
});

const emits = defineEmits<{
    (e: "update:editing", value: boolean): void;
    (e: "onDelete"): void;
    (e: "onRefresh"): void;
    (e: "onSave"): void;
}>();

const editing = ref(editingProps);
const deleting = ref(false);
const refreshLoading = ref(false);
const saveLoading = ref(false);
const deleteLoading = ref(false);

const loading = computed(() => refreshLoading.value || saveLoading.value || deleteLoading.value);

const toggleEditing = () => {
    editing.value = !editing.value;
    deleting.value = false;
};

const toggleDeleting = () => {
    deleting.value = !deleting.value;
    editing.value = false;
};

const onSave = () => {
    emits("onSave");
};

const onRefresh = () => {
    refreshLoading.value = true;
    editing.value = false;
    emits("onRefresh");
};

watch(
    () => editingProps,
    (newEditing) => (editing.value = newEditing),
);
watch(editing, (newEditing) => emits("update:editing", newEditing));

watch(
    () => refreshLoadingProps,
    (newRefresh) => (refreshLoading.value = newRefresh),
);
watch(
    () => saveLoadingProps,
    (newSaving) => {
        saveLoading.value = newSaving;
    },
);
watch(
    () => deleteLoadingProps,
    (newDelete) => {
        deleteLoading.value = newDelete;
    },
);
</script>

<template>
    <v-container class="d-flex justify-end">
        <v-btn
            v-if="refreshable"
            :disabled="loading"
            :loading="refreshLoading"
            @click="onRefresh"
            rounded="lg"
            icon="fa-solid fa-refresh"
            class="mx-1"
        >
        </v-btn>
        <v-card v-if="editable" rounded="lg" class="mx-1">
            <v-btn
                rounded="0"
                icon="fa-solid fa-pen"
                :disabled="loading"
                @click="toggleEditing"
                :variant="editing ? 'tonal' : undefined"
            >
            </v-btn>
            <v-btn
                v-show="editing"
                color="success"
                :disabled="!isSaveable || loading"
                :loading="saveLoading"
                @click="onSave"
                rounded="0"
                icon="fa-solid fa-check"
                variant="text"
            >
            </v-btn>
            <v-btn
                v-show="editing"
                color="error"
                :disabled="loading"
                rounded="0"
                icon="fa-solid fa-xmark"
                @click="editing = false"
                variant="text"
            >
            </v-btn>
        </v-card>

        <v-card v-if="deletable" :disabled="loading" rounded="lg" class="mx-1">
            <v-btn
                rounded="0"
                icon="fa-solid fa-trash"
                :disabled="loading"
                @click="toggleDeleting"
                :variant="deleting ? 'tonal' : undefined"
            >
            </v-btn>
            <v-btn
                v-show="deleting"
                color="success"
                rounded="0"
                icon="fa-solid fa-check"
                variant="text"
                :loading="deleteLoading"
                :disabled="loading"
                @click="emits('onDelete')"
            >
            </v-btn>
            <v-btn
                v-show="deleting"
                color="error"
                rounded="0"
                icon="fa-solid fa-xmark"
                :disabled="loading"
                @click="deleting = false"
                variant="text"
            >
            </v-btn>
        </v-card>
        <v-btn
            v-show="exitable"
            rounded="lg"
            icon="fa-solid fa-arrow-up-from-bracket"
            class="mx-1"
            @click="$router.go(-1)"
        >
        </v-btn>
    </v-container>
</template>

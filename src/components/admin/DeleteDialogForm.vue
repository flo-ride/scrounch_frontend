<template>
    <v-dialog v-model="show">
        <v-card class="mx-auto pa-5" min-width="500">
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">{{ title }}</div>
                <v-btn icon="fa-solid fa-xmark" variant="text" @click="show = false"></v-btn>
            </v-card-title>

            <v-card-actions class="d-flex justify-space-between">
                <v-btn
                    variant="flat"
                    rounded="xl"
                    :text="$t('common.cancel')"
                    @click="show = false"
                ></v-btn>
                <v-btn
                    :disabled="loading"
                    :loading="loading"
                    variant="flat"
                    rounded="xl"
                    prepend-icon="fa-solid fa-check"
                    :text="$t('common.delete')"
                    color="error"
                    @click="submitForm"
                >
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <AlertError v-model="error" :title="errorTitle" :message="errorMessage" />
</template>

<script lang="ts">
import AlertError from "@/components/AlertError.vue";

export default {
    data: () => ({
        error: false,
        errorTitle: undefined as undefined | string,
        errorMessage: undefined as undefined | string,
    }),
    props: {
        modelValue: Boolean,
        title: String,
        icon: String,
        loading: Boolean,
    },
    computed: {
        show: {
            get(): boolean {
                return this.modelValue;
            },
            set(value: boolean) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    emits: ["submit", "update:modelValue"],
    components: {
        AlertError,
    },
    methods: {
        openError({ title, message }: { title?: string; message?: string }) {
            this.error = false;
            this.errorTitle = title;
            this.errorMessage = message;
            this.error = true;
        },
        submitForm() {
            this.$emit("submit");
        },
    },
};
</script>

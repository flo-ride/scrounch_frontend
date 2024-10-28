<template>
    <v-dialog v-model="show">
        <template v-slot:activator="{ props: activatorProps }">
            <v-card
                v-bind="activatorProps"
                variant="tonal"
                class="d-flex justify-center align-center pa-5 rounded-lg"
                radis="xl"
                link
            >
                <v-icon x-large :icon="icon"></v-icon>
                <div class="text-h6 ml-2">{{ title }}</div>
            </v-card>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card class="mx-auto pa-5" min-width="500">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="text-h5 text-medium-emphasis ps-2">{{ title }}</div>
                    <v-btn
                        icon="fa-solid fa-xmark"
                        variant="text"
                        @click="isActive.value = false"
                    ></v-btn>
                </v-card-title>

                <v-form v-model="valid" fast-fail ref="form">
                    <v-card-text>
                        <slot name="form-content"></slot>
                    </v-card-text>

                    <v-card-actions class="d-flex justify-end">
                        <v-btn
                            variant="flat"
                            rounded="xl"
                            :text="$t('common.cancel')"
                            @click="isActive.value = false"
                        ></v-btn>
                        <v-btn
                            :disabled="!valid || loading"
                            :loading="loading"
                            variant="flat"
                            rounded="xl"
                            prepend-icon="fa-solid fa-check"
                            :text="$t('common.add')"
                            :color="valid ? 'primary' : 'none'"
                            @click="submitForm"
                        >
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </template>
    </v-dialog>

    <AlertError v-model="error" :title="errorTitle" :message="errorMessage" />
</template>

<script lang="ts">
// @ts-ignore
import AlertError from "@/components/AlertError.vue";

export default {
    data: () => ({
        valid: false,
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
    emits: ["submit", "update:modelValue"],
    components: {
        AlertError,
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
        clearForm() {
            // @ts-ignore
            this.$refs.form.reset();
        },
    },
};
</script>

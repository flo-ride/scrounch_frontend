<template>
    <v-dialog v-model="show">
        <template v-slot:default="{ isActive }">
            <v-card class="mx-auto pa-5" min-width="500">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="text-h5 text-medium-emphasis ps-2">
                        {{ $t("admin.user.edit.title") }}
                    </div>
                    <v-btn
                        icon="fa-solid fa-xmark"
                        variant="text"
                        @click="isActive.value = false"
                    ></v-btn>
                </v-card-title>

                <v-form fast-fail>
                    <v-card-text>
                        <v-switch
                            v-model="userIsAdmin"
                            :label="$t('admin.user.edit.isAdmin')"
                            required
                        ></v-switch>
                    </v-card-text>

                    <v-card-actions class="d-flex justify-end">
                        <v-btn
                            variant="flat"
                            rounded="xl"
                            :text="$t('common.cancel')"
                            @click="isActive.value = false"
                        ></v-btn>
                        <v-btn
                            :disabled="loading"
                            variant="flat"
                            rounded="xl"
                            prepend-icon="fa-solid fa-check"
                            :text="$t('common.save')"
                            color="primary"
                            @click="updateUser"
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
import type { AxiosResponse } from "axios";
// @ts-ignore
import AlertError from "@/components/AlertError.vue";

export default {
    props: {
        modelValue: {
            type: Boolean,
        },
        user: {
            type: Object,
            required: true,
            default: () => ({
                is_admin: false,
            }),
        },
    },
    data: () => ({
        error: false,
        errorMessage: undefined as string | undefined,
        errorTitle: undefined as string | undefined,
        loading: false,
        userId: "" as string,
        userIsAdmin: false,
    }),
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
    watch: {
        user: {
            immediate: true,
            handler(newUser) {
                console.log(newUser);
                this.userId = newUser.id;
                this.userIsAdmin = newUser.is_admin;
            },
        },
    },
    methods: {
        async updateUser() {
            this.loading = true;

            // @ts-ignore
            let axios = this.$axios;

            axios
                .put(`/user/${this.userId}`, {
                    is_admin: this.userIsAdmin,
                })
                .then((_res: AxiosResponse<any, any>) => {
                    this.show = false;
                })
                .catch((err: any) => {
                    this.error = true;
                    console.error(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    components: {
        AlertError,
    },
};
</script>

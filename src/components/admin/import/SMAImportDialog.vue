<template>
    <v-dialog v-model="show" max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps">
                {{ $t("admin.import.smaButton") }}
            </v-btn>
        </template>
        <template v-slot:default="">
            <v-card>
                <v-card-title>
                    <span class="text-h6">
                        {{ $t("admin.import.smaButton") }}
                    </span>
                </v-card-title>
                <v-card-text>
                    <v-switch
                        v-model="overwriteName"
                        :label="$t('admin.import.overwriteName')"
                    ></v-switch>
                    <v-switch
                        v-model="overwritePrice"
                        :label="$t('admin.import.overwritePrice')"
                    ></v-switch>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        :loading="loading"
                        :disable="disable"
                        color="primary"
                        @click="importSma"
                        >{{ $t("common.import") }}</v-btn
                    >
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
    <AlertError v-model="error" :title="errorTitle" :message="errorMessage" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AlertError from "@/components/AlertError.vue";
import type { AxiosResponse } from "axios";

export default defineComponent({
    methods: {
        async importSma() {
            this.loading = true;
            this.disable = true;

            this.$miscApi
                .postUpdateFromSma({ name: this.overwriteName, price: this.overwritePrice })
                .then((_res: AxiosResponse<any, any>) => {
                    // TODO: ADD new dialog just for confirmation
                    this.show = false;
                })
                .catch((err: any) => {
                    this.error = true;
                    this.errorMessage = err;
                    console.error(err);
                })
                .finally(() => {
                    this.disable = false;
                    this.loading = false;
                });
        },
    },
    data: () => {
        return {
            show: false,
            loading: false,
            disable: false,
            overwriteName: false,
            overwritePrice: false,
            error: false,
            errorMessage: undefined as string | undefined,
            errorTitle: undefined as string | undefined,
        };
    },
});
</script>

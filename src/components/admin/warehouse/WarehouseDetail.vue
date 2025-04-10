<script setup lang="ts">
import { Warehouse } from "@/types/Warehouse";
import { ref, watch, reactive } from "vue";

const props = defineProps({ item: Warehouse, loading: Boolean, editing: Boolean });

const emits = defineEmits<{
    (e: "update:item", value: Warehouse): void;
    (e: "update:isValid", value: boolean): void;
}>();

let warehouse = reactive(props.item.clone());
let isValid = ref(false);
let panel = ref(["identity"]);

watch(props.item, (value) => {
    Object.assign(warehouse, value);
});

watch(warehouse, (value) => {
    emits("update:item", value);
});

watch(isValid, (value) => {
    emits("update:isValid", value);
});

const editingVariant = "filled";
const nonEditingVariant = "underlined";

const timeSinceCreation = (creationTime: Date) => {
    return creationTime.toLocaleString("fr-FR");
};

const nameRules = [
    (value: string) =>
        !value
            ? "Name is required."
            : value.length <= 32 || "Name must not be longer than 32 characters",
];
</script>

<template>
    <v-form v-model="isValid">
        <v-expansion-panels multiple v-model="panel">
            <v-expansion-panel
                value="identity"
                :title="$t('admin.warehouse.category.identity')"
                expand-icon="fa-solid fa-fingerprint"
                collapse-icon="fa-solid fa-fingerprint"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.warehouse.field.name") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    :rules="nameRules"
                                    v-model="item.name"
                                    :readonly="!editing"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                    :loading="loading"
                                    required
                                />
                            </v-col>

                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.warehouse.field.createdAt") }}
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    :model-value="timeSinceCreation(item.createdAt)"
                                    readonly
                                    :disabled="editing"
                                    hide-details
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                    required
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel
                value="properties"
                :title="$t('admin.warehouse.category.properties')"
                expand-icon="fa-solid fa-circle-info"
                collapse-icon="fa-solid fa-circle-info"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.warehouse.field.disabled") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-checkbox
                                    required
                                    v-model="item.disabled"
                                    :readonly="!editing"
                                    :loading="loading"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-form>
</template>

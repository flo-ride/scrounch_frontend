<script setup lang="ts">
import { Location, LocationCategory } from "@/types/Location";
import { ref, watch, reactive } from "vue";

const props = defineProps({ item: Location, loading: Boolean, editing: Boolean });

const emits = defineEmits<{
    (e: "update:item", value: Location): void;
    (e: "update:isValid", value: boolean): void;
}>();

let location = reactive(props.item.clone());
let isValid = ref(false);
let panel = ref(["identity", "properties"]);

watch(props.item, (value) => {
    Object.assign(location, value);
});

watch(location, (value) => {
    emits("update:item", value);
});

watch(isValid, (value) => {
    emits("update:isValid", value);
});

const editingVariant = "filled";
const nonEditingVariant = "underlined";

const categoryItems = [
    { title: "None", value: null },
    { title: "Room", value: LocationCategory.Room },
    { title: "Dispenser", value: LocationCategory.Dispenser },
];

const nameRules = [
    (value: string) =>
        !value
            ? "Name is required."
            : value.length <= 32 || "Name must not be longer than 32 characters",
];

watch(
    () => location.disabled,
    (newValue) => {
        if (newValue == true) {
            location.hidden = false;
        }
    },
);

watch(
    () => location.hidden,
    (newValue) => {
        if (newValue == true) {
            location.disabled = true;
        }
    },
);
</script>

<template>
    <v-form v-model="isValid">
        <v-expansion-panels multiple v-model="panel">
            <v-expansion-panel
                value="identity"
                :title="$t('admin.location.category.identity')"
                expand-icon="fa-solid fa-fingerprint"
                collapse-icon="fa-solid fa-fingerprint"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.location.field.name") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="location.name"
                                    :readonly="!editing"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                    :loading="loading"
                                    :rules="nameRules"
                                    :counter="32"
                                    required
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.location.field.category") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-if="!editing"
                                    v-model="location.category"
                                    readonly
                                    hide-details
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                    :rules="nameRules"
                                    :counter="32"
                                    required
                                />
                                <v-select
                                    v-else
                                    v-model="location.category"
                                    :readonly="!editing"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                    :items="categoryItems"
                                    :loading="loading"
                                    required
                                >
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel
                value="properties"
                :title="$t('admin.location.category.properties')"
                expand-icon="fa-solid fa-circle-info"
                collapse-icon="fa-solid fa-circle-info"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.location.field.hidden") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-checkbox
                                    required
                                    v-model="location.hidden"
                                    :readonly="!editing"
                                    :loading="loading"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.location.field.disabled") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-checkbox
                                    required
                                    v-model="location.disabled"
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

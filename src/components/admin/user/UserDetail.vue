<script setup lang="ts">
import { User } from "@/types/User";
import { ref, watch, reactive } from "vue";

const props = defineProps({ item: User, loading: Boolean, editing: Boolean });

const emits = defineEmits<{
    (e: "update:item", value: User): void;
    (e: "update:isValid", value: boolean): void;
}>();

let user = reactive(props.item.clone());
let isValid = ref(false);
let panel = ref(["identity", "rights"]);

watch(props.item, (value) => {
    Object.assign(user, value);
});

watch(user, (value) => {
    emits("update:item", value);
});

watch(isValid, (value) => {
    emits("update:isValid", value);
});

const editingVariant = "filled";
const nonEditingVariant = "underlined";

const timeSinceLastConnection = (lastConnection: Date) => {
    const now = new Date();
    const differenceMs = now.getTime() - lastConnection.getTime();

    const minutes = Math.floor(differenceMs / (1000 * 60));
    const hours = Math.floor(differenceMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} jour${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
        return `${hours} heure${hours > 1 ? "s" : ""}`;
    } else {
        return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
};
const timeSinceCreation = (creationTime: Date) => {
    return creationTime.toLocaleString("fr-FR");
};

watch(
    () => user.isAdmin,
    (newValue) => {
        if (newValue == true) {
            user.isBanned = false;
        }
    },
);

watch(
    () => user.isBanned,
    (newValue) => {
        if (newValue == true) {
            user.isAdmin = false;
        }
    },
);
</script>

<template>
    <v-form v-model="isValid">
        <v-expansion-panels multiple v-model="panel">
            <v-expansion-panel
                value="identity"
                :title="$t('admin.user.category.identity')"
                expand-icon="fa-solid fa-fingerprint"
                collapse-icon="fa-solid fa-fingerprint"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.user.field.name") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="item.name"
                                    readonly
                                    hide-details
                                    :disabled="editing"
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                    required
                                />
                            </v-col>

                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.user.field.email") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="item.email"
                                    readonly
                                    hide-details
                                    :disabled="editing"
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                    required
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.user.field.username") }}
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="item.username"
                                    readonly
                                    hide-details
                                    :disabled="editing"
                                    :variant="nonEditingVariant"
                                    :loading="loading"
                                    required
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.user.field.createdAt") }}
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
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.user.field.lastAccess") }}
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    class="my-1"
                                    :model-value="timeSinceLastConnection(item.lastAccessAt)"
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
                value="rights"
                :title="$t('admin.user.category.rights')"
                expand-icon="fa-solid fa-user-plus"
                collapse-icon="fa-solid fa-user-plus"
            >
                <v-expansion-panel-text>
                    <v-container>
                        <v-row>
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.user.field.isBanned") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-checkbox
                                    required
                                    v-model="item.isBanned"
                                    :readonly="!editing"
                                    :loading="loading"
                                    :hide-details="!editing"
                                    :variant="editing ? editingVariant : nonEditingVariant"
                                />
                            </v-col>

                            <!-- TODO: Add RECIPE safety in case of this type of edit -->
                            <v-col cols="4">
                                <v-list-subheader class="mt-3">
                                    {{ $t("admin.user.field.isAdmin") }}:
                                </v-list-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-checkbox
                                    required
                                    v-model="item.isAdmin"
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

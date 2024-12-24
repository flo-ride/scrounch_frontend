<template>
    <DeleteDialogForm
        v-model="show"
        :title="$t('common.delete')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="updateItem"
    >
        <template v-slot:activator="{ activator }">
            <v-btn
                class="ma-2"
                v-bind="activator"
                :disabled="recipeId.length == 0"
                variant="tonal"
                append-icon="fa-solid fa-trash"
                :text="$t('common.delete')"
            ></v-btn>
        </template>
    </DeleteDialogForm>
</template>

<script lang="ts">
import DeleteDialogForm from "@/components/admin/DeleteDialogForm.vue";
import { Recipe } from "@/types/Recipe";

export default {
    data: () => ({
        loading: false,
        recipeId: "",
    }),
    emits: ["isDone", "update:modelValue"],
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
    props: {
        modelValue: {
            type: Boolean,
        },
        item: {
            type: Recipe,
            required: true,
            default: () => Recipe.default(),
        },
    },
    watch: {
        item: {
            immediate: true,
            handler(item) {
                this.recipeId = item.id;
            },
        },
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                await this.$recipeApi.deleteRecipe({ id: this.recipeId });
                this.show = false;
                this.$emit("isDone");
            } catch (err) {
                // @ts-ignore
                this.$refs.dialogRef.openError({});
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
    },
    components: {
        DeleteDialogForm,
    },
};
</script>

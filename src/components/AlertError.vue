<template>
    <v-dialog v-model="show">
        <div class="d-flex justify-center">
            <v-card :color="color" class="custom-alert" max-width="500" dark>
                <v-card-title>
                    <v-icon left>{{ icon }}</v-icon>
                    {{ titleComputed }}
                </v-card-title>

                <v-card-text>
                    <h3>{{ messageComputed }}</h3>
                </v-card-text>
            </v-card>
        </div>
    </v-dialog>
</template>

<script lang="ts">
export default {
    props: {
        modelValue: {
            type: Boolean,
        },
        title: {
            type: String,
            default: "Oooops",
        },
        message: {
            type: String,
            default: "An error has occurred.",
        },
        icon: {
            type: String,
            default: "fa-solid fa-exclamation",
        },
        color: {
            type: String,
            default: "error",
        },
    },
    emit: ["update:modelValue"],
    computed: {
        show: {
            get(): boolean {
                return this.modelValue;
            },
            set(value: boolean) {
                this.$emit("update:modelValue", value);
            },
        },
        messageComputed() {
            if (this.message == undefined) {
                return "An error has occurred.";
            }
            return this.message;
        },
        titleComputed() {
            if (this.title == undefined) {
                return "Oooops";
            }
            return this.title;
        },
    },
};
</script>

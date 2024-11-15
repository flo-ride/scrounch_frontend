<template>
    <v-container>
        <v-alert
            type="error"
            prominent
            border="top"
            colored-border
            elevation="2"
            class="ma-4"
            :title="$t('unavailable.title')"
            :text="$t('unavailable.text')"
        >
            <v-icon large left>mdi-alert-circle-outline</v-icon>
        </v-alert>
    </v-container>
</template>

<script lang="ts">
export default {
    methods: {
        isBackendUp() {
            this.$miscApi
                .getStatus()
                .then((res) => {
                    if (res.status != 200 || res.data != "UP") {
                        this.$router.push("/unavailable");
                    }
                    this.$router.push("/");
                })
                .catch((_err) => {
                    this.$router.push("/unavailable");
                });
        },
    },
    mounted() {
        this.isBackendUp();
    },
};
</script>

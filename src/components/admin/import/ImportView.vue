<template>
    <div class="d-flex justify-center align-center">
        <SMAImportDialog />
    </div>
</template>

<script lang="ts">
// @ts-ignore
import SMAImportDialog from "@/components/admin/import/SMAImportDialog.vue";

export default {
    components: {
        SMAImportDialog,
    },
};
</script>

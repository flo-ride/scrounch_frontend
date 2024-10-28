<template>
    <CreateDialogForm
        v-model="show"
        :title="$t('admin.product.add.title')"
        icon="fa-solid fa-circle-plus"
        ref="dialogRef"
        :loading="loading"
        @submit="createItem"
    >
        <template #form-content>
            <v-file-input
                v-model="productImage"
                :label="$t('admin.product.add.image')"
                accept="image/*"
                :rules="imageRules"
                prepend-icon=""
                required
            ></v-file-input>

            <v-text-field
                v-model="productName"
                :label="$t('admin.product.add.name')"
                :rules="nameRules"
                :counter="32"
                required
            ></v-text-field>

            <p>{{ $t("admin.product.add.price") }}</p>
            <v-number-input
                v-model="productPrice"
                controlVariant="split"
                :min="0.0"
                :max="100.0"
                :step="0.01"
                suffix="€"
                :hideInput="false"
                :inset="false"
                required
            ></v-number-input>

            <p :class="productMax != 0 ? '' : 'text-disabled'">
                {{ $t("admin.product.add.max") }}{{ productMax != 0 ? ": " : ""
                }}{{ displayProductMax }}
            </p>
            <v-slider
                v-model="productMax"
                type="number"
                show-ticks="always"
                :ticks="tickLabels"
                step="1"
                :max="10"
                :min="0"
                required
            ></v-slider>
        </template>
    </CreateDialogForm>
</template>

<script lang="ts">
// @ts-ignore
import CreateDialogForm from "@/components/admin/CreateDialogForm.vue";
// @ts-ignore
import { useProductStore } from "@/stores/product";

export default {
    data: () => ({
        loading: false,
        productImage: undefined,
        productName: "",
        productPrice: 0,
        productMax: 0,
        tickLabels: { 0: "None", 2: "2", 4: "4", 6: "6", 8: "8", 10: "10" },
        imageRules: [
            (value: File[]) =>
                !value || !value.length
                    ? "Image is required."
                    : value[0].size >= 32000000
                      ? "Image size must be lower than 32 MB."
                      : true,
        ],
        nameRules: [
            (value: String) =>
                !value
                    ? "Name is required."
                    : value.length > 32
                      ? "Name must not be longer than 32 characters"
                      : true,
        ],
    }),
    props: {
        modelValue: Boolean,
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
        productStore: () => useProductStore(),
        displayProductMax(): string {
            if (this.productMax == 0) return "";
            return this.productMax.toString();
        },
    },
    methods: {
        async createItem() {
            if (!this.productImage) return;
            this.loading = true;
            const formData = new FormData();
            formData.append(this.productName, this.productImage);
            try {
                // @ts-ignore
                let axios = this.$axios;
                const res = await axios.post("/upload", formData, {
                    params: { type: "product" },
                    headers: { "Content-Type": "multipart/form-data" },
                });
                const filename = res.data[0][1];
                await axios.post("/product", {
                    image: filename,
                    name: this.productName,
                    price: this.productPrice,
                    max_quantity_per_command: this.productMax,
                });
                // @ts-ignore
                this.$refs.dialogRef.closeDialog();
                // @ts-ignore
                this.$refs.dialogRef.clearForm();

                this.productStore.fetch_all_products(axios);
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
        CreateDialogForm,
    },
};
</script>

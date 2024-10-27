import { defineStore } from "pinia";
import type { Product } from "@/types/Product";
import type { ProductListResponse } from "@/types/responses/product";
import type { AxiosInstance } from "axios";

export const useProductStore = defineStore("product", {
    state: () => {
        return {
            products: [] as Product[],
        };
    },
    actions: {
        async fetch_all_products(axios: AxiosInstance) {
            let products: Product[] = [];
            let current_page = 0;
            let total_page = 1;
            do {
                let response = await axios.get<ProductListResponse>(
                    `/product?page=${current_page}&per_page=20`,
                );
                if (response.status == 200) {
                    let response_products = response.data.products.map((x) => {
                        return {
                            image: x.image,
                            id: x.id,
                            name: x.name,
                            price: x.price,
                            max_quantity_per_command: x.max_quantity_per_command,
                            creation_time: x.creation_time,
                            sma_code: x.sma_code,
                            disabled: x.disabled,
                        };
                    });

                    products = products.concat(response_products);
                    total_page = response.data.total_page;
                }

                current_page++;
            } while (current_page < total_page);

            this.products = products;
        },
    },
});

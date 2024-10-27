import { v4 as uuid } from "uuid";

export type ProductResponse = {
    image?: string;

    id: typeof uuid;

    name: string;

    price: number;

    max_quantity_per_command?: number;

    creation_time: Date;

    sma_code?: string;

    disabled?: boolean;
};

export type EditedProductResponse = {
    image?: string;

    id: typeof uuid;

    name?: string;

    price?: number;

    max_quantity_per_command?: number;

    sma_code?: string;

    disabled?: boolean;
};

export type ProductListResponse = {
    products: ProductResponse[];

    current_page: number;

    total_page: number;
};

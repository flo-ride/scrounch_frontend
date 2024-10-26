import { v4 as uuid } from "uuid";

export type Product = {
    image?: string;

    id: typeof uuid;

    name: string;

    price: number;

    quantity?: number;

    max_quantity_per_command?: number;

    creation_time: Date;

    sma_code?: string;

    disabled?: boolean;
};

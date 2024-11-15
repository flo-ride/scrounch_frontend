import type { EditProductRequest, NewProductRequest, ProductResponse } from "@/api";
import { Currency } from "@/types/Currency";

export class Product {
    id: string;
    name: string;
    price: number;
    currency: Currency;
    image?: string;
    maxQuantityPerCommand?: number;
    disabled: boolean;
    smaCode?: string;
    createdAt: Date;

    constructor(
        id: string,
        name: string,
        price: number,
        currency: Currency,
        createdAt: Date,
        image?: string | null,
        maxQuantityPerCommand?: number | null,
        disabled?: boolean | null,
        smaCode?: string | null,
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.currency = currency;
        this.image = image ?? undefined;
        this.maxQuantityPerCommand = maxQuantityPerCommand ?? undefined;
        this.disabled = disabled ?? false;
        this.smaCode = smaCode ?? undefined;
        this.createdAt = createdAt;
    }

    /**
     * Creates a default Product instance with placeholder values.
     * @returns A Product instance with default values.
     */
    static default(): Product {
        return new Product(
            "default-id",
            "Default Product",
            0,
            Currency.default(),
            new Date(),
            null,
            null,
            false,
            null,
        );
    }

    /**
     * Creates a deep copy of the current Product instance.
     * @returns A new Product instance with the same properties.
     */
    clone(): Product {
        return new Product(
            this.id,
            this.name,
            this.price,
            this.currency.clone(), // Ensure CurrencyResponse is cloned
            new Date(this.createdAt), // Clone the Date to avoid shared reference
            this.image,
            this.maxQuantityPerCommand,
            this.disabled,
            this.smaCode,
        );
    }

    /**
     * Converts a ProductResponse to a Product instance.
     * @param response The response containing product data.
     * @returns A Product instance.
     */
    static fromResponse(response: ProductResponse): Product {
        return new Product(
            response.id,
            response.name,
            response.price,
            Currency.fromResponse(response.currency),
            new Date(response.created_at),
            response.image ?? null,
            response.max_quantity_per_command ?? null,
            response.disabled ?? null,
            response.sma_code ?? null,
        );
    }

    /**
     * Converts a Product instance to an EditProductRequest.
     * @returns An EditProductRequest object.
     */
    toEditRequest(): EditProductRequest {
        return {
            name: this.name ?? null,
            price: this.price ?? null,
            currency: this.currency.toRequest(),
            image: this.image ?? null,
            max_quantity_per_command: this.maxQuantityPerCommand ?? null,
            disabled: this.disabled ?? null,
            sma_code: this.smaCode ?? null,
        };
    }

    /**
     * Converts a Product instance to a NewProductRequest.
     * @returns A NewProductRequest object.
     */
    toNewRequest(): NewProductRequest {
        return {
            name: this.name,
            price: this.price,
            currency: this.currency.toRequest(),
            image: this.image ?? null,
            max_quantity_per_command: this.maxQuantityPerCommand ?? null,
            sma_code: this.smaCode ?? undefined,
        };
    }
}

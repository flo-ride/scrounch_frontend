import type { EditProductRequest, NewProductRequest, ProductResponse } from "@/api";
import { Currency } from "@/types/Currency";
import { Unit } from "@/types/Unit";

export class Product {
    id: string;
    name: string;
    image?: string;
    display_order: number,
    sell_price: number;
    sell_price_currency: Currency;
    maxQuantityPerCommand?: number;
    purchasable: boolean;
    unit: Unit;
    disabled: boolean;
    createdAt: Date;
    smaCode?: string;

    constructor(
        id: string,
        name: string,
        display_order: number,

        sell_price: number,
        sell_price_currency: Currency,

        unit: Unit,

        createdAt: Date,

        maxQuantityPerCommand?: number | null,
        purchasable?: boolean | null,
        disabled?: boolean | null,
        image?: string | null,
        smaCode?: string | null,
    ) {
        this.id = id;
        this.name = name;
        this.display_order = display_order;
        this.sell_price = sell_price;
        this.sell_price_currency = sell_price_currency;
        this.unit = unit;
        this.image = image ?? undefined;
        this.maxQuantityPerCommand = maxQuantityPerCommand ?? undefined;
        this.disabled = disabled ?? false;
        this.purchasable = purchasable ?? true;
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

            0.0,
            Currency.default(),

            Unit.default(),

            new Date(),

            null,
            true,

            false,

            null,
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
            this.display_order,
            this.sell_price,
            this.sell_price_currency.clone(), // Ensure CurrencyResponse is cloned
            this.unit.clone(),
            new Date(this.createdAt), // Clone the Date to avoid shared reference
            this.maxQuantityPerCommand,
            this.purchasable,
            this.disabled,
            this.image,
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
            response.display_order,
            response.sell_price,
            Currency.fromResponse(response.sell_price_currency),
            Unit.fromResponse(response.unit),
            new Date(response.created_at),
            response.max_quantity_per_command ?? null,
            response.purchasable ?? true,
            response.disabled ?? null,
            response.image ?? null,
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
            sell_price: this.sell_price ?? null,
            sell_price_currency: this.sell_price_currency.toRequest(),
            display_order: this.display_order,
            unit: this.unit.toRequest(),
            image: this.image ?? null,
            max_quantity_per_command: this.maxQuantityPerCommand ?? null,
            purchasable: this.purchasable,
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
            sell_price: this.sell_price,
            sell_price_currency: this.sell_price_currency.toRequest(),
            unit: this.unit.toRequest(),
            image: this.image ?? null,
            max_quantity_per_command: this.maxQuantityPerCommand ?? null,
            purchasable: this.purchasable,
            sma_code: this.smaCode ?? undefined,
        };
    }
}

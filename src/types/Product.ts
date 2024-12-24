import type { EditProductRequest, NewProductRequest, ProductResponse } from "@/api";
import { Currency, CurrencyValue } from "@/types/Currency";
import { Unit } from "@/types/Unit";

export class Product {
    id: string;
    name: string;
    image?: string;
    displayOrder: number;
    sellPrice: number | undefined;
    sellPriceCurrency: Currency | undefined;
    maxQuantityPerCommand?: number;
    unit: Unit;
    purchasable: boolean;
    hidden: boolean;
    disabled: boolean;
    createdAt: Date;
    smaCode?: string;
    inventreeCode?: string;

    constructor(
        id: string,
        name: string,
        display_order: number,

        unit: Unit,

        createdAt: Date,

        sell_price?: number,
        sell_price_currency?: Currency,

        maxQuantityPerCommand?: number | null,
        purchasable?: boolean | null,
        hidden?: boolean | null,
        disabled?: boolean | null,
        image?: string | null,
        smaCode?: string | null,
        inventreeCode?: string | null,
    ) {
        this.id = id;
        this.name = name;
        this.displayOrder = display_order;
        this.sellPrice = sell_price;
        this.sellPriceCurrency = sell_price_currency;
        this.unit = unit;
        this.image = image ?? undefined;
        this.maxQuantityPerCommand = maxQuantityPerCommand ?? undefined;
        this.disabled = disabled ?? false;
        this.hidden = hidden ?? false;
        this.purchasable = purchasable ?? true;
        this.smaCode = smaCode ?? undefined;
        this.inventreeCode = inventreeCode ?? undefined;
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

            Unit.default(),

            new Date(),

            0.0,
            Currency.default(),

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
            this.displayOrder,
            this.unit.clone(),
            new Date(this.createdAt), // Clone the Date to avoid shared reference
            this.sellPrice,
            this.sellPriceCurrency?.clone(), // Ensure CurrencyResponse is cloned
            this.maxQuantityPerCommand,
            this.purchasable,
            this.hidden,
            this.disabled,
            this.image,
            this.smaCode,
            this.inventreeCode,
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
            Unit.fromResponse(response.unit),
            new Date(response.created_at),
            response.sell_price ?? undefined,
            Currency.fromResponse(response.sell_price_currency ?? CurrencyValue.Euro),
            response.max_quantity_per_command ?? null,
            response.purchasable ?? true,
            response.hidden ?? false,
            response.disabled ?? false,
            response.image ?? null,
            response.sma_code ?? null,
            response.inventree_code ?? null,
        );
    }

    /**
     * Converts a Product instance to an EditProductRequest.
     * @returns An EditProductRequest object.
     */
    toEditRequest(): EditProductRequest {
        return {
            name: this.name ?? null,
            sell_price: this.sellPrice ?? null,
            sell_price_currency: this.sellPriceCurrency?.toRequest(),
            display_order: this.displayOrder,
            unit: this.unit.toRequest(),
            image: this.image ?? null,
            max_quantity_per_command: this.maxQuantityPerCommand ?? null,
            purchasable: this.purchasable,
            hidden: this.hidden,
            disabled: this.disabled,
            sma_code: this.smaCode ?? null,
            inventree_code: this.inventreeCode ?? null,
        };
    }

    /**
     * Converts a Product instance to a NewProductRequest.
     * @returns A NewProductRequest object.
     */
    toNewRequest(): NewProductRequest {
        return {
            name: this.name,
            sell_price: this.sellPrice,
            sell_price_currency: this.sellPriceCurrency?.toRequest(),
            unit: this.unit.toRequest(),
            image: this.image ?? null,
            max_quantity_per_command: this.maxQuantityPerCommand ?? null,
            purchasable: this.purchasable,
            sma_code: this.smaCode ?? undefined,
            inventree_code: this.inventreeCode ?? undefined,
            hidden: this.hidden,
            disabled: this.disabled,
        };
    }
}

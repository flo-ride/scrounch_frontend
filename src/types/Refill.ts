import type { EditRefillRequest, NewRefillRequest, RefillResponse } from "@/api";
import { Currency, CurrencyValue } from "@/types/Currency"; // Ensure the import path is correct

export class Refill {
    id: string;
    credit: number;
    credit_currency: Currency;
    name?: string | null;
    price: number;
    price_currency: Currency;
    disabled: boolean;
    createdAt: Date;

    constructor(
        id: string,
        credit: number,
        credit_currency: Currency,
        price: number,
        price_currency: Currency,
        disabled: boolean,
        createdAt: Date,
        name?: string | null,
    ) {
        this.id = id;
        this.credit = credit;
        this.credit_currency = credit_currency;
        this.price = price;
        this.price_currency = price_currency;
        this.disabled = disabled;
        this.createdAt = createdAt;
        this.name = name || null;
    }

    /**
     * Creates a default Refill instance.
     * @returns A default Refill instance.
     */
    static default(): Refill {
        return new Refill(
            "default-id",
            0,
            new Currency(CurrencyValue.Euro),
            0,
            new Currency(CurrencyValue.Euro),
            false,
            new Date(),
        );
    }

    /**
     * Creates a deep copy of the current Refill instance.
     * @returns A new Refill instance with the same values.
     */
    clone(): Refill {
        return new Refill(
            this.id,
            this.credit,
            this.credit_currency.clone(),
            this.price,
            this.price_currency.clone(),
            this.disabled,
            new Date(this.createdAt),
            this.name,
        );
    }

    /**
     * Converts a response to a Refill instance.
     * @param response The response containing refill details.
     * @returns A new Refill instance.
     */
    static fromResponse(response: RefillResponse): Refill {
        return new Refill(
            response.id,
            response.credit,
            Currency.fromResponse(response.credit_currency),
            response.price,
            Currency.fromResponse(response.price_currency),
            response.disabled,
            new Date(response.created_at),
            response.name,
        );
    }

    /**
     * Converts the current Refill instance to a NewRefillRequest.
     * @returns A NewRefillRequest object.
     */
    toNewRequest(): NewRefillRequest {
        return {
            credit: this.credit,
            credit_currency: this.credit_currency.toRequest(),
            price: this.price,
            price_currency: this.price_currency.toRequest(),
            name: this.name,
        };
    }

    /**
     * Converts the current Refill instance to an EditRefillRequest object.
     * @returns An EditRefillRequest object.
     */
    toEditRequest(): EditRefillRequest {
        return {
            credit: this.credit,
            credit_currency: this.credit_currency ? this.credit_currency.toRequest() : null,
            disabled: this.disabled,
            name: this.name,
            price: this.price,
            price_currency: this.price_currency ? this.price_currency.toRequest() : null,
        };
    }
}

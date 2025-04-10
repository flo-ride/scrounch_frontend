import type { EditRefillRequest, NewRefillRequest, RefillResponse } from "@/api";
import { Currency, CurrencyValue } from "@/types/Currency"; // Ensure the import path is correct

export class Refill {
    id: string | null;
    credit: number;
    creditCurrency: Currency;
    name: string | null;
    price: number;
    priceCurrency: Currency;
    hidden: boolean;
    disabled: boolean;
    createdAt: Date;

    constructor(
        id: string | null,
        credit: number,
        credit_currency: Currency,
        price: number,
        price_currency: Currency,
        hidden: boolean,
        disabled: boolean,
        createdAt: Date,
        name?: string | null,
    ) {
        this.id = id;
        this.credit = credit;
        this.creditCurrency = credit_currency;
        this.price = price;
        this.priceCurrency = price_currency;
        this.hidden = hidden;
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
            null,
            100,
            new Currency(CurrencyValue.Epicoin),
            1,
            new Currency(CurrencyValue.Euro),
            false,
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
            this.creditCurrency.clone(),
            this.price,
            this.priceCurrency.clone(),
            this.hidden,
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
            response.hidden ?? false,
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
            credit_currency: this.creditCurrency.toRequest(),
            price: this.price,
            price_currency: this.priceCurrency.toRequest(),
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
            credit_currency: this.creditCurrency ? this.creditCurrency.toRequest() : null,
            hidden: this.hidden,
            disabled: this.disabled,
            name: this.name,
            price: this.price,
            price_currency: this.priceCurrency ? this.priceCurrency.toRequest() : null,
        };
    }
}

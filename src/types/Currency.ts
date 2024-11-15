import type { CurrencyRequest, CurrencyResponse } from "@/api";

export const CurrencyValue = {
    Euro: "euro",
    Epicoin: "epicoin",
} as const;

export type CurrencyValue = (typeof CurrencyValue)[keyof typeof CurrencyValue];

export class Currency {
    type: CurrencyValue;

    constructor(type: CurrencyValue) {
        this.type = type;
    }

    /**
     * Creates a default Currency instance (e.g., Euro).
     * @returns A default Currency instance.
     */
    static default(): Currency {
        return new Currency(CurrencyValue.Euro); // Defaulting to Euro
    }

    /**
     * Creates a deep copy of the current Currency instance.
     * @returns A new Currency instance with the same type.
     */
    clone(): Currency {
        return new Currency(this.type);
    }

    /**
     * Converts a CurrencyResponse to a Currency instance.
     * @param response The response containing the currency type.
     * @returns An instance of Currency.
     */
    static fromResponse(response: CurrencyResponse): Currency {
        if (!Object.values(CurrencyValue).includes(response)) {
            throw new Error(`Invalid currency type: ${response}`);
        }
        return new Currency(response);
    }

    /**
     * Converts the current Currency instance to a CurrencyRequest.
     * @returns A CurrencyRequest string representing the current currency.
     */
    toRequest(): CurrencyRequest {
        return this.type;
    }

    /**
     * Checks if the currency is of type Euro.
     * @returns `true` if the currency is Euro, otherwise `false`.
     */
    isEuro(): boolean {
        return this.type === CurrencyValue.Euro;
    }

    /**
     * Checks if the currency is of type Epicoin.
     * @returns `true` if the currency is Epicoin, otherwise `false`.
     */
    isEpicoin(): boolean {
        return this.type === CurrencyValue.Epicoin;
    }
}

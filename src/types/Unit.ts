import type { UnitRequest, UnitResponse } from "@/api";

export const UnitValue = {
    Unit: "unit",
    Gram: "gram",
    Liter: "liter",
    Meter: "meter",
} as const;

export type UnitValue = (typeof UnitValue)[keyof typeof UnitValue];

export class Unit {
    type: UnitValue;

    constructor(type: UnitValue) {
        this.type = type;
    }

    /**
     * Creates a default Unit instance (e.g., Unit).
     * @returns A default Unit instance.
     */
    static default(): Unit {
        return new Unit(UnitValue.Unit); // Defaulting to Unit
    }

    /**
     * Creates a deep copy of the current Unit instance.
     * @returns A new Unit instance with the same type.
     */
    clone(): Unit {
        return new Unit(this.type);
    }

    /**
     * Converts a UnitResponse to a Unit instance.
     * @param response The response containing the unit type.
     * @returns An instance of Unit.
     */
    static fromResponse(response: UnitResponse): Unit {
        if (!Object.values(UnitValue).includes(response)) {
            throw new Error(`Invalid unit type: ${response}`);
        }
        return new Unit(response);
    }

    /**
     * Converts the current Unit instance to a UnitRequest.
     * @returns A UnitRequest string representing the unit unit.
     */
    toRequest(): UnitRequest {
        return this.type;
    }
}

import {
    LocationCategoryRequest,
    LocationCategoryResponse,
    type EditLocationRequest,
    type LocationResponse,
    type NewLocationRequest,
} from "@/api";

export enum LocationCategory {
    Room = "room",
    Dispenser = "dispenser",
}

export class Location {
    id: string | null;
    name: string;
    category: LocationCategory | null;
    hidden: boolean;
    disabled: boolean;
    createdAt: Date;

    constructor(
        id: string | null,
        name: string,
        hidden: boolean,
        disabled: boolean,
        created_at: Date,
        category: LocationCategory | null,
    ) {
        this.id = id;
        this.name = name;
        this.category = category ?? null;
        this.hidden = hidden;
        this.disabled = disabled;
        this.createdAt = created_at;
    }

    /**
     * Creates a default Location instance with placeholder values.
     * @returns A Location instance with default values.
     */
    static default(): Location {
        return new Location(null, "", false, false, new Date(), null);
    }

    /**
     * Creates a deep copy of the current Location instance.
     * @returns A new Location instance with the same properties.
     */
    clone(): Location {
        return new Location(
            this.id,
            this.name,
            this.hidden,
            this.disabled,
            new Date(this.createdAt),
            this.category,
        );
    }

    /**
     * Converts a LocationResponse to a Location instance.
     * @param response The response containing location data.
     * @returns A Location instance.
     */
    static fromResponse(response: LocationResponse): Location {
        return new Location(
            response.id,
            response.name,
            response.hidden ?? false,
            response.disabled,
            new Date(response.created_at),
            Location.convertResponseToCategory(response.category ?? null),
        );
    }

    /**
     * Converts a Location instance to an EditLocationRequest.
     * @returns An EditLocationRequest object.
     */
    toEditRequest(): EditLocationRequest {
        return {
            name: this.name || null,
            category: this.category ? Location.convertCategoryToRequest(this.category) : null,
            hidden: this.hidden,
            disabled: this.disabled,
        };
    }

    /**
     * Converts a Location instance to a NewLocationRequest.
     * @returns A NewLocationRequest object.
     */
    toNewRequest(): NewLocationRequest {
        if (!this.name) {
            throw new Error("Name is required for creating a new location.");
        }

        return {
            name: this.name,
            category: this.category ? Location.convertCategoryToRequest(this.category) : null,
        };
    }

    /**
     * Maps LocationCategoryResponse to LocationCategory.
     * @param responseCategory The response category to map.
     * @returns A LocationCategory enum value.
     */
    private static convertResponseToCategory(
        responseCategory: LocationCategoryResponse | null,
    ): LocationCategory | null {
        if (!responseCategory) return null;

        const mapping: Record<LocationCategoryResponse, LocationCategory> = {
            [LocationCategoryResponse.Room]: LocationCategory.Room,
            [LocationCategoryResponse.Dispenser]: LocationCategory.Dispenser,
        };

        return mapping[responseCategory];
    }

    /**
     * Maps LocationCategory to LocationCategoryRequest.
     * @param category The LocationCategory to map.
     * @returns A LocationCategoryRequest enum value.
     */
    private static convertCategoryToRequest(category: LocationCategory): LocationCategoryRequest {
        const mapping: Record<LocationCategory, LocationCategoryRequest> = {
            [LocationCategory.Room]: LocationCategoryRequest.Room,
            [LocationCategory.Dispenser]: LocationCategoryRequest.Dispenser,
        };

        return mapping[category];
    }
}

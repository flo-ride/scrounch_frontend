import type { EditWarehouseRequest, NewWarehouseRequest, WarehouseResponse } from "@/api";

export class Warehouse {
    id: string;
    name: string;
    disabled: boolean;
    createdAt: Date;

    constructor(id: string, name: string, disabled: boolean, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.disabled = disabled;
        this.createdAt = createdAt;
    }

    /**
     * Creates a default Warehouse instance with placeholder values.
     * @returns A Warehouse instance with default values.
     */
    static default(): Warehouse {
        return new Warehouse("", "New Warehouse", false, new Date());
    }

    /**
     * Creates a deep copy of the current Warehouse instance.
     * @returns A new Warehouse instance with the same properties.
     */
    clone(): Warehouse {
        return new Warehouse(this.id, this.name, this.disabled, new Date(this.createdAt));
    }

    /**
     * Converts a WarehouseResponse to a Warehouse instance.
     * @param response The response containing warehouse data.
     * @returns A Warehouse instance.
     */
    static fromResponse(response: WarehouseResponse): Warehouse {
        return new Warehouse(
            response.id,
            response.name,
            response.disabled,
            new Date(response.created_at),
        );
    }

    /**
     * Converts a Warehouse instance to an EditWarehouseRequest.
     * @returns An EditWarehouseRequest object.
     */
    toEditRequest(): EditWarehouseRequest {
        return {
            name: this.name,
            disabled: this.disabled,
        };
    }

    /**
     * Converts a Warehouse instance to a NewWarehouseRequest.
     * @returns A NewWarehouseRequest object.
     */
    toNewRequest(): NewWarehouseRequest {
        return {
            name: this.name,
        };
    }
}

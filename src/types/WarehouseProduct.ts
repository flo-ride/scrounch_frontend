import type { NewWarehouseProductRequest, WarehouseProductResponse } from "@/api";
import { Product } from "./Product";

export class WarehouseProduct {
    warehouseId: string | null;
    productId: string | null;
    product: Product | null;
    quantity: number;
    createdAt: Date;

    constructor(
        warehouseId: string | null,
        productId: string | null,
        product: Product | null,
        quantity: number,
        createdAt: Date,
    ) {
        this.warehouseId = warehouseId;
        this.productId = productId;
        this.product = product;
        this.quantity = quantity;
        this.createdAt = createdAt;
    }

    /**
     * Creates a default Warehouse instance with placeholder values.
     * @returns A Warehouse instance with default values.
     */
    static default(): WarehouseProduct {
        return new WarehouseProduct(null, null, null, 0, new Date());
    }

    /**
     * Creates a deep copy of the current Warehouse instance.
     * @returns A new Warehouse instance with the same properties.
     */
    clone(): WarehouseProduct {
        return new WarehouseProduct(
            this.warehouseId,
            this.productId,
            this.product ? this.product.clone() : null,
            this.quantity,
            new Date(this.createdAt),
        );
    }

    /**
     * Converts a WarehouseResponse to a Warehouse instance.
     * @param response The response containing warehouse data.
     * @returns A Warehouse instance.
     */
    static fromResponse(response: WarehouseProductResponse): WarehouseProduct {
        return new WarehouseProduct(
            null,
            response.product.id,
            Product.fromResponse(response.product),
            Number(response.quantity),
            new Date(response.created_at),
        );
    }

    /**
     * Converts a Warehouse instance to a NewWarehouseRequest.
     * @returns A NewWarehouseRequest object.
     */
    toNewRequest(): NewWarehouseProductRequest {
        return {
            quantity: this.quantity.toString(),
        };
    }
}

import type { NewWarehouseProductRequest, WarehouseProductResponse } from "@/api";
import { Product } from "./Product";

export class WarehouseProduct {
    product: Product;
    quantity: number;
    createdAt: Date;

    constructor(product: Product, quantity: number, createdAt: Date) {
        this.product = product;
        this.quantity = quantity;
        this.createdAt = createdAt;
    }

    /**
     * Creates a default Warehouse instance with placeholder values.
     * @returns A Warehouse instance with default values.
     */
    static default(): WarehouseProduct {
        return new WarehouseProduct(Product.default(), 0, new Date());
    }

    /**
     * Creates a deep copy of the current Warehouse instance.
     * @returns A new Warehouse instance with the same properties.
     */
    clone(): WarehouseProduct {
        return new WarehouseProduct(this.product.clone(), this.quantity, new Date(this.createdAt));
    }

    /**
     * Converts a WarehouseResponse to a Warehouse instance.
     * @param response The response containing warehouse data.
     * @returns A Warehouse instance.
     */
    static fromResponse(response: WarehouseProductResponse): WarehouseProduct {
        return new WarehouseProduct(
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

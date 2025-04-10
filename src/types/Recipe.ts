import type {
    EditRecipeRequest,
    NewRecipeRequest,
    RecipeIngredientRequest,
    RecipeIngredientResponse,
    RecipeResponse,
} from "@/api";

export class RecipeIngredient {
    product_id: string | null;
    quantity: number;
    disabled: boolean;

    constructor(product_id: string | null, quantity: number, disabled?: boolean) {
        this.product_id = product_id;
        this.quantity = quantity;
        this.disabled = disabled ?? false;
    }

    /**
     * Creates a default RecipeIngredient instance with placeholder values.
     * @returns A Recipe instance with default values.
     */
    static default(): RecipeIngredient {
        return new RecipeIngredient("", 1.0);
    }

    /**
     * Creates a deep copy of the current RecipeIngredient instance.
     * @returns A new Recipe instance with the same properties.
     */
    clone(): RecipeIngredient {
        return new RecipeIngredient(this.product_id, this.quantity, this.disabled);
    }

    /**
     * Converts a RecipeIngredientResponse to a RecipeIngredient instance.
     * @param response The response containing recipe data.
     * @returns A Recipe instance.
     */
    static fromResponse(response: RecipeIngredientResponse): RecipeIngredient {
        return new RecipeIngredient(response.product, response.quantity, response.disabled);
    }

    /**
     * Converts a Recipe instance to an RecipeIngredientRequest.
     * @returns An EditRecipeRequest object.
     */
    toRequest(): RecipeIngredientRequest {
        return {
            disabled: this.disabled,
            quantity: this.quantity,
            product: this.product_id ?? "",
        };
    }
}

export class Recipe {
    id: string | null;
    name: string | null;
    result_product_id: string;
    ingredients: RecipeIngredient[];
    disabled: boolean;

    constructor(
        id: string | null,
        result_product_id: string,
        ingredients: RecipeIngredient[],
        name?: string | null,
        disabled?: boolean,
    ) {
        this.id = id;
        this.name = name ?? null;
        this.result_product_id = result_product_id;
        this.ingredients = ingredients;
        this.disabled = disabled ?? false;
    }

    /**
     * Creates a default Recipe instance with placeholder values.
     * @returns A Recipe instance with default values.
     */
    static default(): Recipe {
        return new Recipe("", "", [RecipeIngredient.default()], undefined);
    }

    /**
     * Creates a deep copy of the current Recipe instance.
     * @returns A new Recipe instance with the same properties.
     */
    clone(): Recipe {
        return new Recipe(
            this.id,
            this.result_product_id,
            this.ingredients.map((x) => x.clone()),
            this.name,
            this.disabled,
        );
    }

    /**
     * Converts a RecipeResponse to a Recipe instance.
     * @param response The response containing recipe data.
     * @returns A Recipe instance.
     */
    static fromResponse(response: RecipeResponse): Recipe {
        return new Recipe(
            response.id,
            response.product,
            response.ingredients.map((x) => RecipeIngredient.fromResponse(x)),
            response.name ?? undefined,
            response.disabled,
        );
    }

    /**
     * Converts a Recipe instance to an EditRecipeRequest.
     * @returns An EditRecipeRequest object.
     */
    toEditRequest(): EditRecipeRequest {
        return {
            product: this.result_product_id,
            name: this.name,
            disabled: this.disabled,
            ingredients: this.ingredients.map((x) => x.toRequest()),
        };
    }

    /**
     * Converts a Recipe instance to a NewRecipeRequest.
     * @returns A NewRecipeRequest object.
     */
    toNewRequest(): NewRecipeRequest {
        return {
            product: this.result_product_id,
            name: this.name,
            ingredients: this.ingredients.map((x) => x.toRequest()),
        };
    }
}

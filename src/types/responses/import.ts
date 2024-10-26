import { v4 as uuid } from "uuid";
import type { EditedProductResponse, ProductResponse } from "./product";

export type SMAImportResponse = {
    unchanged: (typeof uuid)[];
    changed: EditedProductResponse[];
    created: ProductResponse[];
};

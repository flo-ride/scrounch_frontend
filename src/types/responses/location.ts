import { v4 as uuid } from "uuid";

export type LocationResponse = {
    id: typeof uuid;

    name: string;

    category: string;

    disabled?: boolean;
};

export type LocationListResponse = {
    locations: LocationResponse[];

    current_page: number;

    total_page: number;
};

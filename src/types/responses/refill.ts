import { v4 as uuid } from "uuid";

export type RefillResponse = {
    id: typeof uuid;

    name?: string;

    amount_in_euro: number;

    amount_in_epicoin: number;

    creation_time: Date;

    disabled?: boolean;
};

export type RefillListResponse = {
    refills: RefillResponse[];

    current_page: number;

    total_page: number;
};

import { v4 as uuid } from "uuid";

export type User = {
    id: typeof uuid;
    name: string;
    email: string;
    username: string;
    is_admin: boolean;
};

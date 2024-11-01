import { v4 as uuid } from "uuid";

export type UserResponse = {
    id: typeof uuid;
    name: string;
    email: string;
    username: string;
    is_admin: boolean;
    is_banned: boolean;
    last_access_time: Date;
    creation_time: Date;
};

export type UserListResponse = {
    users: UserResponse[];

    current_page: number;

    total_page: number;
};

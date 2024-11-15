import type { EditUserRequest, UserResponse } from "@/api";

export class User {
    id: string;
    email?: string;
    name?: string;
    username?: string;
    isAdmin: boolean;
    isBanned: boolean;
    createdAt: Date;
    lastAccessAt: Date;

    constructor(
        id: string,
        is_admin: boolean,
        is_banned: boolean,
        created_at: Date,
        last_access_at: Date,
        email?: string,
        name?: string,
        username?: string,
    ) {
        this.id = id;
        this.isAdmin = is_admin;
        this.isBanned = is_banned;
        this.createdAt = created_at;
        this.lastAccessAt = last_access_at;
        this.email = email;
        this.name = name;
        this.username = username;
    }

    static default(): User {
        return new User(
            "default-id",
            false,
            false,
            new Date(),
            new Date(),
            "Default Name",
            "default-username",
            "default@example.com",
        );
    }

    /**
     * Creates a deep copy of the current User instance.
     * @returns A new User instance with the same properties.
     */
    clone(): User {
        return new User(
            this.id,
            this.isAdmin,
            this.isBanned,
            new Date(this.createdAt), // Create a new Date instance to avoid reference issues
            new Date(this.lastAccessAt),
            this.name,
            this.username,
            this.email,
        );
    }

    /**
     * Converts a UserResponse to a User instance.
     * @param response The response containing user data.
     * @returns A User instance.
     */
    static fromResponse(response: UserResponse): User {
        return new User(
            response.id,
            response.is_admin,
            response.is_banned,
            new Date(response.created_at),
            new Date(response.last_access_at),
            response.email ?? undefined,
            response.name ?? undefined,
            response.username ?? undefined,
        );
    }

    /**
     * Converts a User instance to an EditUserRequest.
     * @returns An EditUserRequest object.
     */
    toEditRequest(): EditUserRequest {
        return {
            is_admin: this.isAdmin ?? null,
            is_banned: this.isBanned ?? null,
        };
    }
}

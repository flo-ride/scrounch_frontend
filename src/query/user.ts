import { UserApi, UserSortEnum } from "@/api";
import { User } from "@/types/User";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toValue, type MaybeRefOrGetter } from "vue";

const userFetcher = (userApi: UserApi, id: MaybeRefOrGetter<string>) => {
    if (toValue(id).length == 0) return;
    return userApi
        .getUser({ id: toValue(id) })
        .then((response) => User.fromResponse(response.data));
};

export const useQueryUser = (userApi: UserApi, id: MaybeRefOrGetter<string>) => {
    return useQuery({
        queryKey: ["user", toValue(id)],
        queryFn: async () => userFetcher(userApi, id),
    });
};

const meFetcher = async (userApi: UserApi) => {
    return userApi.getMe().then((response) => User.fromResponse(response.data));
};

export const useQueryMe = (userApi: UserApi) => {
    return useQuery({
        queryKey: ["me"],
        queryFn: async () => meFetcher(userApi),
    });
};

const mutateUser = async (userApi: UserApi, user: MaybeRefOrGetter<User>) => {
    const userValue = toValue(user);
    if (!userValue.id) return;
    return userApi
        .editUser({
            id: userValue.id,
            editUserRequest: toValue(user).toEditRequest(),
        })
        .then((_) => null);
};

export const useMutateUser = (userApi: UserApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: User) => mutateUser(userApi, user),
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(["user", variables.id], variables);
        },
    });
};

const usersFetcher = (
    userApi: UserApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sort: MaybeRefOrGetter<UserSortEnum[]>,
) =>
    userApi
        .getAllUsers({
            page: toValue(page) - 1,
            perPage: toValue(itemsPerPage),
            sort: toValue(sort),
        })
        .then((response) => response.data)
        .then((data) => {
            return {
                totalPage: data.total_page,
                currentPage: data.current_page,
                users: data.users.map((user) => User.fromResponse(user)),
            };
        });

export const useQueryUsers = (
    userApi: UserApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sortBy: MaybeRefOrGetter<UserSortEnum[]>,
) =>
    useQuery({
        queryKey: ["users", page, itemsPerPage, sortBy],
        queryFn: () => usersFetcher(userApi, page, itemsPerPage, sortBy),
        placeholderData: keepPreviousData,
        initialData: { totalPage: 1, currentPage: 1, users: [] },
    });

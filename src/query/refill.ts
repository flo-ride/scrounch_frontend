import { RefillApi, RefillSortEnum } from "@/api";
import { Refill } from "@/types/Refill";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toValue, type MaybeRefOrGetter } from "vue";

const refillFetcher = (refillApi: RefillApi, id: MaybeRefOrGetter<string>) => {
    if (toValue(id).length == 0) return;
    return refillApi
        .getRefill({ id: toValue(id) })
        .then((response) => Refill.fromResponse(response.data));
};

export const useQueryRefill = (refillApi: RefillApi, id: MaybeRefOrGetter<string>) => {
    return useQuery({
        queryKey: ["refill", toValue(id)],
        queryFn: async () => refillFetcher(refillApi, id),
    });
};

const mutateRefill = async (refillApi: RefillApi, refill: MaybeRefOrGetter<Refill>) => {
    const refillValue = toValue(refill);
    if (!refillValue.id || refillValue.id.length == 0) {
        return refillApi
            .postNewRefill({ newRefillRequest: toValue(refill).toNewRequest() })
            .then((response) => response.data);
    } else {
        return refillApi
            .editRefill({
                id: refillValue.id,
                editRefillRequest: toValue(refill).toEditRequest(),
            })
            .then((_) => null);
    }
};

export const useMutateRefill = (refillApi: RefillApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (refill: Refill) => mutateRefill(refillApi, refill),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["refill", data ?? variables.id], variables);
            queryClient.invalidateQueries({ queryKey: ["refills"] });
        },
    });
};

const deleteRefill = async (refillApi: RefillApi, id: string) => {
    return refillApi.deleteRefill({
        id,
    });
};

export const useDeleteRefill = (refillApi: RefillApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteRefill(refillApi, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["refill", variables] });
            queryClient.invalidateQueries({ queryKey: ["refills"] });
        },
    });
};

const refillsFetcher = (
    refillApi: RefillApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sort: MaybeRefOrGetter<RefillSortEnum[]>,
) =>
    refillApi
        .getAllRefills({
            page: toValue(page) - 1,
            perPage: toValue(itemsPerPage),
            sort: toValue(sort),
        })
        .then((response) => response.data)
        .then((data) => {
            return {
                totalPage: data.total_page,
                currentPage: data.current_page,
                refills: data.refills.map((refill) => Refill.fromResponse(refill)),
            };
        });

export const useQueryRefills = (
    refillApi: RefillApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sortBy: MaybeRefOrGetter<RefillSortEnum[]>,
) =>
    useQuery({
        queryKey: ["refills", page, itemsPerPage, sortBy],
        queryFn: () => refillsFetcher(refillApi, page, itemsPerPage, sortBy),
        placeholderData: keepPreviousData,
        initialData: { totalPage: 1, currentPage: 1, refills: [] },
    });

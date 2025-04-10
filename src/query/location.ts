import { LocationApi, LocationSortEnum } from "@/api";
import { Location } from "@/types/Location";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toValue, type MaybeRefOrGetter } from "vue";

const locationFetcher = (locationApi: LocationApi, id: MaybeRefOrGetter<string>) => {
    if (toValue(id).length == 0) return;
    return locationApi
        .getLocation({ id: toValue(id) })
        .then((response) => Location.fromResponse(response.data));
};

export const useQueryLocation = (locationApi: LocationApi, id: MaybeRefOrGetter<string>) => {
    return useQuery({
        queryKey: ["location", toValue(id)],
        queryFn: async () => locationFetcher(locationApi, id),
    });
};

const mutateLocation = async (locationApi: LocationApi, location: MaybeRefOrGetter<Location>) => {
    const locationValue = toValue(location);
    if (!locationValue.id || locationValue.id.length == 0) {
        return locationApi
            .postNewLocation({ newLocationRequest: toValue(location).toNewRequest() })
            .then((response) => response.data);
    } else {
        return locationApi
            .editLocation({
                id: locationValue.id,
                editLocationRequest: toValue(location).toEditRequest(),
            })
            .then((_) => null);
    }
};

export const useMutateLocation = (locationApi: LocationApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (location: Location) => mutateLocation(locationApi, location),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["location", data ?? variables.id], variables);
            queryClient.invalidateQueries({ queryKey: ["locations"] });
        },
    });
};

const deleteLocation = async (locationApi: LocationApi, id: string) => {
    return locationApi.deleteLocation({
        id,
    });
};

export const useDeleteLocation = (locationApi: LocationApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteLocation(locationApi, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["location", variables] });
            queryClient.invalidateQueries({ queryKey: ["locations"] });
        },
    });
};

const locationsFetcher = (
    locationApi: LocationApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sort: MaybeRefOrGetter<LocationSortEnum[]>,
) =>
    locationApi
        .getAllLocations({
            page: toValue(page) - 1,
            perPage: toValue(itemsPerPage),
            sort: toValue(sort),
        })
        .then((response) => response.data)
        .then((data) => {
            return {
                totalPage: data.total_page,
                currentPage: data.current_page,
                locations: data.locations.map((location) => Location.fromResponse(location)),
            };
        });

export const useQueryLocations = (
    locationApi: LocationApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sortBy: MaybeRefOrGetter<LocationSortEnum[]>,
) =>
    useQuery({
        queryKey: ["locations", page, itemsPerPage, sortBy],
        queryFn: () => locationsFetcher(locationApi, page, itemsPerPage, sortBy),
        placeholderData: keepPreviousData,
        initialData: { totalPage: 1, currentPage: 1, locations: [] },
    });

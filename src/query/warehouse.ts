import { WarehouseApi, WarehouseProductSortEnum, WarehouseSortEnum } from "@/api";
import { Warehouse } from "@/types/Warehouse";
import { WarehouseProduct } from "@/types/WarehouseProduct";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toValue, type MaybeRefOrGetter } from "vue";

const warehouseFetcher = (warehouseApi: WarehouseApi, id: MaybeRefOrGetter<string>) => {
    if (toValue(id).length == 0) return;
    return warehouseApi
        .getWarehouse({ id: toValue(id) })
        .then((response) => Warehouse.fromResponse(response.data));
};

export const useQueryWarehouse = (warehouseApi: WarehouseApi, id: MaybeRefOrGetter<string>) => {
    return useQuery({
        queryKey: ["warehouse", toValue(id)],
        queryFn: async () => warehouseFetcher(warehouseApi, id),
    });
};

const mutateWarehouse = async (
    warehouseApi: WarehouseApi,
    warehouse: MaybeRefOrGetter<Warehouse>,
) => {
    const warehouseValue = toValue(warehouse);
    if (!warehouseValue.id || warehouseValue.id.length == 0) {
        return warehouseApi
            .postNewWarehouse({ newWarehouseRequest: toValue(warehouse).toNewRequest() })
            .then((response) => response.data);
    } else {
        return warehouseApi
            .editWarehouse({
                id: warehouseValue.id,
                editWarehouseRequest: toValue(warehouse).toEditRequest(),
            })
            .then((_) => null);
    }
};

export const useMutateWarehouse = (warehouseApi: WarehouseApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (warehouse: Warehouse) => mutateWarehouse(warehouseApi, warehouse),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["warehouse", data ?? variables.id], variables);
            queryClient.invalidateQueries({ queryKey: ["warehouses"] });
        },
    });
};

const deleteWarehouse = async (warehouseApi: WarehouseApi, id: string) => {
    return warehouseApi.deleteWarehouse({
        id,
    });
};

export const useDeleteWarehouse = (warehouseApi: WarehouseApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteWarehouse(warehouseApi, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["warehouse", variables] });
            queryClient.invalidateQueries({ queryKey: ["warehouses"] });
        },
    });
};

const warehousesFetcher = (
    warehouseApi: WarehouseApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sort: MaybeRefOrGetter<WarehouseSortEnum[]>,
) =>
    warehouseApi
        .getAllWarehouses({
            page: toValue(page) - 1,
            perPage: toValue(itemsPerPage),
            sort: toValue(sort),
        })
        .then((response) => response.data)
        .then((data) => {
            return {
                totalPage: data.total_page,
                currentPage: data.current_page,
                warehouses: data.warehouses.map((warehouse) => Warehouse.fromResponse(warehouse)),
            };
        });

export const useQueryWarehouses = (
    warehouseApi: WarehouseApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sortBy: MaybeRefOrGetter<WarehouseSortEnum[]>,
) =>
    useQuery({
        queryKey: ["warehouses", page, itemsPerPage, sortBy],
        queryFn: () => warehousesFetcher(warehouseApi, page, itemsPerPage, sortBy),
        placeholderData: keepPreviousData,
        initialData: { totalPage: 1, currentPage: 1, warehouses: [] },
    });

const warehouseProductsFetcher = (
    warehouseApi: WarehouseApi,
    warehouseId: MaybeRefOrGetter<string>,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sort: MaybeRefOrGetter<WarehouseProductSortEnum[]>,
) =>
    warehouseApi
        .getAllWarehouseProducts({
            warehouseId: toValue(warehouseId),
            page: toValue(page) - 1,
            perPage: toValue(itemsPerPage),
            sort: toValue(sort),
        })
        .then((response) => response.data)
        .then((data) => {
            return {
                totalPage: data.total_page,
                currentPage: data.current_page,
                products: data.products.map((warehouseProduct) =>
                    WarehouseProduct.fromResponse(warehouseProduct),
                ),
            };
        });

const mutateWarehouseProduct = async (
    warehouseApi: WarehouseApi,
    warehouseProduct: MaybeRefOrGetter<WarehouseProduct>,
) => {
    const warehouseProductValue = toValue(warehouseProduct);
    if (!warehouseProductValue.warehouseId || !warehouseProductValue.productId) return;
    return warehouseApi
        .postNewWarehouseProduct({
            warehouseId: warehouseProductValue.warehouseId,
            productId: warehouseProductValue.productId,
            newWarehouseProductRequest: warehouseProductValue.toNewRequest(),
        })
        .then((response) => response.data);
};

export const useMutateWarehouseProduct = (
    warehouseApi: WarehouseApi,
    warehouseId: MaybeRefOrGetter<string>,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (warehouseProduct: MaybeRefOrGetter<WarehouseProduct>) =>
            mutateWarehouseProduct(warehouseApi, warehouseProduct),
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(
                ["warehouseProduct", toValue(warehouseId), toValue(variables).productId],
                variables,
            );
            queryClient.invalidateQueries({ queryKey: ["warehouses"] });
            queryClient.invalidateQueries({ queryKey: ["warehouse", toValue(warehouseId)] });
            queryClient.invalidateQueries({
                queryKey: ["warehouseProducts", toValue(warehouseId)],
            });
        },
    });
};

export const useQueryWarehouseProducts = (
    warehouseApi: WarehouseApi,
    warehouseId: MaybeRefOrGetter<string>,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sortBy: MaybeRefOrGetter<WarehouseProductSortEnum[]>,
) =>
    useQuery({
        queryKey: ["warehouseProducts", toValue(warehouseId), page, itemsPerPage, sortBy],
        queryFn: () =>
            warehouseProductsFetcher(warehouseApi, warehouseId, page, itemsPerPage, sortBy),
        placeholderData: keepPreviousData,
        initialData: { totalPage: 1, currentPage: 1, products: [] },
    });

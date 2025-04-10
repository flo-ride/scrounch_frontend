import { ProductApi, ProductSortEnum } from "@/api";
import { Product } from "@/types/Product";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toValue, type MaybeRefOrGetter } from "vue";

const productFetcher = (productApi: ProductApi, id: MaybeRefOrGetter<string>) => {
    if (toValue(id).length == 0) return;
    return productApi
        .getProduct({ id: toValue(id) })
        .then((response) => Product.fromResponse(response.data));
};

export const useQueryProduct = (productApi: ProductApi, id: MaybeRefOrGetter<string>) => {
    return useQuery({
        queryKey: ["product", toValue(id)],
        queryFn: async () => productFetcher(productApi, id),
    });
};

const mutateProduct = async (productApi: ProductApi, product: MaybeRefOrGetter<Product>) => {
    const productValue = toValue(product);
    if (!productValue.id || productValue.id.length == 0) {
        return productApi
            .postNewProduct({ newProductRequest: toValue(product).toNewRequest() })
            .then((response) => response.data);
    } else {
        return productApi
            .editProduct({
                id: productValue.id,
                editProductRequest: toValue(product).toEditRequest(),
            })
            .then((_) => null);
    }
};

export const useMutateProduct = (productApi: ProductApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (product: Product) => mutateProduct(productApi, product),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["product", data ?? variables.id], variables);
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

const deleteProduct = async (productApi: ProductApi, id: string) => {
    return productApi.deleteProduct({
        id,
    });
};

export const useDeleteProduct = (productApi: ProductApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProduct(productApi, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["product", variables] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

const productsFetcher = (
    productApi: ProductApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sort: MaybeRefOrGetter<ProductSortEnum[]>,
) =>
    productApi
        .getAllProducts({
            page: toValue(page) - 1,
            perPage: toValue(itemsPerPage),
            sort: toValue(sort),
        })
        .then((response) => response.data)
        .then((data) => {
            return {
                totalPage: data.total_page,
                currentPage: data.current_page,
                products: data.products.map((product) => Product.fromResponse(product)),
            };
        });

export const useQueryProducts = (
    productApi: ProductApi,
    page: MaybeRefOrGetter<number>,
    itemsPerPage: MaybeRefOrGetter<number>,
    sortBy: MaybeRefOrGetter<ProductSortEnum[]>,
) =>
    useQuery({
        queryKey: ["products", page, itemsPerPage, sortBy],
        queryFn: () => productsFetcher(productApi, page, itemsPerPage, sortBy),
        placeholderData: keepPreviousData,
        initialData: { totalPage: 1, currentPage: 1, products: [] },
    });

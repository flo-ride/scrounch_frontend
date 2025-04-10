import type { MiscApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";

const statusFetcher = async (miscApi: MiscApi) => {
    return miscApi.getStatus().then((response) => {
        if (response.data != "UP") throw new Error(response.data);
        return response.data;
    });
};

export const useQueryStatus = (miscApi: MiscApi) => {
    return useQuery({
        queryKey: ["status"],
        queryFn: () => statusFetcher(miscApi),
    });
};

import { MiscApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export class ImageApi {
    readonly baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl ?? "http://localhost:3000";
    }

    getProductImageString(id: string) {
        return `${this.baseUrl}/download/${id}?type=product`;
    }
}

const mutateImage = async (miscApi: MiscApi, image: File) => {
    return miscApi
        .postUploadFiles({ file: image, fileType: "product" })
        .then((response) => response.data);
};

export const useMutateImage = (miscApi: MiscApi) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (image: File) => mutateImage(miscApi, image),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["image", data], variables);
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
    });
};

import {
    LocationApi,
    MiscApi,
    ProductApi,
    RecipeApi,
    RefillApi,
    UserApi,
    WarehouseApi,
} from "@/api";
import { ImageApi } from "@/query/image";
import axios from "axios";
import type { App } from "vue";

interface AxiosOptions {
    baseUrl?: string;
    token?: string;
}

export default {
    install: (app: App, options: AxiosOptions) => {
        const apiUrl = options.baseUrl;
        const axiosInstance = axios.create({
            baseURL: apiUrl,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                const modifiedError = error;

                let errorHeadline = "Whoops";
                let errorTitle = "Something Went Wrong";
                let errorMessage =
                    "There might be a problem with your connection or our servers. Please check your internet connection or try again later. We appreciate your patience.";
                let errorKind = "UNKNOWN";

                if (error.response) {
                    const response = error.response;
                    errorHeadline = `Whoops, ${response.status}`;

                    // Temp
                    if (response.status === 404) {
                        errorKind = "NOT_FOUND";
                        errorMessage = response.data;
                    }

                    if (response.data) {
                        const data = response.data;
                        if (data.message) {
                            errorMessage = data.message;
                        }
                        if (data.kind) {
                            errorKind = data.kind;
                        }
                        if (data.error) {
                            errorTitle = data.error;
                        }
                    }
                }
                modifiedError.headline = errorHeadline;
                modifiedError.title = errorTitle;
                modifiedError.kind = errorKind;
                modifiedError.message = errorMessage;

                throw modifiedError;
            },
        );
        app.provide("recipeApi", new RecipeApi(undefined, apiUrl, axiosInstance));
        app.provide("refillApi", new RefillApi(undefined, apiUrl, axiosInstance));
        app.provide("locationApi", new LocationApi(undefined, apiUrl, axiosInstance));
        app.provide("userApi", new UserApi(undefined, apiUrl, axiosInstance));
        app.provide("warehouseApi", new WarehouseApi(undefined, apiUrl, axiosInstance));
        app.provide("productApi", new ProductApi(undefined, apiUrl, axiosInstance));
        app.provide("miscApi", new MiscApi(undefined, apiUrl, axiosInstance));
        app.provide("imageApi", new ImageApi(apiUrl));
        app.provide("apiUrl", apiUrl);
    },
};

import { LocationApi, MiscApi, ProductApi, RecipeApi, RefillApi, UserApi } from "@/api";
import axios from "axios";
import type { App } from "vue";

interface AxiosOptions {
    baseUrl?: string;
    token?: string;
}

export default {
    install: (app: App, options: AxiosOptions) => {
        const $axios = axios.create({
            headers: {
                Authorization: options.token ? `Bearer ${options.token}` : "",
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        app.config.globalProperties.$miscApi = new MiscApi(undefined, options.baseUrl, $axios);
        app.config.globalProperties.$userApi = new UserApi(undefined, options.baseUrl, $axios);
        app.config.globalProperties.$refillApi = new RefillApi(undefined, options.baseUrl, $axios);
        app.config.globalProperties.$productApi = new ProductApi(
            undefined,
            options.baseUrl,
            $axios,
        );
        app.config.globalProperties.$locationApi = new LocationApi(
            undefined,
            options.baseUrl,
            $axios,
        );
        app.config.globalProperties.$recipeApi = new RecipeApi(undefined, options.baseUrl, $axios);
        // app.config.globalProperties.$axios = $axios;
    },
};

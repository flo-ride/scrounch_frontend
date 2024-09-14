import axios from "axios";
import type { App } from "vue";

interface AxiosOptions {
    baseUrl?: string;
    token?: string;
}

export default {
    install: (app: App, options: AxiosOptions) => {
        const $axios = axios.create({
            baseURL: options.baseUrl,
            headers: {
                Authorization: options.token ? `Bearer ${options.token}` : "",
            },
        });
        $axios.interceptors.request.use(
            (config) => {
                config.headers["Content-Type"] = "application/json";

                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );
        $axios.interceptors.response.use(
            (response) => {
                return response.data;
            },
            (error) => {
                throw error;
            },
        );

        app.config.globalProperties.$axios = $axios;
    },
};

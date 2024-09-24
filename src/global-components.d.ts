import type { AxiosInstance } from "axios";
import type { Router } from "vue-router";

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $backendUrl: string;
        $router: Router;
        $t: (string) => string;
    }
}

export {};

import { createApp } from "vue";
import { createPinia } from "pinia";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa";
import "@fortawesome/fontawesome-free/css/all.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { VNumberInput } from "vuetify/labs/components";
import { VTreeview } from "vuetify/labs/VTreeview";

// I18n
import { createI18n, useI18n } from "vue-i18n";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import { en as enVuetify, fr as frVuetify } from "vuetify/locale";

import App from "./App.vue";
import router from "./router";
import axios from "./plugins/axios";

import type { Router } from "vue-router";
import {
    LocationApi,
    MiscApi,
    ProductApi,
    RecipeApi,
    RefillApi,
    UserApi,
    WarehouseApi,
} from "./api";

import { VueQueryPlugin } from "@tanstack/vue-query";

const messages = {
    en: {
        ...en,
        $vuetify: {
            ...enVuetify,
        },
    },
    fr: {
        ...fr,
        $vuetify: {
            ...frVuetify,
        },
    },
};

const i18n = createI18n({
    globalInjection: true,
    legacy: false,
    mode: "composition",
    locale: "fr",
    fallbackLocale: "en",
    messages,
});

const vuetify = createVuetify({
    components: {
        components,
        VNumberInput,
        VTreeview,
    },
    directives,
    theme: { defaultTheme: "dark" },
    icons: {
        defaultSet: "fa",
        aliases,
        sets: {
            fa,
        },
    },
    locale: {
        adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
});

const app = createApp(App);

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $miscApi: MiscApi;
        $userApi: UserApi;
        $locationApi: LocationApi;
        $productApi: ProductApi;
        $refillApi: RefillApi;
        $recipeApi: RecipeApi;
        $warehouseApi: WarehouseApi;
        $backendUrl: string;
        $vuetify: typeof vuetify;
        $router: Router;
    }
}

// @ts-ignore
let api_url = window.env.BACKEND_URL || "http://localhost:3000";

app.use(i18n);
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(axios, {
    baseUrl: api_url,
});
app.use(VueQueryPlugin, {
    enableDevtoolsV6Plugin: true,
});

app.config.globalProperties.$backendUrl = api_url;

app.mount("#app");

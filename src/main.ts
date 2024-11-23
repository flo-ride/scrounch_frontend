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

// I18n
import { createI18n, useI18n } from "vue-i18n";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

import App from "./App.vue";
import router from "./router";
import axios from "./plugins/axios";

import type { Router } from "vue-router";
import { LocationApi, MiscApi, ProductApi, RefillApi, UserApi } from "./api";

const messages = {
    en: {
        ...en,
        $vuetify: {
            ...en,
            input: {
                clear: "Clear",
            },
            open: "Open",
            close: "Close",
            loading: "Loading content...",
            dataIterator: {
                rowsPerPageText: "Items per page:",
                pageText: "{0}-{1} of {2}",
            },
            dataFooter: {
                itemsPerPageText: "Items per Page",
                pageText: "Page {0}",
                itemsPerPageAll: "All",
                firstPage: "Fist page",
                lastPage: "Last page",
                nextPage: "Next page",
                prevPage: "Previous page",
            },
            noDataText: "No Data",
        },
    },
    fr: {
        ...fr,
        $vuetify: {
            ...fr,
            input: {
                clear: "Effacer",
            },
            open: "Ouvrir",
            close: "Fermer",
            loading: "Chargement du contenu...",
            dataIterator: {
                rowsPerPageText: "Éléments par pages:",
                pageText: "{0}-{1} sur {2}",
            },
            dataFooter: {
                itemsPerPageText: "Items par Page",
                pageText: "Page {0}",
                itemsPerPageAll: "Tout",
                firstPage: "Premiere page",
                lastPage: "Derniere page",
                nextPage: "Page suivante",
                prevPage: "Page précedente",
            },
            noDataText: "Pas de données",
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
        $backendUrl: string;
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

app.config.globalProperties.$backendUrl = api_url;

app.mount("#app");

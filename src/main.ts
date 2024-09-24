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

// I18n
import { createI18n, useI18n } from "vue-i18n";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

import App from "./App.vue";
import router from "./router";
import axios from "./plugins/axios";

import type { AxiosInstance } from "axios";
import type { Router } from "vue-router";

const messages = {
    en: {
        ...en,
        $vuetify: {
            ...en,
            loading: "Loading content...",
            dataIterator: {
                rowsPerPageText: "Items per page:",
                pageText: "{0}-{1} of {2}",
            },
        },
    },
    fr: {
        ...fr,
        $vuetify: {
            ...fr,
            loading: "Chargement du contenu...",
            dataIterator: {
                rowsPerPageText: "Éléments par pages:",
                pageText: "{0}-{1} sur {2}",
            },
        },
    },
};

const i18n = createI18n({
    globalInjection: true,
    legacy: false,
    locale: "fr",
    fallbackLocale: "en",
    messages,
});

const vuetify = createVuetify({
    components,
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
        $axios: AxiosInstance;
        $backendUrl: string;
        $router: Router;
    }
}

app.use(i18n);
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(axios, {
    baseUrl: __BACKEND_URL__,
});

app.config.globalProperties.$backendUrl = __BACKEND_URL__;

app.mount("#app");

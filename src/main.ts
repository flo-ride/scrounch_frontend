import { createApp } from "vue";
import { createPinia } from "pinia";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa";
import "@fortawesome/fontawesome-free/css/all.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import App from "./App.vue";
import router from "./router";
import axios from "./plugins/axios";

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
});

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(axios, {
    baseUrl: __BACKEND_URL__,
});

app.config.globalProperties.$backendUrl = __BACKEND_URL__;

app.mount("#app");

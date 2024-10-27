<template>
    <v-app-bar>
        <template v-slot:prepend>
            <RouterLink to="/">
                <div v-if="theme.global.name.value == 'dark'">
                    <v-img aspect-ratio="1/1" width="80" cover src="@/assets/logo-white.svg">
                        <template v-slot:placeholder>
                            <v-skeleton-loader
                                class="d-flex align-center justify-center fill-height"
                                type="list-item-avatar"
                            ></v-skeleton-loader>
                        </template>
                    </v-img>
                </div>
                <div v-else>
                    <v-img aspect-ratio="1/1" width="80" cover src="@/assets/logo.svg">
                        <template v-slot:placeholder>
                            <v-skeleton-loader
                                class="d-flex align-center justify-center fill-height"
                                type="list-item-avatar"
                            ></v-skeleton-loader>
                        </template>
                    </v-img>
                </div>
            </RouterLink>
        </template>
        <template v-slot:append>
            <v-btn icon="fa-solid fa-language" @click="toggleLanguage"> </v-btn>
            <v-btn
                :icon="themeName == `dark` ? `fa-solid fa-sun` : `fa-solid fa-moon`"
                @click="toggleTheme"
            >
            </v-btn>
            <v-btn
                v-if="!userStore.connected"
                @click="login"
                variant="tonal"
                prepend-icon="fa-brands fa-microsoft"
                :loading="loginLoading"
                :disabled="loginLoading"
                icon="fa-solid fa-right-to-bracket"
            >
            </v-btn>
            <v-menu v-else open-on-hover transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                    <v-avatar color="blue" v-bind="props">
                        {{ nameInitials }}
                    </v-avatar>
                </template>
                <v-list>
                    <v-list-item @click="">
                        <v-icon> fa-solid fa-user </v-icon>
                        {{ $t("toolbar.account") }}
                    </v-list-item>
                    <v-list-item @click="">
                        <v-icon> fa-solid fa-file-invoice </v-icon>
                        {{ $t("toolbar.previous") }}
                    </v-list-item>
                    <v-list-item v-if="userStore.is_admin" @click="$router.push('/admin')">
                        <v-icon> fa-solid fa-gear </v-icon>
                        {{ $t("toolbar.admin") }}
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="logout">
                        <v-icon> fa-solid fa-arrow-right-from-bracket </v-icon>
                        {{ $t("toolbar.logout") }}
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
    </v-app-bar>
</template>

<script lang="ts">
// @ts-ignore
import { useUserStore } from "@/stores/user";
import { useTheme } from "vuetify";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
    data() {
        return {
            loginLoading: false,
        };
    },
    methods: {
        async login() {
            this.loginLoading = true;
            // @ts-ignore
            let res = await this.$axios.get("/me");
            if (res.status != 200) {
                // @ts-ignore
                window.location.href = `${this.$backendUrl}/login`;
            }
            this.loginLoading = false;
        },
        async logout() {
            // @ts-ignore
            let res = await this.$axios.get("/me");
            if (res.status == 200) {
                // @ts-ignore
                window.location.href = `${this.$backendUrl}/logout`;
            }
        },

        toggleLanguage() {
            // @ts-ignore
            this.$i18n.locale = this.$i18n.locale === "fr" ? "en" : "fr";
        },
        toggleTheme() {
            // @ts-ignore
            this.$vuetify.theme.global.name = this.$vuetify.theme.global.current.dark
                ? "light"
                : "dark";
        },
    },
    computed: {
        userStore: () => useUserStore(),
        nameInitials() {
            return this.userStore.name
                ?.split(" ")
                .map((w: String) => w[0])
                .join("")
                .toUpperCase();
        },
        themeName(): string {
            // @ts-ignore
            return this.$vuetify.theme.global.name;
        },
    },
    setup() {
        const theme = useTheme();
        const { t } = useI18n({
            inheritLocale: true,
        });

        return {
            t,
            theme,
        };
    },
});
</script>

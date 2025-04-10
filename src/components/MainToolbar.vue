<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed, inject } from "vue";
import { useI18n } from "vue-i18n";
import { useQueryMe } from "@/query/user";
import { UserApi } from "@/api";

const userApi = inject("userApi", new UserApi());
const apiUrl = inject("apiUrl", "http://localhost:3000");

const { isLoading, data } = useQueryMe(userApi);

const theme = useTheme();
const { locale } = useI18n({
    useScope: "global",
});

const login = () => {
    if (data.value && data.value.id) return;
    window.location.href = `${apiUrl}/login`;
};

const logout = () => {
    if (!data.value || !data.value.id) return;
    window.location.href = `${apiUrl}/logout`;
};

const nameInitials = computed(() => {
    if (!data.value || !data.value.name) return "";
    return data.value.name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase();
});

const themeIsDark = computed(() => {
    return theme.global.current.value.dark;
});

const toggleLanguage = () => {
    locale.value = locale.value === "fr" ? "en" : "fr";
};

const toggleTheme = () => {
    theme.global.name.value = themeIsDark.value ? "light" : "dark";
};
</script>

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
                :icon="themeIsDark ? `fa-solid fa-sun` : `fa-solid fa-moon`"
                @click="toggleTheme"
            >
            </v-btn>
            <v-btn
                v-if="!data || !data.id"
                @click="login"
                variant="tonal"
                :loading="isLoading"
                :disabled="isLoading"
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
                    <v-list-item>
                        <v-icon> fa-solid fa-user </v-icon>
                        {{ $t("toolbar.account") }}
                    </v-list-item>
                    <v-list-item>
                        <v-icon> fa-solid fa-file-invoice </v-icon>
                        {{ $t("toolbar.previous") }}
                    </v-list-item>
                    <v-list-item v-if="data.isAdmin" @click="$router.push('/admin')">
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

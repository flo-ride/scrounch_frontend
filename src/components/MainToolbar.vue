<template>
    <v-app-bar>
        <template v-slot:prepend>
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
            <v-avatar v-else color="blue">
                {{ nameInitials }}
            </v-avatar>
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

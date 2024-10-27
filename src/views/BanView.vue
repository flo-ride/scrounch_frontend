<template>
    <v-container class="d-flex flex-column align-center justify-center text-center ban-page" fluid>
        <v-row>
            <v-col>
                <h1 class="rainbow-text">🚫 Tu t'es fait bannir ! 🚫</h1>
                <img src="@/assets/ohsicrigolo.png" class="funny-img" alt="Oh si c rigolo!" />
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-btn color="pink" dark class="bounce-btn" @click="tryToEscape">
                    Essaye de cliquer ici pour revenir 😈
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-alert colored-border type="warning" class="wobble-text warning-text">
                    ⚠️ <strong>ALERTE !</strong> Tu es un super vilain !
                </v-alert>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-chip color="deep-purple accent-3" class="spinning-chip">
                    Mieux vaut en rire 😂
                </v-chip>
                <v-chip color="indigo accent-4" class="spinning-chip">
                    Et oui, c'est la fin 😢
                </v-chip>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/user";
export default {
    methods: {
        tryToEscape() {
            alert("Ha ! Tu croyais vraiment pouvoir revenir ? 😈");
        },
    },
    computed: {
        userStore: () => useUserStore(),
    },
    mounted() {
        if (this.userStore.is_banned != true) {
            this.$router.push("/");
        }
    },
};
</script>

<style scoped>
@keyframes rainbow {
    0% {
        color: red;
    }
    25% {
        color: yellow;
    }
    50% {
        color: lime;
    }
    75% {
        color: blue;
    }
    100% {
        color: violet;
    }
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes wobble {
    0%,
    100% {
        transform: rotate(-5deg);
    }
    50% {
        transform: rotate(5deg);
    }
}

.ban-page {
    background-color: #ffcccc;
}

.rainbow-text {
    animation: rainbow 2s infinite;
    font-size: 3rem;
    font-weight: bold;
}

.funny-img {
    width: 300px;
    border-radius: 50%;
    margin: 20px 0;
    border: 5px dashed #ff69b4;
}

.bounce-btn {
    animation: bounce 1s infinite;
}

.warning-text {
    font-size: 1.5rem;
    animation: wobble 1s infinite;
}

.spinning-chip {
    animation: spin 4s linear infinite;
    margin: 10px;
}
</style>

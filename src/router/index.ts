import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/about",
            name: "about",
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: "/admin",
            name: "admin",
            component: () => import("../views/admin/AdminView.vue"),
            children: [
                {
                    path: "product",
                    component: () => import("../views/admin/product/ProductView.vue"),
                },
                {
                    path: "user",
                    component: () => import("../views/admin/UserView.vue"),
                },
                {
                    path: "delivery",
                    component: () => import("../views/admin/TodoView.vue"),
                },
                {
                    path: "warehouse",
                    component: () => import("../views/admin/WarehouseView.vue"),
                },
                {
                    path: "order",
                    component: () => import("../views/admin/TodoView.vue"),
                },
                {
                    path: "money",
                    component: () => import("../views/admin/MoneyView.vue"),
                },
                {
                    path: "location",
                    component: () => import("../views/admin/LocationView.vue"),
                },
                {
                    path: "announcement",
                    component: () => import("../views/admin/TodoView.vue"),
                },
                {
                    path: "import",
                    component: () => import("../views/admin/ImportView.vue"),
                },
                {
                    path: "log",
                    component: () => import("../views/admin/TodoView.vue"),
                },
            ],
        },
        {
            path: "/unavailable",
            name: "unavailable",
            component: () => import("../views/UnavailableView.vue"),
        },
        {
            path: "/ban",
            name: "ban",
            component: () => import("../views/BanView.vue"),
        },
    ],
});

export default router;

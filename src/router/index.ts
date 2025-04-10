import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomeView,
        },
        {
            path: "/about",
            name: "About",
            component: () => import("@/views/AboutView.vue"),
        },
        {
            path: "/admin",
            name: "Admin",
            component: () => import("@/views/admin/AdminView.vue"),
            children: [
                {
                    path: "product",
                    component: () => import("@/views/admin/product/ProductView.vue"),
                    alias: "",
                    children: [
                        {
                            alias: "",
                            path: "grid",
                            component: () => import("@/views/admin/product/ProductGridView.vue"),
                        },
                        {
                            path: "list",
                            component: () => import("@/views/admin/product/ProductListView.vue"),
                        },
                    ],
                },
                {
                    path: "product/new",
                    component: () => import("@/views/admin/product/ProductCreateView.vue"),
                },
                {
                    path: "product/:id",
                    component: () => import("@/views/admin/product/ProductDetailView.vue"),
                    props: true,
                },
                {
                    path: "product/:id/recipe",
                    component: () => import("@/views/admin/recipe/RecipeView.vue"),
                    props: true,
                },
                {
                    path: "product/:id/recipe/new",
                    component: () => import("@/views/admin/recipe/RecipeCreateView.vue"),
                    props: true,
                },
                {
                    path: "recipe/:id",
                    component: () => import("@/views/admin/recipe/RecipeDetailView.vue"),
                    props: true,
                },
                {
                    path: "user",
                    component: () => import("@/views/admin/user/UserView.vue"),
                    children: [],
                },
                {
                    path: "user/:id",
                    component: () => import("@/views/admin/user/UserDetailView.vue"),
                    props: true,
                },
                {
                    path: "warehouse",
                    component: () => import("@/views/admin/warehouse/WarehouseView.vue"),
                },
                {
                    path: "warehouse/new",
                    component: () => import("@/views/admin/warehouse/WarehouseCreateView.vue"),
                },
                {
                    path: "warehouse/:id",
                    component: () => import("@/views/admin/warehouse/WarehouseDetailView.vue"),
                    props: true,
                },
                {
                    path: "delivery",
                    component: () => import("../views/admin/TodoView.vue"),
                },
                {
                    path: "order",
                    component: () => import("../views/admin/TodoView.vue"),
                },
                {
                    path: "money",
                    component: () => import("@/views/admin/money/MoneyView.vue"),
                },
                {
                    path: "refill/new",
                    component: () => import("@/views/admin/refill/RefillCreateView.vue"),
                },
                {
                    path: "refill/:id",
                    component: () => import("@/views/admin/refill/RefillDetailView.vue"),
                    props: true,
                },
                {
                    path: "location",
                    component: () => import("@/views/admin/location/LocationView.vue"),
                },
                {
                    path: "location/new",
                    component: () => import("@/views/admin/location/LocationCreateView.vue"),
                },
                {
                    path: "location/:id",
                    component: () => import("@/views/admin/location/LocationDetailView.vue"),
                    props: true,
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
            name: "Unavailable",
            component: () => import("../views/UnavailableView.vue"),
        },
        {
            path: "/ban",
            name: "Ban",
            component: () => import("../views/BanView.vue"),
        },
    ],
});

export default router;

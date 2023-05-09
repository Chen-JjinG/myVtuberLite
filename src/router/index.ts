import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        // { name: "login", path: "/", component: () => import("../views/LoginPage.vue") },
        { name: "studio", path: "/", component: () => import("../views/StudioPage.vue") },
        // { name: "home", path: "/home", component: () => import("../views/HomePage.vue") },
        // { name: "content", path: "/content", component: () => import("../views/ContentShare.vue") },
        // { name: "modelContentShare", path: "/modelContentShare", component: () => import("../views/ModelContentSharePage.vue") },
        // { name: "backgroundContentShare", path: "/backgroundContentShare", component: () => import("../views/BackgroundContentSharePage.vue") },
        // { name: "prime", path: "/", component: () => import("../views/PrimeVue.vue") },
    ]
})
export default router
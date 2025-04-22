import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '@/views/AccueilView.vue'
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import ActiviteView from "@/views/ActiviteView.vue";
import PlanningView from "@/views/PlanningView.vue";
import CoursView from "@/views/CoursView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfilView from "@/views/ProfilView.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: AccueilView,
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView,
    },
    {
        path: '/contact',
        name: '/contact',
        component: ContactView,
    },
    {
        path: '/activite',
        name: 'activite',
        component: ActiviteView,
    },
    {
        path: '/cours',
        name: 'cours',
        component: CoursView,
    },
    {
        path: '/planning',
        name: 'planning',
        component: PlanningView,
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
    },
    {
        path: '/profil',
        name : 'profil',
        component: ProfilView,
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // toujours faire un scroll tout en haut quand un recharge un page
        return { top: 0 };
    },
})

export default router

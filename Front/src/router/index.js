import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '@/views/AccueilView.vue'
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";

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
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // si tu utilises Vite
    routes,
})

export default router

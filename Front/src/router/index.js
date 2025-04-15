import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '@/views/AccueilView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: AccueilView,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // si tu utilises Vite
    routes,
})

export default router

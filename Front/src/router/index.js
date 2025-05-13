import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '@/views/AccueilView.vue'
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import ActiviteView from "@/views/ActiviteView.vue";
import PlanningView from "@/views/PlanningView.vue";
import CoursView from "@/views/CoursView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfilView from "@/views/ProfilView.vue";
import SAbonnerView from "@/views/SAbonnerView.vue";
import EditUserView from "@/components/Admin/User/EditUserView.vue";
import AddFormuleUserView from "@/components/Admin/User/AddFormuleUserView.vue";
import EditCreneauView from "@/components/Planning/EditCreneau.vue"
import CreateFormuleView from "@/components/Admin/Formule/CreateFormuleView.vue";
import EditFormuleView from "@/components/Admin/Formule/EditFormuleView.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: AccueilView,
        meta: { hideNavbar: false, hideFooter: false },
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
    },
    {
        path: '/souscrire/:id',
        name: 'souscrire',
        component: SAbonnerView,
    },
    {
        path: '/profil/editProfil/:id',
        name: 'editUser',
        component: EditUserView,
    },
    {
        path :'/profil/addFormule/:id',
        name: 'addFormule',
        component: AddFormuleUserView,
    },
    {
        path: '/planning/editCreneau',
        name: 'editCreneau',
        component: EditCreneauView,
    },
    {
        path: '/profil/createFormule',
        name: 'createFormule',
        component: CreateFormuleView
    },
    {
        path: '/profil/editFormule',
        name: 'editFormule',
        component: EditFormuleView
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

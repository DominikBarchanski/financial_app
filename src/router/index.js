import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Register from '@/views/Register.vue';
import Login from '@/views/Login.vue';
import Dashboard from "@/views/Dashboard.vue";
import Balance from "@/views/Balance.vue";
import Expanse from "@/views/Expanse.vue";
import Shop_List from "@/views/Shop_List.vue";
import Groups from "@/views/Groups.vue";
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/balance',
        name: 'Balance',
        component: Balance
    },{
        path: '/expanse',
        name: 'Expanse',
        component: Expanse
    },{
        path: '/shop-list',
        name: 'Shop_List',
        component: Shop_List
    },{
        path: '/groups',
        name: 'Groups',
        component: Groups
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes
});

export default router;

import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './pages/Dashboard.vue'
import Index from "./pages/Voices/Index.vue";
import UserLayout from "./layouts/UserLayout.vue";
import Create from "./pages/Voices/Create.vue";

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      component: Dashboard
    },
    {
      path: '/voices',
      meta: { layout: UserLayout},
      component: Index
    },
    {
      path: '/voices/create',
      meta: { layout: UserLayout},
      component: Create
    },
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/album',
      name: 'album',
      component: () => import('../views/album/albumViews.vue')
    },
    {
      path: '/album/albumSet',
      name: 'albumSet',
      component: () => import('../components/albumSet/albumSetViews.vue')
    },
  ]
})

export default router

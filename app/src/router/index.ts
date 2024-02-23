import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'album',
      component: () => import('../views/album/albumViews.vue')
    },
    {
      path: '/albumSet',
      name: 'albumSet',
      component: () => import('../components/albumSet/albumSetViews.vue')
    },
    {
      path: '/albumPhoto',
      name: 'albumPhoto',
      component: () => import('../components/albumSet/albumPhotoViews.vue')
    },
  ]
})

export default router

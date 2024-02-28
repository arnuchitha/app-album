import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'albumCountry',
      component: () => import('../views/album/albumCountryView.vue')
    },
    {
      path: '/albumCity',
      name: 'albumCity',
      component: () => import('../components/album/albumCityView.vue')
    },
    {
      path: '/album',
      name: 'album',
      component: () => import('../components/album/albumView.vue')
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

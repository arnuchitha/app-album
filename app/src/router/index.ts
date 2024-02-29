import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/album/albumCountryView.vue')
    },
    {
      path: '/albumCountry',
      name: 'albumCountry',
      component: () => import('../views/album/albumCountryView.vue')
    },
    {
      path: '/albumCountry/albumCity',
      name: 'albumCity',
      component: () => import('../components/album/albumCityView.vue')
    },
    {
      path: '/albumCountry/albumCity/album',
      name: 'album',
      component: () => import('../components/album/albumView.vue')
    },
    {
      path: '/albumCountry/albumCity/album/albumSet',
      name: 'albumSet',
      component: () => import('../components/albumSet/albumSetViews.vue')
    },
    {
      path: '/albumCountry/albumCity/album/albumSet/albumPhoto',
      name: 'albumPhoto',
      component: () => import('../components/albumSet/albumPhotoViews.vue')
    },
  ]
})

export default router

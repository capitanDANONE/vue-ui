import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/Main.vue'
import Authors from '@/views/Authors.vue'
import Books from '@/views/Books.vue'
import Genres from '@/views/Genres.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
    {
      path: '/authors',
      name: 'authors',
      component: Authors,
    },
    {
      path: '/books',
      name: 'books',
      component: Books,
    },
    {
      path: '/genres',
      name: 'genres',
      component: Genres,
    },
  ],
})

export default router

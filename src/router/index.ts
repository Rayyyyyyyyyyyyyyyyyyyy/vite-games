import { createRouter, createWebHashHistory } from 'vue-router'
import RouterNames from './name'

const routes = [
  {
    path: '/',
    name: RouterNames.homeLayout,
    component: () => import('@/layout/HomeLayout.vue'),
    children: [
      {
        path: '/sudoku',
        name: RouterNames.sudoku,
        component: () => import('@/views/Sudoku.vue')
      },
      {
        path: '/snake',
        name: RouterNames.snake,
        component: () => import('@/views/Snake.vue')
      }
    ]
  },

  {
    path: '/:catchAll(.*)',
    name: RouterNames.page404,
    component: () => import('@/views/NotFound.vue')
  }
]
export default createRouter({
  history: createWebHashHistory(),
  routes
})

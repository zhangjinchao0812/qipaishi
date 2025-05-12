import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import RoomManage from '@/views/RoomManage.vue'
import ProductManage from '@/views/ProductManage.vue'
import SystemManage from '@/views/SystemManage.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/rooms',
    name: 'RoomManage',
    component: RoomManage
  },
  {
    path: '/products',
    name: 'ProductManage',
    component: ProductManage
  },
  {
    path: '/system',
    name: 'SystemManage',
    component: SystemManage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
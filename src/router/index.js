import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/auth/login.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import ScannerDashboard from '@/views/scanner/ScannerDashboard.vue'
import MainHome from '@/views/home/MainHome.vue'
import TicketsManagement from '@/views/admin/TicketsManagement.vue'
import AdminIndex from '@/views/admin/AdminIndex.vue'
import EventsManagement from '@/views/admin/EventsManagement.vue'
import ScannerIndex from '@/views/scanner/ScannerIndex.vue'
import NaikulaHome from '@/views/naikula_main/NaikulaHome.vue'
import NaikulaMenu from '@/views/naikula_main/NaikulaMenu.vue'

const routes = [
  { path: '/', name: 'NaikulaHome', component: NaikulaHome },
  { path: '/naikulamenu', name: 'NaikulaMenu', component: NaikulaMenu },
  { path: '/naikulatickets', name: 'NaikulaTickets', component: MainHome },
  { path: '/login', name: 'Login', component: Login },
  { path: '/admin', component: AdminIndex,
    children:[
      { path:'/admin',redirect:'/admin/admindashboard'},
      { path: 'admindashboard', component: AdminDashboard },
      { path: 'eventsmanagement', component: EventsManagement },
      { path :'ticketsmanagement',component:TicketsManagement },
    ]
   },
  { path: '/scanner', component: ScannerIndex,
    children:[
      {path:'/scanner',redirect:'/scanner/scannerdashboard'},
      {path:'scannerdashboard', component:ScannerDashboard},
    ]
   },
   {
    path: '/events/:id',
    name: 'EventDetail',
    component: () => import('@/views/home/EventDetails.vue')
  },
  {
    path: '/checkout/:id',
    name: 'EventCheckout',
    component: () => import('@/views/home/TicketsCheckout.vue')
  },
  {
    path: '/download/:id',
    name: 'PreviewDownload',
    component: () => import('@/views/home/PreviewDownload.vue')
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

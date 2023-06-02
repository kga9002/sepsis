import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/main/MainView.vue'
import DetectedView from '../views/main/DetectedView.vue'
import PatientView from '../views/patient/PatientView.vue'
import Vital from '../components/Vital.vue'

const routes = [
  {
    path: '/',
    name: 'MainView',
    component: MainView
  },
  {
    path: '/detected',
    name: 'DetectedView',
    component: DetectedView
  },
  {
    // path: '/patient/:pid',
    path: '/patient/:pid/:date?',
    name: 'PatientView',
    component: PatientView
  },
  {
    path: '/addpatient',
    name: 'AddPatient',
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/popups/AddPatient.vue')
  },
  {
    path: '/addvital/:pid',
    name: 'AddVital',
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/popups/AddVital.vue')
  },
  {
    path: '/addlab/:pid',
    name: 'AddLab',
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/popups/AddLab.vue')
  },
  {
    path: '/editvital/:pid/:input',
    name: 'EditVital',
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/popups/EditVital.vue')
  },
  {
    path: '/getAllPatient',
    name: 'getAllPatient',
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/patient/PatientView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

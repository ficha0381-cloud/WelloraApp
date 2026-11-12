import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import ExercisePage from '../views/ExercisePage.vue'
import ExerciseDetailPage from '../views/ExerciseDetailPage.vue'
import TargetPage from '../views/TargetPage.vue'
import StatisticsPage from '../views/StatisticsPage.vue'
import WeatherPage from '../views/WeatherPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import AIAssistantPage from '../views/AIAssistantPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: HomePage
  },
  {
    path: '/exercise',
    component: ExercisePage
  },
  {
    path: '/exercise-detail',
    component: ExerciseDetailPage
  },
  {
    path: '/target',
    component: TargetPage
  },
  {
    path: '/statistics',
    component: StatisticsPage
  },
  {
    path: '/weather',
    component: WeatherPage
  },
  {
    path: '/profile',
    component: ProfilePage
  },
  {
    path: '/ai-assistant',
    component: AIAssistantPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
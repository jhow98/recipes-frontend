import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import RecipesPage from '@/pages/RecipesPage.vue'
import CreateRecipePage from '@/pages/CreateRecipePage.vue'
import EditRecipePage from '@/pages/EditRecipePage.vue'

const routes = [
  { path: '/login',       component: LoginPage },
  { path: '/register',    component: RegisterPage },
  { path: '/receitas',    component: RecipesPage,    meta: { requiresAuth: true } },
  { path: '/receitas/criar',    component: CreateRecipePage, meta: { requiresAuth: true } },
  { path: '/receitas/:id/editar', component: EditRecipePage,   meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' }
]

export default createRouter({
  history: createWebHistory(),
  routes
})

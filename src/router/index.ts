import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import RecipesPage from '@/pages/RecipesPage.vue'
import CreateRecipePage from '@/pages/CreateRecipePage.vue'
import EditRecipePage from '@/pages/EditRecipePage.vue'
import RecipeDetailPage from '@/pages/RecipeDetailPage.vue'

const routes = [
  {
    path: '/login',
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    component: RegisterPage,
    meta: { requiresAuth: false },
  },
  {
    path: '/receitas',
    component: RecipesPage,
    meta: { requiresAuth: true },
  },
  

  {
    path: '/receitas/criar',
    component: CreateRecipePage,
    meta: { requiresAuth: true },
  },
  { path: '/receitas/:id',     component: RecipeDetailPage, meta: { requiresAuth: true } },
  {
    path: '/receitas/:id/editar',
    component: EditRecipePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const loggedIn = auth.isLoggedIn

  if (to.meta.requiresAuth && !loggedIn) {
    return next({ path: '/login' })
  }

  if (to.path === '/login' && loggedIn) {
    return next({ path: '/receitas' })
  }

  next()
})

export default router

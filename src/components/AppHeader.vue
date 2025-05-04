<template>
  <header class="header">
    <h1 class="title">
      Receitas App
    </h1>
    <nav class="nav">
      <RouterLink v-if="!auth.isLoggedIn" to="/register" :class="{ active: route.path === '/register' }">
        Cadastrar Usuário
      </RouterLink>
      <button v-if="!auth.isLoggedIn" @click="router.push('/login')">
        Login
      </button>
      <RouterLink v-if="auth.isLoggedIn" to="/receitas"
        :class="{ active: route.path.startsWith('/receitas') && !route.path.includes('criar') }">
        Minhas Receitas
      </RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/receitas/criar" :class="{ active: route.path === '/receitas/criar' }">
        Nova Receita
      </RouterLink>
      <button v-if="auth.isLoggedIn" @click="logout">
        Logout
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 1.5rem;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding-bottom: 0.25em;
}

.nav a.active {
  border-bottom: 2px solid white;
}

.nav button {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>

<template>
  <header class="header">
    <h1 class="title">
      Receitas App
    </h1>

    <nav class="nav">
      <RouterLink to="/register">
        Cadastrar Usuário
      </RouterLink>
      <RouterLink to="/receitas/criar">
        Nova Receita
      </RouterLink>
      <RouterLink to="/receitas">
        Minhas Receitas
      </RouterLink>
      <button @click="logout">
        Logout
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const auth = useAuthStore();

const logout = () => {
  auth.logout();
  router.push('/login');
};
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
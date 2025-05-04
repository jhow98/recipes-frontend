<template>
  <AppHeader />
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <BaseInput id="login" label="Login" type="text" v-model="login" placeholder="login" />
        <BaseInput
          id="password"
          label="Senha"
          type="password"
          v-model="password"
          placeholder="••••••••"
        />
        <BaseButton type="submit" :disabled="loading">Entrar</BaseButton>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <p class="register-link">
        Não tem uma conta?
        <router-link to="/register">Cadastre‑se</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import AppHeader from '@/components/AppHeader.vue'

const login = ref('')
const password = ref('')
const { error, loading, login: doLogin } = useAuth()

const handleLogin = () => {
  doLogin({ login: login.value, password: password.value })
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f9f9f9;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  text-align: left;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.error {
  color: red;
  margin-top: 0.5rem;
}

.register-link {
  margin-top: 1rem;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>

<template>
  <AppHeader />
  <div class="login-page__wrapper">
    <div class="login-page__card">
      <h2 class="login-page__title">Login</h2>
      <form @submit.prevent="handleLogin" class="login-page__form">
        <BaseInput id="login" label="Login" type="text" v-model="login" placeholder="login" />
        <BaseInput
          id="password"
          label="Senha"
          type="password"
          v-model="password"
          placeholder="••••••••"
        />
        <BaseButton v-if="!loading" type="submit" class="login-page__button">Entrar</BaseButton>
        <div v-else class="login-page__loading">Entrando...</div>
        <p v-if="error" class="login-page__error">{{ error }}</p>
      </form>
      <p class="login-page__register">
        Não tem uma conta?
        <router-link to="/register" class="login-page__register-link">Cadastre‑se</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import AppHeader from '@/components/AppHeader.vue'

const login = ref('')
const password = ref('')
const router = useRouter()
const { token, error, loading, login: doLogin } = useAuth()

onMounted(() => {
  if (token?.valueOf) {
    router.push('/receitas')
  }
})

const handleLogin = async () => {
  if (await doLogin({ login: login.value, password: password.value })) {
    router.push('/receitas')
  }
}
</script>

<style scoped>
.login-page__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f9f9f9;
}

.login-page__card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  text-align: left;
}

.login-page__title {
  margin-bottom: 1.5rem;
  text-align: center;
}

.login-page__form {
  display: flex;
  flex-direction: column;
}

.login-page__button {
  margin-top: 1rem;
}

.login-page__loading {
  text-align: center;
  padding: 0.7rem 1.2rem;
  color: #555;
}

.login-page__error {
  color: red;
  margin-top: 0.5rem;
}

.login-page__register {
  margin-top: 1rem;
  text-align: center;
}

.login-page__register-link {
  color: #007bff;
  text-decoration: none;
}

.login-page__register-link:hover {
  text-decoration: underline;
}
</style>

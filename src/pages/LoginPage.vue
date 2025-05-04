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
        <BaseButton type="submit"> Entrar </BaseButton>
        <p v-if="error" class="error">
          {{ error }}
        </p>
      </form>
      <p class="register-link">
        Não tem uma conta?
        <router-link to="/register"> Cadastre‑se </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import api from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import AppHeader from '@/components/AppHeader.vue'
import axios from 'axios'

const login = ref('')
const password = ref('')
const error = ref('')

const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (auth.token) {
    router.push('/receitas')
  }
})

const handleLogin = async () => {
  error.value = ''

  if (!login.value || !password.value) {
    error.value = 'Preencha todos os campos.'
    return
  }

  try {
    const response = await api.post('/auth/login', {
      login: login.value,
      password: password.value,
    })
    auth.setToken(response.data.access_token)
    router.push('/receitas')
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status

      if (status === 400) {
        error.value = 'Preencha corretamente os dados.'
      } else if (status === 401) {
        error.value = 'Credenciais inválidas.'
      } else if (status === 500) {
        error.value = 'Erro interno do servidor.'
      } else {
        error.value = 'Servidor acordando… aguarde um minuto e tente novamente.'
      }
    } else {
      error.value = 'Ocorreu um erro inesperado.'
    }
  }
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

<template>
  <AppHeader />
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Cadastrar novo usuário</h2>

      <form @submit.prevent="handleRegister">
        <BaseInput id="login" v-model="login" type="text" label="Login" placeholder="novo.login" />
        <BaseInput id="password" v-model="password" type="password" label="Senha" placeholder="••••••••" />
        <BaseInput id="name" v-model="name" type="text" label="Nome completo" placeholder="Seu nome" />

        <BaseButton type="submit">
          Cadastrar
        </BaseButton>

        <p v-if="message" class="success">
          {{ message }}
        </p>
        <p v-if="error" class="error">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import api from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import AppHeader from '@/components/AppHeader.vue';

const login = ref('')
const password = ref('')
const name = ref('')
const error = ref('')
const message = ref('')

const router = useRouter()

const handleRegister = async () => {
  error.value = ''
  message.value = ''

  if (!login.value || !password.value || !name.value) {
    error.value = 'Preencha todos os campos.'
    return
  }

  if (password.value.length < 6) {
    error.value = 'A senha deve conter pelo menos 6 caracteres.'
    return
  }

  if (name.value.length < 2) {
    error.value = 'Informe um nome válido.'
    return
  }

  try {
    await api.post('/users', {
      login: login.value,
      password: password.value,
      name: name.value,
    })

    message.value = 'Usuário cadastrado com sucesso!'
    setTimeout(() => router.push('/login'), 1000)
  }
  catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 400) {
        error.value = 'Verifique os dados preenchidos.'
      }
      else if (status === 500) {
        error.value = 'Erro interno do servidor.'
      }
      else {
        error.value = 'Ops! Nosso servidor está acordando agora — aguarde 1 minutinho e tente de novo. 🍃'
      }
    }
    else {
      error.value = 'Erro inesperado.'
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
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.error {
  color: red;
  margin-top: 0.5rem;
  text-align: center;
}

.success {
  color: green;
  margin-top: 0.5rem;
  text-align: center;
}
</style>

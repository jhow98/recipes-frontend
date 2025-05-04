<template>
  <AppHeader />
  <div class="register-page__wrapper">
    <div class="register-page__card">
      <h2 class="register-page__title">Cadastrar novo usuário</h2>

      <form @submit.prevent="handleRegister" class="register-page__form">
        <BaseInput
          id="login"
          v-model="login"
          type="text"
          label="Login"
          placeholder="novo.login"
          class="register-page__input"
        />
        <BaseInput
          id="password"
          v-model="password"
          type="password"
          label="Senha"
          placeholder="••••••••"
          class="register-page__input"
        />
        <BaseInput
          id="name"
          v-model="name"
          type="text"
          label="Nome completo"
          placeholder="Seu nome"
          class="register-page__input"
        />

        <BaseButton v-if="!submitting" type="submit" class="register-page__button">
          Cadastrar
        </BaseButton>
        <div v-else class="register-page__loading">Cadastrando...</div>

        <p v-if="message" class="register-page__success">{{ message }}</p>
        <p v-if="error" class="register-page__error">{{ error }}</p>
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
import AppHeader from '@/components/AppHeader.vue'

const login = ref('')
const password = ref('')
const name = ref('')
const error = ref('')
const message = ref('')
const submitting = ref(false)

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
  submitting.value = true
  try {
    await api.post('/users', {
      login: login.value,
      password: password.value,
      name: name.value,
    })
    message.value = 'Usuário cadastrado com sucesso!'
    setTimeout(() => router.push('/login'), 1000)
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 400) {
        error.value = 'Verifique os dados preenchidos.'
      } else if (status === 409) {
        error.value = 'Login já existe.'
      } else if (status === 500) {
        error.value = 'Erro interno do servidor.'
      } else {
        error.value =
          'Ops! Nosso servidor está acordando agora — aguarde 1 minutinho e tente de novo. 🍃'
      }
    } else {
      error.value = 'Erro inesperado.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.register-page__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f9f9f9;
}

.register-page__card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
}

.register-page__title {
  margin-bottom: 1.5rem;
  text-align: center;
}

.register-page__form {
  display: flex;
  flex-direction: column;
}

.register-page__input:not(:last-of-type) {
  margin-bottom: 1rem;
}

.register-page__button {
  margin-top: 1rem;
}

.register-page__loading {
  margin-top: 1rem;
  text-align: center;
  color: #555;
}

.register-page__success {
  color: green;
  margin-top: 0.5rem;
  text-align: center;
}

.register-page__error {
  color: red;
  margin-top: 0.5rem;
  text-align: center;
}
</style>

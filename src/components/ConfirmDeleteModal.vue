<template>
  <div class="confirm-modal__backdrop">
    <div class="confirm-modal__dialog">
      <p class="confirm-modal__message">Tem certeza que deseja excluir esta receita?</p>
      <div class="confirm-modal__actions">
        <button
          class="confirm-modal__button confirm-modal__button--cancel"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
        <button
          class="confirm-modal__button confirm-modal__button--confirm"
          @click="$emit('confirm')"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.confirm-modal__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.confirm-modal__dialog {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.confirm-modal__message {
  margin: 0;
}

.confirm-modal__actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-around;
}

.confirm-modal__button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.confirm-modal__button--cancel {
  background: #ccc;
}

.confirm-modal__button--confirm {
  background: #c0392b;
  color: white;
}
</style>

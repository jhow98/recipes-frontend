<template>
  <div class="modal-backdrop">
    <div class="modal">
      <p>Tem certeza que deseja excluir esta receita?</p>
      <div class="actions">
        <button class="cancel" @click="$emit('cancel')">Cancelar</button>
        <button class="confirm" @click="$emit('confirm')">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-backdrop {
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

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-around;
}

.cancel {
  background: #ccc;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.confirm {
  background: #c0392b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>

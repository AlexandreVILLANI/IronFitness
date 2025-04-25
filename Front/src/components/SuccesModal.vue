<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <svg class="icon-success" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
        </svg>
        <h2>Demande envoyée avec succès !</h2>
      </div>
      <div class="modal-body">
        <p>Votre demande d'abonnement pour <strong>{{ formuleNom }}</strong> a bien été transmise.</p>
        <p>Vous recevrez une confirmation par email lorsque le gérant aura traité votre demande.</p>
      </div>
      <div class="modal-footer">
        <button @click="closeModal" class="modal-button">Continuer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  formuleNom: String,
  isVisible: Boolean
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s ease-out;
}

.modal-header {
  background-color: #4CAF50;
  color: white;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-success {
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.modal-body {
  padding: 25px;
  text-align: center;
  color: #555;
  line-height: 1.6;
}

.modal-footer {
  padding: 15px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #eee;
}

.modal-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-button:hover {
  background-color: #3e8e41;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
<template>
  <div class="user-profile-container">
    <confirm-dialogue ref="confirmDialog" />

    <div class="profile-header">
      <h1>Profil Utilisateur</h1>
      <div class="welcome-message">Bonjour {{ userCourant.prenom_utilisateur }} {{ userCourant.nom_utilisateur}} 👋</div>
    </div>

    <button class="logout-button" @click="logout">
      <span class="button-icon">🚪</span>
      <span class="button-text">Se déconnecter</span>
    </button>
  </div>
</template>

<script setup>
import ConfirmDialogue from "@/components/ConfirmDialog.vue";
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

// Référence pour la boîte de dialogue de confirmation
const confirmDialog = ref(null);
// Si vous utilisez un composant popup, déclarez-le aussi
const popup = ref(null);

const userCourant = store.state.user.userCourant;

const logout = async () => {
  // Version avec le popup
  if (popup.value) {
    popup.value.show();
  }

  // Ou version avec confirmDialog
  const ok = await confirmDialog.value?.show({
    title: 'Confirmer Déconnexion',
    message: 'Etes-vous sûr de vouloir vous déconnecter ?',
    okButton: 'Confirmer',
  });

  if (ok) {
    await store.dispatch('user/logoutUser');
    await router.push('/');
  }
};
</script>

<style scoped>
.user-profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.welcome-message {
  font-size: 1.2rem;
  color: #42b983;
  font-weight: 500;
}

.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #dc3545;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: #f1f3f5;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-icon {
  font-size: 1.2rem;
}

.button-text {
  font-size: 1rem;
}

@media (max-width: 640px) {
  .user-profile-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>

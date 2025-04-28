<script setup>

import ConfirmDialogue from "@/components/Dialog/ConfirmDialog.vue";
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

<template>
  <div>
    <confirm-dialogue ref="confirmDialog"></confirm-dialogue>
    <p>Profil Administrateur</p>
    <div class="titre-bienvenue">Bonjour {{ userCourant.prenom }}</div>
    <button class="button-disconnect" @click="logout">Se déconnecter</button>
  </div>
</template>

<style scoped>

</style>
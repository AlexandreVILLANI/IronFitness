<template>
  <BaseModal ref="popup">
    <h2 style="margin-top: 0;">Déconnexion</h2>
    <p style="margin-top: 20px; margin-bottom: 20px;">
      Vous avez été déconnecté en raison d'une inactivité prolongée.
    </p>
    <div class="btns">
      <span class="ok-btn" @click="closeDialog">OK</span>
    </div>
  </BaseModal>
</template>

<script>
import BaseModal from '@/components/Dialog/BaseModal.vue';

export default {
  name: 'DisconnectedDialog',
  components: {
    BaseModal,
  },
  methods: {
    show() {
      if (this.$refs.popup) {
        this.$refs.popup.open(); // Ouvrir la boîte de dialogue
      } else {
        console.error('BaseModal introuvable !');
      }
    },
    closeDialog() {
      if (this.$refs.popup) {
        this.$refs.popup.close(); // Fermer la boîte de dialogue
      }
    },
  },
};
</script>

<style scoped>
.btns {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.ok-btn {
  background-color: #000000;
  color: white;
  padding: 10px 20px;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}
.ok-btn:hover {
  background-color: #1caf17;
}
</style>

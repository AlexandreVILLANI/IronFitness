<template>
  <BaseModal ref="popup">
    <h2 style="margin-top: 0">{{ title }}</h2>
    <p style="margin-top: 20px;margin-bottom: 20px">{{ message }}</p>
    <div class="btns">
      <button class="cancel-btn" @click="_cancel">{{ cancelButton }}</button>
      <span class="ok-btn" @click="_confirm">{{ okButton }}</span>
    </div>
  </BaseModal>
</template>

<script>
import BaseModal from '@/components/Dialog/BaseModal.vue';

export default {
  name: 'ConfirmDialogue',
  components: {
    BaseModal,
  },
  data() {
    return {
      title: undefined,
      message: undefined,
      okButton: undefined,
      cancelButton: 'Annuler',
      resolvePromise: undefined,
      rejectPromise: undefined,
    };
  },
  methods: {
    show(opts = {}) {
      this.title = opts.title;
      this.message = opts.message;
      this.okButton = opts.okButton;
      if (opts.cancelButton) {
        this.cancelButton = opts.cancelButton;
      }

      // S'assurer que la référence popup est correcte
      if (this.$refs.popup) {
        this.$refs.popup.open(); // Ouvre le modal
      } else {
        console.error('PopupModal not found!');
      }

      // Retourne une promesse
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },

    _confirm() {
      if (this.$refs.popup) {
        this.$refs.popup.close(); // Ferme le modal
      }
      this.resolvePromise(true);
    },

    _cancel() {
      if (this.$refs.popup) {
        this.$refs.popup.close(); // Ferme le modal
      }
      this.resolvePromise(false);
    },
  },
};
</script>


<style scoped>
.btns {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.ok-btn {
  background-color: #000000;
  color: white;
  padding: 10px 20px;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

.cancel-btn {
  background-color: #000000;
  color: white;
  padding: 10px 20px;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

.cancel-btn:hover {
  background-color: #ff0000;
}

.ok-btn:hover{
  background-color: #1caf17;
}
</style>
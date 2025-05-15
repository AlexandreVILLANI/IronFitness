<template>
  <div class="user-details-container">
    <button class="back-button" @click="$router.push('/profil')">⬅ Retour au profil</button>

    <h1>Modifier les informations de l'utilisateur</h1>

    <div v-if="user" class="edit-section">
      <div class="form-group">
        <label for="nom">Nom :</label>
        <input v-model="user.nom_utilisateur" id="nom" type="text" />
      </div>

      <div class="form-group">
        <label for="prenom">Prénom :</label>
        <input v-model="user.prenom_utilisateur" id="prenom" type="text" />
      </div>

      <div class="form-group">
        <label for="email">Adresse e-mail :</label>
        <input v-model="user.adresse_mail" id="email" type="email" />
      </div>

      <div class="form-group">
        <label for="formule">Formule attribuée (ce champ ne peut pas être changé ici) :
        </label>
        <div id="formule" class="form-display">
          <span v-if="user.formules">{{ user.formules }}</span>
          <span v-else>Aucune formule attribuée</span>
        </div>
      </div>

      <button class="save-button" @click="saveChanges">
        Enregistrer les modifications
      </button>
    </div>

    <div v-else>
      <p>Chargement des informations de l'utilisateur...</p>
    </div>

    <!-- Boîte de dialogue -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-box" :class="dialogType">
        <div class="dialog-header">
          <h3>{{ dialogTitle }}</h3>
          <button class="close-button" @click="closeDialog">&times;</button>
        </div>
        <div class="dialog-content">
          <p>{{ dialogMessage }}</p>
        </div>
        <div class="dialog-footer">
          <button v-if="dialogType === 'confirm'" class="dialog-button cancel" @click="closeDialog">
            Annuler
          </button>
          <button class="dialog-button confirm" @click="confirmAction">
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "UserDetails",
  data() {
    return {
      user: null,
      showDialog: false,
      dialogTitle: "",
      dialogMessage: "",
      dialogType: "", // 'info', 'confirm', 'error'
      confirmButtonText: "OK",
      onConfirm: null,
    };
  },
  async created() {
    const userId = this.$route.params.id;
    await this.fetchUserDetails(userId);
  },
  methods: {
    ...mapActions("user", ["getUserById", "updateUtilisateur"]),

    async fetchUserDetails(id) {
      try {
        const result = await this.getUserById(id);
        if (result) {
          this.user = result;
        } else {
          console.warn("Aucune donnée utilisateur trouvée !");
          this.showErrorDialog("Erreur", "Impossible de charger les informations de l'utilisateur");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        this.showErrorDialog("Erreur", "Une erreur est survenue lors du chargement des données");
      }
    },

    showInfoDialog(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      this.dialogType = "info";
      this.confirmButtonText = "OK";
      this.showDialog = true;
    },

    showConfirmDialog(title, message, confirmCallback) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      this.dialogType = "confirm";
      this.confirmButtonText = "Confirmer";
      this.onConfirm = confirmCallback;
      this.showDialog = true;
    },

    showErrorDialog(title, message) {
      this.dialogTitle = title || "Erreur";
      this.dialogMessage = message;
      this.dialogType = "error";
      this.confirmButtonText = "OK";
      this.showDialog = true;
    },

    closeDialog() {
      this.showDialog = false;
      this.onConfirm = null;
    },

    confirmAction() {
      if (this.onConfirm) {
        this.onConfirm();
      }
      this.closeDialog();
    },

    editFormule() {
      const userId = this.$route.params.id;
      this.$router.push({ name: 'editUser', params: { id: userId.id_utilisateur } });
    },

    async saveChanges() {
      try {
        this.showConfirmDialog(
            "Confirmer les modifications",
            "Êtes-vous sûr de vouloir enregistrer ces modifications ?",
            async () => {
              const updatedUser = {
                id_utilisateur: this.user.id_utilisateur,
                nom_utilisateur: this.user.nom_utilisateur,
                prenom_utilisateur: this.user.prenom_utilisateur,
                mail_utilisateur: this.user.adresse_mail,
              };
              await this.updateUtilisateur(updatedUser);
              this.showInfoDialog("Succès", "Modifications enregistrées avec succès !");
            }
        );
      } catch (err) {
        this.showErrorDialog("Erreur", "Échec de l'enregistrement des modifications.");
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
      }
    },
  },
};
</script>

<style scoped>
.user-details-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
}

.back-button:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.edit-section {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #2c3e50;
}

input {
  padding: 0.6rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  color: #2c3e50;
}

input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.15);
}

.form-display {
  padding: 0.6rem;
  background-color: #f1f3f5;
  border-radius: 6px;
  color: #495057;
}

.save-button {
  align-self: flex-end;
  padding: 0.8rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.save-button:hover {
  background-color: #3aa876;
  transform: translateY(-1px);
}

/* Styles pour la boîte de dialogue */
.dialog-overlay {
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
}

.dialog-box {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.dialog-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0 0.5rem;
}

.close-button:hover {
  color: #495057;
}

.dialog-content {
  padding: 1.5rem;
  color: #495057;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  gap: 0.75rem;
}

.dialog-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dialog-button.confirm {
  background-color: #42b983;
  color: white;
}

.dialog-button.confirm:hover {
  background-color: #3aa876;
}

.dialog-button.cancel {
  background-color: #f1f1f1;
  color: #333;
}

.dialog-button.cancel:hover {
  background-color: #e0e0e0;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Types de boîtes */
.dialog-box.error .dialog-header {
  background-color: #f8d7da;
  color: #721c24;
}

.dialog-box.error .dialog-header h3 {
  color: #721c24;
}

.dialog-box.error .dialog-button.confirm {
  background-color: #dc3545;
}

.dialog-box.error .dialog-button.confirm:hover {
  background-color: #c82333;
}

.dialog-box.info .dialog-header {
  background-color: #d1ecf1;
  color: #0c5460;
}

.dialog-box.info .dialog-header h3 {
  color: #0c5460;
}

.dialog-box.confirm .dialog-header {
  background-color: #d4edda;
  color: #155724;
}

.dialog-box.confirm .dialog-header h3 {
  color: #155724;
}

@media (max-width: 768px) {
  .user-details-container {
    padding: 1rem;
  }
}
</style>

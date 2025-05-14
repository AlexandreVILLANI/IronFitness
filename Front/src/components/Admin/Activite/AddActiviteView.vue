<template>
  <div class="create-activite-page">
    <div class="activite-header">
      <button class="btn modal-btn" @click="redirectNow">
        Retour au profil
      </button>
      <h1>Ajouter une nouvelle activité</h1>
      <p class="subtitle">Remplissez le formulaire pour créer une nouvelle activité</p>
    </div>


    <form @submit.prevent="submitActivite" class="activite-form">
      <div class="form-group">
        <label>Nom de l'activité *</label>
        <input
            v-model="form.nom_activite"
            type="text"
            class="form-control"
            required
        />
      </div>

      <div class="form-group">
        <label>Nom du fichier image</label>
        <input
            v-model="form.image_activite"
            type="text"
            class="form-control"
        />
        <p class="input-hint">Laissez vide si aucune image</p>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea
            v-model="form.description_activite"
            rows="4"
            class="form-control"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Type d'activité *</label>
        <div class="select-wrapper">
          <select
              v-model="form.type_activite"
              class="form-control"
              required
          >
            <option disabled value="">-- Sélectionner un type --</option>
            <option value="En groupe">En groupe</option>
            <option value="Personnel">Personnel</option>
          </select>
          <div class="select-arrow"></div>
        </div>
      </div>

      <div class="form-actions">
        <button
            type="submit"
            class="btn btn-submit"
            :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="spinner"></span>
          <span v-else>Enregistrer</span>
        </button>
      </div>
    </form>

    <transition name="fade">
      <div v-if="showSuccess" class="modal-overlay">
        <div class="modal-content">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2>Activité créée !</h2>
          <p>Votre nouvelle activité a été enregistrée avec succès.</p>
          <div class="modal-actions">
            <button @click="goToProfile" class="btn modal-btn">Fermer</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showError" class="modal-overlay">
        <div class="modal-content">
          <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2>Erreur</h2>
          <p>Une erreur est survenue lors de l'enregistrement.</p>
          <div class="modal-actions">
            <button @click="showError = false" class="btn modal-btn">Fermer</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { useRouter } from 'vue-router';

export default {
  name: "AddActivite",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      form: {
        nom_activite: "",
        image_activite: "",
        description_activite: "",
        type_activite: ""
      },
      isSubmitting: false,
      showSuccess: false,
      showError: false
    };
  },
  methods: {
    ...mapActions("activite", ["createActivite"]),

    async submitActivite() {
      this.isSubmitting = true;
      this.showSuccess = false;
      this.showError = false;

      try {
        await this.createActivite(this.form);
        this.showSuccess = true;
        this.resetForm();
      } catch (err) {
        console.error(err);
        this.showError = true;
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.form = {
        nom_activite: "",
        image_activite: "",
        description_activite: "",
        type_activite: ""
      };
    },
    redirectNow() {
      this.$router.push({ name: 'profil' });
    },

    goToProfile() {
      this.showSuccess = false;
      this.router.push('/profil');
    }
  }
};
</script>

<style scoped>
.create-activite-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.activite-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.activite-header h1 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
}

.activite-form {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 1.75rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
}

.input-hint {
  margin-top: 0.5rem;
  color: #7f8c8d;
  font-size: 0.8rem;
  font-style: italic;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  background-color: #fff;
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.select-wrapper {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #7f8c8d;
  pointer-events: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-submit {
  background-color: #3498db;
  color: white;
}

.btn-submit:hover {
  background-color: #2980b9;
}

.btn-submit:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: modalEnter 0.3s ease-out;
}

.success-icon, .error-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon {
  background: #e8f5e9;
}

.success-icon svg {
  fill: #2ecc71;
}

.error-icon {
  background: #ffebee;
}

.error-icon svg {
  fill: #e74c3c;
}

.modal-content h2 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
}

.modal-content p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.modal-actions {
  margin-top: 1.5rem;
}

.modal-btn {
  background: #3498db;
  color: white;
  width: 100%;
}

.modal-btn:hover {
  background: #2980b9;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .activite-form {
    padding: 1.5rem;
  }

  .modal-content {
    padding: 1.5rem;
  }
}


</style>
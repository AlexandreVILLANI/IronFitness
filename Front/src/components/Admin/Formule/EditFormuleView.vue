<template>
  <div class="create-formule-page">
    <div class="formule-header">
      <h1>{{ isEditMode ? 'Modifier la Formule' : 'Créer une Formule' }}</h1>
      <p class="subtitle">{{ isEditMode ? 'Modifiez votre formule existante' : 'Configurez une nouvelle formule pour vos clients' }}</p>
    </div>

    <form @submit.prevent="submitForm" class="formule-form">
      <div class="form-group">
        <label for="nom_formule">Nom de la formule*</label>
        <input
            type="text"
            id="nom_formule"
            v-model="formuleData.nom_formule"
            required
            class="form-control"
            placeholder="Ex: Formule Premium"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="prix_formule">Prix*</label>
          <div class="input-with-icon">
            <input
                type="number"
                id="prix_formule"
                v-model="formuleData.prix_formule"
                min="0"
                step="0.01"
                required
                class="form-control"
                placeholder="0.00"
            />
            <span class="currency-icon">€</span>
          </div>
        </div>

        <div class="form-group">
          <label for="unite">Unité*</label>
          <div class="select-wrapper">
            <select
                id="unite"
                v-model="formuleData.unite"
                required
                class="form-control"
            >
              <option value="mois">mois</option>
              <option value="séance">séance</option>
              <option value="heure">heure</option>
            </select>
            <div class="select-arrow"></div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Activités incluses*</label>
        <div v-if="allActivites.length === 0" class="no-activities">
          Aucune activité disponible
        </div>
        <div v-else class="activities-grid">
          <div
              v-for="activite in allActivites"
              :key="activite.id_activite"
              class="activity-card"
              :class="{ selected: formuleData.activites.includes(activite.id_activite) }"
              @click="toggleActivity(activite.id_activite)"
          >
            <input
                type="checkbox"
                :id="'activite-' + activite.id_activite"
                :value="activite.id_activite"
                v-model="formuleData.activites"
                class="activity-checkbox"
                hidden
            />
            <label :for="'activite-' + activite.id_activite">
              {{ activite.nom_activite }}
            </label>
            <div class="check-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>La formule est sur rendez vous ?</label>
        <div class="radio-group">
          <label>
            <input
                type="radio"
                name="sur_rendezvous"
                :value="true"
                v-model="formuleData.sur_rendezvous"
                required
            />
            Oui
          </label>
          <label>
            <input
                type="radio"
                name="sur_rendezvous"
                :value="false"
                v-model="formuleData.sur_rendezvous"
                required
            />
            Non
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancel" class="btn btn-cancel">
          Annuler
        </button>
        <button type="submit" class="btn btn-submit" :disabled="loading">
          <span v-if="!loading">{{ isEditMode ? 'Mettre à jour' : 'Créer la formule' }}</span>
          <span v-else class="spinner"></span>
        </button>
      </div>
    </form>

    <transition name="fade">
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-content">
          <div class="success-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2>{{ isEditMode ? 'Formule mise à jour !' : 'Formule créée avec succès !' }}</h2>
          <p>Votre formule est maintenant {{ isEditMode ? 'à jour' : 'disponible' }}.</p>
          <div class="modal-actions">
            <button class="btn modal-btn" @click="redirectNow">
              Retour aux formules
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'EditFormule',

  data() {
    return {
      formuleData: {
        id_formule: null,
        nom_formule: '',
        prix_formule: 0,
        unite: 'mois',
        activites: [],
        sur_rendezvous: false
      },
      loading: false,
      showSuccessModal: false,
      isEditMode: false
    };
  },

  computed: {
    ...mapGetters('activite', ['allActivites']),

    formuleId() {
      return this.$route.params.id;
    }
  },

  async created() {
    try {
      await this.getAllActivite();
      if (this.formuleId) {
        this.isEditMode = true;
        await this.loadFormuleData();
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données :', err);
    }
  },

  methods: {
    ...mapActions('formule', ['createFormule', 'updateFormule', 'getFormuleById']),
    ...mapActions('activite', ['getAllActivite']),

    async loadFormuleData() {
      try {
        this.loading = true;
        await this.getFormuleById(this.formuleId);
        const formule = this.$store.state.formule.selectedFormule;

        if (formule) {
          const activiteIds = formule.activites_liees
              ? formule.activites_liees.split(',').map(nom => {
                const activite = this.allActivites.find(a => a.nom_activite === nom.trim());
                return activite ? activite.id_activite : null;
              }).filter(id => id !== null)
              : [];

          this.formuleData = {
            id_formule: formule.id_formule,
            nom_formule: formule.nom_formule,
            prix_formule: parseFloat(formule.prix_formule),
            unite: formule.unite,
            activites: activiteIds,
            sur_rendezvous: formule.sur_rendezvous
          };
        } else {
          this.$router.push({ name: 'formules' });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la formule :', error);
        this.$router.push({ name: 'formules' });
      } finally {
        this.loading = false;
      }
    },

    toggleActivity(activityId) {
      const index = this.formuleData.activites.indexOf(activityId);
      if (index === -1) {
        this.formuleData.activites.push(activityId);
      } else {
        this.formuleData.activites.splice(index, 1);
      }
    },

    async submitForm() {
      try {
        this.loading = true;

        if (this.isEditMode && this.formuleData.id_formule) {
          await this.updateFormule({ id: this.formuleData.id_formule, payload: this.formuleData });
        } else {
          await this.createFormule(this.formuleData);
        }

        this.showSuccessModal = true;
      } catch (error) {
        console.error('Erreur lors de la soumission :', error);
        alert(`Erreur : ${error.message || 'Une erreur est survenue'}`);
      } finally {
        this.loading = false;
      }
    },

    redirectNow() {
      this.$router.push({ name: 'profil' });
    },

    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
/* Le style reste exactement le même que dans la version précédente */
.create-formule-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.formule-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.formule-header h1 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
}

.formule-form {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.75rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
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

.input-with-icon {
  position: relative;
}

.currency-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
  font-weight: 500;
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

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.activity-card {
  position: relative;
  padding: 1.25rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.activity-card:hover {
  background: #f1f3f5;
  transform: translateY(-2px);
}

.activity-card.selected {
  background: #e3f2fd;
  border-color: #3498db;
}

.activity-card label {
  display: block;
  cursor: pointer;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0;
}

.check-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.check-icon svg {
  width: 0.75rem;
  height: 0.75rem;
  fill: white;
}

.activity-card.selected .check-icon {
  opacity: 1;
  transform: scale(1);
}

.no-activities {
  padding: 1.5rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #7f8c8d;
  font-style: italic;
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

.btn-cancel {
  background-color: #f1f3f5;
  color: #495057;
}

.btn-cancel:hover {
  background-color: #e9ecef;
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

.success-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  background: #e8f5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg {
  width: 2rem;
  height: 2rem;
  fill: #2ecc71;
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
  background: #2ecc71;
  color: white;
  width: 100%;
}

.modal-btn:hover {
  background: #27ae60;
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
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .activities-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 1.5rem;
  }
}
</style>
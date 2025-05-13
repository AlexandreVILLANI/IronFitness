<template>
  <div class="create-formule-page">
    <h1>Créer une Formule</h1>

    <form @submit.prevent="submitForm" class="formule-form">
      <div class="form-group">
        <label for="nom_formule">Nom de la formule*</label>
        <input
            type="text"
            id="nom_formule"
            v-model="formuleData.nom_formule"
            required
            class="form-control"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="prix_formule">Prix*</label>
          <input
              type="number"
              id="prix_formule"
              v-model="formuleData.prix_formule"
              min="0"
              step="0.01"
              required
              class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="unite">Unité*</label>
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
        </div>
      </div>

      <div class="form-group">
        <label>Activités incluses*</label>
        <div class="activities-list">
          <div
              v-for="activite in allActivites"
              :key="activite.id_activite"
              class="activity-item"
          >
            <input
                type="checkbox"
                :id="'activite-' + activite.id_activite"
                :value="activite.id_activite"
                v-model="formuleData.activites"
                class="activity-checkbox"
            />
            <label :for="'activite-' + activite.id_activite">
              {{ activite.nom_activite }}
            </label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancel" class="btn-cancel">Annuler</button>
        <button type="submit" class="btn-submit">Créer</button>
      </div>
    </form>
  </div>
  <!-- Modale de succès -->
  <div v-if="showSuccessModal" class="modal-overlay">
    <div class="modal-content">
      <h2>✅ Formule créée avec succès !</h2>
      <p>Vous allez être redirigé vers votre profil...</p>
      <button class="modal-button" @click="redirectNow">OK</button>
    </div>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'CreateFormule',

  data() {
    return {
      formuleData: {
        nom_formule: '',
        prix_formule: 0,
        unite: 'mois',
        activites: []
      },
      loading: false,
      showSuccessModal: false
    };
  },

  computed: {
    ...mapGetters('activite', ['allActivites'])
  },

  async created() {
    try {
      await this.getAllActivite();
    } catch (err) {
      console.error('Erreur lors du chargement des activités :', err);
    }
  },

  methods: {
    ...mapActions('formule', ['createFormule']),
    ...mapActions('activite', ['getAllActivite']),


    async submitForm() {
      try {
        this.loading = true;
        await this.createFormule(this.formuleData);
        this.showSuccessModal = true;
        setTimeout(() => {
          this.$router.push({ name: 'profil' });
        }, 3000);
      } catch (error) {
        console.error('Erreur lors de la création :', error);
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
.create-formule-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.formule-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.activities-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
}

.modal-content h2 {
  color: #2ecc71;
  margin-bottom: 15px;
}

.modal-button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

.modal-button:hover {
  background-color: #27ae60;
}


.activity-checkbox {
  margin-right: 10px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-cancel,
.btn-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background-color: #7f8c8d;
}

.btn-submit {
  background-color: #2ecc71;
  color: white;
}

.btn-submit:hover {
  background-color: #27ae60;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .activities-list {
    grid-template-columns: 1fr;
  }
}
</style>

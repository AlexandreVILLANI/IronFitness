<template>
  <div class="admin-edit-activite">
    <h2>Modifier une activité</h2>

    <div v-if="!selectedActiviteId">
      <h3>Sélectionnez une activité à modifier</h3>
      <select
          v-model="selectedActiviteId"
          class="form-control"
          @change="loadSelectedActivite"
      >
        <option value="">-- Choisir une activité --</option>
        <option
            v-for="activite in activites"
            :key="activite.id_activite"
            :value="activite.id_activite"
        >
          {{ activite.nom_activite }}
        </option>
      </select>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Modification de l'activité {{ formData.nom_activite}}</h3>
        <button @click="selectedActiviteId = null" class="btn btn-secondary">
          Changer d'activité
        </button>
      </div>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="nom">Nom de l'activité</label>
          <input
              id="nom"
              v-model="formData.nom_activite"
              type="text"
              required
              class="form-control"
          >
        </div>

        <div class="form-group">
          <label for="image">Image (URL)</label>
          <input
              id="image"
              v-model="formData.image_activite"
              type="text"
              required
              class="form-control"
          >
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
              id="description"
              v-model="formData.description_activite"
              required
              class="form-control"
              rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="type">Type d'activité</label>
          <select
              id="type"
              v-model="formData.type_activite"
              required
              class="form-control"
          >
            <option value="En groupe">En groupe</option>
            <option value="Personnel">Personnel</option>
          </select>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>

          <button type="button" class="btn btn-outline-danger" @click="cancelEdit">
            Annuler
          </button>
        </div>

        <div v-if="successMessage" class="alert alert-success mt-3">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      saving: false,
      activites: [],
      selectedActiviteId: null,
      formData: {
        id_activite: null,
        nom_activite: '',
        image_activite: '',
        description_activite: '',
        type_activite: 'En groupe'
      },
      successMessage: '',
      errorMessage: ''
    };
  },
  async created() {
    await this.loadActivites();
  },
  methods: {
    async loadActivites() {
      try {
        this.loading = true;
        await this.$store.dispatch('activite/getAllActivite');
        this.activites = this.$store.getters['activite/allActivites'];
      } catch (error) {
        console.error("Erreur lors du chargement des activités:", error);
        this.errorMessage = "Impossible de charger la liste des activités";
      } finally {
        this.loading = false;
      }
    },

    async loadSelectedActivite() {
      if (!this.selectedActiviteId) {
        console.error('Aucune activité sélectionnée');
        return;
      }

      try {
        this.loading = true;
        const activite = await this.$store.dispatch('activite/getActiviteById', this.selectedActiviteId);
        if (!activite) {
          throw new Error('Activité non trouvée');
        }


        this.formData = {
          id_activite: this.selectedActiviteId,
          nom_activite: activite.nom_activite,
          image_activite: activite.image_activite,
          description_activite: activite.description_activite,
          type_activite: activite.type_activite
        };

      } catch (error) {
        console.error("Erreur lors du chargement de l'activité:", error);
        this.errorMessage = "Impossible de charger l'activité sélectionnée";
        this.selectedActiviteId = null;
      } finally {
        this.loading = false;
      }
    },


    async submitForm() {
      try {
        this.saving = true;
        this.successMessage = '';
        this.errorMessage = '';


        await this.$store.dispatch(
            'activite/updateActivite',
            this.formData
        );

        this.successMessage = "L'activité a été mise à jour avec succès";
        setTimeout(() => {
          this.successMessage = '';
          this.loadActivites(); // Rafraîchir la liste
        }, 2000);
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        this.errorMessage = "Erreur lors de la mise à jour de l'activité";
      } finally {
        this.saving = false;
      }
    },

    cancelEdit() {
      this.selectedActiviteId = null;
      this.formData = {
        id_activite: null,
        nom_activite: '',
        image_activite: '',
        description_activite: '',
        type_activite: 'En groupe'
      };
      this.successMessage = '';
      this.errorMessage = '';
    }
  }
};
</script>

<style scoped>
.admin-edit-activite {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-primary:disabled {
  background-color: #cccccc;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}

.btn-outline-danger {
  color: #dc3545;
  background-color: transparent;
  border: 1px solid #dc3545;
}

.alert {
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.loading {
  text-align: center;
  padding: 20px;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.gap-2 {
  gap: 8px;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mt-3 {
  margin-top: 1rem;
}
</style>
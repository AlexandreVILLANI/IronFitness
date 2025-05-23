<template>
  <div class="edit-activite-page">
    <h2>Modifier l'activité</h2>

    <div v-if="loading" class="loading-message">
      <p>Chargement des données de l'activité...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchActivite" class="retry-btn">Réessayer</button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="edit-form">
      <div class="form-group">
        <label for="nom">Nom :</label>
        <input
            type="text"
            id="nom"
            v-model="form.nom_activite"
            required
            class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="image">URL de l'image :</label>
        <input
            type="text"
            id="image"
            v-model="form.image_activite"
            class="form-input"
        />
        <div v-if="form.image_activite" class="image-preview">
          <img :src="previewImage" alt="Prévisualisation de l'image" />
        </div>
      </div>

      <div class="form-group">
        <label for="description">Description :</label>
        <textarea
            id="description"
            v-model="form.description_activite"
            rows="5"
            class="form-textarea"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="type">Type :</label>
        <select
            id="type"
            v-model="form.type_activite"
            required
            class="form-select"
        >
          <option value="En groupe">En groupe</option>
          <option value="Personnel">Personnel</option>
        </select>
      </div>
      <div class="form-group">
        <label>Sur rendez-vous :</label>
        <div class="radio-group">
          <label>
            <input
                type="radio"
                value="true"
                v-model="form.sur_rendezvous"
            />
            Oui
          </label>
          <label>
            <input
                type="radio"
                value="false"
                v-model="form.sur_rendezvous"
            />
            Non
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          {{ isSubmitting ? 'En cours...' : 'Enregistrer' }}
        </button>
        <button type="button" @click="cancel" class="cancel-btn">
          Annuler
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
const images = import.meta.glob('@/assets/Activite/*.jpg', {
  eager: true,
  import: 'default',
});

function getActivityImage(nom_image) {
  const fileName = nom_image.toLowerCase().replace(/\s+/g, '_') + '.jpg';
  const imagePath = `/src/assets/Activite/${fileName}`;
  return images[imagePath] || images["/src/assets/Activite/notfound.jpg"];
}

export default {
  name: 'EditActivite',

  data() {
    return {
      loading: true,
      error: null,
      isSubmitting: false,
      form: {
        id_activite: null,
        nom_activite: '',
        image_activite: '',
        description_activite: '',
        type_activite: '',
        sur_rendezvous: false // Ajouté ici
      }
    };
  },

  computed: {
    activiteId() {
      return parseInt(this.$route.params.id);
    },
    previewImage() {
      return getActivityImage(this.form.image_activite);
    }
  },

  created() {
    this.fetchActivite();
  },

  methods: {
    ...mapActions('activite', ['getActiviteById', 'updateActivite']),



    async fetchActivite() {
      this.loading = true;
      this.error = null;

      try {
        const activites = await this.getActiviteById(this.activiteId);
        const activite = activites[0]; // on prend le premier (et seul) élément
        this.form = { ...activite };

      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        this.error = 'Impossible de charger les données de l\'activité.';
      } finally {
        this.loading = false;
      }
    },

    async handleSubmit() {
      this.isSubmitting = true;

      try {
        this.form.sur_rendezvous = this.form.sur_rendezvous === 'true';

        await this.updateActivite(this.form);
        this.$router.push({ name: 'profil' });
      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
        this.error = 'Erreur lors de la mise à jour de l\'activité.';
      } finally {
        this.isSubmitting = false;
      }
    },

    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>

.radio-group {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}
.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.edit-activite-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-message, .error-message {
  text-align: center;
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 4px;
}

.loading-message {
  background-color: #f5f5f5;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-textarea {
  min-height: 150px;
  resize: vertical;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn {
  background-color: #42b983;
  color: white;
}

.submit-btn:disabled {
  background-color: #a0d9bb;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}
</style>
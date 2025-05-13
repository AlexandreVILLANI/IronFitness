<template>
  <div class="formule-selection-container">
    <button class="back-button" @click="$router.push('/profil')">⬅ Retour au profil</button>

    <h2>Gérer les formules de l'utilisateur</h2>

    <div v-if="loading" class="loading">Chargement en cours...</div>

    <div v-else>
      <div v-if="allFormules.length === 0" class="no-formules">
        Aucune formule disponible.
      </div>

      <div v-else class="formule-list">
        <div
            v-for="formule in allFormules"
            :key="formule.id_formule"
            class="formule-card"
            :class="{ 'selected': isFormuleSelected(formule.id_formule) }"
            @click="toggleFormule(formule.id_formule)"
        >
          <h3>{{ formule.nom_formule }}</h3>
          <p class="price">{{ formule.prix_formule }} €</p>
          <input
              type="checkbox"
              :value="formule.id_formule"
              :checked="isFormuleSelected(formule.id_formule)"
              @change="toggleFormule(formule.id_formule)"
              class="formule-checkbox"
          >
        </div>
      </div>

      <button
          class="validate-button"
          @click="validateSelection"
      >
        Valider les modifications
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ManageUserFormules',

  data() {
    return {
      loading: true,
      userId: null,
      selectedFormuleIds: [] // Tableau pour stocker les IDs des formules sélectionnées
    };
  },

  computed: {
    ...mapState('formule', ['formules']),
    ...mapState('user', ['formulesUtilisateur']),

    // Renommer pour plus de clarté : toutes les formules disponibles
    allFormules() {
      return this.formules;
    }
  },

  async created() {
    this.userId = this.$route.params.id;
    await Promise.all([
      this.loadAllFormules(),
      this.loadUserFormules()
    ]);
    this.loading = false;
  },

  methods: {
    ...mapActions('formule', ['getAllFormule']),
    ...mapActions('user', ['updateUserFormule', 'getUserFormules']),

    async loadAllFormules() {
      try {
        await this.getAllFormule();
      } catch (error) {
        console.error('Erreur lors du chargement des formules:', error);
      }
    },

    async loadUserFormules() {
      try {
        await this.getUserFormules(this.userId);
        // Initialiser le tableau des IDs sélectionnés avec les formules actuelles de l'utilisateur
        this.selectedFormuleIds = this.formulesUtilisateur.map(f => f.id_formule);
      } catch (error) {
        console.error('Erreur lors du chargement des formules de l\'utilisateur:', error);
      }
    },

    isFormuleSelected(formuleId) {
      return this.selectedFormuleIds.includes(formuleId);
    },

    toggleFormule(formuleId) {
      if (this.selectedFormuleIds.includes(formuleId)) {
        this.selectedFormuleIds = this.selectedFormuleIds.filter(id => id !== formuleId);
      } else {
        this.selectedFormuleIds.push(formuleId);
      }
    },

    async validateSelection() {
      if (!this.userId) return;

      try {
        await this.updateUserFormule({
          id_utilisateur: this.userId,
          formules: this.selectedFormuleIds
        });

        // Rediriger vers la page précédente ou afficher un message de succès
        this.$router.go(-1);
      } catch (error) {
        console.error('Erreur lors de la mise à jour des formules de l\'utilisateur:', error);
      }
    }
  }
};
</script>

<style scoped>
.formule-selection-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .no-formules {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.formule-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.formule-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.formule-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.formule-card.selected {
  border-color: #42b983;
  background-color: #f0f9f0;
}

.formule-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.formule-card p {
  margin-bottom: 10px;
  color: #666;
}

.price {
  font-weight: bold;
  color: #42b983;
  font-size: 1.2em;
}

.formule-checkbox {
  margin-top: 10px;
}

.validate-button {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 30px auto 0;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.validate-button:hover {
  background-color: #3aa876;
}

.validate-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.back-button {
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #bbb;
}
</style>
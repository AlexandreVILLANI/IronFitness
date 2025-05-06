<template>
  <div class="formule-selection-container">
    <button class="back-button" @click="$router.push('/profil')">⬅ Retour au profil</button>

    <h2>Sélectionner une formule pour l'utilisateur</h2>

    <div v-if="loading" class="loading">Chargement en cours...</div>

    <div v-else>
      <div v-if="formules.length === 0" class="no-formules">
        Aucune formule disponible.
      </div>

      <div v-else class="formule-list">
        <div
            v-for="formule in formules"
            :key="formule.id_formule"
            class="formule-card"
            :class="{ 'selected': selectedFormuleId === formule.id_formule }"
            @click="selectFormule(formule)"
        >
          <h3>{{ formule.nom_formule }}</h3>
          <p class="price">{{ formule.prix_formule }} €</p>
        </div>
      </div>

      <button
          class="validate-button"
          :disabled="!selectedFormuleId"
          @click="validateSelection"
      >
        Valider la sélection
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AddFormule',

  data() {
    return {
      loading: true,
      selectedFormuleId: null,
      userId: null
    }
  },

  computed: {
    ...mapState('formule', ['formules']),
    ...mapState('user', ['formulesUtilisateur'])
  },

  async created() {
    this.userId = this.$route.params.id
    await this.loadFormules()
  },

  methods: {
    ...mapActions('formule', ['getAllFormule']),
    ...mapActions('user', ['updateUserFormule', 'getUserFormules']),

    async loadFormules() {
      try {
        await this.getAllFormule()
        this.loading = false
      } catch (error) {
        console.error('Erreur lors du chargement des formules:', error)
        this.loading = false
      }
    },

    selectFormule(formule) {
      this.selectedFormuleId = formule.id_formule
    },

    async validateSelection() {
      if (!this.selectedFormuleId || !this.userId) return

      try {
        // Récupérer les formules actuelles de l'utilisateur
        await this.getUserFormules(this.userId)

        // Créer un nouveau tableau avec les formules existantes + la nouvelle
        const updatedFormules = [
          ...this.formulesUtilisateur.map(f => f.id_formule),
          this.selectedFormuleId,
        ]
        // Mettre à jour les formules de l'utilisateur
        await this.updateUserFormule({
          id_utilisateur: this.userId,
          formules: updatedFormules
        })

        // Rediriger vers la page précédente ou afficher un message de succès
        this.$router.go(-1)
      } catch (error) {
        console.error('Erreur lors de la mise à jour des formules:', error)
      }
    }
  }
}
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
  margin-bottom: 5px;
  color: #666;
}

.price {
  font-weight: bold;
  color: #42b983;
  font-size: 1.2em;
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
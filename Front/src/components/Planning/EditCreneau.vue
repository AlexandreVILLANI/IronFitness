<template>
  <div class="edit-creneau-page">
    <h1>Modifier le créneau</h1>

    <div v-if="loading" class="loading">Chargement en cours...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <form v-if="creneau" @submit.prevent="submitForm" class="edit-form">
      <div class="form-group">
        <label for="id_activite">Activité:</label>
        <select
            id="id_activite"
            v-model="creneau.id_activite"
            required
        >
          <option value="" disabled>Sélectionnez une activité</option>
          <option
              v-for="activite in activites"
              :key="activite.id_activite"
              :value="activite.id_activite"
          >
            {{ activite.nom_activite }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="date_activite">Date:</label>
        <input
            id="date_activite"
            v-model="creneau.date_activite"
            type="date"
            required
        />
      </div>

      <div class="form-group">
        <label for="heure_debut">Heure de début:</label>
        <input
            id="heure_debut"
            v-model="creneau.heure_debut"
            type="time"
            required
        />
      </div>

      <div class="form-group">
        <label for="heure_fin">Heure de fin:</label>
        <input
            id="heure_fin"
            v-model="creneau.heure_fin"
            type="time"
            required
        />
      </div>

      <div class="form-group">
        <label for="places_disponibles">Places disponibles:</label>
        <input
            id="places_disponibles"
            v-model="creneau.places_disponibles"
            type="number"
            min="1"
            required
        />
      </div>

      <div class="form-actions">
        <button type="button" @click="cancel" class="cancel-button">Annuler</button>
        <button type="submit" class="submit-button">Enregistrer</button>
      </div>
    </form>

    <div v-if="success" class="success-message">
      Créneau modifié avec succès!
      <router-link to="/planning">Retour au planning</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

// Récupérer l'ID depuis les query params (?id_creneau=2)
const creneauId = ref(route.query.id_creneau)
const loading = ref(true)
const error = ref(null)
const success = ref(false)
const creneau = ref({
  id_creneau: null,
  id_activite: '',
  date_activite: '',
  heure_debut: '',
  heure_fin: '',
  places_disponibles: 1
})

// Récupérer les activités
const activites = computed(() => store.getters['activite/allActivites'] || [])

onMounted(async () => {
  try {
    if (!creneauId.value) {
      throw new Error("ID du créneau manquant dans l'URL")
    }

    // Charger les activités si ce n'est pas déjà fait
    if (activites.value.length === 0) {
      await store.dispatch('activite/getAllActivite')
    }

    // Récupérer le créneau à modifier
    const creneauData = await store.dispatch('creneau/getCreneauById', creneauId.value)

    if (creneauData && creneauData.length > 0) {
      const data = creneauData[0]
      creneau.value.id_creneau = data.id_creneau
      creneau.value.id_activite = data.id_activite
      creneau.value.date_activite = data.date_activite.slice(0, 10) // si présence de l'heure
      creneau.value.heure_debut = data.heure_debut
      creneau.value.heure_fin = data.heure_fin
      creneau.value.places_disponibles = data.places_disponibles
    } else {
      console.error("Les données du créneau sont vides ou incorrectes.")
      error.value = "Les données du créneau sont vides ou incorrectes."
    }

    loading.value = false
  } catch (err) {
    console.error("Erreur lors du chargement du créneau:", err)
    error.value = err.message || "Erreur lors du chargement du créneau. Veuillez réessayer."
    loading.value = false
  }
})

async function submitForm() {
  try {
    loading.value = true
    error.value = null

    // Mettre à jour le créneau
    await store.dispatch('creneau/updateCreneau', creneau.value)

    success.value = true
    loading.value = false
  } catch (err) {
    console.error("Erreur lors de la mise à jour du créneau:", err)
    error.value = "Erreur lors de la mise à jour du créneau. Veuillez vérifier les données et réessayer."
    loading.value = false
  }
}

function cancel() {
  router.push('/planning')
}
</script>

<style scoped>
.edit-creneau-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.loading, .error {
  text-align: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.loading {
  background-color: #f8f9fa;
  color: #6c757d;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}

.success-message {
  text-align: center;
  padding: 1rem;
  margin-top: 1rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
}

.success-message a {
  display: block;
  margin-top: 0.5rem;
  color: #0c5460;
  text-decoration: underline;
}

.edit-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #495057;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-button:hover {
  background-color: #218838;
}
</style>
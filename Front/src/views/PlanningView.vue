<template>
  <div class="calendar-page">
    <!-- Bouton visible uniquement pour l'admin -->
    <button
        v-if="isAdmin"
        class="create-button"
        @click="openCreateModal"
    >
      Ajouter un cours
    </button>

    <FullCalendar :options="calendarOptions" />

    <!-- MODALE DE VISUALISATION -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ selectedEvent.title }}</h2>
        <p><strong>Date :</strong> {{ selectedEvent.date }}</p>
        <p><strong>Horaire :</strong> {{ selectedEvent.heureDebut }} → {{ selectedEvent.heureFin }}</p>
        <div v-if="selectedEvent.sur_rendezvous === true">
          <p><strong>Nombre de personnes inscrites :</strong> {{ selectedEvent.reservations }}/{{ selectedEvent.places }}</p>
          <p style="color: #e67e22; font-weight: bold;">Inscription obligatoire pour assister au cours.</p>

          <div v-if="isAlreadyRegistered" class="already-registered">
            <p>✅ Vous êtes déjà inscrit à ce cours</p>
          </div>
          <div v-else>
            <button
                class="register-button"
                @click="registerToEvent"
                :disabled="!hasValidFormuleForActivity"
                :class="{ 'disabled-button': !hasValidFormuleForActivity }"
            >
              {{ hasValidFormuleForActivity ? "S'inscrire" : "Formule requise" }}
            </button>
            <p v-if="!hasValidFormuleForActivity" style="color: #e74c3c; font-size: 0.9rem;">
              Votre formule actuelle ne comprend pas cette activité
            </p>
          </div>
        </div>
        <div v-else>
          <p style="color: #27ae60; font-size: 1.2rem; font-weight: bold;">Cours disponible sans inscription</p>
        </div>
        <div class="modal-actions">
          <button @click="closeModal">Fermer</button>
          <button
              v-if="isAdmin"
              @click="goToEditCreneau"
              class="submit-button"
          >
            Modifier
          </button>
          <button
              v-if="isAdmin"
              @click="deleteSelectedCreneau"
              class="delete-button"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- MODALE DE CREATION -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal-content">
        <h2>Ajouter un nouveau cours</h2>

        <form @submit.prevent="submitNewCreneau">
          <div class="form-group">
            <label for="id_activite">Activité:</label>
            <select
                id="id_activite"
                v-model="newCreneau.id_activite"
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
                v-model="newCreneau.date_activite"
                type="date"
                required
            />
          </div>

          <div class="form-group">
            <label for="heure_debut">Heure de début:</label>
            <input
                id="heure_debut"
                v-model="newCreneau.heure_debut"
                type="time"
                required
            />
          </div>

          <div class="form-group">
            <label for="heure_fin">Heure de fin:</label>
            <input
                id="heure_fin"
                v-model="newCreneau.heure_fin"
                type="time"
                required
            />
          </div>

          <div class="form-group">
            <label for="places_disponibles">Places disponibles:</label>
            <input
                id="places_disponibles"
                v-model="newCreneau.places_disponibles"
                type="number"
                min="1"
                required
            />
          </div>

          <div class="form-actions">
            <button type="button" @click="closeCreateModal">Annuler</button>
            <button type="submit" class="submit-button">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import {computed, onMounted, ref, watch} from 'vue'
import { useStore } from 'vuex'
import frLocale from '@fullcalendar/core/locales/fr'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const showModal = ref(false)
const showCreateModal = ref(false)
const isAdmin = computed(() => store.getters['user/getUserCourant'].id_role === 2)
const selectedEvent = ref({
  id: null,
  title: '',
  date: '',
  heureDebut: '',
  heureFin: '',
  places: '',
  reservations: ''
})
// Récupérer les activités
const activites = computed(() => store.getters['activite/allActivites'] || [])
const newCreneau = ref({
  id_activite: '',
  date_activite: '',
  heure_debut: '',
  heure_fin: '',
  places_disponibles: 10
})
const userCourant = computed(() => store.getters['user/getUserCourant'])

const userFormules = computed(() => store.getters['user/getFormulesUtilisateur']);
// Charger les réservations de l'utilisateur
const loadUserReservations = async () => {
  if (userCourant.value?.id_utilisateur) {
    await store.dispatch('creneau/getReservationsByUserId', userCourant.value.id_utilisateur);
  }
};

const isAlreadyRegistered = computed(() => {
  if (!selectedEvent.value?.id || !userCourant.value?.id_utilisateur) return false;

  const userReservations = store.getters['creneau/userReservations'];
  return userReservations.some(reservation =>
      reservation.id_creneau == selectedEvent.value.id
  );
});

const hasValidFormuleForActivity = computed(() => {
  if (!selectedEvent.value.id || !userFormules.value) {
    console.log("[hasValidFormule] Pas de créneau sélectionné ou pas de formules utilisateur", {
      selectedEventId: selectedEvent.value.id,
      userFormules: userFormules.value,
    });
    return false;
  }

  const selectedId = Number(selectedEvent.value.id);
  const creneau = store.getters['creneau/allCreneaux'].find(c => c.id_creneau === selectedId);

  if (!creneau) {
    console.log("[hasValidFormule] Créneau non trouvé dans le store", { selectedEventId: selectedEvent.value.id, selectedId, allCreneaux: store.getters['creneau/allCreneaux'] });
    return false;
  }

  const idActiviteCreneau = creneau.id_activite;

  const valid = userFormules.value.some(formule =>
      formule.activites.some(activite => activite.id_activite === idActiviteCreneau)
  );
  return valid;
});


onMounted(async () => {
  await store.dispatch('creneau/getAllCreneau');
  await store.dispatch('activite/getAllActivite');

  const user = store.getters['user/getUserCourant'];
  if (user && user.id_utilisateur) {
    await store.dispatch('user/getUserFormules', user.id_utilisateur);
    await loadUserReservations();
  }
});


function goToEditCreneau() {
  if (!selectedEvent.value.id) return
  router.push(`/planning/editCreneau?id_creneau=${selectedEvent.value.id}`)
}

function openCreateModal() {
  showCreateModal.value = true
}

async function registerToEvent() {
  if (!selectedEvent.value.id) return;

  if (isAlreadyRegistered.value) {
    alert("Vous êtes déjà inscrit à ce cours");
    return;
  }

  if (selectedEvent.value.reservations >= selectedEvent.value.places) {
    alert("Ce créneau est déjà complet");
    return;
  }

  if (!hasValidFormuleForActivity.value) {
    alert("Vous devez avoir une formule incluant cette activité pour vous inscrire");
    return;
  }

  try {
    await store.dispatch('creneau/reserverCreneau', {
      id_creneau: selectedEvent.value.id,
      id_utilisateur: userCourant.value.id_utilisateur
    });

    // Rafraîchir les données
    await store.dispatch('creneau/getAllCreneau');
    await loadUserReservations();
    alert(`Inscription réussie au cours "${selectedEvent.value.title}"`);
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    alert(error.response?.data?.message || "Une erreur est survenue lors de l'inscription");
  }
}
// Fermer la modale de création
function closeCreateModal() {
  showCreateModal.value = false
  resetNewCreneau()
}

// Réinitialiser le formulaire
function resetNewCreneau() {
  newCreneau.value = {
    id_activite: '',
    date_activite: '',
    heure_debut: '',
    heure_fin: '',
    places_disponibles: 10
  }
}


async function deleteSelectedCreneau() {
  if (!selectedEvent.value.id) return

  try {
    await store.dispatch('creneau/deleteCreneau', selectedEvent.value.id)
    closeModal()
    await store.dispatch('creneau/getAllCreneau')
  } catch (error) {
    console.error("Erreur lors de la suppression du créneau:", error)
  }
}


async function submitNewCreneau() {
  try {
    const selectedActivite = activites.value.find(a => a.id_activite === newCreneau.value.id_activite)

    if (!selectedActivite) {
      throw new Error("Aucune activité sélectionnée")
    }

    const creneauToCreate = {
      id_activite: newCreneau.value.id_activite,
      date_activite: newCreneau.value.date_activite,
      heure_debut: newCreneau.value.heure_debut,
      heure_fin: newCreneau.value.heure_fin,
      places_disponibles: newCreneau.value.places_disponibles
    }

    await store.dispatch('creneau/createCreneau', creneauToCreate)
    closeCreateModal()
    await store.dispatch('creneau/getAllCreneau')
  } catch (error) {
    console.error("Erreur lors de la création du créneau:", error)
  }
}

// Transformer les créneaux en événements FullCalendar
const calendarEvents = computed(() => {
  return store.getters['creneau/allCreneaux'].map(c => {
    if (!c || !c.date_activite) return null
    const start = `${c.date_activite.substring(0, 10)}T${c.heure_debut}`
    const end = `${c.date_activite.substring(0, 10)}T${c.heure_fin}`

    const totalPlaces = c.places_disponibles
    const nbResa = c.nombre_reservations
    const pourcentage = totalPlaces === 0 ? 100 : (nbResa / totalPlaces) * 100

    let backgroundColor = ''
    let borderColor = ''

    if (pourcentage < 40) {
      backgroundColor = '#2ecc71'
      borderColor = '#27ae60'
    } else if (pourcentage < 70) {
      backgroundColor = '#f39c12'
      borderColor = '#e67e22'
    } else {
      backgroundColor = '#e74c3c'
      borderColor = '#c0392b'
    }

    return {
      id: c.id_creneau,
      title: c.nom_activite,
      start,
      end,
      backgroundColor,
      borderColor,
      textColor: '#fff',
      extendedProps: {
        heureDebut: c.heure_debut,
        heureFin: c.heure_fin,
        places: c.places_disponibles,
        reservations: c.nombre_reservations,
        pourcentage,
        sur_rendezvous: c.sur_rendezvous
      },
    }
  }).filter(event => event !== null)
})

// Configuration du calendrier
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  events: calendarEvents.value,
  locale: frLocale,
  eventClick(info) {
    selectedEvent.value = {
      id: info.event.id,
      title: info.event.title,
      date: info.event.startStr.split('T')[0],
      heureDebut: info.event.extendedProps.heureDebut,
      heureFin: info.event.extendedProps.heureFin,
      places: info.event.extendedProps.places,
      reservations: info.event.extendedProps.reservations,
      sur_rendezvous: info.event.extendedProps.sur_rendezvous
    }
    showModal.value = true
  }
}))

function closeModal() {
  showModal.value = false
}

// Recharger les réservations quand la modal s'ouvre
watch(showModal, async (newVal) => {
  if (newVal && userCourant.value?.id_utilisateur) {
    await loadUserReservations();
  }
});
</script>

<style scoped>
.already-registered {
  background-color: #e8f5e9;
  color: #27ae60;
  padding: 0.75rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
  font-weight: bold;
}
.disabled-button {
  background-color: #95a5a6 !important;
  cursor: not-allowed !important;
}

.register-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
.register-button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 1rem 0;
}

.register-button:hover {
  background-color: #2980b9;
}
.create-button {
  display: block;
  margin: 0 auto 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #2980b9;
}

.calendar-page {
  padding: 2rem;
  background-color: #fff;
}

:deep(.fc) {
  max-width: 900px;
  margin: auto;
}

/* MODALE */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.delete-button:hover {
  background-color: #c0392b;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.submit-button {
  background-color: #2ecc71;
  color: white;
}

.submit-button:hover {
  background-color: #27ae60;
}
</style>
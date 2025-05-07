<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import frLocale from '@fullcalendar/core/locales/fr'

const store = useStore()
const showModal = ref(false)
const selectedEvent = ref({
  title: '',
  date: '',
  heureDebut: '',
  heureFin: '',
  places: '',
  reservations: ''
})

// Charger les créneaux au montage
onMounted(() => {
  store.dispatch('creneau/getAllCreneau')
})

// Transformer les créneaux en événements FullCalendar
const calendarEvents = computed(() => {
  return store.getters['creneau/allCreneaux'].map(c => {
    // Extraire la date ISO complète sans la modifier
    const start = `${c.date_activite.substring(0, 10)}T${c.heure_debut}`
    const end = `${c.date_activite.substring(0, 10)}T${c.heure_fin}`

    const totalPlaces = c.places_disponibles
    const nbResa = c.nombre_reservations
    const pourcentage = totalPlaces === 0 ? 100 : (nbResa / totalPlaces) * 100

    let backgroundColor = ''
    let borderColor = ''

    if (pourcentage < 40) {
      backgroundColor = '#2ecc71'   // Vert
      borderColor = '#27ae60'
    } else if (pourcentage < 70) {
      backgroundColor = '#f39c12'   // Orange
      borderColor = '#e67e22'
    } else {
      backgroundColor = '#e74c3c'   // Rouge
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
        pourcentage
      }
    }
  })
})



// Configuration du calendrier
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  events: calendarEvents.value,
  locale: frLocale,
  eventClick(info) {
    selectedEvent.value = {
      title: info.event.title,
      date: info.event.startStr.split('T')[0],
      heureDebut: info.event.extendedProps.heureDebut,
      heureFin: info.event.extendedProps.heureFin,
      places: info.event.extendedProps.places,
      reservations: info.event.extendedProps.reservations
    }
    showModal.value = true
  }
}))

function closeModal() {
  showModal.value = false
}
</script>


<template>
  <div class="calendar-page">
    <FullCalendar :options="calendarOptions" />

    <!-- MODALE -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ selectedEvent.title }}</h2>
        <p><strong>Date :</strong> {{ selectedEvent.date }}</p>
        <p><strong>Heure :</strong> {{ selectedEvent.heureDebut }} → {{ selectedEvent.heureFin }}</p>
        <p><strong>Nombres de personnes inscrites :</strong> {{ selectedEvent.reservations }}/{{ selectedEvent.places }}</p>
        <button @click="closeModal">Fermer</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
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
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-content h2 {
  margin-bottom: 1rem;
}

.modal-content button {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>

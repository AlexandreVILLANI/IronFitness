<template>
  <div class="container">
    <div v-if="formule" class="formule-box">
      <h1 class="title">Formule : {{ formule.nom_formule }}</h1>
      <p class="description">{{ formule.description }}</p>
      <p class="prix">Prix : <strong>{{ formule.prix_formule }} €</strong> / {{ formule.unite }}</p>
      <p class="activites"><strong>Activités :</strong> {{ formule.activites_liees }}</p>

      <!-- Affichage conditionnel selon sur_rendezvous -->
      <div v-if="formule.sur_rendezvous">
        <h3>Demande de rendez-vous personnalisé</h3>
        <p>Veuillez décrire vos objectifs et disponibilités :</p>
        <textarea
            v-model="demandeDescription"
            class="demande-input"
            placeholder="Décrivez vos objectifs sportifs, vos disponibilités, et toute information utile pour votre accompagnement personnalisé..."
        ></textarea>
        <p class="note">Note : Vous serez contacté pour confirmer le rendez-vous.</p>
      </div>
      <div v-else>
        <p>Pour obtenir cet abonnement, il suffit d'envoyer cette demande au gérant de la salle de sport. Vous serez ensuite contacté pour régler en salle l'adhésion.</p>
      </div>

      <br>
      <button
          v-if="userCourant && userCourant.id_role !== null"
          @click="finaliserAbonnement"
          class="btn-finaliser"
      >
        {{ formule.sur_rendezvous ? 'Envoyer la demande de rendez-vous' : 'Envoyer la demande' }}
      </button>
      <p v-else class="connect-message">Connectez-vous pour finaliser l'abonnement.</p>
    </div>
    <div v-else class="not-found">
      <p>Formule introuvable</p>
    </div>

    <SuccessModal
        v-if="showSuccessModal"
        :formule-nom="formule?.nom_formule"
        :is-visible="showSuccessModal"
        @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import SuccessModal from '@/components/SuccesModal.vue';

const store = useStore();
const route = useRoute();
const formuleId = route.params.id;
const router = useRouter();
const formule = computed(() => store.state.formule.selectedFormule);
const userCourant = computed(() => store.state.user.userCourant);
const showSuccessModal = ref(false);
const demandeDescription = ref(''); // Pour stocker la description de la demande de rendez-vous

onMounted(async () => {
  await store.dispatch('formule/getFormuleById', formuleId);
});

async function finaliserAbonnement() {
  try {
    const sessionId = store.getters["user/getSessionId"];
    const idFormule = formule.value.id_formule;

    if (!sessionId) {
      alert("Session introuvable. Veuillez vous reconnecter.");
      return;
    }

    if (!idFormule) {
      alert("ID de la formule manquant.");
      return;
    }

    // Préparation des données à envoyer
    const data = {
      sessionId,
      id_formule: idFormule
    };

    // Si c'est une formule sur rendez-vous, on ajoute la description
    if (formule.value.sur_rendezvous) {
      if (!demandeDescription.value.trim()) {
        alert("Veuillez décrire votre demande de rendez-vous.");
        return;
      }
      data.demandeDescription = demandeDescription.value;
    }

    await store.dispatch("mail/sendAbonnementMail", data);
    showSuccessModal.value = true;
  } catch (error) {
    alert("Une erreur est survenue lors de l'envoi de la demande.");
    console.error(error);
  }
}

function handleModalClose() {
  showSuccessModal.value = false;
  router.push('/');
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
  position: relative;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../assets/Login/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: blur(8px);
  z-index: -1;
}

.formule-box {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.description {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.prix, .activites {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #34495e;
}

.demande-input {
  width: 100%;
  min-height: 120px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

.note {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-style: italic;
}

.btn-finaliser {
  background-color: #2980b9;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-finaliser:hover {
  background-color: #1c5980;
}

.connect-message {
  margin-top: 1rem;
  color: #e67e22;
  font-weight: bold;
}

.not-found {
  font-size: 1.2rem;
  color: #e74c3c;
  text-align: center;
}
</style>
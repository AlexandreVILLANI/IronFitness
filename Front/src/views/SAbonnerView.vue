<template>
  <div class="container">
    <div v-if="formule" class="formule-box">
      <h1 class="title">Formule : {{ formule.nom_formule }}</h1>
      <p class="description">{{ formule.description }}</p>
      <p class="prix">Prix : <strong>{{ formule.prix_formule }} €</strong> / {{ formule.unite }}</p>
      <p class="activites"><strong>Activités :</strong> {{ formule.activites_liees }}</p>
      <p>Pour obtenir cet abonnement, il suffit d'envoyer cette demande au gérant de la salle de sport. Vous serez notifié par mail une fois la demande acceptée, vous pourrez ensuite régler en salle la formule.</p>
      <br>
      <button
          v-if="userCourant && userCourant.id_role !== null"
          @click="finaliserAbonnement"
          class="btn-finaliser"
      >
        Envoyer la demande
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
const formuleId = route.params.id;  // Récupère l'ID de la formule depuis l'URL
const router = useRouter();
const formule = computed(() => store.state.formule.selectedFormule);  // Sélectionne la formule depuis le store
const userCourant = computed(() => store.state.user.userCourant);  // Utilisateur courant
const showSuccessModal = ref(false);

// Charge les données de la formule lors du montage du composant
onMounted(async () => {
  await store.dispatch('formule/getFormuleById', formuleId);
});

// Fonction pour finaliser l'abonnement
async function finaliserAbonnement() {
  try {
    const sessionId = store.getters["user/getSessionId"];  // Récupère l'ID de session depuis le store
    const idFormule = formule.value.id_formule;  // Récupère l'ID de la formule actuelle

    if (!sessionId) {
      alert("Session introuvable. Veuillez vous reconnecter.");
      return;
    }

    if (!idFormule) {
      alert("ID de la formule manquant.");
      return;
    }

    // Envoie la demande d'abonnement avec l'ID de session et l'ID de la formule
    await store.dispatch("mail/sendAbonnementMail", {sessionId, id_formule: idFormule});

    // Affiche la modale de succès
    showSuccessModal.value = true;
  } catch (error) {
    alert("Une erreur est survenue lors de l'envoi de la demande.");
    console.error(error);
  }
}

// Fonction pour fermer la modale de succès
function handleModalClose() {
  showSuccessModal.value = false;
  router.push('/');  // Redirige vers la page d'accueil
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

/* Crée un pseudo-élément pour l'image de fond avec flou */
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
  filter: blur(8px); /* Ajustez la valeur pour plus/moins de flou */
  z-index: -1; /* Place en arrière-plan */
}

.formule-box {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  text-align: center;
  /* Assure que la boîte est au-dessus du fond flou */
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

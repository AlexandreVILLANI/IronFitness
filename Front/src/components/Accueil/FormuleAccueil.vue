<template>
  <section class="spikes"></section>
  <div class="formule-page">
    <h1>Nos abonnements</h1>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Chargement des abonnements...</p>
    </div>

    <!-- Contenu principal -->
    <div v-else class="formules">
      <div v-for="(formule, index) in formules" :key="index" class="formule-card">
        <h2>{{ formule.nom_formule }}</h2>
        <p class="prix">{{ formule.prix_formule }} € / {{ formule.unite }}</p>
        <p class="activites">Activités : {{ formule.activites_liees }}</p>
        <p v-if="formule.sur_rendezvous === true"> Abonnement sur rendez-vous</p>

        <button @click="abonner(formule)" class="subscribe-button">
          S'abonner
        </button>
      </div>
    </div>
  </div>
  <!-- modal -->
  <transition name="fade">
    <div v-if="showLoginModal" class="login-modal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <button class="close-button" @click="closeModal" aria-label="Fermer la fenêtre">
          &times;
        </button>

        <div class="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#527091">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>

        <h3 class="modal-title">Connexion requise</h3>
        <p class="modal-message">Vous devez être connecté pour accéder à cette fonctionnalité.</p>

        <div class="modal-actions">
          <button @click="closeModal" class="modal-button cancel">Plus tard</button>
          <button @click="goToLogin" class="modal-button confirm">Se connecter</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const loading = ref(true);
const router = useRouter();
const store = useStore();
const formules = computed(() => store.state.formule.formules);
const userCourant = computed(() => store.state.user.userCourant);
const images = import.meta.glob("@/assets/Formule/*.jpg", {
  eager: true,
  import: "default",
});

const showLoginModal = ref(false);

async function abonner(formule) {
  if (!userCourant.value || !userCourant.value.id_session) {
    showLoginModal.value = true; // Affiche le modal au lieu de l'alert
    return;
  }
  router.push({ name: "souscrire", params: { id: formule.id_formule } });
}

function closeModal() {
  showLoginModal.value = false;
}

function goToLogin() {
  closeModal();
  router.push({ name: "login" });
}



onMounted(async () => {
  try {
    await store.dispatch("formule/getAllFormule");
  } catch (error) {
    console.error("Erreur lors du chargement des formules:", error);
  } finally {
    loading.value = false;
  }
});


</script>

<style scoped>


/* Styles du modal */
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 10;
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(82, 112, 145, 0.1);
  border-radius: 50%;
}

.modal-icon svg {
  width: 30px;
  height: 30px;
}

.modal-title {
  font-size: 1.5rem;
  color: #527091;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.modal-message {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-button {
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.modal-button.cancel {
  background: #f0f0f0;
  color: #555;
}

.modal-button.cancel:hover {
  background: #e0e0e0;
}

.modal-button.confirm {
  background: #527091;
  color: white;
}

.modal-button.confirm:hover {
  background: #3b5a75;
  transform: translateY(-1px);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #555;
}

/* Responsive */
@media (max-width: 480px) {
  .modal-content {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-button {
    width: 100%;
  }
}
/* Styles pour l'indicateur de chargement */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
  min-height: 200px;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.subscribe-button {
  background-color: #527091;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  margin-top: 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.subscribe-button:hover {
  background-color: #3b5a75;
}

.spikes {
  position: relative;
  background: #ffffff;
  height: 2vh;
}

.spikes::after {
  content: '';
  position: absolute;
  right: 0;
  left: -0%;
  top: 100%;
  z-index: 10;
  display: block;
  height: 40px;
  background-size: 20px 100%;
  background-image: linear-gradient(135deg, #ffffff 25%, transparent 25%), linear-gradient(225deg, #ffffff 25%, transparent 25%);
  background-position: 0 0;
}

.formule-page {
  padding: 1.5rem;
  text-align: center;
  background-color: #445f77;
  min-height: 300px;
}

.formule-page h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: white;
}

.formules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.formule-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.formule-card:hover {
  transform: scale(1.02);
}

.image-formule {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border-radius: 0.3rem;
}

.formule-card h2 {
  font-size: 1.2rem;
  color: #527091;
  margin-bottom: 0.3rem;
}

.formule-card .prix {
  font-size: 1rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 0.3rem;
}

.formule-card .activites {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.subscribe-button {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  margin-top: 0.75rem;
  border-radius: 0.3rem;
}

/* Media query pour les écrans de taille moyenne (petites tablettes) */
@media (min-width: 601px) and (max-width: 992px) {
  .formule-page {
    padding: 2rem;
  }

  .formule-page h1 {
    font-size: 2.2rem;
  }

  .formules {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .formule-card {
    padding: 1.2rem;
  }

  .formule-card h2 {
    font-size: 1.3rem;
  }

  .formule-card .prix,
  .formule-card .activites {
    font-size: 1rem;
  }

  .subscribe-button {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    margin-top: 1rem;
    border-radius: 0.4rem;
  }
}

/* Media query pour les écrans plus grands (tablettes et ordinateurs) */
@media (min-width: 993px) {
  .formule-page {
    padding: 2rem;
  }

  .formule-page h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .formules {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 0 1rem;
  }

  .formule-card {
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .formule-card:hover {
    transform: scale(1.05);
  }

  .image-formule {
    margin-bottom: 1rem;
    border-radius: 0.5rem;
  }

  .formule-card h2 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }

  .formule-card .prix {
    font-size: 1.1rem;
  }

  .formule-card .activites {
    font-size: 0.95rem;
  }

  .subscribe-button {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    margin-top: 1rem;
    border-radius: 0.4rem;
  }
}
</style>
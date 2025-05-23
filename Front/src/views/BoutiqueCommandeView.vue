<template>
  <div class="container">
    <div v-if="currentGoodie" class="goodie-box">
      <h1 class="title">{{ currentGoodie.nom_goodies }}</h1>
      <img
          :src="getGoodieImage(currentGoodie.image_goodies)"
          :alt="currentGoodie.nom_goodies"
          class="goodie-image"
          @error="handleImageError"
      >
      <p class="description">{{ currentGoodie.description_goodies }}</p>
      <p class="prix">Prix unitaire : <strong>{{ currentGoodie.prix_goodies }} €</strong></p>

      <!-- Sélection de la taille -->
      <div class="form-group">
        <label>Taille :</label>
        <select v-model="selectedSize" class="form-control">
          <option
              v-for="taille in availableSizes"
              :key="taille.id_taille"
              :value="taille.id_taille"
              :disabled="taille.quantite_stock !== 't'"
          >
            {{ taille.valeur_taille }}
            <span v-if="taille.quantite_stock !== 't'">(Indisponible)</span>
          </option>
        </select>
      </div>

      <!-- Sélection de la quantité -->
      <div class="form-group">
        <label>Quantité :</label>
        <input
            type="number"
            v-model.number="quantity"
            min="1"
            max="10"
            class="form-control"
        >
      </div>

      <p class="note">Note : Vous serez contacté pour finaliser votre commande en salle.</p>

      <br>
      <button
          v-if="userCourant && userCourant.id_role !== null"
          @click="commanderGoodie"
          class="btn-finaliser"
          :disabled="!selectedSize || quantity < 1"
      >
        Envoyer une demande
      </button>
      <p v-else class="connect-message">Connectez-vous pour passer commande.</p>
    </div>
    <div v-else class="not-found">
      <p>Goodie introuvable</p>
      <button @click="router.push('/boutique')" class="btn-retour">
        Retour à la boutique
      </button>
    </div>

    <SuccessModal
        v-if="showSuccessModal"
        :message="`Votre commande pour ${currentGoodie?.nom_goodies} a bien été envoyée`"
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
const router = useRouter();
const goodieId = route.params.id;

const currentGoodie = computed(() => store.state.boutique.currentGoodie);
const userCourant = computed(() => store.state.user.userCourant);
const showSuccessModal = ref(false);
const selectedSize = ref(null);
const quantity = ref(1);

// Computed property for available sizes
const availableSizes = computed(() => {
  return currentGoodie.value?.tailles || [];
});

// Image handling
const images = import.meta.glob('@/assets/Boutique/*.{jpg,png,webp}', { eager: true, import: 'default' });
const notFoundImage = new URL('@/assets/notfound.jpg', import.meta.url).href;

function getGoodieImage(nom_image) {
  if (!nom_image) return notFoundImage;
  const fileName = nom_image.toLowerCase().replace(/\s+/g, "_");
  const extensions = ['.jpg', '.png', '.webp'];

  for (const ext of extensions) {
    const imagePath = `/src/assets/Boutique/${fileName}${ext}`;
    if (images[imagePath]) {
      return images[imagePath];
    }
  }

  return notFoundImage;
}

function handleImageError(event) {
  event.target.src = notFoundImage;
}

onMounted(async () => {
  try {
    await store.dispatch('boutique/getGoodieById', goodieId);
    if (currentGoodie.value?.tailles?.length) {
      selectedSize.value = currentGoodie.value.tailles.find(t => t.quantite_stock === 't')?.id_taille || null;
    }
  } catch (error) {
    console.error("Erreur lors du chargement du goodie:", error);
  }
});

async function commanderGoodie() {
  try {
    const sessionId = store.getters["user/getSessionId"];
    const id_goodie = currentGoodie.value.id_goodies;

    if (!sessionId) {
      alert("Session introuvable. Veuillez vous reconnecter.");
      return;
    }

    if (!id_goodie) {
      alert("ID du goodie manquant.");
      return;
    }

    if (!selectedSize.value) {
      alert("Veuillez sélectionner une taille.");
      return;
    }

    if (!quantity.value || quantity.value < 1) {
      alert("Veuillez entrer une quantité valide.");
      return;
    }

    await store.dispatch("mail/sendGoodieMail", {
      sessionId,
      id_goodie,
      quantite: quantity.value,
      id_taille: selectedSize.value
    });

    showSuccessModal.value = true;
  } catch (error) {
    alert("Une erreur est survenue lors de l'envoi de la commande.");
    console.error(error);
  }
}

function handleModalClose() {
  showSuccessModal.value = false;
  router.push('/boutique');
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

.goodie-box {
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

.goodie-image {
  max-width: 100%;
  height: auto;
  max-height: 300px;
  margin: 1rem 0;
  border-radius: 0.5rem;
  object-fit: contain;
}

.description {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.prix {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #e74c3c;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
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

.btn-finaliser:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.btn-retour {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  margin-top: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-retour:hover {
  background-color: #1a252f;
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
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
</style>
<template>
  <div class="boutique-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Boutique Officielle</h1>
        <p class="hero-subtitle">Équipez-vous avec style et performance</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="page-description-box">
        <p class="page-description">
          Explorez notre collection d'équipements sportifs ! Que ce soit pour vos entraînements ou pour dénicher
          le cadeau idéal, notre boutique vous propose des articles de qualité. Pour acheter un produit, envoyez simplement
          une demande depuis le site. Ensuite, rendez-vous dans la salle de sport pour le payer et le récupérer.
        </p>
      </div>


      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des produits...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <div class="error-message">
          <h3>Oups ! Une erreur est survenue</h3>
          <p>{{ error }}</p>
          <button class="retry-btn" @click="fetchGoodies">Réessayer</button>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else class="products-grid">
        <div
            v-for="goodie in allGoodies"
            :key="goodie.id_goodies"
            class="product-card"
        >
          <div class="product-image-container">
            <img
                :src="getGoodieImage(goodie.image_goodies)"
                :alt="goodie.nom_goodies"
                class="product-image"
                @error="handleImageError"
                loading="lazy"
            />
          </div>
          <div class="product-details">
            <div class="product-info">
              <h2 class="product-title">{{ goodie.nom_goodies }}</h2>
              <div class="price-container">
                <span class="current-price">{{ formatPrice(goodie.prix_goodies) }}</span>
              </div>

            </div>
            <div class="size-info" v-if="goodie.tailles && goodie.tailles.length > 0">
              <div class="size-label">Tailles :</div>
              <div class="size-buttons">
                <button
                    v-for="taille in goodie.tailles"
                    :key="taille.id_taille"
                    class="size-btn"
                    :class="{ 'disabled': taille.quantite_stock==='f' }"
                >
                  {{ taille.valeur_taille }}
                </button>
              </div>
            </div>
            <div class="product-actions">
              <button class="add-to-cart-btn" @click="shopping(goodie)">Commander</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && allGoodies.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M22 7h-4V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2H2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7zM6 7v2h12V7H6zm12 6h-2v2h2v-2z"/>
          </svg>
        </div>
        <h3>Aucun produit disponible</h3>
        <p>Revenez plus tard pour découvrir nos nouvelles collections</p>
      </div>
    </div>
  </div>
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
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import {useRouter} from "vue-router";

const store = useStore();
const loading = ref(false);
const error = ref(null);
const userCourant = computed(() => store.state.user.userCourant);
const showLoginModal = ref(false);
const router = useRouter();

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";


function getGoodieImage(imagePath) {
  if (!imagePath) return `${baseUrl}/uploads/notfound.jpg`;
  return `${baseUrl}/uploads/${imagePath}`;
}
function handleImageError(event) {
  event.target.src = notFoundImage;
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

 function shopping(goodies) {
  if (!userCourant.value || !userCourant.value.id_session) {
    showLoginModal.value = true; // Affiche le modal au lieu de l'alert
    return;
  }
  router.push({ name: "boutiqueCommande", params: { id: goodies.id_goodies } });
}

function closeModal() {
  showLoginModal.value = false;
}

function goToLogin() {
  closeModal();
  router.push({ name: "login" });
}

const allGoodies = computed(() => store.getters['boutique/allGoodies']);
async function fetchGoodies() {
  try {
    loading.value = true;
    error.value = null;
    await store.dispatch('boutique/getAllGoodies');
  } catch (err) {
    console.error("Erreur lors du chargement des goodies:", err);
    error.value = err.message || "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchGoodies();
});
</script>

<style scoped>
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

/* Base Styles */
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #3b82f6;
  --secondary: #6b7280;
  --success: #16a34a;
  --error: #ef4444;
  --warning: #f59e0b;
  --background: #f9fafb;
  --card-bg: #ffffff;
  --text-primary: #1f2937;
  --text-secondary: #4b5563;
  --border-color: #e5e7eb;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --rounded-sm: 0.25rem;
  --rounded: 0.5rem;
  --rounded-lg: 0.75rem;
  --rounded-xl: 1rem;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.boutique-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text-primary);
  background-color: var(--background);
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 400px;
  background-image: url('@/assets/boutique-hero.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: 0 1rem;
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInDown 0.8s ease;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease 0.2s both;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.page-description-box {
  background-color: var(--card-bg);
  border-radius: var(--rounded-lg);
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.page-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

/* Filter Section */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.filter-select {
  padding: 0.5rem 1rem;
  border-radius: var(--rounded);
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:hover {
  border-color: var(--primary-light);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 1.5rem;
}

.spinner {
  width: 3.5rem;
  height: 3.5rem;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
}

.loading-state p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* Error State */
.error-state {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: #fef2f2;
  padding: 2rem;
  border-radius: var(--rounded-lg);
  margin: 2rem 0;
  border-left: 4px solid var(--error);
}

.error-icon {
  flex-shrink: 0;
}

.error-icon svg {
  width: 3rem;
  height: 3rem;
  fill: var(--error);
}

.error-message {
  flex-grow: 1;
}

.error-message h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--error);
}

.error-message p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1.25rem;
  background-color: var(--error);
  color: white;
  border: none;
  border-radius: var(--rounded);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background-color: #dc2626;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.product-card {
  background-color: var(--card-bg);
  border-radius: var(--rounded-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.product-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--rounded);
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
}

.product-badge.discount {
  background-color: var(--error);
  left: auto;
  right: 1rem;
}

.product-image-container {
  position: relative;
  width: 100%;
  padding-top: 100%; /* Square aspect ratio */
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.quick-view-btn {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--rounded);
  font-weight: 500;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.product-card:hover .quick-view-btn {
  opacity: 1;
}

.product-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-info {
  margin-bottom: 1rem;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.price-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.original-price {
  font-size: 0.9rem;
  color: var(--secondary);
  text-decoration: line-through;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.stars {
  color: #f59e0b;
  font-size: 0.9rem;
}

.review-count {
  font-size: 0.8rem;
  color: var(--secondary);
}

.size-info {
  margin-bottom: 1.5rem;
}

.size-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.size-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.size-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  border-radius: var(--rounded-sm);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
  text-align: center;
}

.size-btn:hover {
  border-color: var(--primary-light);
}

.size-btn.disabled {
  color: var(--secondary);
  text-decoration: line-through;
  cursor: not-allowed;
  opacity: 0.6;
  background-color: #f3f4f6;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

.wishlist-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.wishlist-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: var(--secondary);
  stroke-width: 2;
}

.wishlist-btn:hover {
  background-color: #f3f4f6;
}

.wishlist-btn:hover svg {
  stroke: var(--error);
}

.add-to-cart-btn {
  flex-grow: 1;
  padding: 0.75rem;
  background-color: var(--primary);
  color: #000000;
  border: none;
  border-radius: var(--rounded);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-to-cart-btn:hover {
  background-color: var(--primary-dark);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
  gap: 1.5rem;
}

.empty-icon svg {
  width: 4rem;
  height: 4rem;
  fill: var(--secondary);
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.empty-state p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 500px;
}

/* Newsletter Section */
.newsletter-section {
  background-color: var(--primary);
  color: white;
  border-radius: var(--rounded-lg);
  padding: 3rem 2rem;
  margin-top: 4rem;
  background-image: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.newsletter-content h3 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.newsletter-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--rounded) 0 0 var(--rounded);
  font-size: 1rem;
}

.newsletter-input:focus {
  outline: none;
}

.newsletter-btn {
  padding: 0.75rem 1.5rem;
  background-color: #1e40af;
  color: white;
  border: none;
  border-radius: 0 var(--rounded) var(--rounded) 0;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.newsletter-btn:hover {
  background-color: #1e3a8a;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 300px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .main-content {
    padding: 0 1rem 3rem;
  }

  .page-description-box {
    padding: 1.5rem;
  }

  .newsletter-section {
    padding: 2rem 1rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-input,
  .newsletter-btn {
    border-radius: var(--rounded);
  }

  .newsletter-input {
    margin-bottom: 0.5rem;
  }
}
</style>
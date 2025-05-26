<template>
  <div class="page-intro">
    <h1>Nos Activités Sportives</h1>
    <div class="intro-container">
      <p class="intro-text">
        Découvrez notre large gamme d'activités adaptées à tous les niveaux et à tous les objectifs.
        Que vous préfériez les séances en groupe dynamiques ou les entraînements personnels individualisés,
        notre salle propose des options variées pour vous accompagner dans votre pratique sportive.
      </p>
      <p class="intro-text">
        Cliquez sur une activité pour en voir le détail et choisissez celle qui correspond le mieux à vos besoins.
      </p>
    </div>
  </div>

  <div class="activites-grid">
    <div
        v-for="activite in activites"
        :key="activite.id_activite"
        class="card"
        @click="openModal(activite)"
    >
      <img
          :src="getActivityImage(activite.image_activite || activite.nom_activite)"
          alt="Image activité"
          class="card-image"
      />
      <div class="card-body">
        <h2 class="card-title">{{ activite.nom_activite }}</h2>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div v-if="selectedActivite" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal" aria-label="Fermer la fenêtre">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
        <div class="modal-image-container">
          <img
              :src="getActivityImage(selectedActivite.image_activite || selectedActivite.nom_activite)"
              :alt="selectedActivite.nom_activite"
              class="modal-image"
              loading="lazy"
          />
        </div>
        <div class="modal-body">
          <div class="modal-header">
            <h2 class="modal-title">{{ selectedActivite.nom_activite }}</h2>
          </div>
          <p class="modal-description">{{ selectedActivite.description_activite }}</p>

          <span class="modal-tag" :class="selectedActivite.type_activite.toLowerCase()">
            {{ selectedActivite.type_activite }}
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { ref } from "vue";

const store = useStore();
const activites = computed(() => store.state.activite.activites);
const selectedActivite = ref(null);


function openModal(activite) {
  selectedActivite.value = activite;
}

function closeModal() {
  selectedActivite.value = null;
}
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function getActivityImage(imagePath) {
  if (!imagePath) return `${baseUrl}/uploads/notfound.jpg`;
  return `${baseUrl}/uploads/${imagePath}`;
}


onMounted(() => {
  store.dispatch("activite/getAllActivite");
});
</script>

<style scoped>

.page-intro {
  padding: 1.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  text-align: center;
}

.intro-container {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  backdrop-filter: blur(2px);
}

.page-intro h1 {
  font-size: clamp(1.5rem, 4vw, 2rem); /* Taille responsive */
  color: var(--dark-color);
  margin-bottom: 1.5rem;
}

.intro-text {
  font-size: clamp(0.95rem, 2vw, 1.1rem); /* Taille responsive */
  color: var(--gray-color);
  line-height: 1.6;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .intro-container {
    padding: 1rem;
    border-radius: 8px;
    text-align: left;
  }

  .page-intro {
    padding: 1rem 0.5rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .intro-container {
    border-left: none;
    border-right: none;
    border-radius: 0;
    padding: 1rem 0.5rem;
  }
}
/* Grid layout */
.activites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Largeur minimale réduite */
  gap: 0.75rem; /* Espacement réduit pour les petits écrans */
  padding: 0.75rem; /* Padding réduit pour les petits écrans */
}

/* Sur les écrans très petits, forcer deux colonnes */
@media (max-width: 480px) {
  .activites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 640px) {
  .activites-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Deux colonnes minimum sur les écrans un peu plus grands */
    gap: 1.5rem;
    padding: 1rem;
  }
}

@media (min-width: 960px) {
  .activites-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Plus large sur les écrans moyens */
    gap: 2rem;
    padding: 20px;
  }
}

@media (min-width: 1280px) {
  .activites-grid {
    grid-template-columns: repeat(5, 1fr); /* Cinq colonnes sur les grands écrans */
  }
}

.card {
  background-color: white;
  border-radius: 8px; /* Rayon de bordure encore plus réduit pour s'adapter à deux colonnes */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08); /* Ombre encore plus subtile */
  overflow: hidden;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.01); /* Effet de survol discret */
}

.card-image {
  width: 100%;
  height: 100px; /* Hauteur d'image encore réduite pour deux colonnes */
  object-fit: cover;
}

@media (min-width: 640px) {
  .card-image {
    height: 120px; /* Hauteur légèrement plus importante sur les écrans un peu plus grands */
  }
}

@media (min-width: 960px) {
  .card-image {
    height: 150px; /* Hauteur standard sur les écrans moyens */
  }
}

.card-body {
  padding: 0.5rem; /* Padding encore réduit pour deux colonnes */
}

.card-title {
  font-size: 1rem; /* Taille de titre réduite pour deux colonnes */
  margin-bottom: 0.2rem;
  color: #34495e;
}

@media (min-width: 640px) {
  .card-title {
    font-size: 1.1rem; /* Taille légèrement plus importante sur les écrans un peu plus grands */
    margin-bottom: 0.3rem;
  }
}

@media (min-width: 960px) {
  .card-title {
    font-size: 1.2rem; /* Taille standard sur les écrans moyens */
    margin-bottom: 0.5rem;
  }
}

/* Styles du modal (inchangés) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 1000px;
  max-height: 95vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  box-shadow: var(--box-shadow);
}

.modal-image-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-body {
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0;
}

.modal-tag {
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.modal-tag.groupe {
  background-color: #28a745;
}

.modal-tag.personnel {
  background-color: #007bff;
}

.modal-description {
  font-size: 1rem;
  color: var(--gray-color);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  z-index: 10;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.close-button svg {
  width: 20px;
  height: 20px;
}

@media (min-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr 1fr;
  }

  .modal-image-container {
    height: auto;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
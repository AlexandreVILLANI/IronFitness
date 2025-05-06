<template>
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

  <!-- Modal -->
  <transition name="fade">
    <div v-if="selectedActivite" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal" aria-label="Fermer la fenêtre">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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

          <!-- Place type_activite sous la description -->
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
const images = import.meta.glob("@/assets/Activite/*.jpg", { eager: true });
images["/src/assets/notfound.jpg"] = new URL("@/assets/notfound.jpg", import.meta.url).href;

function openModal(activite) {
  selectedActivite.value = activite;
}

function closeModal() {
  selectedActivite.value = null;
}
function getActivityImage(nom_image) {
  const fileName = nom_image.toLowerCase().replace(/\s+/g, "_") + ".jpg";
  const imagePath = `/src/assets/Activite/${fileName}`;
  return images[imagePath]?.default || images["/src/assets/notfound.jpg"];
}



onMounted(() => {
  store.dispatch("activite/getAllActivite");
});
</script>

<style scoped>


/* Modal styles */
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




/* Responsive */
@media (min-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr 1fr;
  }

  .modal-image-container {
    height: auto;
  }
}

@media (max-width: 480px) {
  .activites-grid {
    grid-template-columns: 1fr;
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

/* Grid layout */
.activites-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
  padding: 20px;
}

@media (max-width: 1024px) {
  .activites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .activites-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.02);
}

.card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #34495e;
}

</style>

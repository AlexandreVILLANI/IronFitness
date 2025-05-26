<template>
  <div class="sticker-page">
    <h1>Nos activités</h1>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Chargement des activités...</p>
    </div>

    <!-- Contenu principal -->
    <template v-else>
      <div class="carousel-container">
        <button class="carousel-button prev" @click="prevSlide" aria-label="Précédent">
          &lt;
        </button>

        <div class="carousel">
          <div
              v-for="(activity, index) in activities"
              :key="index"
              class="sticker"
              :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
              @click="goToActivity"
          >
            <img
                class="image-activite"
                :src="getActivityImage(activity.image_activite)"
                alt="Image de l'activité"
            />
            <h2>{{ activity.nom_activite }}</h2>
          </div>
        </div>

        <button class="carousel-button next" @click="nextSlide" aria-label="Suivant">
          &gt;
        </button>
      </div>

      <!-- Indicateurs de slide -->
      <div class="carousel-indicators">
        <span
            v-for="(_, index) in visibleDots"
            :key="index"
            :class="{ active: currentIndex === index }"
            @click="goToSlide(index)"
        ></span>
      </div>

      <!-- Bouton "Voir plus" -->
      <div class="voir-plus">
        <button @click="goToActivity">Voir plus</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import {onMounted, computed, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";


const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const loading = ref(true);
const store = useStore();
const router = useRouter();
const activities = computed(() => store.state.activite.activites);
const currentIndex = ref(0);

// Calculer le nombre de points indicateurs visibles
const visibleDots = computed(() => {
  return Math.ceil(activities.value.length / slidesToShow());
});

// Calculer le nombre de slides à afficher selon la largeur d'écran
const slidesToShow = () => {
  if (window.innerWidth >= 1200) return 4;
  if (window.innerWidth >= 768) return 3;
  if (window.innerWidth >= 576) return 2;
  return 1;
};

onMounted(async () => {
  try {
    await store.dispatch("activite/getAllActivite");
    window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error("Erreur lors du chargement des activités:", error);
  } finally {
    loading.value = false;
  }
});

function handleResize() {
  currentIndex.value = 0;
}

function getActivityImage(imagePath) {
  if (!imagePath) return `${baseUrl}/uploads/notfound.jpg`;
  return `${baseUrl}/uploads/${imagePath}`;
}

function goToActivity() {
  router.push("/activite");
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % visibleDots.value;
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + visibleDots.value) % visibleDots.value;
}

function goToSlide(index) {
  currentIndex.value = index;
}
</script>


<style scoped>
.sticker-page {
  padding: 1.5rem;
  text-align: center;
  background-color: white;
  min-height: 300px;
  overflow: hidden;
}

.sticker-page h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

/* Styles pour l'indicateur de chargement */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #2c3e50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Styles du carrousel */
.carousel-container {
  position: relative;
  max-width: 100%; /* Prend toute la largeur disponible */
  margin: 2rem auto; /* Ajoute une marge haut et bas */
  padding: 0 10px; /* Réduit les marges latérales */
}


.carousel {
  display: flex;
  overflow: hidden;
  scroll-behavior: smooth;
  margin: 0 -10px;
}

.sticker {
  flex: 0 0 calc(100% - 20px);
  margin: 0 10px;
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  scroll-snap-align: start;
}

.sticker:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.sticker img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border-radius: 0.3rem;
}

.sticker h2 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.3rem;
}

/* Boutons de navigation */
.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid #ddd;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.carousel-button:hover {
  background: #2c3e50;
  color: white;
}

.prev {
  left: 0;
}

.next {
  right: 0;
}

/* Indicateurs de slide */
.carousel-indicators {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 8px;
}

.carousel-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
  transition: background 0.3s ease;
}

.carousel-indicators span.active {
  background: #2c3e50;
}

/* Bouton "Voir plus" */
.voir-plus {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.voir-plus button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.8rem 1.6rem;
  font-size: 1.1rem;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.voir-plus button:hover {
  background-color: #1a252f;
}

/* Media Queries */
@media (min-width: 576px) {
  .sticker {
    flex: 0 0 calc(50% - 20px);
  }
}

@media (min-width: 768px) {
  .sticker-page {
    padding: 3rem;
  }

  .sticker-page h1 {
    font-size: 3rem;
    margin-bottom: 2.5rem;
  }

  .sticker {
    flex: 0 0 calc(33.333% - 20px);
    padding: 1.2rem;
  }

  .sticker img {
    height: 200px;
    margin-bottom: 0.9rem;
  }

  .sticker h2 {
    font-size: 1.2rem;
  }
}

@media (min-width: 1200px) {
  .sticker {
    flex: 0 0 calc(25% - 20px);
  }

  .sticker img {
    height: 220px;
  }
}
</style>
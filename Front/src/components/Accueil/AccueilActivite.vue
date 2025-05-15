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
      <div class="stickers">
        <div
            v-for="(activity, index) in visibleActivities"
            :key="index"
            class="sticker"
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

const loading = ref(true);
const store = useStore();
const router = useRouter();
const activities = computed(() => store.state.activite.activites);
const visibleActivities = computed(() => activities.value.slice(0, 5));

const images = import.meta.glob('@/assets/Activite/*.jpg', {
  eager: true,
  import: 'default',
});

onMounted(async () => {
  try {
    await store.dispatch("activite/getAllActivite");
  } catch (error) {
    console.error("Erreur lors du chargement des activités:", error);
  } finally {
    loading.value = false;
  }
});

function getActivityImage(nom_image) {
  const fileName = nom_image.toLowerCase().replace(/\s+/g, '_') + '.jpg';
  const imagePath = `/src/assets/Activite/${fileName}`;
  return images[imagePath] || images["/src/assets/notfound.jpg"];
}

function goToActivity() {
  router.push("/activite");
}
</script>

<style scoped>
.sticker-page {
  padding: 1.5rem;
  text-align: center;
  background-color: white;
  min-height: 300px; /* Pour éviter les sauts de layout */
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

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

.stickers {
  margin-top: 20px;
  margin-right: 20px;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.sticker {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  width: calc(50% - 0.5rem);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.sticker:hover {
  transform: scale(1.02);
}

.sticker img {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border-radius: 0.3rem;
}

.sticker h2 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.3rem;
}

/* Media query pour les écrans plus grands (tablettes et ordinateurs) */
@media (min-width: 768px) {
  .sticker-page {
    padding: 3rem;
  }

  .sticker-page h1 {
    font-size: 3rem;
    margin-bottom: 2.5rem;
  }

  .stickers {
    gap: 2.5rem;
    justify-content: flex-start;
  }

  .sticker {
    width: 350px;
    padding: 2rem;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  .sticker:hover {
    transform: scale(1.07);
  }

  .sticker img {
    margin-bottom: 1.2rem;
    border-radius: 0.6rem;
  }

  .sticker h2 {
    font-size: 1.5rem;
    margin-bottom: 0.7rem;
  }
}

/* Media query pour les écrans de taille moyenne (petites tablettes) */
@media (min-width: 576px) and (max-width: 767px) {
  .stickers {
    justify-content: center;
    gap: 2rem;
  }

  .sticker {
    width: calc(50% - 1rem);
    padding: 1.2rem;
  }

  .sticker img {
    margin-bottom: 0.9rem;
    border-radius: 0.4rem;
  }

  .sticker h2 {
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
  }
}
</style>
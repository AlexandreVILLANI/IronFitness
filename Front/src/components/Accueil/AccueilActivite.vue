<template>
  <div class="sticker-page">
    <h1>Activités</h1>
    <div class="stickers">
      <div
          v-for="(activity, index) in activities"
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
  </div>
</template>

<script setup>
import {onMounted, computed, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const activities = computed(() => store.state.activite.activites);
const store = useStore();
const router = useRouter();
const images = import.meta.glob('@/assets/Activite/*.jpg', {
  eager: true,
  import: 'default',
});

onMounted(() => {
  store.dispatch("activite/getAllActivite");
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
  padding: 1.5rem; /* Réduit un peu le padding global sur mobile */
  text-align: center;
  background-color: #f2f2f2;
}

.sticker-page h1 {
  font-size: 2rem; /* Réduit la taille du titre sur mobile */
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.stickers {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem; /* Réduit l'espace entre les stickers sur mobile */
}

.sticker {
  background: white;
  border-radius: 0.75rem; /* Réduit légèrement le rayon de bordure sur mobile */
  padding: 1rem; /* Réduit le padding à l'intérieur du sticker sur mobile */
  width: calc(50% - 0.5rem); /* Deux colonnes sur les petits écrans */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Ombre plus subtile sur mobile */
  transition: transform 0.2s ease;
  cursor: pointer;
}

.sticker:hover {
  transform: scale(1.02); /* Effet de survol plus subtil sur mobile */
}

.sticker img {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 0.75rem; /* Réduit la marge sous l'image sur mobile */
  border-radius: 0.3rem; /* Réduit le rayon de bordure de l'image sur mobile */
}

.sticker h2 {
  font-size: 1.1rem; /* Réduit la taille du titre du sticker sur mobile */
  color: #333;
  margin-bottom: 0.3rem;
}

/* Media query pour les écrans plus grands (tablettes et ordinateurs) */
@media (min-width: 768px) {
  .sticker-page {
    padding: 2rem;
  }

  .sticker-page h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .stickers {
    gap: 2rem;
    justify-content: flex-start; /* Alignement à gauche sur les écrans plus grands */
  }

  .sticker {
    width: 300px; /* Retour à la largeur fixe sur les écrans plus grands */
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .sticker:hover {
    transform: scale(1.05);
  }

  .sticker img {
    margin-bottom: 1rem;
    border-radius: 0.5rem;
  }

  .sticker h2 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
}

/* Media query pour les écrans de taille moyenne (petites tablettes) */
@media (min-width: 576px) and (max-width: 767px) {
  .stickers {
    justify-content: center; /* Centre les stickers sur les tablettes de taille moyenne */
    gap: 1.5rem;
  }

  .sticker {
    width: calc(33.33% - 1rem); /* Trois colonnes sur les tablettes de taille moyenne */
  }
}
</style>
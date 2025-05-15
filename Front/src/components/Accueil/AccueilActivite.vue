<template>
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

<script setup>
import {onMounted, computed} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const activities = computed(() => store.state.activite.activites);
const store = useStore();
const router = useRouter();
const visibleActivities = computed(() => activities.value.slice(0, 5));

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
  margin-top: 20px;
  margin-right: 20px;
  margin-left: 20px;
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
    padding: 3rem; /* Augmente le padding global sur ordinateur */
  }

  .sticker-page h1 {
    font-size: 3rem; /* Augmente la taille du titre sur ordinateur */
    margin-bottom: 2.5rem;
  }

  .stickers {
    gap: 2.5rem; /* Augmente l'espace entre les stickers sur ordinateur */
    justify-content: flex-start; /* Alignement à gauche sur les écrans plus grands */
  }

  .sticker {
    width: 350px; /* Augmente la largeur des stickers sur ordinateur */
    padding: 2rem; /* Augmente le padding à l'intérieur du sticker sur ordinateur */
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); /* Ombre plus prononcée sur ordinateur */
  }

  .sticker:hover {
    transform: scale(1.07); /* Effet de survol plus marqué sur ordinateur */
  }

  .sticker img {
    margin-bottom: 1.2rem; /* Augmente la marge sous l'image sur ordinateur */
    border-radius: 0.6rem;
  }

  .sticker h2 {
    font-size: 1.5rem; /* Augmente la taille du titre du sticker sur ordinateur */
    margin-bottom: 0.7rem;
  }
}

/* Media query pour les écrans de taille moyenne (petites tablettes) */
@media (min-width: 576px) and (max-width: 767px) {
  .stickers {
    justify-content: center; /* Centre les stickers sur les tablettes de taille moyenne */
    gap: 2rem; /* Ajuste l'espace pour les tablettes */
  }

  .sticker {
    width: calc(50% - 1rem); /* Deux colonnes sur les tablettes de taille moyenne */
    padding: 1.2rem; /* Ajuste le padding pour les tablettes */
  }

  .sticker img {
    margin-bottom: 0.9rem; /* Ajuste la marge pour les tablettes */
    border-radius: 0.4rem;
  }

  .sticker h2 {
    font-size: 1.2rem; /* Ajuste la taille du titre pour les tablettes */
    margin-bottom: 0.4rem;
  }
}
</style>
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
        <img class="image-activite" :src="getActivityImage(activity.image_activite)" />
        <h2>{{ activity.nom_activite }}</h2>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";


const activities = computed(() => store.state.activite.activites);
const store = useStore();
const router = useRouter();
const images = import.meta.glob('@/assets/Activite/*.jpg', {
  eager: true,
  import: 'default'
});

onMounted(() => {
  store.dispatch("activite/getAllActivite");
});

function getActivityImage(nom_image) {
  const fileName = nom_image.toLowerCase().replace(/\s+/g, '_') + '.jpg';
  const imagePath = `/src/assets/Activite/${fileName}`;
  return images[imagePath] || images['/src/assets/notfound.jpg'];
}

function goToActivity() {
  router.push('/activite');
}
</script>
<style scoped>
.sticker-page {
  padding: 2rem;
  text-align: center;
  background-color: #f2f2f2;
}

.sticker-page h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.stickers {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.sticker {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  cursor: pointer; /* Ajout du curseur pour indiquer que c'est cliquable */
}

.sticker:hover {
  transform: scale(1.05);
}

.sticker img {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
}

.sticker h2 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.sticker p {
  font-size: 1rem;
  color: #666;
}
</style>

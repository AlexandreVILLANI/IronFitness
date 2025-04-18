<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";

// Store
const store = useStore();

onMounted(() => {
  store.dispatch("formule/getAllFormule");
});

const formules = computed(() => store.state.formule.formules);

// Images (si tu as des images pour les formules)
const images = import.meta.glob('@/assets/Formule/*.jpg', {
  eager: true,
  import: 'default'
});

function getFormuleImage(nom_image) {
  if (!nom_image) return images['/src/assets/notfound.jpg'];
  const fileName = nom_image.toLowerCase().replace(/\s+/g, '_') + '.jpg';
  const imagePath = `/src/assets/Formule/${fileName}`;
  return images[imagePath] || images['/src/assets/notfound.jpg'];
}
</script>

<template>
  <!-- Bande de séparation -->
  <div class="svg-divider">
    <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
      <path d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" fill="#eef2f5"></path>
    </svg>
  </div>

  <div class="formule-page">
    <h1>Formules</h1>
    <div class="formules">
      <div v-for="(formule, index) in formules" :key="index" class="formule-card">
        <img class="image-formule" :src="getFormuleImage(formule.image_formule)" />
        <h2>{{ formule.nom_formule }}</h2>
        <p class="prix">{{ formule.prix_formule }} € / {{ formule.unite }}</p>
        <p class="activites">Activités : {{ formule.activites_liees }}</p>
      </div>
    </div>
  </div>
</template>


<style scoped>

.svg-divider {
  width: 100%;
  overflow: hidden;
  line-height: 0;
  margin-top: 4rem;
}

.svg-divider svg {
  display: block;
  width: 100%;
  height: 100px;
}

.formule-page {
  padding: 2rem;
  text-align: center;
  background-color: #eef2f5;
}

.formule-page h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #34495e;
}

.formules {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.formule-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.formule-card:hover {
  transform: scale(1.05);
}

.image-formule {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
}

.formule-card h2 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.formule-card .prix {
  font-size: 1.1rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 0.5rem;
}

.formule-card .activites {
  font-size: 0.95rem;
  color: #7f8c8d;
}
</style>

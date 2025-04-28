<template>
  <section class="spikes"></section>

  <div class="formule-page">
    <h1>Formules</h1>
    <div class="formules">
      <div v-for="(formule, index) in formules" :key="index" class="formule-card">
        <img class="image-formule" :src="getFormuleImage(formule.image_formule)" />
        <h2>{{ formule.nom_formule }}</h2>
        <p class="prix">{{ formule.prix_formule }} € / {{ formule.unite }}</p>
        <p class="activites">Activités : {{ formule.activites_liees }}</p>

        <button @click="abonner(formule)" class="subscribe-button">
          S'abonner
        </button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";


const router = useRouter();
const store = useStore();
const formules = computed(() => store.state.formule.formules);
const userCourant = computed(() => store.state.user.userCourant);
const images = import.meta.glob('@/assets/Formule/*.jpg', {
  eager: true,
  import: 'default'
});

async function abonner(formule) {
  if (!userCourant.value || !userCourant.value.id_session) {
    alert("Vous devez être connecté pour vous abonner.");
    router.push({ name: 'login' });
    return;
  }
  router.push({ name: 'souscrire', params: { id: formule.id_formule } });
}


onMounted(() => {
  store.dispatch("formule/getAllFormule");
});

function getFormuleImage(nom_image) {
  if (!nom_image) return images['/src/assets/notfound.jpg'];
  const fileName = nom_image.toLowerCase().replace(/\s+/g, '_') + '.jpg';
  const imagePath = `/src/assets/Formule/${fileName}`;
  return images[imagePath] || images['/src/assets/notfound.jpg'];
}

</script>

<style scoped>

.subscribe-button {
  background-color: #527091;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  margin-top: 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.subscribe-button:hover {
  background-color: #3b5a75;
}


.spikes {
  position: relative;
  background: #445f77;
  height: 1vh;
  z-index: 1;
}

.spikes::after {
  content: '';
  position: absolute;
  right: 0;
  left: -98%;
  bottom: 100%;
  z-index: 2;
  display: block;
  height: 10px;
  background-size: 10px 100%;
  background-image:
      linear-gradient(135deg, #445f77 25%, transparent 25%),
      linear-gradient(225deg, #445f77 25%, transparent 25%);
  background-position: 0 0;
  transform: rotate(180deg);
}

.formule-page {
  padding: 2rem;
  text-align: center;
  background-color: #445f77;
}

.formule-page h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: white;
}

.formules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.formule-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
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
  color: #527091;
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

/* Responsive design pour petits écrans */
@media (max-width: 600px) {
  .formule-page {
    padding: 1rem;
  }

  .formule-page h1 {
    font-size: 2rem;
  }

  .formule-card {
    padding: 1rem;
  }

  .formule-card h2 {
    font-size: 1.2rem;
  }

  .formule-card .prix,
  .formule-card .activites {
    font-size: 0.95rem;
  }
}
</style>



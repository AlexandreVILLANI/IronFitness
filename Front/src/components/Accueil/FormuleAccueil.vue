<template>
  <section class="spikes"></section>
  <div class="formule-page">
    <h1>Nos abonnements</h1>
    <div class="formules">
      <div v-for="(formule, index) in formules" :key="index" class="formule-card">
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
const images = import.meta.glob("@/assets/Formule/*.jpg", {
  eager: true,
  import: "default",
});

async function abonner(formule) {
  if (!userCourant.value || !userCourant.value.id_session) {
    alert("Vous devez être connecté pour vous abonner.");
    router.push({ name: "login" });
    return;
  }
  router.push({ name: "souscrire", params: { id: formule.id_formule } });
}

onMounted(() => {
  store.dispatch("formule/getAllFormule");
});

function getFormuleImage(nom_image) {
  if (!nom_image) return images["/src/assets/notfound.jpg"];
  const fileName = nom_image.toLowerCase().replace(/\s+/g, "_") + ".jpg";
  const imagePath = `/src/assets/Formule/${fileName}`;
  return images[imagePath] || images["/src/assets/notfound.jpg"];
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
  background: #ffffff;
  height: 2vh;
}

.spikes::after {
  content: '';
  position: absolute;
  right: 0;
  left: -0%;
  top: 100%;
  z-index: 10;
  display: block;
  height: 40px;
  background-size: 20px 100%;
  background-image: linear-gradient(135deg, #ffffff 25%, transparent 25%), linear-gradient(225deg, #ffffff 25%, transparent 25%);
  background-position: 0 0;
}

.formule-page {
  padding: 1.5rem; /* Réduit le padding global sur mobile */
  text-align: center;
  background-color: #445f77;
}

.formule-page h1 {
  font-size: 2rem; /* Réduit la taille du titre sur mobile */
  margin-bottom: 1.5rem;
  color: white;
}

.formules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Légèrement réduit la largeur minimale */
  gap: 1.5rem; /* Réduit l'espace entre les cartes sur mobile */
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.formule-card {
  background: white;
  border-radius: 0.75rem; /* Réduit légèrement le rayon de bordure sur mobile */
  padding: 1rem; /* Réduit le padding à l'intérieur de la carte sur mobile */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Ombre plus subtile sur mobile */
  transition: transform 0.2s ease;
}

.formule-card:hover {
  transform: scale(1.02); /* Effet de survol plus subtil sur mobile */
}

.image-formule {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 0.75rem; /* Réduit la marge sous l'image sur mobile */
  border-radius: 0.3rem; /* Réduit le rayon de bordure de l'image sur mobile */
}

.formule-card h2 {
  font-size: 1.2rem; /* Réduit la taille du titre de la formule sur mobile */
  color: #527091;
  margin-bottom: 0.3rem;
}

.formule-card .prix {
  font-size: 1rem; /* Réduit la taille du prix sur mobile */
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 0.3rem;
}

.formule-card .activites {
  font-size: 0.9rem; /* Réduit légèrement la taille du texte des activités */
  color: #7f8c8d;
}

.subscribe-button {
  font-size: 0.9rem; /* Réduit la taille du texte du bouton sur mobile */
  padding: 0.5rem 1rem; /* Réduit le padding du bouton sur mobile */
  margin-top: 0.75rem; /* Réduit la marge au-dessus du bouton sur mobile */
  border-radius: 0.3rem; /* Réduit légèrement le rayon de bordure du bouton */
}

/* Media query pour les écrans de taille moyenne (petites tablettes) */
@media (min-width: 601px) and (max-width: 992px) {
  .formule-page {
    padding: 2rem;
  }

  .formule-page h1 {
    font-size: 2.2rem;
  }

  .formules {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .formule-card {
    padding: 1.2rem;
  }

  .formule-card h2 {
    font-size: 1.3rem;
  }

  .formule-card .prix,
  .formule-card .activites {
    font-size: 1rem;
  }

  .subscribe-button {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    margin-top: 1rem;
    border-radius: 0.4rem;
  }
}

/* Media query pour les écrans plus grands (tablettes et ordinateurs) */
@media (min-width: 993px) {
  .formule-page {
    padding: 2rem;
  }

  .formule-page h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .formules {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 0 1rem;
  }

  .formule-card {
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .formule-card:hover {
    transform: scale(1.05);
  }

  .image-formule {
    margin-bottom: 1rem;
    border-radius: 0.5rem;
  }

  .formule-card h2 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }

  .formule-card .prix {
    font-size: 1.1rem;
  }

  .formule-card .activites {
    font-size: 0.95rem;
  }

  .subscribe-button {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    margin-top: 1rem;
    border-radius: 0.4rem;
  }
}
</style>
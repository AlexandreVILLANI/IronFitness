<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'


const store = useStore()
const activites = ref([])

onMounted(async () => {
  await store.dispatch('activite/getAllActivite')
  activites.value = store.state.activite.activites
})
</script>

<template>
  <div class="accueil-container">
    <div class="overlay">
      <div class="greetings">
        <h1 class="titre-principal">Iron Fitness</h1>
      </div>
    </div>
  </div>
</template>


<style scoped>
.accueil-container {
  background-image: url('@/assets/Accueil/accueilFond.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100%;
  position: relative;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 1rem;
}

.titre-principal {
  color: #fff;
  font-size: 4rem;
  font-weight: 700;
  text-transform: uppercase;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  letter-spacing: 2px;
  background: linear-gradient(45deg, #7bff00, #00e1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeInDown 1s ease;
}

/* Animation d'apparition */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>



<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import AccueilActivite from "@/components/Accueil/AccueilActivite.vue";

const store = useStore()
const activites = ref([])
const showScrollTop = ref(false)
const activiteViewSection = ref(null)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 800
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToActivite = () => {
  activiteViewSection.value.scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
  await store.dispatch('activite/getAllActivite')
  activites.value = store.state.activite.activites
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>



<template>
  <div class="accueil-container">
    <div class="overlay">
      <div class="greetings">
        <h1 class="titre-principal">Iron Fitness</h1>
        <a @click.prevent="scrollToActivite" class="scroll-link">Nos activités ↓</a>
      </div>
    </div>
  </div>

  <div ref="activiteViewSection">
    <AccueilActivite />
  </div>

  <button v-if="showScrollTop" class="scroll-top-btn" @click="scrollToTop">
    ↑
  </button>
</template>




<<style scoped>

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
  flex-direction: column;
}

.titre-principal {
  color: #fff;
  font-size: 4rem;
  font-weight: 700;
  text-transform: uppercase;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  letter-spacing: 2px;
  background: linear-gradient(45deg, #0033ff, #ff0000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeInDown 1s ease;
  margin-bottom: 1rem;
  transform: translateY(-30px); /* remonter légèrement */
}

.scroll-link {
  color: #fff;
  font-size: 1.2rem;
  text-decoration: none;
  border: 2px solid #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
}

.scroll-link:hover {
  background-color: #fff;
  color: #2c3e50;
  cursor: pointer;
}

/* Animation d'apparition */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.scroll-top-btn:hover {
  background-color: #00d8ff;
  color: #2c3e50;
}

</style>



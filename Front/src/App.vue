<template>
  <div id="app">
    <Navbar v-if="!route.meta.hideNavbar" />
    <RouterView />
    <Footer v-if="!route.meta.hideFooter" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

// Récupérer l'URL de l'API depuis le .env
const apiUrl = import.meta.env.VITE_API_URL

const activites = ref([])

const store = useStore()
const route = useRoute()

onMounted(async () => {
  // Appel à fetchSessionFromCookies dès que l'app est montée
  await store.dispatch('user/fetchSessionFromCookies')

  // Exemple de requête à ton API pour récupérer des activités
  try {
    const res = await axios.get(`${apiUrl}/activites`)
    activites.value = res.data
  } catch (error) {
    console.error('Erreur lors du chargement des activités :', error)
  }
})
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

/* Solution principale */
#app {
  display: grid;
  grid-template-rows: auto 1fr auto; /* Navbar - Contenu - Footer */
  min-height: 100vh;
}

.main-content {
  min-height: 0; /* Important pour le débordement */
}

/* Vos styles existants */
* {
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}
</style>

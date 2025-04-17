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
import axios from 'axios'

// Récupérer l'URL de l'API depuis le .env
const apiUrl = import.meta.env.VITE_API_URL

const activites = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('https://ironfitness.onrender.com')
    activites.value = res.data
  } catch (error) {
    console.error('Erreur lors du chargement des activités :', error)
  }
})
//    const res = await axios.get(`${apiUrl}/api/activites`)


const route = useRoute()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

* {
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif;
  box-sizing: border-box;
}
html, body {
  height: 100vh;
}
</style>

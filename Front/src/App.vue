<!-- src/views/Activites.vue -->
<template>
  <div>
    <h1>Nos Activités</h1>
    <ul>
      <li v-for="a in activites" :key="a.id_activite">{{ a.nom_activite }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Récupérer l'URL de l'API depuis le .env
const apiUrl = import.meta.env.VITE_API_URL

const activites = ref([])

onMounted(async () => {
  try {
    const res = await axios.get(`${apiUrl}/api/activites`)
    activites.value = res.data
  } catch (error) {
    console.error('Erreur lors du chargement des activités :', error)
  }
})
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

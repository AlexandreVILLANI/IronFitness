<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

defineProps({
  msg: {
    type: String,
    required: true,
  },
})

const store = useStore()
const activites = ref([])

onMounted(async () => {
  await store.dispatch('activite/getAllActivite') // Appelle l'action Vuex
  activites.value = store.state.activite.activites // Récupère les données depuis le state
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>Test page d'accueil</h3>

    <div>
      <h4>Liste des activités :</h4>
      <ul>
        <li v-for="a in activites" :key="a.id_activite">{{ a.nom_activite }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>

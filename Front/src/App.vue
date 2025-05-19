<template>
  <div id="app">
    <Navbar v-if="!route.meta.hideNavbar" />
    <RouterView />
    <Footer v-if="!route.meta.hideFooter" />
    <DisconnectedDialog ref="disconnectedDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import DisconnectedDialog from '@/components/Dialog/DisconnectedDialog.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const route = useRoute();
const disconnectedDialog = ref(null);
const userCourant = computed(() => store.state.user.userCourant);

// Initialisation de la session avant le rendu
store.dispatch('user/fetchSessionFromCookies').then(() => {
  console.log('Session initialisée:', userCourant.value);
});

const inactivityTime = 59 * 60 * 1000; // 59 minutes
let inactivityTimer = null;

function resetInactivityTimer() {
  if (!userCourant.value?.id_session) {
    return;
  }

  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  inactivityTimer = setTimeout(() => {
    disconnectedDialog.value?.show();
    store.dispatch('user/logoutUser');
    router.push({ name: 'login' });
  }, inactivityTime);
}

function setupInactivityListener() {
  document.addEventListener('mousemove', resetInactivityTimer);
  document.addEventListener('keydown', resetInactivityTimer);
  document.addEventListener('click', resetInactivityTimer);
}

onMounted(() => {
  setupInactivityListener();
  resetInactivityTimer();
});

onUnmounted(() => {
  clearTimeout(inactivityTimer);
  document.removeEventListener('mousemove', resetInactivityTimer);
  document.removeEventListener('keydown', resetInactivityTimer);
  document.removeEventListener('click', resetInactivityTimer);
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

/* Reset global pour empêcher le défilement horizontal */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden; /* Empêche le défilement horizontal sur tout le document */
  position: relative;
}

* {
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif;
  box-sizing: border-box;
}

/* Structure principale */
#app {
  display: grid;
  grid-template-rows: auto 1fr auto; /* Navbar - Contenu - Footer */
  min-height: 100vh;
  width: 100%;
  max-width: 100vw; /* Empêche le dépassement de la largeur */
  overflow-x: hidden; /* Empêche le défilement horizontal au niveau de l'app */
  position: relative;
}

/* Pour éviter que le contenu de routerView ne cause de défilement horizontal */
#app > * {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

/* Media queries pour les appareils mobiles */
@media screen and (max-width: 768px) {
  body {
    -webkit-text-size-adjust: 100%; /* Empêche le zoom du texte sur iOS */
  }

  #app {
    padding: 0; /* Élimine tout padding potentiellement problématique */
  }
}
</style>

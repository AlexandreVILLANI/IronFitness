<template>
  <div id="app">
    <Navbar v-if="!route.meta.hideNavbar" />
    <RouterView />
    <Footer v-if="!route.meta.hideFooter" />
    <DisconnectedDialog ref="disconnectedDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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
const userCourant = store.state.user.userCourant;

const inactivityTime = 59 * 60 * 1000; // 59 minutes
let inactivityTimer = null;

function resetInactivityTimer() {

  if (!userCourant || !userCourant.id_session) {
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
  store.dispatch('user/fetchSessionFromCookies');
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

/* Solution principale */
#app {
  display: grid;
  grid-template-rows: auto 1fr auto; /* Navbar - Contenu - Footer */
  min-height: 100vh;
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

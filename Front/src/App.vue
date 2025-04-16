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

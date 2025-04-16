<template>
  <footer class="footer">
    <p>© {{ year }} MonApp — Tous droits réservés</p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

body {
  display: flex;
  flex-direction: column;
}

.footer {
  margin-top: auto;
  text-align: center;
  padding: 1rem;
  background-color: #f5f5f5;
  color: #555;
  font-size: 0.9rem;
}
</style>

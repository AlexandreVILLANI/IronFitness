<template>
  <footer class="footer">
    <div class="footer-links">
      <router-link to="/about">À propos</router-link>
      <router-link to="/contact">Contact</router-link>
    </div>
    <p>© {{ year }} IronFitness — Tous droits réservés</p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  margin-top: auto;
  text-align: center;
  padding: 1.5rem 1rem;
  background-color: #2c3e50;
  color: white;
  font-size: 0.9rem;
}

.footer-links {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>

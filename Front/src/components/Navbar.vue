<template>
  <nav class="navbar">
    <div class="logo">
      <img class="logo-site" src="https://static.cdnlogo.com/logos/s/59/sports.svg">
      Iron Fitness
    </div>
    <ul class="nav-links">
      <li><router-link to="/">Accueil</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
.logo-site {
  width: 40px;
  height: 40px;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  padding: 1rem 2rem;
  color: white;
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.nav-links a:hover {
  text-decoration: underline;
}
</style>

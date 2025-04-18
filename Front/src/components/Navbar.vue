<template>
  <nav class="navbar">
    <div class="logo">
      <img class="logo-site" src="@/assets/logoSite.png" alt="Logo Iron Fitness" />
    </div>
    <ul class="nav-links">
      <li><router-link to="/">Accueil</router-link></li>
      <li><router-link to="/activite">Activité</router-link></li>
      <li><router-link to="/cours">Cours</router-link></li>
      <li><router-link to="/planning">Planning</router-link></li>
    </ul>
    <div class="auth-buttons">
      <router-link to="/login" class="login-btn">Connexion</router-link>
    </div>
  </nav>
</template>



<style scoped>
.auth-buttons {
  margin-left: 2rem;
}

.login-btn {
  background-color: transparent;
  color: white;
  border: 2px solid #ffffff;
  padding: 0.4rem 1rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.login-btn:hover {
  background-color: #ffffff;
  color: #2c3e50;
}


.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #283e97, #7e2a2a);/*#2c3e50, #34495e*/
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo-site {
  height: 50px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo-site:hover {
  transform: scale(1.1);
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  transition: color 0.3s ease;
}

.nav-links a::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 2px;
  background: #ffffff;
  left: 0;
  bottom: -4px;
  transition: width 0.3s ease;
}



.nav-links a:hover::after {
  width: 100%;
}
</style>

<script setup lang="ts">
</script>
<template>
  <nav class="navbar">
    <div class="logo">
      <img class="logo-site" src="@/assets/logoSite.png" alt="Logo Iron Fitness" />
    </div>

    <div class="menu-toggle" @click="toggleMenu">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>

    <div class="nav-container" :class="{ 'active': menuOpen }">
      <ul class="nav-links">
        <li><router-link to="/" @click="closeMenu">Accueil</router-link></li>
        <li><router-link to="/activite" @click="closeMenu">Activité</router-link></li>
        <li><router-link to="/planning" @click="closeMenu">Planning</router-link></li>
      </ul>
      <div class="auth-buttons">
        <router-link v-if="!isConnected || !userCourant?.id_session" to="/login" class="login-btn" @click="closeMenu">Connexion</router-link>
        <router-link
            v-else
            to="/profil"
            class="profile-btn"
            @click="closeMenu"
        >
          <img src="@/assets/user-icon.svg" alt="Profil" class="user-icon" />
          Profil
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const userCourant = computed(() => store.state.user.userCourant);
const isConnected = computed( () => store.state.user.isConnected);
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #283e97, #7e2a2a);
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

.nav-container {
  display: flex;
  align-items: center;
  gap: 2rem;
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

.auth-buttons {
  margin-left: 1rem;
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

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  color: #2c3e50;
  border: 2px solid white;
  padding: 0.4rem 1rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.profile-btn:hover {
  background-color: #f0f0f0;
  color: #283e97;
}

.user-icon {
  width: 20px;
  height: 20px;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  z-index: 20;
}

.bar {
  width: 30px;
  height: 3px;
  background-color: white;
  margin: 3px 0;
  transition: all 0.3s ease;
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-container {
    position: fixed;
    top: 0;
    right: -300px;
    width: 300px;
    height: 100vh;
    background: linear-gradient(180deg, #283e97, #7e2a2a);
    flex-direction: column;
    align-items: flex-start;
    padding: 80px 20px 20px;
    transition: right 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  }

  .nav-container.active {
    right: 0;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .nav-links a {
    font-size: 1.2rem;
    padding: 0.5rem 0;
    display: block;
  }

  .auth-buttons {
    margin: 2rem 0 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

@media screen and (max-width: 480px) {
  .navbar {
    padding: 1rem;
  }

  .logo-site {
    height: 40px;
  }

  .nav-container {
    width: 250px;
    right: -250px;
  }
}
</style>
<template>
  <div class="login-container">
    <!-- Formulaire de login -->
    <div v-if="!register" class="login-form">
      <h2>Se connecter</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Entrez votre email" required />
        </div>
        <div class="input-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="password" placeholder="Entrez votre mot de passe" required />
        </div>
        <button type="submit" class="btn">Se connecter</button>
      </form>
      <p class="signup-link">
        Pas encore de compte ? <a href="#" @click="toggleRegister">S'inscrire</a>
      </p>
    </div>

    <!-- Formulaire d'inscription -->
    <div v-if="register" class="register-form">
      <h2>S'inscrire</h2>
      <form @submit.prevent="registerUser">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Entrez votre email" required />
        </div>
        <div class="input-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="password" placeholder="Entrez votre mot de passe" required />
        </div>
        <div class="input-group">
          <label for="confirm-password">Confirmer le mot de passe</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="Confirmer votre mot de passe" required />
        </div>
        <button type="submit" class="btn">S'inscrire</button>
      </form>
      <p class="login-link">
        Déjà un compte ? <a href="#" @click="toggleRegister">Se connecter</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      register: false, // Utilisé pour basculer entre la page de connexion et d'inscription
    };
  },
  methods: {
    login() {
      // Implémentation de la logique de connexion
      console.log('Connexion avec:', this.email, this.password);
    },
    registerUser() {
      // Implémentation de la logique d'inscription
      if (this.password === this.confirmPassword) {
        console.log('Inscription avec:', this.email, this.password);
      } else {
        console.log('Les mots de passe ne correspondent pas');
      }
    },
    toggleRegister() {
      // Bascule entre la page de connexion et la page d'inscription
      this.register = !this.register;
    }
  }
};
</script>

<style scoped>
/* Styles identiques à ceux précédemment fournis */
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/Login/loginPage.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  z-index: -1;
}

.login-form, .register-form {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.btn {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}

.signup-link, .login-link {
  text-align: center;
  margin-top: 10px;
}

.signup-link a, .login-link a {
  color: #4CAF50;
  text-decoration: none;
}

.signup-link a:hover, .login-link a:hover {
  text-decoration: underline;
}
</style>

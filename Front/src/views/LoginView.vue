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

        <!-- Message d'erreur de connexion -->
        <div v-if="loginError" class="error-message">
          {{ loginError }}
        </div>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>
      <p class="signup-link">
        Pas encore de compte ? <a href="#" @click.prevent="toggleRegister">S'inscrire</a>
      </p>
    </div>

    <!-- Formulaire d'inscription -->
    <div v-if="register" class="register-form">
      <h2>S'inscrire</h2>
      <form @submit.prevent="registerUser">
        <div class="input-group">
          <label for="nom">Nom</label>
          <input type="text" id="nom" v-model="nom" placeholder="Entrez votre nom" required />
        </div>
        <div class="input-group">
          <label for="prenom">Prénom</label>
          <input type="text" id="prenom" v-model="prenom" placeholder="Entrez votre prénom" required />
        </div>
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

        <!-- Message d'erreur d'inscription -->
        <div v-if="registerError" class="error-message">
          {{ registerError }}
        </div>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'Inscription en cours...' : 'S\'inscrire' }}
        </button>
      </form>
      <p class="login-link">
        Déjà un compte ? <a href="#" @click.prevent="toggleRegister">Se connecter</a>
      </p>
    </div>
  </div>
</template>

<script>
import { getSession } from "@/services/authentification.service.js";
import { getUserFromSessionId } from "@/services/users.service";
import { mapActions, mapState } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      email: null,
      password: null,
      confirmPassword: null,
      register: false,
      nom: null,
      prenom: null,
      loading: false,
      loginError: null,
      registerError: null,
      connectionError: null
    };
  },
  computed: {
    ...mapState("user", ["userCourant"]),
  },
  methods: {
    ...mapActions("user", ["loginUtilisateur", "createUtilisateur"]),

    toggleRegister() {
      this.email = null;
      this.password = null;
      this.confirmPassword = null;
      this.nom = null;
      this.prenom = null;
      this.loginError = null;
      this.registerError = null;
      this.register = !this.register;
    },

    async login() {
      this.loginError = null;
      this.loading = true;

      try {
        if (!this.email || !this.password) {
          this.loginError = "Veuillez remplir tous les champs";
          return;
        }

        const sessionResponse = await getSession(this.email, this.password);

        if (sessionResponse.data.error === 1) {
          this.loginError = "Email ou mot de passe incorrect";
          return;
        }

        if (!sessionResponse.data) {
          this.loginError = "Erreur de connexion au serveur";
          return;
        }

        this.$store.commit("user/SET_SESSION_ID", sessionResponse.data);

        const userResponse = await getUserFromSessionId();
        this.$store.commit("user/SET_USER", userResponse.data);

        await this.$router.push({ path: "/" });
      } catch (error) {
        console.error("Erreur de connexion:", error);
        if (error.response) {
          // Erreur HTTP
          if (error.response.status === 401) {
            this.loginError = "Identifiants incorrects";
          } else if (error.response.status === 500) {
            this.loginError = "Erreur serveur, veuillez réessayer plus tard";
          } else {
            this.loginError = "Erreur de connexion (" + error.response.status + ")";
          }
        } else if (error.request) {
          this.loginError = "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
        } else {
          this.loginError = "Une erreur inattendue s'est produite";
        }
      } finally {
        this.loading = false;
      }
    },

    async registerUser() {
      this.registerError = null;
      this.loading = true;

      try {
        // Validation des champs
        if (!this.email || !this.password || !this.confirmPassword || !this.nom || !this.prenom) {
          this.registerError = "Veuillez remplir tous les champs";
          return;
        }

        // Validation nom/prénom
        const regexNom = /^[A-Za-zÀ-ÖØ-öø-ÿ\- ]+$/;
        if (!regexNom.test(this.nom) || !regexNom.test(this.prenom)) {
          this.registerError = "Le nom et le prénom ne doivent contenir que des lettres";
          return;
        }

        // Validation email
        if (!this.email.includes("@") || !this.email.includes(".")) {
          this.registerError = "Adresse email invalide";
          return;
        }

        // Confirmation mot de passe
        if (this.password !== this.confirmPassword) {
          this.registerError = "Les mots de passe ne correspondent pas";
          return;
        }

        // Tentative d'inscription
        await this.createUtilisateur({
          nom: this.nom,
          prenom: this.prenom,
          mail: this.email,
          password: this.password,
          id_role: 1,
        });

        // Retour au formulaire de connexion après inscription réussie
        this.toggleRegister();
        this.loginError = "Inscription réussie ! Vous pouvez maintenant vous connecter";
      } catch (error) {
        console.error("Erreur d'inscription:", error);
        if (error.response) {
          if (error.response.status === 409) {
            this.registerError = "Cet email est déjà utilisé";
          } else {
            this.registerError = "Erreur lors de l'inscription (" + error.response.status + ")";
          }
        } else if (error.request) {
          this.registerError = "Impossible de se connecter au serveur";
        } else {
          this.registerError = "Erreur lors de l'inscription";
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>



<style scoped>


.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Container global pour centrer les éléments */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Prend toute la hauteur de la page */
  padding: 2rem;
  overflow: hidden;
}

/* Fond flou avec image */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  z-index: -1; /* Pour que l'image de fond soit derrière le contenu */
}

/* Formulaire d'authentification et d'inscription */
.login-form, .register-form {
  background-color: rgba(255, 255, 255, 0.8); /* Fond blanc semi-transparent */
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px; /* Largeur du formulaire */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Titre */
h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

/* Styles des groupes d'input */
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

/* Bouton */
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

/* Lien pour changer de formulaire (se connecter / s'inscrire) */
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

<template>
  <div class="user-profile-container">
    <confirm-dialogue ref="confirmDialog" />

    <div class="profile-header">
      <h1>Profil Utilisateur</h1>
      <div class="welcome-message">Bonjour {{ userCourant.prenom_utilisateur }} {{ userCourant.nom_utilisateur }} 👋</div>
    </div>

    <div class="formules-section" v-if="userFormules.length > 0">
      <h2 class="section-title">Mes Formules</h2>
      <div class="formules-grid">
        <div v-for="formule in userFormules" :key="formule.id_formule" class="formule-card">
          <div class="formule-header">
            <h3>{{ formule.nom_formule }}</h3>
            <div class="formule-prix">
              {{ formule.prix_formule }}€ / {{ formatUnite(formule.unite) }}
            </div>
          </div>

          <div class="formule-activites" v-if="formule.activites && formule.activites.length > 0">
            <h4>Activités incluses :</h4>
            <ul class="activites-list">
              <li v-for="activite in formule.activites" :key="activite.id_activite">
                <div class="activite-item">
                  <span class="activite-nom">{{ activite.nom_activite }}</span>
                  <span class="activite-type">{{ activite.type_activite }}</span>
                </div>
                <p class="activite-description" v-if="activite.description_activite">
                  {{ activite.description_activite }}
                </p>
              </li>
            </ul>
          </div>

          <div class="formule-actions">
            <button class="reserve-button" @click="pushToPlanning()">
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="no-formules" v-else>
      <p>Vous n'avez souscrit à aucun abonnement pour le moment.</p>
    </div>

    <div class="reservations-section" v-if="reservations.length > 0">
      <h2 class="section-title">Mes Réservations</h2>
      <!-- Liste des réservations ici -->
    </div>

    <button class="logout-button" @click="logout">
      <span class="button-icon">🚪</span>
      <span class="button-text">Se déconnecter</span>
    </button>
  </div>
</template>

<script setup>
import ConfirmDialogue from "@/components/Dialog/ConfirmDialog.vue";
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

// Références
const confirmDialog = ref(null);
const userFormules = ref([]);
const reservations = ref([]);

// Données utilisateur
const userCourant = store.state.user.userCourant;

// Formatage de l'unité
const formatUnite = (unite) => {
  const map = {
    'mois': 'mois',
    'séance': 'séance',
    'heure': 'heure'
  };
  return map[unite] || unite;
};

// Charger les formules et activités de l'utilisateur
const loadUserData = async () => {
  try {
    // Charger les formules de base
    await store.dispatch('user/getUserFormules', userCourant.id_utilisateur);
    userFormules.value = store.state.user.formulesUtilisateur || [];

    // Pour chaque formule, charger les activités associées
    //for (const formule of userFormules.value) {
      //const activites = await store.dispatch('user/getFormuleActivites', formule.id_formule);
      //formule.activites = activites || [];
    //}

    // Charger les réservations
    //reservations.value = await store.dispatch('user/getUserReservations', userCourant.id_utilisateur);
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  }
};

// Afficher le formulaire de réservation
const pushToPlanning = (formule) => {
  router.push({ name: 'planning'});
};

// Déconnexion
const logout = async () => {
  const ok = await confirmDialog.value?.show({
    title: 'Confirmer Déconnexion',
    message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    okButton: 'Confirmer',
  });

  if (ok) {
    await store.dispatch('user/logoutUser');
    await router.push('/');
  }
};

// Au montage du composant
onMounted(() => {
  loadUserData();
});
</script>

<style scoped>
.user-profile-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.welcome-message {
  font-size: 1.2rem;
  color: #42b983;
  font-weight: 500;
}

.section-title {
  color: #2c3e50;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.formules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.formule-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.formule-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.formule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.formule-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.formule-prix {
  font-weight: 600;
  color: #42b983;
  background: #f0f7f4;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.formule-activites {
  margin: 1rem 0;
  flex-grow: 1;
}

.formule-activites h4 {
  margin: 0 0 0.5rem 0;
  color: #4b5563;
  font-size: 1rem;
}

.activites-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activites-list li {
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px dashed #e5e7eb;
}

.activites-list li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.activite-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}

.activite-nom {
  font-weight: 500;
  color: #2c3e50;
}

.activite-type {
  font-size: 0.8rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.activite-description {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0.3rem 0 0 0;
}

.formule-actions {
  margin-top: auto;
  padding-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.reserve-button {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.reserve-button:hover {
  background: #3aa876;
}

.no-formules {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.browse-formules-link {
  display: inline-block;
  margin-top: 1rem;
  color: #42b983;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.browse-formules-link:hover {
  color: #3aa876;
  text-decoration: underline;
}

.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #dc3545;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.logout-button:hover {
  background: #f1f3f5;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-icon {
  font-size: 1.2rem;
}

.button-text {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .user-profile-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .formules-grid {
    grid-template-columns: 1fr;
  }
}
</style>
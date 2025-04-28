<template>
  <div class="admin-dashboard">
    <confirm-dialogue ref="confirmDialog"></confirm-dialogue>

    <header class="dashboard-header">
      <div class="user-info">
        <h1>Tableau de bord Administrateur</h1>
        <div class="welcome-message">
          <span>Bonjour, {{ userCourant.prenom }}</span>
          <button class="logout-btn" @click="logout">
            <i class="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </div>
    </header>

    <div class="dashboard-content">
      <nav class="sidebar">
        <ul>
          <li
              :class="{ active: activeTab === 'dashboard' }"
              @click="setActiveTab('dashboard')"
          >
            <i class="fas fa-tachometer-alt"></i> Tableau de bord
          </li>
          <li
              :class="{ active: activeTab === 'activity' }"
              @click="setActiveTab('activity')"
          >
            <i class="fas fa-users"></i> Activité
          </li>
          <li
              :class="{ active: activeTab === 'utilisateur' }"
              @click="setActiveTab('utilisateur')"
          >
            <i class="fas fa-users"></i> Utilisateur
          </li>
          <li
              :class="{ active: activeTab === 'creneau' }"
              @click="setActiveTab('creneau')"
          >
            <i class="fas fa-file-alt"></i> Créneau
          </li>
        </ul>
      </nav>

      <main class="main-content">
        <!-- Contenu dynamique en fonction de l'onglet sélectionné -->
        <DashboardView v-if="activeTab === 'dashboard'" />
        <ActivityView v-if="activeTab === 'activity'" />
        <CreneauView v-if="activeTab === 'creneau'" />
        <UserView v-if="activeTab === 'utilisateur'"/>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ConfirmDialogue from "@/components/Dialog/ConfirmDialog.vue";
import DashboardView from '@/components/Admin/DashboardView.vue';
import ActivityView from '@/components/Admin/ActivityView.vue';
import CreneauView from '@/components/Admin/CreneauView.vue';
import UserView from "@/components/Admin/UserView.vue";

const store = useStore();
const router = useRouter();
const confirmDialog = ref(null);
const activeTab = ref('dashboard'); // Onglet actif par défaut

const userCourant = store.state.user.userCourant;

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.admin-dashboard {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #333;
}

.dashboard-header {
  background: #000000;
  color: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-info h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.welcome-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.welcome-message span {
  font-size: 1rem;
  opacity: 0.9;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dashboard-content {
  display: flex;
  min-height: calc(100vh - 80px);
}

.sidebar {
  width: 250px;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
}

.sidebar li:hover {
  background: #f0f2f5;
  color: #6e8efb;
}

.sidebar li.active {
  background: #f0f2f5;
  color: #6e8efb;
  border-left: 3px solid #6e8efb;
}

.main-content {
  flex: 1;
  padding: 2rem;
}




.recent-activity h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}




@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }


}


</style>
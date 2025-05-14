<template>
  <div class="formule-management-container">
    <div class="header-section">
      <button class="back-button" @click="$router.push('/profil')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        Retour au profil
      </button>
      <h1>Gestion des formules</h1>
      <p class="subtitle">Sélectionnez les formules pour cet utilisateur</p>
    </div>

    <div class="content-section">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des formules...</p>
      </div>

      <template v-else>
        <div v-if="allFormules.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ccc" viewBox="0 0 16 16">
            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          </svg>
          <h3>Aucune formule disponible</h3>
          <p>Créez des formules avant de pouvoir les attribuer</p>
        </div>

        <div v-else class="formule-grid">
          <div
              v-for="formule in allFormules"
              :key="formule.id_formule"
              class="formule-card"
              :class="{ 'active': isFormuleSelected(formule.id_formule) }"
              @click="toggleFormule(formule.id_formule)"
          >
            <div class="card-header">
              <h3>{{ formule.nom_formule }}</h3>
              <span class="price-tag">{{ formule.prix_formule }}€</span>
            </div>
            <p class="card-detail">{{ formule.unite }}</p>
            <div class="card-footer">
              <div class="selected-indicator">
                <svg v-if="isFormuleSelected(formule.id_formule)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#42b983" viewBox="0 0 16 16">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                </svg>
              </div>
              <span class="status-badge" :class="{ 'active': isFormuleSelected(formule.id_formule) }">
                {{ isFormuleSelected(formule.id_formule) ? 'Sélectionnée' : 'Non sélectionnée' }}
              </span>
            </div>
          </div>
        </div>

        <button
            class="validate-btn"
            :class="{ 'disabled': !hasChanges }"
            :disabled="!hasChanges"
            @click="validateSelection"
        >
          <span v-if="!saving">Enregistrer les modifications</span>
          <span v-else class="btn-spinner"></span>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ManageUserFormules',

  data() {
    return {
      loading: true,
      saving: false,
      userId: null,
      selectedFormuleIds: []
    };
  },

  computed: {
    ...mapState('formule', ['formules']),
    ...mapState('user', ['formulesUtilisateur']),

    allFormules() {
      return this.formules;
    },

    hasChanges() {
      const currentIds = this.formulesUtilisateur.map(f => f.id_formule);
      return JSON.stringify(currentIds.sort()) !== JSON.stringify(this.selectedFormuleIds.sort());
    }
  },

  async created() {
    this.userId = this.$route.params.id;
    await Promise.all([
      this.loadAllFormules(),
      this.loadUserFormules()
    ]);
    this.loading = false;
  },

  methods: {
    ...mapActions('formule', ['getAllFormule']),
    ...mapActions('user', ['updateUserFormule', 'getUserFormules']),

    async loadAllFormules() {
      try {
        await this.getAllFormule();
      } catch (error) {
        console.error('Erreur lors du chargement des formules:', error);
      }
    },

    async loadUserFormules() {
      try {
        await this.getUserFormules(this.userId);
        this.selectedFormuleIds = this.formulesUtilisateur.map(f => f.id_formule);
      } catch (error) {
        console.error('Erreur lors du chargement des formules de l\'utilisateur:', error);
      }
    },

    isFormuleSelected(formuleId) {
      return this.selectedFormuleIds.includes(formuleId);
    },

    toggleFormule(formuleId) {
      if (this.selectedFormuleIds.includes(formuleId)) {
        this.selectedFormuleIds = this.selectedFormuleIds.filter(id => id !== formuleId);
      } else {
        this.selectedFormuleIds.push(formuleId);
      }
    },

    async validateSelection() {
      if (!this.userId || !this.hasChanges) return;

      this.saving = true;
      try {
        await this.updateUserFormule({
          id_utilisateur: this.userId,
          formules: this.selectedFormuleIds
        });
        this.$router.go(-1);
      } catch (error) {
        console.error('Erreur lors de la mise à jour des formules:', error);
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.formule-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header-section {
  margin-bottom: 2.5rem;
  text-align: center;
}

.header-section h1 {
  color: #2c3e50;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
}

.back-button:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.back-button svg {
  margin-right: 0.5rem;
}

.content-section {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.loading-state p {
  margin-top: 1rem;
  color: #6c757d;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.empty-state svg {
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #495057;
  margin-bottom: 0.5rem;
}

.formule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.formule-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.formule-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.formule-card.active {
  border-color: #42b983;
  background-color: rgba(66, 185, 131, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.price-tag {
  background-color: #42b983;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.card-detail {
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.selected-indicator {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-badge {
  font-size: 0.85rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background-color: #f8f9fa;
  color: #6c757d;
}

.status-badge.active {
  background-color: #e6f7ee;
  color: #42b983;
}

.validate-btn {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 2rem auto 0;
  padding: 0.8rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.validate-btn:hover:not(:disabled) {
  background-color: #3aa876;
  transform: translateY(-1px);
}

.validate-btn:disabled {
  background-color: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
}

.btn-spinner {
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .formule-management-container {
    padding: 1rem;
  }

  .formule-grid {
    grid-template-columns: 1fr;
  }

  .header-section h1 {
    font-size: 1.8rem;
  }
}
</style>
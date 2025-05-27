<template>
  <div class="admin-activites-page">
    <h1>Gestion des Activités</h1>

    <div class="header-actions">
      <div class="search-container">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher par nom, type ou description..."
            class="search-input"
        />
        <button @click="resetSearch" class="btn-reset">Réinitialiser</button>
      </div>

      <div class="filter-container">
        <label for="type-filter" class="filter-label">Filtrer par type:</label>
        <select v-model="typeFilter" id="type-filter" class="filter-select">
          <option value="">Tous les types</option>
          <option value="Personnel">Personnel</option>
          <option value="En groupe">En groupe</option>
        </select>
      </div>

      <div class="filter-container">
        <label for="rdv-filter" class="filter-label">Filtrer par RDV:</label>
        <select v-model="rdvFilter" id="rdv-filter" class="filter-select">
          <option value="">Tous</option>
          <option value="true">Sur rendez-vous</option>
          <option value="false">Sans rendez-vous</option>
        </select>
      </div>

      <button @click="createActivite" class="btn-create">
        <i class="fas fa-plus"></i> Créer une activité
      </button>
    </div>

    <div v-if="loading" class="loading">
      Chargement des activités...
    </div>

    <div v-else-if="filteredActivites.length === 0" class="no-results">
      Aucune activité trouvée
    </div>

    <div v-else>
      <div class="activites-table-container">
        <table class="activites-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Type</th>
            <th>Rendez-vous</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="activite in filteredActivites"
              :key="activite.id_activite"
          >
            <td>{{ activite.id_activite }}</td>
            <td class="image-cell">
              <img
                  v-if="activite.image_activite"
                  :src="getActivityImage(activite.image_activite)"
                  :alt="activite.nom_activite"
                  class="activite-image"
              >
              <span v-else class="no-image">Aucune image</span>
            </td>
            <td>{{ activite.nom_activite }}</td>
            <td>{{ truncateDescription(activite.description_activite) }}</td>
            <td>{{ activite.type_activite }}</td>
            <td>
              <span v-if="activite.sur_rendezvous" class="rdv-badge rdv-yes">Oui</span>
              <span v-else class="rdv-badge rdv-no">Non</span>
            </td>
            <td class="actions">
              <button @click="editActivite(activite)" class="btn-edit">
                <i class="fas fa-edit"></i> Modifier
              </button>
              <button @click="confirmDelete(activite)" class="btn-delete">
                <i class="fas fa-trash"></i> Supprimer
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer l'activité "{{ activiteToDelete?.nom_activite }}" ?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-cancel">Annuler</button>
          <button @click="deleteActivite" class="btn-confirm">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";


export default {
  name: 'AdminActivitesPage',
  data() {
    return {
      loading: true,
      showDeleteModal: false,
      activiteToDelete: null,
      searchQuery: '',
      typeFilter: '',
      rdvFilter: '',
      activites: []
    };
  },
  computed: {
    ...mapState('activite', {
      storeActivites: state => state.activites
    }),

    filteredActivites() {
      if (!this.activites) return [];
      const search = this.searchQuery.toLowerCase();

      return this.activites.filter(activite => {
        const matchesSearch = !this.searchQuery ||
            (activite.nom_activite && activite.nom_activite.toLowerCase().includes(search)) ||
            (activite.description_activite && activite.description_activite.toLowerCase().includes(search)) ||
            (activite.type_activite && activite.type_activite.toLowerCase().includes(search)) ||
            (activite.id_activite && activite.id_activite.toString().includes(this.searchQuery));

        const matchesType = !this.typeFilter || activite.type_activite === this.typeFilter;

        let matchesRdv = true;
        if (this.rdvFilter !== '') {
          matchesRdv = this.rdvFilter === 'true'
              ? activite.sur_rendezvous === true
              : activite.sur_rendezvous === false;
        }

        return matchesSearch && matchesType && matchesRdv;
      })
          .sort((a, b) => a.id_activite - b.id_activite); // Add this line to sort by ID
    }
  },
  async created() {
    await this.loadActivites();
    this.loading = false;
  },
  methods: {
    ...mapActions('activite', ['getAllActivite', 'deleteActivite']),

    async loadActivites() {
      try {
        await this.getAllActivite();
        this.activites = this.storeActivites || [];
      } catch (error) {
        console.error("Erreur lors du chargement des activités:", error);
        this.activites = [];
      }
    },

    getActivityImage(imagePath) {
      if (!imagePath) return `${baseUrl}/uploads/notfound.jpg`;
      return `${baseUrl}/uploads/${imagePath}`;
    },

    truncateDescription(desc) {
      if (!desc) return '';
      return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc;
    },

    resetSearch() {
      this.searchQuery = '';
      this.typeFilter = '';
      this.rdvFilter = '';
    },

    createActivite() {
      this.$router.push({name: 'addActivite'});
    },

    editActivite(activite) {
      this.$router.push({name: 'editActivite', params: {id: activite.id_activite}});
    },

    confirmDelete(activite) {
      this.activiteToDelete = activite;
      this.showDeleteModal = true;
    },

    cancelDelete() {
      this.showDeleteModal = false;
      this.activiteToDelete = null;
    },

    async deleteActivite() {
      if (!this.activiteToDelete) return;
      try {
        await this.$store.dispatch('activite/deleteActivite', this.activiteToDelete.id_activite);
        await this.loadActivites();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      } finally {
        this.showDeleteModal = false;
        this.activiteToDelete = null;
      }
    }
  }
};
</script>

<style scoped>
.admin-activites-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.search-container {
  display: flex;
  gap: 10px;
  flex: 1;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  flex: 1;
}

.btn-reset {
  padding: 10px 15px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-reset:hover {
  background-color: #7f8c8d;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-weight: bold;
  color: #34495e;
}

.filter-select {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.btn-create {
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-create:hover {
  background-color: #27ae60;
}

.activites-table-container {
  overflow-x: auto;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.activites-table {
  width: 100%;
  border-collapse: collapse;
}

.activites-table th, .activites-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.activites-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #2c3e50;
  position: sticky;
  top: 0;
}

.activites-table tr:hover {
  background-color: #f9f9f9;
}

.image-cell {
  width: 120px;
}

.activite-image {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
}

.no-image {
  color: #95a5a6;
  font-style: italic;
  font-size: 0.9em;
}

.actions {
  display: flex;
  gap: 8px;
  min-width: 180px;
}

.btn-edit, .btn-delete {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.loading, .no-results {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-size: 1.1em;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel, .btn-confirm {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background-color: #7f8c8d;
}

.btn-confirm {
  background-color: #e74c3c;
  color: white;
}

.btn-confirm:hover {
  background-color: #c0392b;
}

/* Responsive design */
@media (max-width: 992px) {
  .activites-table td, .activites-table th {
    padding: 8px 10px;
  }

  .btn-edit, .btn-delete {
    padding: 6px 8px;
    font-size: 0.8em;
  }
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
  }

  .search-container {
    width: 100%;
    margin-bottom: 15px;
  }

  .filter-container {
    width: 100%;
    margin-bottom: 10px;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .activite-image {
    width: 60px;
    height: 40px;
  }

  .actions {
    flex-direction: column;
    gap: 5px;
    min-width: auto;
  }

  .btn-edit, .btn-delete {
    width: 100%;
    justify-content: center;
  }
}
</style>
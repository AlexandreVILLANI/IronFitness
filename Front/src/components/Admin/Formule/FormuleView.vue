<template>
  <div class="admin-formules-page">
    <h1>Gestion des Formules</h1>

    <div class="header-actions">
      <div class="search-container">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher par nom de formule..."
            class="search-input"
        />
        <button @click="resetSearch" class="btn-reset">Réinitialiser</button>
      </div>

      <button @click="createFormule" class="btn-create">
        <i class="fas fa-plus"></i> Créer une formule
      </button>
    </div>

    <div v-if="loading" class="loading">
      Chargement des formules...
    </div>

    <div v-else>
      <div class="formules-table-container">
        <table class="formules-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prix</th>
            <th>Unité</th>
            <th>Activités incluses</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="formule in filteredFormules"
              :key="formule.id_formule"
          >
            <td>{{ formule.id_formule }}</td>
            <td>{{ formule.nom_formule }}</td>
            <td>{{ formule.prix_formule }} €</td>
            <td>{{ formule.unite }}</td>
            <td>{{ formule.activites_liees }}</td>
            <td class="actions">
              <button @click="editFormule(formule)" class="btn-edit">Modifier</button>
              <button @click="confirmDelete(formule)" class="btn-delete">Supprimer</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer la formule "{{ formuleToDelete.nom_formule }}" ?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-cancel">Annuler</button>
          <button @click="deleteFormule" class="btn-confirm">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AdminFormulesPage',
  data() {
    return {
      loading: true,
      showDeleteModal: false,
      formuleToDelete: null,
      searchQuery: ''
    };
  },
  computed: {
    ...mapGetters('formule', ['formules']),

    filteredFormules() {
      return this.formules.filter(formule => {
        return !this.searchQuery ||
            formule.nom_formule.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            formule.activites_liees.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            formule.id_formule.toString().includes(this.searchQuery);
      });
    }
  },
  async created() {
    await this.loadFormules();
    this.loading = false;
  },
  methods: {
    ...mapActions('formule', ['getAllFormule', 'deleteFormule']), // Ajoutez deleteFormule ici

    async loadFormules() {
      try {
        await this.getAllFormule();
      } catch (error) {
        console.error("Erreur lors du chargement des formules:", error);
      }
    },

    resetSearch() {
      this.searchQuery = '';
    },

    createFormule() {
      this.$router.push({ name: 'createFormule' });
    },

    editFormule(formule) {
      this.$router.push({name: 'editFormule', params: { id: formule.id_formule }});
    },

    confirmDelete(formule) {
      this.formuleToDelete = formule;
      this.showDeleteModal = true;
    },

    cancelDelete() {
      this.showDeleteModal = false;
      this.formuleToDelete = null;
    },

    async deleteFormule() {
      try {
        if (this.formuleToDelete) {
          await this.$store.dispatch('formule/deleteFormule', this.formuleToDelete.id_formule);
          await this.loadFormules();
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        console.error(`Erreur lors de la suppression: ${error.message || 'Une erreur est survenue'}`);
      } finally {
        this.showDeleteModal = false;
        this.formuleToDelete = null;
      }
    }
  }
};
</script>

<style scoped>
.admin-formules-page {
  padding: 20px;
  max-width: 1200px;
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

.formules-table-container {
  overflow-x: auto;
}

.formules-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.formules-table th, .formules-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.formules-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #2c3e50;
}

.formules-table tr:hover {
  background-color: #f9f9f9;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
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

.loading {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
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

/* Responsive design pour petits écrans */
@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    margin-bottom: 15px;
  }

  .btn-create {
    justify-content: center;
    width: 100%;
  }
}
</style>
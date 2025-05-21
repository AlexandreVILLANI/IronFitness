<template>
  <div class="admin-users-page">
    <h1>Gestion des Utilisateurs</h1>

    <div class="search-container">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher par nom ou prénom..."
          class="search-input"
      />
      <select v-model="formuleFilter" class="filter-select">
        <option value="">Utilisateurs avec ou sans formules</option>
        <option value="no-formule">Pas de formule</option>
        <option v-for="formule in uniqueformules" :key="formule" :value="formule">{{ formule }}</option>
      </select>
      <button @click="resetSearch" class="btn-reset">Réinitialiser</button>
    </div>

    <div v-if="loading" class="loading">
      Chargement des utilisateurs...
    </div>

    <div v-else>
      <div class="users-table-container">
        <table class="users-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Formules</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="user in filteredUsers"
              :key="user.id_utilisateur"
              :class="{'no-formule': !user.noms_formules}"
          >
            <td>{{ user.id_utilisateur }}</td>
            <td>{{ user.nom_utilisateur }}</td>
            <td>{{ user.prenom_utilisateur }}</td>
            <td>{{ user.adresse_mail }}</td>
            <td>
              <span v-if="!user.noms_formules" class="no-formule-text">Pas de formules</span>
              <span v-else>{{ user.noms_formules }}</span>
            </td>
            <td class="actions">
              <button @click="addFormule(user)" class="btn-edit">Attribution des formules</button>
              <button @click="editUser(user)" class="btn-edit">Modifier</button>
              <button @click="confirmDelete(user)" class="btn-delete">Supprimer</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer l'utilisateur {{ userToDelete.nom_utilisateur }} {{ userToDelete.prenom_utilisateur }} ?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-cancel">Annuler</button>
          <button @click="deleteUser" class="btn-confirm">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AdminUsersPage',
  data() {
    return {
      loading: true,
      showDeleteModal: false,
      userToDelete: null,
      searchQuery: '',
      formuleFilter: '' // Ajout du filtre de formule
    };
  },
  computed: {
    ...mapState('user', ['users']),

    uniqueformules() {
      const formules = new Set();
      this.users.forEach(user => {
        if (user.noms_formules) {
          user.noms_formules.split(', ').forEach(formule => formules.add(formule));
        }
      });
      return Array.from(formules).sort();
    },

    filteredUsers() {
      return this.users.filter(user => {
        const searchMatch =
            !this.searchQuery ||
            user.nom_utilisateur.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            user.prenom_utilisateur.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            user.adresse_mail.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            user.id_utilisateur.toString().includes(this.searchQuery);

        const formuleMatch =
            !this.formuleFilter ||
            (this.formuleFilter === 'no-formule' && !user.noms_formules) ||
            (user.noms_formules && user.noms_formules.includes(this.formuleFilter));

        return searchMatch && formuleMatch;
      })    .sort((a, b) => a.id_utilisateur - b.id_utilisateur); // Add this line to sort by ID

    }
  },
  async created() {
    await this.loadUsers();
    this.loading = false;
  },
  methods: {
    ...mapActions('user', ['getAllUsers', 'deleteUtilisateur']),

    async loadUsers() {
      try {
        await this.getAllUsers();
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      }
    },

    resetSearch() {
      this.searchQuery = '';
      this.formuleFilter = ''; // Réinitialiser également le filtre de formule
    },

    addFormule(user) {
      this.$router.push({ name: 'addFormule', params: { id: user.id_utilisateur } });
    },

    editUser(user) {
      this.$router.push({ name: 'editUser', params: { id: user.id_utilisateur } });
    },

    confirmDelete(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },

    cancelDelete() {
      this.showDeleteModal = false;
      this.userToDelete = null;
    },

    async deleteUser() {
      try {
        await this.deleteUtilisateur(this.userToDelete.id_utilisateur);
        this.showDeleteModal = false;
        this.userToDelete = null;
        await this.loadUsers();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  }
};
</script>

<style scoped>

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center; /* Aligner verticalement les éléments de recherche */
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}
</style>

<style scoped>
.admin-users-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
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

.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.users-table th, .users-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.users-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #2c3e50;
}

.users-table tr:hover {
  background-color: #f9f9f9;
}

.users-table tr.no-formule {
  background-color: #ffebee;
}

.users-table tr.no-formule:hover {
  background-color: #ffcdd2;
}

.no-formule-text {
  color: #e53935;
  font-weight: 500;
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
</style>
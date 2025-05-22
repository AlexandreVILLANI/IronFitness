<template>
  <div class="admin-boutique-page">
    <h1>Gestion de la Boutique</h1>

    <div class="action-bar">
      <router-link to="/profil/addGoodies" class="btn-add">
        Ajouter un nouveau goodie
      </router-link>
    </div>

    <div class="search-container">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher par nom..."
          class="search-input"
      />
      <button @click="resetSearch" class="btn-reset">Réinitialiser</button>
    </div>

    <div v-if="loading" class="loading">
      Chargement des goodies...
    </div>

    <div v-else>
      <div class="goodies-table-container">
        <table class="goodies-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Image</th>
            <th>Prix</th>
            <th>Tailles/Stock</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="goodie in filteredGoodies"
              :key="goodie.id_goodies"
          >
            <td>{{ goodie.id_goodies }}</td>
            <td>{{ goodie.nom_goodies }}</td>
            <td>
              <img
                  :src="getGoodieImage(goodie.image_goodies)"
                  :alt="goodie.nom_goodies"
                  class="product-image"
                  loading="lazy"
              />
            </td>
            <td>{{ goodie.prix_goodies }} €</td>
            <td>
              <div v-if="goodie.tailles && goodie.tailles.length > 0">
                <div v-for="taille in goodie.tailles" :key="taille.id_taille" class="taille-item">
                  <span class="taille-value">{{ taille.valeur_taille }}:</span>
                  <span class="stock-value" v-if="taille.quantite_stock==='t'">En stock</span>
                  <span class="stock-value2" v-else>Plus de stock</span>
                </div>
              </div>
              <span v-else class="no-tailles">Aucune taille disponible</span>
            </td>
            <td class="actions">
              <button @click="editGoodie(goodie)" class="btn-edit">Modifier</button>
              <button @click="confirmDelete(goodie)" class="btn-delete">Supprimer</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer le goodie "{{ goodieToDelete.nom_goodies }}" ?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-cancel">Annuler</button>
          <button @click="deleteGoodie" class="btn-confirm">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

// État réactif
const loading = ref(true);
const showDeleteModal = ref(false);
const goodieToDelete = ref(null);
const searchQuery = ref('');

// Gestion des images
const images = import.meta.glob('@/assets/Boutique/*.{jpg,png,webp}', { eager: true, import: 'default' });
const notFoundImage = new URL('@/assets/notfound.jpg', import.meta.url).href;

// Computed properties
const goodies = computed(() => store.state.boutique.goodies);

const filteredGoodies = computed(() => {
  return goodies.value.filter(goodie => {
    const searchMatch =
        !searchQuery.value ||
        goodie.nom_goodies.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        goodie.id_goodies.toString().includes(searchQuery.value);
    return searchMatch;
  }).sort((a, b) => a.id_goodies - b.id_goodies);
});

// Méthodes
const getGoodieImage = (nom_image) => {
  if (!nom_image) return notFoundImage;
  const fileName = nom_image.toLowerCase().replace(/\s+/g, "_");
  const extensions = ['.jpg', '.png', '.webp'];

  for (const ext of extensions) {
    const imagePath = `/src/assets/Boutique/${fileName}${ext}`;
    if (images[imagePath]) {
      return images[imagePath];
    }
  }

  return notFoundImage;
};

const loadGoodies = async () => {
  try {
    await store.dispatch('boutique/getAllGoodies');
  } catch (error) {
    console.error("Erreur lors du chargement des goodies:", error);
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  searchQuery.value = '';
};

const editGoodie = (goodie) => {
  router.push({ name: 'editGoodies', params: { id: goodie.id_goodies } });
};

const confirmDelete = (goodie) => {
  goodieToDelete.value = goodie;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  goodieToDelete.value = null;
};

const deleteGoodie = async () => {
  try {
    await store.dispatch('boutique/deleteGoodies', goodieToDelete.value.id_goodies);
    showDeleteModal.value = false;
    goodieToDelete.value = null;
    await loadGoodies();
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  }
};

// Cycle de vie
onMounted(async () => {
  await loadGoodies();
});
</script>

<style scoped>
.product-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 4px;
}
.admin-boutique-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.action-bar {
  margin-bottom: 20px;
}

.btn-add {
  display: inline-block;
  padding: 10px 15px;
  background-color: #2ecc71;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-add:hover {
  background-color: #27ae60;
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

.goodies-table-container {
  overflow-x: auto;
}

.goodies-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.goodies-table th, .goodies-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.goodies-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #2c3e50;
}

.goodies-table tr:hover {
  background-color: #f9f9f9;
}

.goodie-image {
  max-width: 100px;
  max-height: 100px;
  border-radius: 4px;
}

.taille-item {
  margin-bottom: 5px;
}

.taille-value {
  font-weight: bold;
  margin-right: 5px;
}

.stock-value {
  color: #3498db;
}

.stock-value2 {
  color: #db3434;
}

.no-tailles {
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
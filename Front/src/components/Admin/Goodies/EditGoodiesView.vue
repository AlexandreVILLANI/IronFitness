<template>
  <div class="edit-goodies-container">
    <h1>Modifier le Goodie</h1>

    <form @submit.prevent="submitForm" class="goodies-form">
      <div class="form-group">
        <label for="nom">Nom du goodie:</label>
        <input
            id="nom"
            v-model="goodie.nom_goodies"
            type="text"
            required
            class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="prix">Prix (€):</label>
        <input
            id="prix"
            v-model.number="goodie.prix_goodies"
            type="number"
            step="0.01"
            min="0"
            required
            class="form-control"
        >
      </div>

      <div class="form-group">
        <label>Image URL:</label>
        <input
            v-model="goodie.image_goodies"
            type="text"
            class="form-control"
        >
        <img
            v-if="goodie.image_goodies"
            :src="goodie.image_goodies"
            alt="Preview"
            class="image-preview"
        >
      </div>

      <div class="form-group">
        <h3>Disponibilité par taille:</h3>
        <div
            v-for="taille in goodie.tailles"
            :key="taille.id_taille"
            class="taille-item"
        >
          <label>
            <input
                type="checkbox"
                v-model="taille.quantite_stock"
                :true-value="true"
                :false-value="false"
            >
            {{ taille.valeur_taille }} (Disponible)
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <button type="button" @click="cancel" class="btn btn-secondary">Annuler</button>
      </div>
    </form>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal">
        <h3>Goodie mis à jour avec succès !</h3>
        <button @click="redirectToProfil" class="btn btn-primary">OK</button>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'EditGoodies',
  data() {
    return {
      goodie: {
        id_goodies: null,
        nom_goodies: '',
        image_goodies: '',
        prix_goodies: 0,
        tailles: []
      },
      showSuccessModal: false

    };
  },
  computed: {
    ...mapGetters('boutique', ['currentGoodie'])
  },

  async created() {
    const goodieId = this.$route.params.id;
    if (goodieId) {
      try {
        await this.getGoodieById(goodieId);

        if (this.currentGoodie) {
          this.goodie = JSON.parse(JSON.stringify(this.currentGoodie));
          // Conversion des "t"/"f" en booléens
          this.goodie.tailles = this.goodie.tailles.map(taille => ({
            ...taille,
            quantite_stock: taille.quantite_stock === 't' || taille.quantite_stock === true
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement du goodie:', error);
        this.$router.push({ name: 'goodiesList' });
      }
    }
  },
  methods: {
    ...mapActions('boutique', ['getGoodieById', 'updateGoodies']),

    async submitForm() {
      try {
        // Préparer les données pour l'update
        const goodieToUpdate = {
          id_goodies: this.goodie.id_goodies,
          nom_goodies: this.goodie.nom_goodies,
          image_goodies: this.goodie.image_goodies,
          prix_goodies: this.goodie.prix_goodies,
          tailles: this.goodie.tailles.map(taille => ({
            id_taille: taille.id_taille,
            disponible: taille.quantite_stock // On envoie directement le booléen
          }))
        };
        await this.updateGoodies(goodieToUpdate);
        this.showSuccessModal = true; // Affiche la modal

      } catch (error) {

      }
    },

    cancel() {
      this.$router.go(-1);
    },
    redirectToProfil() {
      this.$router.push('/profil');
    }
  }
};
</script>

<style scoped>

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

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal h3 {
  margin-bottom: 1.5rem;
  color: #42b983;
}

.modal .btn {
  margin-top: 1rem;
}
.edit-goodies-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.goodies-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.image-preview {
  max-width: 200px;
  max-height: 200px;
  margin-top: 10px;
  display: block;
}

.taille-item {
  margin: 10px 0;
  padding: 10px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
}

.taille-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.taille-item input[type="checkbox"] {
  margin-right: 10px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}
</style>
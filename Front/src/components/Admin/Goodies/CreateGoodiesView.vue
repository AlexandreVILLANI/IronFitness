<template>
  <div class="create-goodie-page">
    <div class="form-container">
      <h1 class="page-title">Créer un nouveau goodie</h1>

      <form @submit.prevent="submitGoodie" class="goodie-form">
        <div class="form-group">
          <label class="form-label">Nom du goodie</label>
          <input
              v-model="form.nom_goodies"
              type="text"
              class="form-input"
              required
              placeholder="Ex: T-shirt collector"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Nom de l'image</label>
          <input
              v-model="form.image_goodies"
              type="text"
              class="form-input"
              required
              placeholder="Ex: t-shirt-bleu.png"
          />
          <small class="form-hint">Format recommandé : nom-descriptif.png</small>
        </div>

        <div class="form-group">
          <label class="form-label">Prix (€)</label>
          <input
              v-model.number="form.prix_goodies"
              type="number"
              step="0.01"
              min="0"
              class="form-input"
              required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Tailles en stock</label>
          <div class="sizes-container">
            <div
                v-for="taille in tailles"
                :key="taille.id_taille"
                class="size-option"
            >
              <input
                  type="checkbox"
                  :id="`taille-${taille.id_taille}`"
                  v-model="taille.disponible"
                  class="size-checkbox"
              />
              <label
                  :for="`taille-${taille.id_taille}`"
                  class="size-label"
                  :class="{ 'selected': taille.disponible }"
              >
                {{ taille.valeur_taille }}
              </label>
            </div>
          </div>
        </div>

        <button type="submit" class="submit-btn">
          Créer le goodie
        </button>
      </form>
    </div>

    <!-- Modale de succès -->
    <transition name="modal">
      <div
          v-if="showSuccessModal"
          class="modal-overlay"
          @click.self="redirectToProfile"
      >
        <div class="modal-content">
          <div class="modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="modal-title">Goodie enregistré !</h2>
          <p class="modal-text">Votre nouveau goodie a été créé avec succès.</p>
          <button
              @click="redirectToProfile"
              class="modal-btn"
          >
            OK
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'CreateGoodieView',
  data() {
    return {
      form: {
        nom_goodies: '',
        image_goodies: '',
        prix_goodies: 0,
        tailles: [] // This will be populated by fetchTailles
      },
      tailles: [], // This holds the full list of sizes with their 'disponible' status
      showSuccessModal: false,
    };
  },
  methods: {
    ...mapActions('boutique', ['createGoodies']),

    async submitGoodie() {
      // Map ALL sizes, including their current 'disponible' status (true or false)
      const allTaillesWithStatus = this.tailles.map(t => ({
        id_taille: t.id_taille,
        disponible: t.disponible, // Send true or false for each size
      }));

      const payload = {
        ...this.form,
        tailles: allTaillesWithStatus // Attach the mapped sizes to the payload
      };

      try {
        await this.createGoodies(payload);
        this.showSuccessModal = true;
        this.resetForm();
      } catch (err) {
        console.error("Erreur création goodie:", err);
        alert("Erreur lors de la création du goodie.");
      }
    },

    redirectToProfile() {
      this.$router.push("/profil");
    },

    resetForm() {
      this.form = {
        nom_goodies: '',
        image_goodies: '',
        prix_goodies: 0,
        tailles: []
      };
      // Reset the 'disponible' status for all fetched sizes
      this.tailles.forEach(t => (t.disponible = false));
    },

    async fetchTailles() {
      // In a real application, you would fetch this from an API:
      // const response = await axios.get('/api/tailles');
      // this.tailles = response.data.map(t => ({ ...t, disponible: false }));

      // Static example for demonstration:
      this.tailles = [
        {id_taille: 1, valeur_taille: 'XXXS', disponible: false},
        {id_taille: 2, valeur_taille: 'XXS', disponible: false},
        {id_taille: 3, valeur_taille: 'XS', disponible: false},
        {id_taille: 4, valeur_taille: 'S', disponible: false},
        {id_taille: 5, valeur_taille: 'M', disponible: false},
        {id_taille: 6, valeur_taille: 'L', disponible: false},
        {id_taille: 7, valeur_taille: 'XL', disponible: false},
      ];
    }
  },
  mounted() {
    this.fetchTailles();
  }
};
</script>

<style scoped>
/* Variables */
:root {
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --success: #10b981;
  --text-dark: #1f2937; /* New variable for dark text */
  --text-light: #6b7280;
  --border: #e5e7eb;
  --radius: 0.5rem;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Structure */
.create-goodie-page {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.form-container {
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  width: 100%;
  max-width: 640px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-dark); /* Using the new dark text variable */
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Formulaire */
.goodie-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--text-dark); /* Using the new dark text variable */
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 1rem;
  transition: all 0.2s;
  color: var(--text-dark); /* Ensure input text is dark */
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-hint {
  color: var(--text-light);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Tailles */
.sizes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.size-option {
  position: relative;
}

.size-checkbox {
  position: absolute;
  opacity: 0;
}

.size-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  color: var(--text-dark); /* Default text color for size labels */
}

.size-label:hover {
  border-color: var(--primary);
}

.size-checkbox:checked + .size-label,
.size-label.selected {
  background-color: var(--primary);
  color: #1caf17; /* Ensure text is white when selected */
  border-color: var(--primary);
}

/* Bouton */
.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: #69f10f;
  font-weight: 500;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  width: 100%;
}

.submit-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: white;
  border-radius: var(--radius);
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: var(--shadow-md);
  animation: modalFadeIn 0.3s ease-out;
}

.modal-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background-color: #d1fae5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon svg {
  width: 30px;
  height: 30px;
  color: var(--success);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-dark); /* Ensure modal title is dark */
  margin-bottom: 0.5rem;
}

.modal-text {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--success);
  color: #66ff00;
  font-weight: 500;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.modal-btn:hover {
  background-color: #0d9f6e;
  transform: translateY(-1px);
}

.modal-btn:active {
  transform: translateY(0);
}

/* Animations */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .create-goodie-page {
    padding: 1rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .sizes-container {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
}
</style>
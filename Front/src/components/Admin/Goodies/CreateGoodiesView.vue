<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Créer un nouveau goodie</h1>

    <form @submit.prevent="submitGoodie" class="space-y-4">
      <div>
        <label class="block font-medium">Nom du goodie</label>
        <input v-model="form.nom_goodies" type="text" class="border p-2 w-full rounded" required />
      </div>

      <div>
        <label class="block font-medium">Nom de l'image</label>
        <input v-model="form.image_goodies" type="text" class="border p-2 w-full rounded" required />
        <small class="text-gray-500">Exemple : t-shirt-bleu.png</small>
      </div>

      <div>
        <label class="block font-medium">Prix (€)</label>
        <input v-model.number="form.prix_goodies" type="number" step="0.01" min="0" class="border p-2 w-full rounded" required />
      </div>

      <div>
        <label class="block font-medium mb-2">Tailles en stock</label>
        <div v-for="taille in tailles" :key="taille.id_taille" class="flex items-center space-x-2">
          <input type="checkbox" :id="`taille-${taille.id_taille}`" v-model="taille.disponible" />
          <label :for="`taille-${taille.id_taille}`">{{ taille.valeur_taille }}</label>
        </div>
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Créer le goodie
      </button>
    </form>
    <!-- MODALE DE SUCCÈS -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
        <h2 class="text-xl font-semibold mb-4">✅ Goodie créé avec succès !</h2>
        <p class="mb-6">Votre goodie a été enregistré.</p>
        <button @click="redirectToProfile" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Aller au profil
        </button>
      </div>
    </div>
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
        tailles: []
      },
      tailles: [], // Ex: [{ id_taille: 1, valeur_taille: "S", disponible: false }, ...]
      showSuccessModal: false,
    };
  },
  methods: {
    ...mapActions('boutique', ['createGoodies']),

    async submitGoodie() {
      const selectedTailles = this.tailles.map(t => ({
        id_taille: t.id_taille,
        disponible: t.disponible,
      }));

      const payload = {
        ...this.form,
        tailles: selectedTailles
      };

      try {
        await this.createGoodies(payload);
        this.showSuccessModal = true;
        this.resetForm();
      } catch (err) {
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
      this.tailles.forEach(t => (t.disponible = false));
    },

    async fetchTailles() {
      // Exemple statique, à remplacer par un appel API si nécessaire
      this.tailles = [
        { id_taille: 1, valeur_taille: 'XXXS', disponible: false },
        { id_taille: 2, valeur_taille: 'XXS', disponible: false },
        { id_taille: 3, valeur_taille: 'XS', disponible: false },
        { id_taille: 4, valeur_taille: 'S', disponible: false },
        { id_taille: 5, valeur_taille: 'M', disponible: false },
        { id_taille: 6, valeur_taille: 'L', disponible: false },
        { id_taille: 7, valeur_taille: 'XL', disponible: false }

      ];
    }
  },
  mounted() {
    this.fetchTailles();
  }
};
</script>

<style scoped>
/* Conteneur principal */
div {
  font-family: 'Inter', sans-serif;
}

/* Titre */
h1 {
  color: #1f2937; /* gris foncé */
}

/* Labels */
label {
  color: #374151;
}

/* Inputs */
input[type="text"],
input[type="number"] {
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  width: 100%;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #2563eb; /* bleu */
}

/* Cases à cocher */
input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  accent-color: #2563eb;
}

/* Boutons */
button {
  transition: background-color 0.2s, transform 0.1s;
  font-weight: 500;
}

button:hover {
  transform: scale(1.02);
}

button:active {
  transform: scale(0.98);
}

/* Modale */
.fixed {
  backdrop-filter: blur(4px);
}

.bg-white {
  animation: fadeInUp 0.3s ease-out;
}

/* Animation */
@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .max-w-xl {
    padding: 1rem;
  }

  .bg-white {
    width: 90%;
  }
}
</style>


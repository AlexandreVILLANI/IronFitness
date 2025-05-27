<template>
  <div class="container">
    <div class="upload-section">
      <h2 class="title">Upload d'image</h2>

      <form @submit.prevent="uploadImage" enctype="multipart/form-data" class="upload-form">
        <div class="file-input-container">
          <label class="file-label">
            <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="handleFileChange"
                required
                class="file-input"
            >
            <span class="file-cta">
              <span class="file-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </span>
              <span class="file-label-text">
                Choisir une image...
              </span>
            </span>
            <span class="file-name" v-if="file">
              {{ file.name }}
            </span>
          </label>
        </div>

        <div class="preview-container" v-if="previewUrl">
          <div class="preview-title">Aperçu</div>
          <img :src="previewUrl" alt="Preview" class="preview-image">
        </div>

        <button type="submit" :disabled="uploading" class="submit-button">
          <span v-if="uploading">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
            Envoi en cours...
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Envoyer
          </span>
        </button>

        <div v-if="message" class="message" :class="{ 'success': message.includes('succès'), 'error': message.includes('Erreur') }">
          {{ message }}
        </div>

        <div v-if="imageUrl" class="uploaded-info">
          <h3 class="uploaded-title">Image téléchargée</h3>
          <p class="uploaded-link">Lien: <a :href="imageUrl" target="_blank">{{ imageUrl }}</a></p>
        </div>
      </form>
    </div>

    <div class="gallery-section">
      <h2 class="gallery-title">Galerie d'images</h2>
      <div class="gallery-grid">
        <div v-for="(img, index) in images" :key="index" class="gallery-item">
          <div class="image-container">
            <img
                :src="'http://localhost:3000' + img"
                :alt="'Image ' + index"
                @click="copyToClipboard(img)"
                class="gallery-image"
            >
            <div class="image-overlay">
              <span class="overlay-text" @click.stop="copyToClipboard(img)">
                Cliquer pour copier
              </span>
              <button
                  class="delete-button"
                  @click.stop="confirmDelete(img)"
                  aria-label="Supprimer l'image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal de confirmation -->
  <div v-if="showDeleteModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Confirmer la suppression</h3>
      <p>Voulez-vous vraiment supprimer l'image "{{ imageToDelete.split('/').pop() }}"?</p>
      <div class="modal-actions">
        <button @click="showDeleteModal = false" class="cancel-button">Annuler</button>
        <button @click="deleteImage" class="confirm-delete-button">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      previewUrl: null,
      uploading: false,
      message: '',
      imageUrl: '',
      images: [],
      showDeleteModal: false,
      imageToDelete: ''
    };
  },
  mounted() {
    this.fetchImages();
  },
  methods: {
    confirmDelete(img) {
      this.imageToDelete = img;
      this.showDeleteModal = true;
    },
    async deleteImage() {
      if (!this.imageToDelete) return;

      try {
        const fileName = this.imageToDelete.split('/').pop();
        await axios.delete(`http://localhost:3000/upload/${fileName}`);

        this.message = `Image "${fileName}" supprimée avec succès.`;
        this.showDeleteModal = false;

        await this.fetchImages(); // Rafraîchit la galerie
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        this.message = 'Erreur lors de la suppression de l\'image.';
      }

      setTimeout(() => { this.message = ''; }, 3000);
    },
    copyToClipboard(imagePath) {
      const fileName = imagePath.split('/').pop();
      navigator.clipboard.writeText(fileName)
          .then(() => {
            this.message = `Nom de l'image "${fileName}" copié dans le presse-papiers !`;
            setTimeout(() => { this.message = ''; }, 3000);
          })
          .catch(err => {
            console.error('Erreur lors de la copie :', err);
            this.message = 'Erreur lors de la copie';
          });
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.file = file;
      this.previewUrl = URL.createObjectURL(file);
      this.message = '';
      this.imageUrl = '';
    },
    async fetchImages() {
      try {
        const response = await axios.get('http://localhost:3000/api/images');
        this.images = response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
      }
    },
    async uploadImage() {
      if (!this.file) {
        this.message = 'Veuillez sélectionner une image';
        return;
      }

      this.uploading = true;
      const formData = new FormData();
      formData.append('image', this.file);

      try {
        const response = await axios.post('http://localhost:3000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.message = 'Image uploadée avec succès!';
        this.imageUrl = response.data.path;
        await this.fetchImages();
        this.$refs.fileInput.value = '';
        this.file = null;
        this.previewUrl = null;
      } catch (error) {
        console.error('Erreur:', error);
        this.message = error.response?.data?.error || 'Erreur lors de l\'upload';
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>

<style scoped>
.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.image-container:hover .image-overlay {
  transform: translateY(0);
}

.overlay-text {
  font-size: 0.8rem;
  flex-grow: 1;
  text-align: center;
  cursor: pointer;
}

.delete-button {
  background: rgba(255, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-button:hover {
  background: rgba(255, 0, 0, 0.9);
}

.delete-button svg {
  color: white;
}

/* Styles pour le modal de confirmation */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button, .confirm-delete-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.cancel-button {
  background: #e0e0e0;
  color: #333;
}

.cancel-button:hover {
  background: #d0d0d0;
}

.confirm-delete-button {
  background: #ff4444;
  color: white;
}

.confirm-delete-button:hover {
  background: #cc0000;
}

/* Responsive pour mobile */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .image-container {
    height: 150px;
  }

  .overlay-text {
    font-size: 0.7rem;
  }

  .delete-button {
    width: 24px;
    height: 24px;
  }

  .modal-content {
    width: 90%;
    padding: 1.5rem;
  }
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title, .gallery-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
  position: relative;
}

.title::after, .gallery-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  background: #42b983;
  margin: 0.5rem auto;
}

.upload-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 3rem;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.file-input-container {
  margin-bottom: 1rem;
}

.file-label {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.file-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.file-cta:hover {
  background-color: #e9ecef;
  border-color: #42b983;
}

.file-icon {
  margin-right: 0.5rem;
  color: #42b983;
}

.file-label-text {
  font-weight: 500;
  color: #2c3e50;
}

.file-name {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
}

.file-input {
  display: none;
}

.preview-container {
  margin-top: 1rem;
  text-align: center;
}

.preview-title {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
  margin: 0 auto;
}

.submit-button:hover:not(:disabled) {
  background: #3aa876;
}

.submit-button:disabled {
  background: #a1a1a1;
  cursor: not-allowed;
}

.upload-icon {
  margin-right: 0.5rem;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.path {
  stroke: #ffffff;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.message {
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  margin: 1rem 0;
}

.message.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.message.error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.uploaded-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.uploaded-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.uploaded-link {
  color: #6b7280;
  word-break: break-all;
}

.uploaded-link a {
  color: #42b983;
  text-decoration: none;
}

.uploaded-link a:hover {
  text-decoration: underline;
}

.gallery-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.gallery-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.gallery-image:hover {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  text-align: center;
}

.image-container:hover .image-overlay {
  transform: translateY(0);
}

.overlay-text {
  font-size: 0.8rem;
  display: block;
}
</style>
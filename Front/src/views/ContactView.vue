<script setup>
// Code Vue éventuel pour gérer le formulaire
</script>

<template>
  <div class="contact-page">
    <div class="content">
      <h1>📬 Contactez-nous</h1>

      <div class="contact-info">
        <div class="contact-item">
          <span class="icon">✉️</span>
          <a href="mailto:contact@ironfitness.fr">contact@ironfitness.fr</a>
        </div>

        <div class="contact-item">
          <span class="icon">📞</span>
          <span>06 12 34 56 78</span>
        </div>

        <div class="contact-item">
          <span class="icon">🏋️</span>
          <span>La Filature - 70250 Ronchamp</span>
        </div>
      </div>

      <div class="map-container">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.6895101422933!2d6.634206193494958!3d47.70048830723429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4792465d4b28b89b%3A0x53109e53483aad04!2sLa%20Filature%20de%20Ronchamp!5e1!3m2!1sfr!2sfr!4v1746533531148!5m2!1sfr!2sfr"
            width="100%"
            height="400"
            style="border:0;"
            allowfullscreen=""
            loading="lazy">
        </iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  text-align: center;
  background-color: #f9f9f9;
  padding: 2rem;
}

.content {
  max-width: 800px;
  width: 100%;
}

.content h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.contact-info {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  font-size: 1.2rem;
}

.contact-item .icon {
  font-size: 1.5rem;
}

.contact-item a {
  color: #3498db;
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

.map-container {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

@media (max-width: 600px) {
  .content h1 {
    font-size: 2rem;
  }

  .contact-item {
    font-size: 1rem;
    flex-direction: column;
    text-align: center;
  }

  .map-container {
    padding: 0;
  }
}
</style>
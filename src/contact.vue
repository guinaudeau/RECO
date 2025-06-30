<script>
import emailjs from 'emailjs-com';
export default {
  name: 'ContactUs',
  props: {
    serviceId: String,
    templateId: String,
    userId: String
  },
  data() {
    return {
      name: '',
      email: '',
      message: '',
      subject: '',
      formTouched: false
    }
  },
  computed: {
    isFormValid() {
      return this.name && this.email && this.message && this.subject;
    }
  },
  methods: {
    sendEmail(e) {
      this.formTouched = true;
      if (!this.isFormValid) return;
      try {
        emailjs.sendForm(
          this.serviceId,
          this.templateId,
          e.target,
          this.userId,
          {
            name: this.name,
            email: this.email,
            message: this.message,
            subject: this.subject,
          }
        )
      } catch(error) {
        console.log({error})
      }
      this.name = ''
      this.email = ''
      this.message = ''
      this.subject = ''
      this.formTouched = false; 
      alert('Email sent successfully!');
    },
  }
}
</script>
<template>
  <div class="contenu">
    <div class="contact-container">
      <h2>Contactez-nous</h2>
      <form @submit.prevent="sendEmail" class="contact-form">
        <div class="form-group">
          <label for="name">Nom</label>
          <input 
            id="name"
            type="text" 
            v-model="name"
            name="name"

            required
          >
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            type="email" 
            v-model="email"
            name="email"
            required
          >
        </div>
        <div class="form-group">
          <label for="subject">Sujet</label>
          <select id="subject" v-model="subject" name="subject" required>
            <option value="" disabled>Sélectionnez un sujet</option>
            <option value="bug">Bug</option>
            <option value="retour">Retour</option>
            <option value="souhait d'amélioration">Souhait d'amélioration</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea 
            id="message"
            name="message"
            v-model="message"
            rows="5"
            required
          ></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" :disabled="!isFormValid" :class="{'error-btn': formTouched && !isFormValid}">
            Envoyer
          </button>
          <button type="reset" @click="formTouched = false">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

* {
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 10px;
  background: linear-gradient(115deg, #444 10%, #00c7ec 90%);
}

html.dark body {
  background: linear-gradient(115deg, #aaa 10%, #00c7ec 90%);
}

.contact-container {
  width: 100%;
  padding: 0px 40px 0px 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

html.dark .contact-container {
  background: #232834;
  color: #e6eaf3;
}

.contact-container h2 {
  text-align: center;
  font-size: 1.7em;
  font-weight: 600;
  margin-bottom: 18px;
  letter-spacing: 1px;
}

html.dark .contact-container h2 {
  color: #00c7ec;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.1em;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 2px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 7px 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 1em;
  background: #fff;
  color: #222;
  transition: border 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border: 1.5px solid #007bff;
  outline: none;
}

html.dark .form-group input,
html.dark .form-group select,
html.dark .form-group textarea {
  background: #232834;
  color: #e6eaf3;
  border: 1px solid #3a4152;
}

.form-actions {
  display: flex;
  gap: 1em;
  justify-content: flex-end;
}

.form-actions button {
  padding: 8px 18px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: #fff;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.form-actions button[type="reset"] {
  background: #bbb;
  color: #222;
}

.form-actions button:disabled,
.form-actions button.error-btn {
  background: #e74c3c !important;
  color: #fff !important;
  cursor: not-allowed;
}

.form-actions button:not(:disabled):hover {
  background: #0056b3;
}

.form-actions button[type="reset"]:hover {
  background: #888;
  color: #fff;
}

@media (max-width: 600px) {
  .contact-container {
    padding: 10px 4vw 10px 4vw;
    margin: 10px 0;
  }
  .form-actions {
    flex-direction: column;
    gap: 0.5em;
  }
}
</style>
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
      if (!this.isFormValid) return; // Ne rien faire si le formulaire est invalide

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
    <div class="container">
      <div class="text">
         Contact Formulaire
      </div>
      <form @submit.prevent="sendEmail">
        <div class="form-row">
          <div class="input-data">
            <input 
              type="text" 
              v-model="name"
              name="name"
              placeholder="Nom"
              required
            >
            <input 
              type="email" 
              v-model="email"
              name="email"
              placeholder="Email"
              required
            >
          </div>
          <div class="input-data">
            <input 
              list="subject"
              v-model="subject"
              name="subject"
              placeholder="Sujet"
              required
            >
            <textarea 
              name="message"
              v-model="message"
              cols="30" rows="5"
              placeholder="Message"
              required
            ></textarea>
            
          </div>
          <div class="input-data">

            <div class="inner"></div>
            <input
              type="submit"
              value="envoyer le message"
              :disabled="!isFormValid"
              :class="{'error-btn': formTouched && !isFormValid}"
            >
              <input type="reset" value="Annuler" @click="formTouched = false">
          </div>
        </div>
      </form>
    </div>
  </div>
    <datalist id="subject">
      <option value="bug"></option>
      <option value="retour"></option>
      <option value="souhait d'amélioration"></option>
      <option value="autre"></option>
    </datalist>
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

.container {
  background: #f0f9ff;
  width: 100%;
  padding: 25px 40px 10px 40px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
}

html.dark .container {
  background: #181c23;
}

.container .text {
  text-align: center;
  font-size: 41px;
  font-weight: 600;
  background: -webkit-linear-gradient(right, #444, #00c7ec, #444, #00c7ec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  padding-bottom: 20px;
  text-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

html.dark .container .text {
  background: -webkit-linear-gradient(right, #aaa, #00c7ec, #aaa, #00c7ec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.container form {
  padding-top: 30px;
}

.container form .form-row {
  display: flex;
  margin: 32px 0;
}

form .form-row .input-data {
  width: 100%;
  display: flex;
  margin: 0 20px;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

form .form-row .input-data * {
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
  padding: 8px 14px;
  border: 1.5px solid #dbe2ea;
  border-radius: 6px;
  font-size: 1.1em;
}

html.dark form .form-row .input-data * {
  background: #232834;
  color: #e6eaf3;
  border: 1.5px solid #3a4152;
}

.inner {
  position: absolute;
  height: 100%;
  width: 100%;
  background: #00c7ec;
  color: #000;
  border-radius: 5px;
  top: -5px;
  left: -5px;
  z-index: -1;
  transition: all 0.3s ease;
}

html.dark .inner {
  background: #000;
  color: #aaa;
}

.input-data input,
.textarea textarea {
  display: block;
  width: 100%;
  margin-bottom: 100px;
  border: none;
  font-size: 17px;
  border-bottom: 2px solid rgba(0,0,0, 0.12);
}

.textarea textarea {
  resize: none;
  padding-top: 10px;
}

textarea {
  background-image: linear-gradient(#EFEFEF 50%, #F9F9F9 50%);
  background-size: 100% 4rem;
  border: 2px solid #CCC;
  width: 100%;
  height: 400px;
  line-height: 2rem;
  margin: 0 auto;
  padding: 4px 8px;
}

html.dark textarea {
  background-image: linear-gradient(#212632 50%, #252a36 50%);
  border: 2px solid #222;
  color: #aaa;
}

input[type="submit"] {
  background: #00c7ec;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
}

html.dark input[type="submit"] {
  background: #232834;
  color: #aaa;
  border: 1px solid #00c7ec;
}

input[type="submit"]:hover {
  background: #00c7ec;
  color: #fff;
  transform: scale(1.05);
}

html.dark input[type="submit"]:hover {
  background: #232834;
  color: #aaa;
  border: 1px solid #00c7ec;
}

input[type="submit"]:active {
  background: limegreen;
  transform: scaleX(1.1);
}

input[type="submit"]:disabled {
  background: #aaa;
  color: #fff;
  cursor: not-allowed;
}

html.dark input[type="submit"]:active {
  border: 5px solid limegreen;
}

input[type="submit"].error-btn {
  background: red !important;
  color: #fff !important;
  border: 2px solid #900 !important;
  animation: shake 0.2s 2;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}

.input-data input[type="reset"] {
  background: #c9c9c9;
  color: #000;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.input-data input[type="reset"]:hover {
  background: #aaa;
  color: #fff;
  transform: scale(1.05);
  border: 2px solid #900;
}

.input-data input[type="reset"]:active {
  background: #900;
  color: #fff;
  transform: scaleX(1.1);
}

html.dark .input-data input[type="reset"]:active {
  background: #e00;
  color: #000;
}

html.dark .input-data input[type="reset"]:hover {
  color: #000;
  border: 2px solid #e00;
}

@media (max-width: 700px) {
  .container .text {
    font-size: 30px;
  }
  .container form {
    padding-top: 10px;
  }
  .container form .form-row {
    display: block;
  }
  form .form-row .input-data {
    margin: 35px 0 !important;
  }
  .submit-btn .input-data {
    width: 40% !important;
  }
}
</style>
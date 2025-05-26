<script>
import emailjs from 'emailjs-com';
export default {
  name: 'ContactUs',
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
      this.formTouched = true; // Marque le formulaire comme touché
      if (!this.isFormValid) return; // Ne rien faire si le formulaire est invalide

      try {
        emailjs.sendForm('service_mimb94k', 'template_g50q2tl', e.target,
        'ISM6B8zfLyjqOPXXd', {
          name: this.name,
          email: this.email,
          message: this.message,
          subject: this.subject,
        })
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
              placeholder="Name"
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
            <textarea 
              name="message"
              v-model="message"
              cols="30" rows="5"
              placeholder="Message"
              required
            ></textarea>
            <input 
              list="subject"
              v-model="subject"
              name="subject"
              placeholder="Subject"
              required
            >
          </div>
          <div class="input-data">

            <div class="inner"></div>
            <input
              type="submit"
              value="envoier"
              :disabled="!isFormValid"
              :class="{'error-btn': formTouched && !isFormValid}"
            >
              <input type="reset" value="Reset" @click="formTouched = false">
          </div>
        </div>
      </form>
    </div>
    <datalist id="subject">
      <option value="bug"></option>
      <option value="feedback"></option>
      <option value="feature-request"></option>
      <option value="other"></option>
    </datalist>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');
*{
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
body{
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 10px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(115deg, #444 10%, #00c7ec 90%);
}
html.dark body {
  background: linear-gradient(115deg, #aaa 10%, #00c7ec 90%);
}
.container{
  max-width: auto;
  background: #fff0f0;
  width: 100%;
  padding: 25px 40px 10px 40px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
}
html.dark .container {
  background: #000;
}
.container .text{
  text-align: center;
  font-size: 41px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  background: -webkit-linear-gradient(right, #444, #00c7ec, #444, #00c7ec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 20px 0;
  padding: 0 0 20px 0;
  text-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  flex-direction: column;
}
html.dark .container .text {
  background: -webkit-linear-gradient(right, #aaa, #00c7ec, #aaa, #00c7ec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.container form{
  padding: 30px 0 0 0;
}
.container form .form-row{
  display: flex;
  margin: 32px 0;
}
form .form-row .input-data {
  width: 100%;
  height: 40%;
  display: flex;
  margin: 0 20px;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
form .form-row .input-data *{
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
}
html.dark .inner{
  background: #000;
  color: #aaa;
}
.inner{
  position: absolute;
  height: 100%;
  width: 100%;
  background: #00c7ec;
  color:#000;
  border-radius: 5px;
  top: -5px;
  left: -5px;
  z-index: -1;
  transition: all 0.3s ease;
}
.input-data input,
.textarea textarea{
  display: block;
  width: 100%;
  height: 100%;
  margin: 0 0 100px 0;
  border: none;
  font-size: 17px;
  border-bottom: 2px solid rgba(0,0,0, 0.12);
}
.input-data input:focus ~ label, .textarea textarea:focus ~ label,
.input-data input:valid ~ label, .textarea textarea:valid ~ label{
  transform: translateY(-20px);
  font-size: 14px;
  color: #aaa;
}
.textarea textarea{
  resize: none;
  padding-top: 10px;
}
.input-data .underline{
  position: absolute;
  bottom: 0;
  height: 2px;
  width: 100%;
}

.input-data .underline:before{
  position: absolute;
  content: "";
  height: 2px;
  width: 100%;
  background: #aaa;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease;
}
.input-data input:focus ~ .underline:before,
.input-data input:valid ~ .underline:before,
.textarea textarea:focus ~ .underline:before,
.textarea textarea:valid ~ .underline:before{
  transform: scale(1);
}
@media (max-width: 700px) {
  .container .text{
    font-size: 30px;
  }
  .container form{
    padding: 10px 0 0 0;
  }
  .container form .form-row{
    display: block;
  }
  form .form-row .input-data{
    margin: 35px 0!important;
  }
  .submit-btn .input-data{
    width: 40%!important;
  }
}
html.dark .submit-btn .input-data button::after{
  background: #00c7ec;
  border : 1px solid limegreen;
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
  background-size: 100% 4rem;
  border: 2px solid #222;
  color :#aaa

}
input[type="submit"]{
  background: #00c7ec;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
}
html.dark input[type="submit"]{
  background: #232834;
  color: #aaa;
  border: 1px solid #00c7ec;
  padding: 10px 20px;
}
input[type="submit"]:hover{
  background: #00c7ec;
  color: #fff;
  transform: scale(1.05);
  transition: all 0.3s ease;
}
html.dark input[type="submit"]:hover{
  background: #232834;
  color: #aaa;
  border: 1px solid #00c7ec;
}
input[type="submit"]:active{
  background: limegreen;
  transform: scaleX(1.1);
  transition: all 0.3s ease;
}
input[type="submit"]:disabled{
  background: #aaa;
  color: #fff;
  cursor: not-allowed;
}
html.dark input[type="submit"]:active{
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
</style>
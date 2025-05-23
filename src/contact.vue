<script>
import emailjs from 'emailjs-com';
export default {
  name: 'ContactUs',
  data() {
    return {
      name: '',
      email: '',
      message: ''
    }
  },
  methods: {
    sendEmail(e) {
      try {
        emailjs.sendForm('service_mimb94k', 'template_g50q2tl', e.target,
        'ISM6B8zfLyjqOPXXd', {
          name: this.name,
          email: this.email,
          message: this.message,

        })

      } catch(error) {
          console.log({error})
      }
      // Reset form field
      this.name = ''
      this.email = ''
      this.message = ''
      // Show success message
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
              placeholder="Your Name"
            >
          </div>
          <div class="input-data">
            <input 
              type="email" 
            v-model="email"
            name="email"
            placeholder="Your Email"
            >
          </div>
          <div class="input-data">
            <textarea 
              name="message"
              v-model="message"
              cols="30" rows="5"
              placeholder="Message">
            </textarea>
          </div>
          <div class="submit-btn">
            <div class="input-data">
              <div class="inner"></div>
              <input type="submit" value="Send">
            </div>
          </div>
        </div>
      </form>
    </div>
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
  background: linear-gradient(115deg, #000 10%, #00c7ec 90%);
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
  background: -webkit-linear-gradient(right, #000, #00c7ec, #000, #00c7ec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
form .form-row .input-data{
  width: 100%;
  height: 40%;
  display: flex;
  margin: 0 20px;
  position: relative;
}
form .form-row .input-data .inner{
  position: absolute;
  height: 100%;
  width: 100%;
  background: #000;
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
.input-data label{
  position: absolute;
  pointer-events: none;
  bottom: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
}
.textarea label{
  width: 100%;
  bottom: 40px;
  background: #000;
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
@import "compass/css3";

textarea {
  background-image: linear-gradient(#F1F1F1 50%, #F9F9F9 50%);
  background-size: 100% 4rem;
  border: 1px solid #CCC;
  width: 100%;
  height: 400px;
  line-height: 2rem;
  margin: 0 auto;
  padding: 4px 8px;
}
html.dark textarea {
  background-image: linear-gradient(#090909 50%, #010101 50%);
  background-size: 100% 4rem;
  border: 1px solid #222;

}
</style>
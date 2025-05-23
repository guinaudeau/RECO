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
          message: this.message
        })

      } catch(error) {
          console.log({error})
      }
      // Reset form field
      this.name = ''
      this.email = ''
      this.message = ''
    },
  }
}
</script>

<template>
    <div class="container">
        <form @submit.prevent="sendEmail">
          <h1>Contact Us</h1>
          <label>Name</label>
          <input 
            type="text" 
            v-model="name"
            name="name"
            placeholder="Your Name"
          >
          <label>Email</label>
          <input 
            type="email" 
            v-model="email"
            name="email"
            placeholder="Your Email"
            >
          <label>Message</label>
          <textarea 
            name="message"
            v-model="message"
            cols="30" rows="5"
            placeholder="Message">
          </textarea>

          <input type="submit" value="Send">
        </form>
    </div>
</template>
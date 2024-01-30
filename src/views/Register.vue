<template>
  <div class="home-container bg-dark text-white vh-100 d-flex flex-column justify-content-center align-items-center">
    <h2 class="mb-4">Register</h2>

    <div class="mb-3 w-50">
      <label for="username" class="form-label">Username</label>
      <input type="text" id="username" v-model="username" class="form-control w-100">
    </div>

    <div class="mb-3 w-50">
      <label for="email" class="form-label">Email</label>
      <input type="email" id="email" v-model="email" class="form-control w-100">
    </div>

    <div class="mb-3 w-50">
      <label for="password" class="form-label">Password</label>
      <input type="password" id="password" v-model="password" class="form-control w-100">
    </div>

    <div class="d-flex gap-2">
      <button class="btn btn-primary" @click="register">Register</button>
      <button class="btn btn-secondary" @click="goToHome">Home</button>
      <button class="btn btn-light" @click="goToLogin">Login Screen</button>
    </div>

    <p v-if="errorMessage" class="mt-3 text-danger">{{ errorMessage }}</p>
  </div>
</template>



<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    goToHome() {
      this.$router.push({ name: 'Home' });
    },
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
    async register() {
      try {
        const response = await axios.post('http://localhost:80/api/v1/accounts/users/register', {
          username: this.username,
          email: this.email,
          password: this.password
        });
        console.log(response)
        if (response.statusText === 'OK'|| response.statusText=== 'Created') {
          // Redirect to login page or show success message
          localStorage.setItem('token', response.data)
          document.cookie = `token=${response.data}; path=/; samesite=strict;`;
          this.$router.push({ name: 'Dashboard' });
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        this.errorMessage = "Username or email already exists";
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 300px;
}

button {
  cursor: pointer;
}
</style>

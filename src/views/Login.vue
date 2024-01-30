<template>
  <div class="home-container bg-dark text-white vh-100 d-flex flex-column justify-content-center align-items-center">
    <h2 class="mb-4">Login</h2>

    <div class="mb-3 w-50">
      <label for="username" class="form-label">Username</label>
      <input type="text" id="username" v-model="username" class="form-control w-100">
    </div>

    <div class="mb-3 w-50">
      <label for="password" class="form-label">Password</label>
      <input type="password" id="password" v-model="password" class="form-control w-100">
    </div>

    <div class="d-flex gap-2">
      <button class="btn btn-primary" @click="login">Login</button>
      <button class="btn btn-secondary" @click="goToHome">Home</button>
      <button class="btn btn-light" @click="goToRegister">Register Screen</button>
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
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    goToHome() {
      this.$router.push({name: 'Home'});
    },
    goToRegister() {
      this.$router.push({name: 'Register'});
    },
    async login() {
      try {
        console.log(this.username)
        const response = await axios.post('http://localhost:80/api/v1/accounts/users/login', {
          username: this.username,
          password: this.password
        });
        console.log(response.statusText === 'OK')
        console.log(response)
        if (response.statusText === 'OK' ) {
          console.log(
              'test'
          )
          // Redirect to login page or show success message
          document.cookie = `token=${response.data.bearerToken}; path=/; samesite=strict;`;
          console.log(response.data)
          this.$router.push({name: 'Dashboard'});
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        this.errorMessage = "Wrong username or password";
      }
    }
  }
}
</script>

<style scoped>
.button_div{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding:0 2rem;
}
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

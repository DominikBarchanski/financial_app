<template>
  <div class="home-container bg-dark text-white vh-100 d-flex flex-column justify-content-center align-items-center">
    <h1 class="project-title mb-4">Financial App</h1>

    <div class="tiles-container d-flex gap-3">
      <button class="btn btn-primary btn-lg d-flex flex-column align-items-center" @click="goToLogin">
        <i class="bi bi-box-arrow-in-right mb-2"></i>
        Log in
      </button>

      <button class="btn btn-success btn-lg d-flex flex-column align-items-center" @click="goToRegister">
        <i class="bi bi-person-plus-fill mb-2"></i>
        Register
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
    goToRegister() {
      this.$router.push({ name: 'Register' });
    }
  }
}
</script>

<style scoped>
.project-title {
  font-size: 2rem;
}
</style>

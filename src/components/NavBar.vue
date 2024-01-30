<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{title}}</a>
      <div class="d-flex">
        <button v-if="showHomeButton" class="btn btn-light me-2" @click="goToDashboard">
          <i class="bi bi-house-door-fill"></i> Home
        </button>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-gear"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" href="#">Username: {{ userData.username }}</a></li>
            <li><a class="dropdown-item" href="#">Email: {{ userData.email }}</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" @click="logout">Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";

export default {
  props:{
    title: {
      type: String,
      required: true
    },
    showHomeButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      userData: {
        username: '',
        email: ''
      }
    };
  },
  mounted() {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      this.userData.username = decodedToken.username;
      this.userData.email = decodedToken.email;
    }
  },
  methods: {
    logout() {
      Cookies.remove('token');
      this.$router.push({name: 'Home'});
    },
    goToDashboard() {
      this.$router.push({name: 'Dashboard'});
    }
  }
}
</script>

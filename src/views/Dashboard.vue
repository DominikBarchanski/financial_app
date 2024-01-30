<template>
  <div class="dashboard-container bg-dark text-white vh-100">
   <NavBar :title="navBarTitle" :show-home-button="false"/>

    <div class="tiles-container d-flex justify-content-center flex-wrap">
      <div class="tile bg-primary m-2" @click="goTo('Expanse')">
        <i class="bi bi-cash-stack display-4"></i>
        <p>Expanse</p>
      </div>
      <div class="tile bg-success m-2" @click="goTo('Balance')">
        <i class="bi bi-wallet2 display-4"></i>
        <p>Balance</p>
      </div>
      <div class="tile bg-info m-2" @click="goTo('Groups')">
        <i class="bi bi-people display-4"></i>
        <p>Groups</p>
      </div>
      <div class="tile bg-danger m-2" @click="goTo('Shop_List')">
        <i class="bi bi-cart4 display-4"></i>
        <p>Shop List</p>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";
import NavBar from "../components/NavBar.vue"
export default {
  components: {
    NavBar
  },
  data() {
    return {
      userData: {
        username: '',
        email: ''
      },
      navBarTitle: 'Dashboard'
    };
  },
  mounted() {
    const token = Cookies.get('token');
    const tokenStorage = localStorage.getItem('token');
    const tokenToUse = token || tokenStorage;

    if (tokenToUse) {
      const decodedToken = jwtDecode(tokenToUse);
      this.userData.username = decodedToken.username;
      this.userData.email = decodedToken.email;
    }

  },
  methods: {
    logout() {
      Cookies.remove('token');
      this.$router.push({name: 'Home'});
    },
    goTo(route) {
      this.$router.push({name: route});
    }
  }
}
</script>

<style scoped>
.tiles-container {
  width: 80%;
}

.tile {
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  transition: transform 0.2s;
  text-align: center;
}

.tile:hover {
  transform: scale(1.05);
}
</style>


<template>
  <div class="dashboard-container bg-dark text-white vh-100">

  <NavBar :title="navBarTitle"/>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue"
export default {
  components: {
    NavBar
  },
  data() {
    return {
      navBarTitle: 'Balance'
    };
  },
}
</script>
<style scoped>

</style>
<template>
  <div id="app">
    <Login v-if="!isLoggedIn" @login-success="onLoginSuccess" />
    <MapView v-else :chargers="chargers" />
  </div>
</template>

<script>
import Login from './views/Login.vue';
import MapView from './views/MapView.vue';

export default {
  components: { Login, MapView },
  data() {
    return {
      isLoggedIn: false,
      chargers: [],
      userData: null,  // store logged in user data or token
    };
  },
  methods: {
    async onLoginSuccess(userData) {
      this.isLoggedIn = true;
      this.userData = userData;

      // Optionally, fetch chargers data after login
      try {
        const response = await fetch('http://localhost:5000/api/chargers');
        this.chargers = await response.json();
      } catch (error) {
        console.error('Failed to load chargers:', error);
      }
    },
  },
};
</script>

<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link to="/" class="navbar-brand">conduit</router-link>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <!-- Add "active" class when you're on that page" -->
          <router-link class="nav-link active" to="/">Home</router-link>
        </li>
        <li v-if="username" class="nav-item">
          <router-link class="nav-link" to="/editor">
            <i class="ion-compose"></i>&nbsp;New Post
          </router-link>
        </li>
        <li v-if="username" class="nav-item">
          <router-link class="nav-link" to="/settings">
            &nbsp;Settings
          </router-link>
        </li>
        <li v-if="username == null" class="nav-item">
          <router-link class="nav-link" to="/login">Log in</router-link>
        </li>
        <li v-if="username == null" class="nav-item">
          <router-link class="nav-link" to="/register">Sign up</router-link>
        </li>
        <li v-if="username" class="nav-item">
          <router-link class="nav-link" :to="'/@' + username">{{
            username
          }}</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
// OR using transpiled js version
import AlertIcon from "vue-ionicons/dist/ios-alert.vue";

export default {
  components: {
    AlertIcon
  },
  computed: {
    username() {
      return this.$store.getters["users/username"];
    }
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <router-link to="/login">{{ message }}</router-link>
          </p>

          <ul class="error-messages">
            <li v-if="errors.length > 0">
              There is already a user with this username/email
            </li>
          </ul>
          <form>
            <fieldset class="form-group">
              <input
                v-model="username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="email"
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
              />
            </fieldset>
            <button
              @click="register"
              class="btn btn-lg btn-primary pull-xs-right"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      username: "",
      password: "",
      email: "",
      errors: [],
      successRegister: false
    };
  },
  computed: {
    message() {
      return this.successRegister === true
        ? "Reistered Sucessfully, Login ?"
        : "Have an account?";
    }
  },
  methods: {
    register() {
      this.$store
        .dispatch("users/registerUser", {
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.errors = [];
          this.successRegister = true;
        })
        .catch(err => {
          this.errors.push(err);
        });
    }
  }
};
</script>

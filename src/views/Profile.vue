<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img v-bind:src="image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              v-if="this.loggedusername != profile.username"
              @click="followUser()"
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              Follow {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <router-link
                  to=""
                  @click.native="onFavor(false)"
                  class="nav-link"
                  :class="{ active: activeItem === 'myarticles' }"
                  href=""
                  >My Articles</router-link
                >
              </li>
              <li class="nav-item">
                <router-link
                  @click.native="onFavor(true)"
                  :class="{ active: activeItem === 'favarticles' }"
                  class="nav-link"
                  to=""
                  >Favorited Articles</router-link
                >
              </li>
            </ul>
          </div>

          <Article
            v-for="article in articles"
            :key="article.slug"
            :article="article"
          >
          </Article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Article from "../components/Article";
export default {
  components: {
    Article
  },
  data() {
    return {
      profile: false,
      articles: false,
      image: "",
      username: "",
      activeItem: "myarticles"
    };
  },
  computed: {
    loggedusername() {
      return this.$store.getters["users/username"];
    },
    token() {
      return this.$store.getters["users/token"];
    }
  },
  mounted() {
    this.username = this.$route.params.username || "";
    if (this.username.charAt(0) === "@") {
      this.username = this.username.substr(1);
    }
    if (this.loggedusername) {
      this.$store
        .dispatch("profile/getProfile", {
          username: this.username,
          token: this.token
        })
        .then(() => {
          this.profile = this.$store.state.profile.profile;
          this.image = this.$store.state.profile.profile.image;
        });
    } else {
      this.$store
        .dispatch("profile/getProfile", {
          username: this.username,
          token: ""
        })
        .then(() => {
          this.profile = this.$store.state.profile.profile;
          this.image = this.$store.state.profile.profile.image;
        });
    }

    this.$store
      .dispatch("articles/getAuthorArticles", this.username)
      .then(() => {
        this.articles = this.$store.state.articles.feed || [];
      });
  },
  methods: {
    onFavor(Favflag) {
      this.articles = [];
      let username = this.$route.params.username || "";
      if (username.charAt(0) === "@") {
        username = username.substr(1);
      }
      if (Favflag === true) {
        this.setActive("favarticles");
        this.$store
          .dispatch("articles/getFavoritedArticles", username)
          .then(() => {
            this.articles = this.$store.state.articles.feed || [];
          });
      } else {
        this.setActive("myarticles");

        this.$store
          .dispatch("articles/getAuthorArticles", username)
          .then(() => {
            this.articles = this.$store.state.articles.feed || [];
          });
      }
    },
    setActive: function(menuItem) {
      this.activeItem = menuItem;
    },
    followUser() {
      let path = "users/followUser";
      this.$store.dispatch(path, {
        username: this.username,
        token: this.token
      });
    }
  }
};
</script>

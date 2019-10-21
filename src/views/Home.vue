<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a
                  class="nav-link"
                  @click="setFeed('user')"
                  :class="{ active: activeFeed === 'user' }"
                  >Your Feed</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  @click="setFeed('global')"
                  :class="{ active: activeFeed === 'global' }"
                  >Global Feed</a
                >
              </li>
            </ul>
          </div>

          <Article
            v-for="article in globalArticles"
            :key="article.slug"
            :article="article"
          >
          </Article>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <router-link
                class="tag-pill tag-default"
                v-for="tag in popularTags"
                :key="tag.id"
                @click.native="searchTag(tag)"
                to="/"
                >{{ tag }}
              </router-link>
            </div>
          </div>
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
  methods: {
    setFeed(feedType) {
      if (feedType === "global") {
        this.activeFeed = "global";
        if (this.token) {
          this.$store.dispatch("articles/getGlobalFeed", { token: this.token });
        } else this.$store.dispatch("articles/getGlobalFeed", { token: "" });
      } else if (feedType === "user") {
        this.activeFeed = "user";
        this.$store.dispatch("articles/getUserFeed", this.token);
      }
    },
    getPopularTags() {
      //this.$store.dispatch("users/getUser",username);
      if (this.token) {
        this.$store.dispatch("articles/getPopularTags", this.token);
      } else this.$store.dispatch("articles/getPopularTags", "");
    },
    searchTag(tag) {
      let str = "articles/getTag";
      this.$store.dispatch(str, tag);
    }
  },
  mounted() {
    this.setFeed("global");
    console.log(this.tagName);
    this.getPopularTags();
  },
  computed: {
    globalArticles() {
      return this.$store.state.articles.feed || [];
    },
    username() {
      return this.$store.getters["users/username"];
    },
    popularTags() {
      return this.$store.state.articles.tags || [];
    },
    token() {
      return this.$store.getters["users/token"];
    },
    tagName() {
      return this.$store.state.articles.tagName || "";
    }
  },
  data: function() {
    return {
      activeFeed: "global",
      tag: ""
    };
  }
};
</script>

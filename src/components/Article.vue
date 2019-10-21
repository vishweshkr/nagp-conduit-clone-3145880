<template>
  <div class="article-preview">
    <div class="article-meta">
      <router-link :to="'/@' + article.author.username"
        ><img v-bind:src="article.author.image"
      /></router-link>
      <div class="info">
        <router-link :to="'/@' + article.author.username" class="author">{{
          article.author.username
        }}</router-link>
        <span class="date">{{ formatDate(article.createdAt) }}</span>
      </div>
      <button
        @click="markfavoriteArticle()"
        class="btn btn-outline-primary btn-sm pull-xs-right"
      >
        {{ article.favoritesCount }}
      </button>
      <button
        v-if="loggedusername === article.author.username"
        @click="deleteArticle()"
        class="btn btn-outline btn-sm pull-xs-right"
      >
        Delete
      </button>
      <router-link
        v-if="loggedusername === article.author.username"
        :to="'editor/' + article.slug"
        class="btn btn-outline btn-sm pull-xs-right"
      >
        Edit
      </router-link>
    </div>
    <!-- :to="'task/'+ todo.id" -->
    <router-link :to="'/article/' + article.slug" class="preview-link">
      <h1>{{ article.title }}</h1>
      <p>{{ article.description }}</p>

      <div class="tag-list">
        <router-link
          class="tag-pill tag-default"
          v-for="tag in article.tagList"
          :key="tag"
          to="/"
          @click.native="searchTag(tag)"
          >{{ tag }}
        </router-link>
      </div>
      <span>Read more...</span>
    </router-link>
  </div>
</template>

<script>
import moment from "moment";
export default {
  computed: {
    loggedusername() {
      return this.$store.getters["users/username"];
    },
    token() {
      return this.$store.getters["users/token"];
    }
  },
  props: ["article"],
  methods: {
    formatDate(dateString) {
      return moment(dateString).format("MMMM D, YYYY");
    },
    searchTag(tag) {
      let str = "articles/getTag";
      this.$store.dispatch(str, tag);
    },
    deleteArticle() {
      const slug = this.article.slug;
      this.$store
        .dispatch("article/deleteArticle", {
          slug: slug,
          token: this.token
        })
        .then(() => {
          this.$router.push("/@" + this.loggedusername);
        })
        .catch(err => {
          console.log(err);
        });
    },
    markfavoriteArticle() {
      let path = "article/markfavoriteArticle";
      this.$store.dispatch(path, {
        slug: this.article.slug,
        token: this.token
      });
    }
  }
};
</script>

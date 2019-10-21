<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ title }}</h1>
        <div class="article-meta">
          <router-link :to="'/' + username"
            ><img v-bind:src="image"
          /></router-link>
          <div class="info">
            <router-link :to="'/' + username" class="author">{{
              username
            }}</router-link>
            <span class="date">{{ formatDate(createdAt) }}</span>
          </div>
          <!-- class on follow -->
          <button
            v-if="this.loggeduser != username"
            @click="followUser()"
            class="btn btn-sm btn-outline-secondary"
          >
            &nbsp; Follow {{ username }}
          </button>
          <button
            v-if="this.loggeduser === username"
            @click="editArticle()"
            class="btn btn-sm btn-outline-secondary"
          >
            &nbsp; Edit Article
          </button>
          &nbsp;&nbsp;
          <button
            v-if="this.loggeduser != username"
            @click="markfavoriteArticle()"
            class="btn btn-sm btn-outline-primary"
          >
            &nbsp; Favorite Post
            <span class="counter">({{ favoritesCount }})</span>
          </button>
          <button
            @click="deleteArticle()"
            v-if="this.loggeduser === username"
            class="btn btn-sm btn-outline-secondary"
          >
            &nbsp; Delete Article
          </button>
        </div>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <p>
            {{ description }}
          </p>
          <h2 id="introducing-ionic">{{ body }}</h2>
          <div class="tag-list">
            <router-link
              class="tag-pill tag-default"
              v-for="tag in tagList"
              :key="tag"
              to="/"
              @click.native="searchTag(tag)"
              >{{ tag }}
            </router-link>
          </div>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <div class="article-meta"></div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form class="card comment-form">
            <div class="card-block">
              <textarea
                v-model="commentText"
                class="form-control"
                placeholder="Write a comment..."
                rows="3"
              ></textarea>
            </div>
            <div class="card-footer">
              <img v-bind:src="image" class="comment-author-img" />
              <button @click="postComment()" class="btn btn-sm btn-primary">
                Post Comment
              </button>
            </div>
          </form>

          <div class="card" v-for="comment in comments" :key="comment.id">
            <div class="card-block">
              <p v-if="!(editCommentId === comment.id)">{{ comment.body }}</p>

              <!-- as -->
              <form
                v-if="editCommentId === comment.id"
                class="card comment-form"
              >
                <div class="card-block">
                  <textarea
                    v-model="editCommentText"
                    class="form-control"
                    placeholder="Write a comment..."
                    rows="3"
                  ></textarea>
                </div>
                <div class="card-footer">
                  <button
                    @click="postEditedComment(comment)"
                    class="btn btn-sm btn-primary"
                  >
                    Save
                  </button>
                </div>
              </form>
              <!-- as -->
            </div>
            <div class="card-footer">
              <a href="" class="comment.author.username">
                <img
                  v-bind:src="comment.author.image"
                  class="comment-author-img"
                />
              </a>
              &nbsp;
              <router-link
                :to="'/' + comment.author.username"
                class="comment-author"
                >{{ comment.author.username }}</router-link
              >
              <span class="date-posted">{{
                formatDate(comment.createdAt)
              }}</span>

              &nbsp; &nbsp;
              <span class="mod-options">
                <button
                  class="btn btn-sm btn-outline-primary"
                  v-if="comment.author.username === loggeduser"
                  @click="deleteComment(comment.id)"
                >
                  Delete
                </button>
                &nbsp; &nbsp;
                <button
                  class="btn btn-sm btn-outline-primary"
                  v-if="comment.author.username === loggeduser"
                  @click="editComment(comment)"
                >
                  Edit
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      article: false,
      username: "",
      image: "",
      favorited: false,
      favoritesCount: 0,
      title: "",
      description: "",
      body: "",
      createdAt: "",
      tagList: [],
      commentText: "",
      editCommentId: 0,
      editCommentText: "",
      slug: ""
    };
  },
  computed: {
    comments() {
      this.$store.dispatch(
        "article/getArticleComments",
        this.$route.params.slug
      );
      return this.$store.state.article.comments || [];
    },
    loggeduser() {
      return this.$store.getters["users/username"];
    },
    token() {
      return this.$store.getters["users/token"];
    }
  },
  mounted() {
    this.$store
      .dispatch("article/getArticle", this.$route.params.slug)
      .then(() => {
        this.article = this.$store.state.article.article;
        this.username = this.article.author.username || "";
        this.image = this.article.author.image || "";
        this.title = this.article.title || "";
        this.createdAt = this.article.createdAt || "";
        this.description = this.article.description || "";
        this.body = this.article.body || "";
        this.favorited = this.article.favorited;
        this.favoritesCount = this.article.favoritesCount;
        this.tagList = this.article.tagList || [];
        this.slug = this.article.slug;
      });
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format("MMMM D,YYYY");
    },
    searchTag(tag) {
      let str = "articles/getTag";
      this.$store.dispatch(str, tag);
    },
    deleteComment(id) {
      this.$store.dispatch("article/removeArticleComment", {
        slug: this.$route.params.slug,
        id: id,
        token: this.token
      });
    },
    postComment() {
      this.$store.dispatch("article/postArticleComment", {
        slug: this.$route.params.slug,
        body: this.commentText,
        token: this.token
      });
      this.commentText = "";
    },
    editComment(comment) {
      this.editCommentId = comment.id;
      this.editCommentText = comment.body;
    },
    postEditedComment(comment) {
      this.deleteComment(comment.id);
      this.$store.dispatch("article/postArticleComment", {
        slug: this.$route.params.slug,
        body: this.editCommentText,
        token: this.token
      });
      this.editCommentId = 0;
      this.editCommentText = "";
    },
    editArticle() {
      this.$router.push("/editor/" + this.slug);
    },
    deleteArticle() {
      const slug = this.slug;
      this.$store
        .dispatch("article/deleteArticle", {
          slug: slug,
          token: this.token
        })
        .then(() => {
          this.$router.push("/" + this.loggeduser);
        })
        .catch(err => {
          console.log(err);
        });
    },
    followUser() {
      let path = "users/followUser";
      this.$store.dispatch(path, {
        username: this.username,
        token: this.token
      });
    },
    markfavoriteArticle() {
      let path = "article/markfavoriteArticle";
      this.$store.dispatch(path, {
        slug: this.slug,
        token: this.token
      });
    }
  }
};
</script>
<style scoped></style>

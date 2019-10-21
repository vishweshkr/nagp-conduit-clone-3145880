<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <h1 v-for="error in errors" :key="error.id">{{ error }}</h1>
              <fieldset class="form-group">
                <input
                  v-model="articleTitle"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  v-model="articleDescription"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="articleBody"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tag"
                  v-on:keyup.enter="onEnter"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags(Press Enter Key to add multiple)"
                />
                <div class="tag-list"></div>
              </fieldset>
              <div class="tag-list">
                <span
                  class="tag-pill tag-default"
                  v-for="tag in articleTags"
                  :key="tag.id"
                  >{{ tag }}
                </span>
              </div>
              <button
                @click="publish()"
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
              >
                {{ buttonText }}
              </button>
            </fieldset>
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
      articleTitle: "",
      articleDescription: "",
      articleBody: "",
      tag: "",
      articleTags: [],
      errors: [],
      token: this.$store.getters["users/token"] || "",
      username: this.$store.getters["users/username"] || "",
      buttonText: ""
    };
  },
  mounted() {
    if (this.isEditMode) {
      this.buttonText = "Edit Article";
      this.$store
        .dispatch("article/getArticle", this.$route.params.articleslug)
        .then(() => {
          this.article = this.$store.state.article.article;
          this.articleTitle = this.article.title || "";
          this.articleDescription = this.article.description || "";
          this.articleBody = this.article.body || "";
          this.articleTags = this.article.tagList || [];
        });
    } else this.buttonText = "Publish Article";
  },
  computed: {
    isEditMode() {
      return this.$route.params.articleslug || false;
    }
  },
  methods: {
    onEnter: function() {
      if (this.tag != "" && this.articleTags.includes(this.tag) === false) {
        this.articleTags.push(this.tag);
      }
      this.tag = "";
    },
    checkForm() {
      if (this.articleTitle && this.articleDescription && this.articleBody) {
        return true;
      }

      this.errors = [];

      if (!this.articleTitle) {
        this.errors.push("Title required.");
      }
      if (!this.articleDescription) {
        this.errors.push("Description required.");
      }
      if (!this.articleBody) {
        this.errors.push("Body required.");
      }

      return false;
    },
    clearForm() {
      this.articleTitle = "";
      this.articleDescription = "";
      this.articleBody = "";
      this.tag = "";
      this.articleTags = [];
    },
    publish() {
      if (this.checkForm()) {
        if (this.tag != "") {
          if (this.articleTags.includes(this.tag) === false) {
            this.articleTags.push(this.tag);
          }
        }
        const methodCall = this.isEditMode
          ? "article/editArticle"
          : "article/postArticle";

        this.$store
          .dispatch(methodCall, {
            title: this.articleTitle,
            description: this.articleDescription,
            body: this.articleBody,
            tagList: this.articleTags,
            slug: this.isEditMode ? this.$route.params.articleslug : "",
            token: this.token
          })
          .then(() => {
            this.errors = [];
            this.clearForm();
            this.$router.push("/" + this.username);
          })
          .catch(err => {
            this.errors.push(err);
          });
      }
    }
  }
};
</script>

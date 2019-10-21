import { api } from "../api";

export default {
  namespaced: true,
  state: {
    feed: [],
    count: 0,
    tags: [],
    tagName: ""
  },
  mutations: {
    setArticles(state, { articles, articlesCount }) {
      state.feed = articles;
      state.count = articlesCount;
    },
    setTag(state, payload) {
      state.feed = payload.articles;
      state.count = payload.articlesCount;
    },
    setPopularTags(state, payload) {
      state.tags = payload.tags;
    },
    setTagName(state, tag) {
      state.tagName = tag;
    }
  },
  actions: {
    async getGlobalFeed({ commit }, payload) {
      let route = "/articles";
      const tokenHeader = "Token " + payload.token;
      const auth =
        payload.token === ""
          ? ""
          : {
              headers: { Authorization: tokenHeader }
            };
      const response = await api.get(route, auth);
      commit("setArticles", response.data);
    },
    async getUserFeed({ commit }, token) {
      let route = "/articles/feed";

      const tokenHeader = "Token " + token;
      const response = await api.get(route, {
        headers: {
          Authorization: tokenHeader
        }
      });
      commit("setArticles", response.data);
    },
    async getAuthorArticles({ commit }, username) {
      let route = "/articles?author=" + username;
      const response = await api.get(route);
      commit("setArticles", response.data);
    },
    async getFavoritedArticles({ commit }, username) {
      let route = "/articles?favorited=" + username;
      const response = await api.get(route);
      commit("setArticles", response.data);
    },
    async getTag({ commit }, tag) {
      let route = "/articles?tag=" + tag;
      const response = await api.get(route);
      commit("setTagName", tag);
      commit("setTag", response.data);
    },
    async getPopularTags({ commit }, token) {
      let route = "/tags";
      const tokenHeader = "Token " + token;

      if (!this.state.tags || !this.state.tags === []) {
        const auth =
          token === ""
            ? ""
            : {
                headers: { Authorization: tokenHeader }
              };
        const response = await api.get(route, auth);
        commit("setPopularTags", response.data);
      }
    }
  }
};

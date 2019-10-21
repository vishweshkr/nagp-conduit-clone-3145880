import { api } from "../api";

export default {
  namespaced: true,
  state: {
    article: [],
    comments: []
  },
  mutations: {
    setArticle(state, { article }) {
      state.article = article;
    },
    setComments(state, { comments }) {
      state.comments = comments;
    }
  },
  actions: {
    async getArticle({ commit }, slug) {
      let route = "/articles/" + slug;
      const response = await api.get(route);
      commit("setArticle", response.data);
    },

    async getArticleComments({ commit }, slug) {
      let route = "/articles/" + slug + "/comments";
      const response = await api.get(route);
      // debugger;
      commit("setComments", response.data);
    },

    async removeArticleComment({ commit }, payload) {
      let route = "/articles/" + payload.slug + "/comments/" + payload.id;
      const tokenHeader = "Token " + payload.token;

      const response = await api.delete(route, {
        headers: {
          Authorization: tokenHeader
        }
      });
      commit("setComments", response.data);
    },

    async postArticleComment({ commit }, payload) {
      try {
        let route = "/articles/" + payload.slug + "/comments";
        const tokenHeader = "Token " + payload.token;
        let body = payload.body;
        const auth = {
          headers: { Authorization: tokenHeader }
        };
        const response = await api.post(route, { body }, auth);
        commit("setComments", response.data);
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    async postArticle({ commit }, payload) {
      try {
        const route = "/articles";
        const tokenHeader = "Token " + payload.token;
        const title = payload.title;
        const description = payload.description;
        const body = payload.body;
        const tagList = payload.tagList;

        const auth = {
          headers: { Authorization: tokenHeader }
        };
        const response = await api.post(
          route,
          { title, description, body, tagList },
          auth
        );
        commit("setArticle", response.data);
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    async editArticle({ commit }, payload) {
      try {
        let route = "/articles/" + payload.slug;
        const tokenHeader = "Token " + payload.token;
        let title = payload.title;
        let description = payload.description;
        let body = payload.body;
        let tagList = payload.tagList;
        const auth = {
          headers: { Authorization: tokenHeader }
        };
        const response = await api.put(
          route,
          { title, description, body, tagList },
          auth
        );
        commit("setArticle", response.data);
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    async deleteArticle({ commit }, payload) {
      const route = "/articles/" + payload.slug;
      const tokenHeader = "Token " + payload.token;
      const auth = {
        headers: { Authorization: tokenHeader }
      };
      const response = await api.delete(route, auth);
      commit("setArticle", response.data);
    },

    async markfavoriteArticle({ commit }, payload) {
      const route = "/articles/" + payload.slug + "/favorite";
      const tokenHeader = "Token " + payload.token;
      const auth = {
        headers: { Authorization: tokenHeader }
      };
      const response = await api.post(route, { body: {} }, auth);
      commit("setArticle", response.data);
    }
  }
};

import Vue from "vue";
import Vuex from "vuex";
import users from "./modules/users";
import articles from "./modules/articles";
import article from "./modules/article";
import profile from "./modules/profile";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    users,
    articles,
    article,
    profile
  }
});

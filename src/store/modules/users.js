import { api, setToken, clearToken, isLoggedIn } from "../api";

export default {
  namespaced: true,
  state: {
    user: null,
    profile: null,
    follow: null
  },
  getters: {
    username(state) {
      return (
        window.localStorage.getItem("username") ||
        (state.user && state.user.username) ||
        null
      );
    },

    token(state) {
      return (
        window.localStorage.getItem("jwtToken") ||
        (state.user && state.user.token) ||
        null
      );
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setFollow(state, payload) {
      state.follow = payload;
    }
  },
  actions: {
    getUser: async function({ commit }) {
      if (isLoggedIn()) {
        let str = "/profiles/" + this.getters.username;
        const user = await api.get(str);
        commit("setUser", user.data.profile);
      }
    },
    registerUser: async function({ username, email, password }) {
      try {
        await api.post("/users", {
          user: {
            username,
            email,
            password
          }
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    loginUser: async function({ commit }, { email, password }) {
      clearToken();
      try {
        const response = await api.post("/users/login", {
          user: {
            email,
            password
          }
        });
        if (response.data.user) {
          setToken(response.data.user.token, response.data.user.username);
          commit("setUser", response.data.user);
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    async followUser({ commit }, payload) {
      try {
        const route = "/profiles/" + payload.username + "/follow";
        console.log(route);
        const tokenHeader = "Token " + payload.token;
        const auth = {
          headers: { Authorization: tokenHeader }
        };
        const response = await api.post(route, { body: "" }, auth);
        commit("setFollow", response.data);
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    async unfollowUser({ commit }, payload) {
      try {
        let route = "/profiles/" + payload.username + "/follow";
        const tokenHeader = "Token " + payload.token;

        const auth = {
          headers: { Authorization: tokenHeader }
        };
        const response = await api.delete(route, auth);
        commit("setFollow", response.data);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }
};

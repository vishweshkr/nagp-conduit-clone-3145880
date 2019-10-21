import { api } from "../api";

export default {
  namespaced: true,
  state: {
    profile: []
  },
  mutations: {
    setProfile(state, { profile }) {
      state.profile = profile;
    }
  },
  actions: {
    async getProfile({ commit }, payload) {
      let route = "/profiles/" + payload.username;
      const tokenHeader = "Token " + payload.token;
      const auth =
        payload.token === ""
          ? ""
          : {
              headers: { Authorization: tokenHeader }
            };
      const response = await api.get(route, auth);
      commit("setProfile", response.data);
    }
  }
};

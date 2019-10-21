import axios from "axios";

export const api = axios.create({
  baseURL: "https://conduit.productionready.io/api"
});

export function setToken(jwt, username) {
  if (!window.localStorage.getItem("jwtToken")) {
    api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    window.localStorage.setItem("jwtToken", jwt);

    window.localStorage.setItem("username", username);
  } else {
    clearToken();
    api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    window.localStorage.setItem("jwtToken", jwt);
    window.localStorage.getItem("username", username);
  }
}

export function clearToken() {
  delete api.defaults.headers.common["Authorization"];
  window.localStorage.removeItem("jwtToken");
}

export function isLoggedIn() {
  if (window.localStorage.getItem("jwtToken")) return true;
}

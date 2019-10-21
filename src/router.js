import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "Login",
      component: () =>
        import(/* webpackChunkName: "Login" */ "./views/Login.vue")
    },
    {
      path: "/register",
      name: "Register",
      component: () =>
        import(/* webpackChunkName: "Register" */ "./views/Register.vue")
    },
    {
      path: "/settings",
      name: "settings",
      component: () =>
        import(/* webpackChunkName: "Settings" */ "./views/Settings.vue")
    },
    {
      path: "/editor",
      name: "editor-create",
      component: () =>
        import(
          /* webpackChunkName: "articlecreate" */ "./views/ArticleCreate.vue"
        )
    },
    {
      path: "/editor/:articleslug",
      name: "editor-edit",
      component: () =>
        import(
          /* webpackChunkName: "articleedit" */ "./views/ArticleCreate.vue"
        )
    },

    {
      path: "/article/:slug",
      name: "article",
      component: () =>
        import(/* webpackChunkName: "article" */ "./views/Article.vue")
    },
    {
      path: "/:username",
      name: "profile",
      component: () =>
        import(/* webpackChunkName: "profile" */ "./views/Profile.vue")
    }
  ]
});

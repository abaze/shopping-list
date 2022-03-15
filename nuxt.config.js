const { CI_PAGES_URL } = process.env;
const base = (CI_PAGES_URL && new URL(CI_PAGES_URL).pathname) || "";

export default {
  env: {
    TVA: "1.196",
    api: {
      host:
        process.env.NODE_ENV === "dev"
          ? "http://localhost:1337"
          : "https://shopping-list-bdd.herokuapp.com",
      listes: "/listes",
      produits: "/produits",
      categories: "/categories",
      stats: "/stats-consos",
      auth: "/auth/local",
      register: "/auth/local/register",
      userValidation: "/auth/send-email-confirmation",
      forgotPwd: "/auth/forgot-password",
      resetPwd: "/auth/reset-password"
    },
    env_name: process.env.NODE_ENV === "dev" ? "dev" : "prod",
    base_image_url: {
      categorie: base + "/img/categories",
      produit: base + "/img/produits"
    }
  },
  /**
   * Gitlab
   */
  router: {
    base
  },
  generate: {
    dir: "public"
  },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "spa",
  /*
   ** Custom page transition
   */
  /*pageTransition: {
    name: "balayage",
    mode: "out-in"
  },*/
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "static",
  /*
   ** custom barre de progression Nuxt
   */
  loading: {
    color: "#174069",
    height: "5px"
  },
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      }
    ]
  },
  /*
   ** Global CSS
   */
  css: ["~/assets/global.scss", "~/assets/scss/animation.scss"],
  styleRessources: {
    scss: ["./assets/scss/vars/*.scss"]
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ["~/plugins/nuxt-client-init.client.js"],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/style-resources"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    [
      "bootstrap-vue/nuxt",
      {
        icons: true
      }
    ],
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios"
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL:
      process.env.NODE_ENV === "dev"
        ? "http://localhost:1337"
        : "https://shopping-list-bdd.herokuapp.com"
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {}
};

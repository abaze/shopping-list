<template>
  <div>
    <overlay-load :show="show_overlay"></overlay-load>
    <b-row class="login-page">
      <div class="logoSite h1">
        <b-icon
          icon="cart"
          class="title-part title-icon animate__animated animate__fadeInLeft animate__delay-4s"
        ></b-icon>
        <span
          class="title-part first-part animate__animated animate__slideInRight"
          >Shop</span
        >
        <span class="title-part animate__animated animate__slideInRight">
          ping
        </span>
        <span class="title-part animate__animated animate__fadeInRight"
          >List</span
        >
      </div>
      <b-col md="6" offset-md="3">
        <b-row class="min-vh-100" align-v="center" align-h="center">
          <transition
            enter-active-class="animate__animated animate__fadeInDown animate__faster"
            leave-active-class="animate__animated animate__fadeOutDown animate__faster"
            mode="out-in"
            appear
          >
            <b-col v-if="show_login" lg="8" class="text-center" key="old_user">
              <h1 class="mb-3">Connectez-vous</h1>
              <p class="mb-3 text-white">Compte de démo</p>

              <b-form>
                <b-form-group id="input-group-1" label-for="input-1">
                  <b-form-input
                    id="input-1"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="Email"
                    size="lg"
                    readonly
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label-for="input-2">
                  <b-form-input
                    id="input-2"
                    v-model="form.password"
                    type="password"
                    required
                    placeholder="Mot de passe"
                    size="lg"
                    readonly
                    disabled
                  >
                  </b-form-input>
                  <template slot="description">
                    <p class="text-right">
                      <a class="cursor-pointer" @click="mdp_forget = true"
                        >Mot de passe oublié ?</a
                      >
                    </p>
                  </template>
                </b-form-group>
                <p v-show="form.error" class="text-white bg-danger p-2 mb-3">
                  {{ form.error }}
                </p>

                <b-button
                  @click="login"
                  pill
                  size="lg"
                  type="button"
                  variant="color-primary"
                  class="text-uppercase"
                >
                  <span v-if="loader"
                    ><b-spinner small></b-spinner>&nbsp;Connexion...</span
                  >
                  <span v-else>Se connecter</span>
                </b-button>
              </b-form>
            </b-col>
          </transition>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  // call the 'notAuth' middleware
  // if the user is logged, he will be redirect to the homepage
  middleware: "notAuth",
  // specific layout pour login
  layout: "login",
  data() {
    return {
      show_success_msg: false,
      show_login: true,
      mdp_forget: false,
      loader: false,
      show_overlay: false,
      form: {
        username: "",
        email: "test@test.com",
        password: "test123",
        error: null,
        msg: {
          status: null,
          text: null,
        },
      },
    };
  },
  methods: {
    ...mapActions({
      initStore: "initStore",
    }),
    reset() {
      this.form = {
        username: "",
        email: "",
        password: "",
        error: null,
        msg: {
          status: null,
          text: null,
        },
      };
    },
    login(e) {
      this.loader = true;
      // call the endpoint Strapi for authentification
      this.$axios
        .post(process.env.api.auth, {
          identifier: this.form.email,
          password: this.form.password,
        })
        .then((resp) => {
          // if its ok, get the jwt token, username and email (important to get the jwt)
          const { jwt } = resp.data;
          const { id, username, email } = resp.data.user;
          // call the SET_USER mutation to set the user var
          this.$store.commit("SET_USER", { id, jwt, username, email });
          // inject the user data to the localstorage
          // to reinject theme in the user after page refresh
          window.localStorage.setItem(
            "shoppingList-user-" + process.env.env_name,
            JSON.stringify({ id, jwt, username, email })
          );
          // the login page redirect the user to homepage
          // if the logged-user try to access at login page again
          // the middleware will redirect him to the homepage
          this.loader = false;
          this.show_overlay = true;
          setTimeout(() => {
            // on init les datas dans le store
            this.initStore();
            this.$router.push("/");
          }, 2000);
        })
        .catch((err) => {
          this.loader = false;
          this.form.error = "Identifiant ou mot de passe incorrect";
        });
    },
    register(e) {
      this.loader = true;
      // call the endpoint Strapi for authentification
      this.$axios
        .post(process.env.api.register, {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          confirmed: false,
        })
        .then((resp) => {
          // Une fois le user loggué
          // on le redirect vers la page login
          this.loader = false;
          this.show_success_msg = true;
          setTimeout(() => {
            this.show_login = true;
            this.show_success_msg = false;
          }, 10000);
        })
        .catch((err) => {
          this.loader = false;
          this.form.error = err.response;
        });
    },
    forget_mdp() {
      this.loader = true;
      // call the endpoint Strapi for authentification
      this.$axios
        .post(process.env.api.forgotPwd, {
          email: this.form.email,
        })
        .then((resp) => {
          // Une fois le mail envoyé
          // on notifie le user
          setTimeout(() => {
            this.form.msg.status = "success";
            this.form.msg.text =
              "Vous allez recevoir un mail de réintitialisation";
            this.loader = false;
          }, 3000);
        })
        .catch((err) => {
          this.form.msg.status = "error";
          this.form.msg.text = err.message;
          this.loader = false;
        });
    },
  },
  watch: {
    show_login: function (val) {
      this.reset();
      window.scroll(0, 0);
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/vars/vars";
body {
  overflow: hidden;
}

.login-page {
  background-color: $color1;
  background-image: $gradient_primary;
}

.logoSite {
  position: relative;
  top: 0;
  width: 100%;
  background-color: $primary;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 2rem;
  padding: 0.5rem;
  margin: auto;
  .title-part {
    color: $color4;
  }
}

@media (min-width: 768px) {
  .logoSite {
    position: absolute;
    background-color: transparent;
    top: 10px;
    right: 0;
    left: 0;
    text-align: center;
    display: flex;
    justify-content: center;
    z-index: 1;
    align-items: center;
    font-weight: 800;
    font-size: 4rem;
    padding: 0;
  }
}
</style>

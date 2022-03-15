<template>
  <div>
    <overlay-load :show="show_overlay"></overlay-load>
    <b-row>
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
      <b-col md="6">
        <b-row class="min-vh-100" align-v="center" align-h="center">
          <transition
            enter-active-class="animate__animated animate__fadeInDown animate__faster"
            leave-active-class="animate__animated animate__fadeOutDown animate__faster"
            mode="out-in"
            appear
          >
            <b-col v-if="show_login" lg="8" class="text-center" key="old_user">
              <b-row
                id="mdpForget"
                v-if="mdp_forget"
                class="position-absolute h-100 w-100 bg-white positon-relative animate__animated animate__fadeInDown animate__faster"
              >
                <a
                  class="close position-absolute right-0 top-0 cursor-pointer"
                  style="z-index:10"
                  @click="
                    mdp_forget = false;
                    form.msg.status = null;
                    form.msg.text = null;
                  "
                >
                  <b-icon icon="x" class="h1"></b-icon>
                </a>
                <b-col>
                  <p class="h1">Mot de passe oublié</p>
                  <p>
                    Veuillez entrer votre adresse email afin de procéder à
                    l'envoi d'un mail de réinitialisation
                  </p>
                  <b-form>
                    <b-form-group id="input-group-1" label-for="input-1">
                      <b-form-input
                        id="input-email-mdp"
                        v-model="form.email"
                        type="email"
                        required
                        placeholder="Email"
                        size="lg"
                      ></b-form-input>
                    </b-form-group>
                    <p
                      v-show="form.error"
                      class="text-white bg-danger p-2 mb-3"
                    >
                      {{ form.error }}
                    </p>
                    <b-button
                      v-if="!form.msg.status"
                      @click="forget_mdp"
                      pill
                      size="lg"
                      type="button"
                      variant="color-primary"
                      class="text-uppercase"
                    >
                      <span v-if="loader"
                        ><b-spinner small></b-spinner
                        >&nbsp;Vérification...</span
                      >
                      <span v-else>Demander un nouveau mot de passe</span>
                    </b-button>
                    <b-alert v-else show :variant="form.msg.status">
                      {{ form.msg.text }}
                    </b-alert>
                  </b-form>
                </b-col>
              </b-row>
              <h1 class="mb-2">Déjà inscrit ?</h1>
              <h2 class="mb-3">Connectez-vous</h2>

              <p class="mb-3">
                Pour accéder à tous les services, veuillez vous connecter à
                votre compte
              </p>

              <b-form>
                <b-form-group id="input-group-1" label-for="input-1">
                  <b-form-input
                    id="input-1"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="Email"
                    size="lg"
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
                <b-button
                  class="d-block d-sm-none mx-auto mt-2 text-color-primary"
                  variant="link"
                  @click="show_login = !show_login"
                >
                  Vous n'avez pas de compte ? C'est par ici
                </b-button>
              </b-form>
            </b-col>
            <b-col v-else lg="8" class="text-center" key="new_user">
              <h1>Rejoignez-nous</h1>
              <h2 class="mb-3">Créez votre compte</h2>
              <p class="mb-3">
                Pour accéder à tous les services, veuillez créer un compte
              </p>
              <b-form v-if="!show_success_msg">
                <b-form-group id="input-group-1" label-for="input-1">
                  <b-form-input
                    id="input-1"
                    v-model="form.username"
                    type="text"
                    required
                    placeholder="Pseudo"
                    size="lg"
                  ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label-for="input-2">
                  <b-form-input
                    id="input-2"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="Email"
                    size="lg"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-3" label-for="input-3">
                  <b-form-input
                    id="input-3"
                    v-model="form.password"
                    type="password"
                    required
                    placeholder="Mot de passe"
                    size="lg"
                  ></b-form-input>
                </b-form-group>
                <br /><br />
                <b-button
                  @click="register"
                  pill
                  size="lg"
                  type="button"
                  variant="color-primary"
                  class="text-uppercase"
                >
                  <span v-if="loader"
                    ><b-spinner small></b-spinner>&nbsp;Chargement...</span
                  >
                  <span v-else>S'enregister</span>
                </b-button>
                <b-button
                  class="d-block d-sm-none mx-auto mt-2 text-color-primary"
                  variant="link"
                  @click="show_login = !show_login"
                >
                  Vous avez déjà un compte ? C'est par ici
                </b-button>
              </b-form>

              <b-alert v-else show variant="success">
                <h4 class="alert-heading">Inscription réussie !</h4>
                <p>
                  Bienvenue parmis nous, vous allez recevoir un email de
                  confirmation sur {{ form.email }}.<br />
                  Une fois votre email confirmé, vous pourrez alors vous
                  connecter à votre compte.
                </p>
                <hr />
                <p class="mb-0">
                  Redirection vers le formulation de login en cours...
                </p>
              </b-alert>
            </b-col>
          </transition>
        </b-row>
      </b-col>
      <b-col
        class="d-none d-md-block"
        md="6"
        :class="{
          'bg-gradient-primary': show_login,
          'bg-gradient-secondary': !show_login
        }"
      >
        <transition
          enter-active-class="animate__animated animate__fadeInUp animate__faster"
          leave-active-class="animate__animated animate__fadeOutUp animate__faster"
          mode="out-in"
          appear
        >
          <b-row
            v-if="show_login"
            class="min-vh-100"
            align-v="center"
            align-h="center"
            key="panel_new_member"
          >
            <b-col lg="8" class="text-center">
              <h1>Bienvenue</h1>
              <br /><br />
              <p class="h5 text-white">
                Rejoignez-nous pour gérer au mieux votre budget pour les courses
              </p>
              <br /><br />
              <b-button
                @click="show_login = !show_login"
                pill
                size="lg"
                type="button"
                variant="success"
                class="text-uppercase font-weight-bold"
              >
                Créez votre compte
              </b-button>
            </b-col>
          </b-row>
          <b-row
            v-else
            class="min-vh-100"
            align-v="center"
            align-h="center"
            key="panel_old_member"
          >
            <b-col lg="8" class="text-center">
              <h1>Déjà membre ?</h1>
              <br /><br />
              <p class="h5 text-white">
                Identifiez-vous et c'est parti pour les courses !
              </p>
              <br /><br />
              <b-button
                @click="show_login = !show_login"
                pill
                size="lg"
                type="button"
                variant="success"
                class="text-uppercase font-weight-bold"
              >
                Me connecter
              </b-button>
            </b-col>
          </b-row>
        </transition>
      </b-col>
    </b-row>
  </div>
</template>

<script>
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
        email: "",
        password: "",
        error: null,
        msg: {
          status: null,
          text: null
        }
      }
    };
  },
  methods: {
    reset() {
      this.form = {
        username: "",
        email: "",
        password: "",
        error: null,
        msg: {
          status: null,
          text: null
        }
      };
    },
    login(e) {
      this.loader = true;
      // call the endpoint Strapi for authentification
      this.$axios
        .post(process.env.api.auth, {
          identifier: this.form.email,
          password: this.form.password
        })
        .then(resp => {
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
            this.$router.push("/");
          }, 2000);
        })
        .catch(err => {
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
          confirmed: false
        })
        .then(resp => {
          // Une fois le user loggué
          // on le redirect vers la page login
          this.loader = false;
          this.show_success_msg = true;
          setTimeout(() => {
            this.show_login = true;
            this.show_success_msg = false;
          }, 10000);
        })
        .catch(err => {
          this.loader = false;
          this.form.error = err.response;
        });
    },
    forget_mdp() {
      this.loader = true;
      // call the endpoint Strapi for authentification
      this.$axios
        .post(process.env.api.forgotPwd, {
          email: this.form.email
        })
        .then(resp => {
          // Une fois le mail envoyé
          // on notifie le user
          setTimeout(() => {
            this.form.msg.status = "success";
            this.form.msg.text =
              "Vous allez recevoir un mail de réintitialisation";
            this.loader = false;
          }, 3000);
        })
        .catch(err => {
          this.form.msg.status = "error";
          this.form.msg.text = err.message;
          this.loader = false;
        });
    }
  },
  watch: {
    show_login: function(val) {
      this.reset();
      window.scroll(0, 0);
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/vars/vars";
body {
  overflow: hidden;
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
  margin: auto;
  .title-part {
    color: #fff;
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
    .title-icon,
    .title-part.first-part {
      color: $primary;
    }
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1rem;
  }
}
</style>

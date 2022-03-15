<template>
  <div>
    <b-row>
      <b-col class="bg-gradient-primary min-vh-100">
        <div class="logoSite h1 mt-5">
          <b-icon
            icon="cart"
            class="animate__animated animate__fadeInLeft animate__delay-4s"
          ></b-icon>
          <span class="animate__animated animate__slideInRight"
            >Shopping List</span
          >
        </div>
        <b-row class="mt-5" align-h="center">
          <b-col lg="4">
            <h2 class="text-white">Créaton d'un nouveau mot de passe</h2>
            <p class="mb-3 text-white">
              Veuillez renseigner un nouveau mot de passe s'il vous plaît
            </p>

            <b-form>
              <b-form-group
                id="input-group-1"
                label-for="input-pwd"
                :class="{
                  'animate__fadeOutRight animate__faster': form.success
                }"
              >
                <b-form-input
                  id="input-pwd"
                  v-model="form.password"
                  type="password"
                  required
                  placeholder="Nouveau mot de passe"
                  size="lg"
                >
                </b-form-input>
              </b-form-group>
              <b-form-group
                id="input-group-2"
                label-for="input-pwd-2"
                :class="{
                  'animate__fadeOutRight animate__delay-1s animate__faster':
                    form.success
                }"
              >
                <b-form-input
                  v-if="form.password"
                  id="input-pwd-2"
                  v-model="form.confirm_password"
                  type="password"
                  required
                  placeholder="Confirmer votre nouveau mot de passe"
                  size="lg"
                  class="animate__animated animate__fadeInRight animate__delay-2s"
                >
                </b-form-input>
              </b-form-group>
              <b-alert
                class="animate__animated animate__fadeIn animate__faster"
                :show="form.msg.status ? true : false"
                :variant="form.msg.status"
              >
                {{ form.msg.text }}
              </b-alert>
              <b-button
                v-if="form.confirm_password"
                :disabled="
                  form.password !== form.confirm_password ? true : false
                "
                @click="save_mdp"
                pill
                size="lg"
                type="button"
                variant="color-primary"
                class="text-uppercase mx-auto d-block"
              >
                <span v-if="loader"
                  ><b-spinner small></b-spinner>&nbsp;Enregistrement...</span
                >
                <span v-else>Enregistrer nouveau mot de passe</span>
              </b-button>
            </b-form>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  // call the 'notAuth' middleware
  // if the user is logged, he will be redirect to the homepage
  // specific layout pour page confirmation
  layout: "login",
  data: () => {
    return {
      loader: false,
      form: {
        success: false,
        password: null,
        confirm_password: null,
        msg: {
          status: null,
          text: null
        }
      }
    };
  },
  methods: {
    save_mdp() {
      let code = this.$route.query.code || null;
      if (!code) {
        this.form.msg.status = "danger";
        this.form.msg.text = "Session inexistante";
      } else {
        this.loader = true;
        // call the endpoint Strapi for authentification
        this.$axios
          .post(process.env.api.resetPwd, {
            code,
            password: this.form.password,
            passwordConfirmation: this.form.confirm_password
          })
          .then(resp => {
            // Si traitement ok alors
            // on notifie le user
            setTimeout(() => {
              this.form.success = true;
              this.form.msg.status = "success";
              this.form.msg.text = "Votre mot de passe a bien été mis à jour";
              this.loader = false;
            }, 3000);
          })
          .catch(err => {
            this.form.msg.status = "error";
            this.form.msg.text = err.message;
            this.loader = false;
          });
      }
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/vars/vars";
body {
  overflow: auto;
}
.logoSite {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  font-size: 4rem;
  color: #fff;
}
@media (min-width: 768px) {
  body {
    overflow: hidden;
  }
}

@media (max-width: 576px) {
  .logoSite {
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 2rem;
    margin: auto;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1rem;
  }
}
</style>

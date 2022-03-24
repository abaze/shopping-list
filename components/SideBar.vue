<template>
  <div>
    <div
      id="leftNav"
      class="min-vh-100 overflow-hidden animate__animated animate__slideInLeft animate__faster bg-gradient-primary"
      v-if="expand"
    >
      <b-overlay :show="show_overlay" rounded="sm" class="min-vh-100">
        <b-nav pills vertical variant="primary">
          <b-nav-item class="brand" to="/">
            <b-icon icon="cart" class="mr-2"></b-icon>
            Shopping List
          </b-nav-item>
          <b-nav-item exact exact-active-class="active" to="/">
            <b-icon icon="graph-up" class="mr-2"></b-icon>
            Tableau de bord
          </b-nav-item>
          <b-nav-item exact exact-active-class="active" to="/planning">
            <b-icon icon="calendar2-date" class="mr-2"></b-icon>
            Planning des courses
          </b-nav-item>
          <b-nav-item
            v-if="isLogged"
            exact
            exact-active-class="active"
            to="/listes/add"
            ><b-icon icon="cart-plus" class="mr-2"></b-icon> Ajouter une liste
            de courses</b-nav-item
          >
          <b-nav-text class="separator mt-4"></b-nav-text>
          <b-nav-item
            v-if="!isLogged"
            exact
            exact-active-class="active"
            to="/login"
            >Se connecter</b-nav-item
          >
          <b-nav-item v-else @click="logout"
            ><b-icon icon="power" class="mr-2"></b-icon> Se
            déconnecter</b-nav-item
          >
        </b-nav>
        <span class="copyright"
          >ShoppingList - {{ new Date().getFullYear() }}</span
        >
      </b-overlay>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["expand"],
  data: () => {
    return {
      show_overlay: false,
    };
  },
  computed: {
    isLogged() {
      return this.$store.state.user ? true : false;
    },
    username() {
      return this.$store.state.user.username;
    },
  },
  methods: {
    ...mapActions({
      resetStore: "resetStore",
    }),
    logout() {
      const _this = this;
      this.show_overlay = true;
      this.$store.dispatch("logout").then(() => {
        this.$bvToast.toast("Vous êtes déconnecté de votre compte", {
          title: "Déconnexion réussie",
          toaster: "b-toaster-bottom-right",
          appendToast: true,
          variant: "danger",
        });
        setTimeout(() => {
          this.show_overlay = false;
          this.resetStore();
          // go to login page
          this.$router.push("/login");
        }, 2000);
      });
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/vars/vars";
#leftNav {
  position: absolute;
  width: 80%;
  z-index: 10;
}

#leftNav .nav-item:not(.brand) a {
  color: $color4;
  font-size: 1rem;
  font-weight: 500;
}
.brand {
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.brand > a {
  color: $color5;
  font-weight: 500;
  font-size: 1.4rem;
}
#leftNav .nav-item:not(.brand) a:hover,
#leftNav .nav-pills .nav-link.active,
#leftNav .nav-pills .show > .nav-link {
  background-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.95);
  border-radius: 0;
}
#leftNav .separator {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.copyright {
  position: absolute;
  left: 0px;
  bottom: 10px;
  width: 100%;
  text-align: center;
  color: #fff;
}
@media (min-width: 992px) {
  #leftNav {
    position: relative;
    width: 270px;
  }
}
</style>

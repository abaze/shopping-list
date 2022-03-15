<template>
  <div>
    <b-navbar id="navBar">
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <span v-if="isLogged">Bienvenue {{ username }}</span>
            <span v-else>Mon compte</span>
          </template>
          <b-dropdown-item v-if="!isLogged" to="/login"
            >Se connecter</b-dropdown-item
          >
          <b-dropdown-item v-else @click="logout"
            >Se déconnecter</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-button
        v-if="show_btn_menu"
        variant="white"
        @click="toggleSideBar(!expand)"
      >
        <b-icon-list v-if="!expand"></b-icon-list>
        <b-icon-x v-else></b-icon-x>
      </b-button>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      expand: false,
      show_btn_menu: null
    };
  },
  computed: {
    isLogged() {
      return this.$store.state.user ? true : false;
    },
    username() {
      return this.$store.state.user.username;
    }
  },
  watch: {
    "$route.path": function() {
      if (window.innerWidth < 992) {
        this.toggleSideBar(false);
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
    toggleSideBar(expand) {
      this.expand = expand;
      this.$emit("toggleSideBar", expand);
    },
    onResize() {
      if (window.innerWidth < 992) {
        this.show_btn_menu = true;
        if (this.expand) {
          this.toggleSideBar(false);
        }
      } else {
        this.show_btn_menu = false;
        if (!this.expand) {
          this.toggleSideBar(true);
        }
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }
};
</script>

<style>
#navBar {
  background-color: #fff;
  box-shadow: 0 5px 15px rgba(57, 98, 254, 0.07),
    0 3px 6px rgba(117, 108, 254, 0.02);
}
.btn:focus {
  box-shadow: none;
}
</style>

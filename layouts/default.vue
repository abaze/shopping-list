<template>
  <div class="wrap d-flex align-items-start">
    <side-bar :expand="expand"></side-bar>

    <b-container id="content_page" fluid class="vh-100 overflow-auto p-0">
      <nav-bar @toggleSideBar="sideBarToggle"></nav-bar>
      <Nuxt id="content_nuxt" />
    </b-container>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      expand: false,
    };
  },
  methods: {
    sideBarToggle(val) {
      this.expand = val;
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/vars/vars";
$navBarH: 62px;
#content_nuxt {
  position: relative;
  min-height: calc(100% - $navBarH);
  padding: 1rem;
  background-color: $color2;
}
</style>

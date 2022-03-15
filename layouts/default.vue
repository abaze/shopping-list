<template>
  <div class="wrap d-flex align-items-start min-vh-100">
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
      expand: false
    };
  },
  methods: {
    sideBarToggle(val) {
      this.expand = val;
    }
  }
};
</script>

<style>
#content_page {
  background-color: rgb(248, 247, 255);
}
#content_nuxt {
  padding: 1rem;
}
</style>

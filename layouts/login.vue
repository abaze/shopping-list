<template>
  <div>
    <b-container fluid class="vh-100 bg-white">
      <Nuxt />
    </b-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
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

<style></style>

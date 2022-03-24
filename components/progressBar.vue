<template>
  <div class="progressBar">
    <progress :max="max" :budget="budget" :value="percent">
      {{ percent }}%
    </progress>
    <span class="info">{{ percent }}% du budget</span>
  </div>
</template>

<script>
export default {
  props: {
    max: {
      type: Number,
      require: true,
      default: 100,
    },
    budget: {
      type: Number,
      require: true,
    },
  },
  computed: {
    percent() {
      return parseFloat((this.budget * this.max) / this.max).toFixed(2);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars/vars";
.progressBar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  progress {
    accent-color: $color1;
    margin: 0;
    width: 100%;
  }
  .info {
    font-size: 0.7rem;
    color: $color4;
  }
}
</style>

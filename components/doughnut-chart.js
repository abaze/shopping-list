import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: ["data", "options"],
  mounted() {
    const _this = this;
    this.$nextTick(() => {
      _this.renderChart(this.data, this.options);
    });
  }
};

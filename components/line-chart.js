import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["data", "options"],
  mounted() {
    const _this = this;
    this.$nextTick(() => {
      _this.renderChart(this.data, this.options);
    });
  }
};

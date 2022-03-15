<template>
  <div>
    <div :id="name"></div>
  </div>
</template>

<script>
export default {
  props: ["name", "value", "max", "color"],
  head: () => {
    return {
      script: [
        {
          src: "/libs/progressbar.min.js"
        }
      ]
    };
  },
  mounted() {
    let ProgressBar = require("progressbar.js");
    let bar = new ProgressBar.Circle("#" + this.name, {
      color: this.color,
      strokeWidth: 7,
      trailColor: "#eee",
      trailWidth: 7,
      text: {
        value: "",
        className: "circle-bar__label"
      },
      step: function(state, circle) {
        circle.setText((circle.value() * 100).toFixed(2) + "%");
      }
    });
    const percent = parseFloat((this.value * 100) / this.max / 100).toFixed(2);
    bar.text.style.fontFamily = "Helvetica, sans-serif";
    bar.text.style.fontWeight = "bold";
    bar.text.style.fontSize = "2rem";
    bar.text.style.color = "#000";
    bar.animate(percent);
  }
};
</script>

<style></style>

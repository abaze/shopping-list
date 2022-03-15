<template>
  <div v-if="show">
    <span class="text-center text-color-primary">
      <b-iconstack font-scale="3" animation="cylon">
        <b-icon stacked icon="cart4" animation="cylon" variant="color-primary">
        </b-icon>
      </b-iconstack>
      <p class="label-icon">Chargement...</p>
    </span>
  </div>
</template>

<script>
export default {
  props: ["show"]
};
</script>

<style>
.label-icon {
  font-size: 0.7rem;
}
</style>

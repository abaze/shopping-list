!<template>
  <div>
    <b-overlay fixed no-wrap :show="show">
      <template v-slot:overlay>
        <div class="text-center">
          <loader :show="true"></loader>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
export default {
  props: ["show"]
};
</script>

<style></style>

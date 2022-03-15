<template>
  <b-row>
    <b-card
      v-for="product in products"
      :key="'produit-' + product.id"
      :title="product.name"
      :img-src="
        product.image
          ? `${process.env.base_image_url.produit}/${product.image}`
          : null
      "
      :img-alt="product.name"
      img-top
      tag="article"
      style="max-width: 20rem;"
      class="mb-2"
    >
      <b-card-text>Prix : {{ product.price }}</b-card-text>
    </b-card>
  </b-row>
</template>

<script>
export default {
  data: () => {
    return {
      products: null
    };
  },
  methods: {
    getProducts() {
      this.$axios.$get(process.env.api.produits).then(products => {
        this.products = products;
      });
    }
  },
  mounted() {
    this.getProducts();
  }
};
</script>

<style></style>

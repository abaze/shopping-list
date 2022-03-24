<template>
  <div>
    <b-dropdown
      v-if="!is_selected_product"
      block
      variant="warning"
      class="mb-2"
    >
      <template slot="button-content">
        {{ "Choisissez un produit..." }}
      </template>
      <b-dropdown-item-button
        v-for="produit in produits_of_cat"
        :key="produit.id || 0"
        @click="select_product(produit)"
      >
        <div class="d-flex align-items-center justify-content-between">
          <span>
            <img
              v-if="produit.image"
              width="50"
              :src="produit.image"
              :alt="produit.name"
            />&nbsp;
            {{ produit.name }}
          </span>
          <span class="font-weight-bold"> {{ produit.price }} &euro; </span>
        </div>
      </b-dropdown-item-button>
    </b-dropdown>
    <b-list-group v-else class="mb-3">
      <b-list-group-item>
        <span class="d-flex align-items-center justify-content-between">
          <span>
            <img width="50" :src="selected_product.image" class="mr-1" />
            {{ selected_product.name }}
          </span>

          <b-form-spinbutton
            :inline="true"
            v-model="product_quantity"
            min="1"
            max="100"
          ></b-form-spinbutton>

          <span class="font-weight-bold">
            {{ selected_product.price }} &#8364;</span
          >

          <span class="cursor-pointer" @click="delete_product">
            <b-icon-x-circle></b-icon-x-circle>
          </span>
        </span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["categorie", "recovered_produit"],
  data: () => {
    return {
      produits_of_cat: [],
      is_selected_product: false,
      product_quantity: 1,
      selected_product: null,
      id_saved_panier: null,
    };
  },
  computed: {
    ...mapState({
      all_products: (state) => state.all_products,
      panier: (state) => state.panier,
    }),
  },
  methods: {
    get_produits_of_cat() {
      if (this.all_products) {
        const produits_cat = this.all_products.filter(
          (produit) => produit.id_cat === this.categorie.id
        );
        if (
          this.panier.produits.find((cat) => cat.id_cat === this.categorie.id)
        ) {
          const product_panier = this.panier.produits
            .find((cat) => cat.id_cat === this.categorie.id)
            .produits.map((p) => p.id);
          return produits_cat.filter((p) => !product_panier.includes(p.id));
        } else {
          return produits_cat;
        }
      }
    },
    delete_product() {
      this.is_selected_product = false;
      this.product_quantity = 1;
      // on transmet l'id du produit à delete
      this.$emit("removePanier", this.selected_product.id, this.$vnode.key);
      // destroy the vue listeners, etc
      //this.$destroy();
      // remove the element from the DOM
      //this.$el.parentNode.removeChild(this.$el);

      // on vide notre data dans le component
      this.selected_product = null;
    },
    select_product(produit) {
      this.is_selected_product = true;
      // on maj le label du dropdown pour voir ce qu'on vient de selectionner
      //on prepare la variable contenant toutes les infos à injecter en BDD
      this.selected_product = {
        id: produit.id,
        quantity: this.product_quantity,
        price: produit.price,
        image: produit.image,
      };

      this.$emit("addPanier", {
        id: produit.id,
        quantity: this.product_quantity,
      });
    },
  },
  watch: {
    product_quantity: function (val) {
      // a chaque changement de la quantite, on envoie les info maj au parent
      if (this.selected_product) {
        this.$emit("majPanier", {
          id: this.selected_product.id,
          quantity: val,
        });
      }
    },
    "panier.produits": function (val) {
      this.produits_of_cat = this.get_produits_of_cat();
    },
  },
  mounted() {
    if (this.all_products) {
      this.produits_of_cat = this.get_produits_of_cat();
    }
    if (this.recovered_produit) {
      this.select_product(this.recovered_produit);
      this.product_quantity = this.recovered_produit.quantity;
    }
  },
};
</script>

<style>
.b-dropdown .dropdown-menu.show {
  width: 100%;
}
.b-dropdown .dropdown-menu.show > li {
  border-bottom: 1px solid #ccc;
}
</style>

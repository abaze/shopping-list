<template>
  <div>
    <b-card no-body class="mb-5">
      <b-card-header>
        <div class="d-flex align-items-center">
          <img
            :src="categorie.image"
            :alt="categorie.name"
            width="165"
            class="mr-3"
          />
          <h3>{{ categorie.name }}</h3>
        </div>
      </b-card-header>
      <b-card-body>
        <b-list-group flush>
          <add-single-product
            v-for="(component, index) in list_product_components"
            :categorie="categorie"
            :key="component.id"
            :is="component.comp"
            :recovered_produit="recovered_article[index]"
            @addPanier="addPanier"
            @majPanier="majPanier"
            @removePanier="removePanier"
          ></add-single-product>
          <b-list-group-item
            class="d-flex align-items-center justify-content-between"
          >
            <span> <strong>Nb Produits : </strong>{{ total_quantity }}</span>
            <span> <strong>Total HT : </strong>{{ total_ht }} &#8364;</span>
            <span> <strong>Total TTC : </strong>{{ total_ttc }} &#8364;</span>
          </b-list-group-item>
        </b-list-group>
      </b-card-body>

      <b-card-footer>
        <b-button
          :disabled="more_product"
          @click="addProductLine"
          block
          variant="primary"
          >Ajouter un produit</b-button
        >
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AddSingleProductVue from "./AddSingleProduct.vue";
export default {
  props: ["categorie_id", "recovered_data"],
  data: () => {
    return {
      product_components: [],
      panier_cat: {},
      total: {
        quantity: 0,
        ht: 0,
        ttc: 0
      },
      recovered_article: []
    };
  },
  computed: {
    ...mapState({
      all_products: state => state.all_products,
      categories: state => state.categories
    }),
    list_product_components() {
      return this.product_components;
    },
    // on get toutes les infos de la categorie en cours (on recupere un l'objet categorie du store)
    categorie() {
      if (this.categories) {
        return this.categories.find(
          cat => cat.id === parseInt(this.categorie_id)
        );
      }
    },
    more_product() {
      if (this.all_products) {
        const products_cat = this.all_products.filter(
          produit => produit.id_cat === this.categorie.id
        );
        return this.list_product_components.length === products_cat.length
          ? true
          : false;
      }
    },
    total_quantity() {
      if (this.panier_cat.produits.length > 0) {
        return this.panier_cat.produits
          .map(p => p.quantity)
          .reduce((total, val) => total + val);
      } else {
        return 0;
      }
    },
    total_ht() {
      if (this.panier_cat.produits.length > 0) {
        return this.panier_cat.produits
          .map(p => {
            let product_price = this.all_products.find(
              article => article.id === p.id
            ).price;
            console.log("product price : " + product_price);
            return parseFloat(product_price * parseInt(p.quantity)).toFixed(2);
          })
          .reduce((total, val) => parseFloat(total) + parseFloat(val));
      } else {
        return 0;
      }
      return 0;
    },
    total_ttc() {
      return this.total_ht > 0
        ? parseFloat(this.total_ht * 1.196).toFixed(2)
        : 0;
      return 0;
    }
  },
  methods: {
    // fonction qui ajoute une nouvelle ligne de produit à la volée
    addProductLine() {
      // on differencie l'index du tableau de comp et l'index du component
      // si on delete un component, faire attention que le ":key" ne change pas
      // pour les autres comp, sinon ils seront re-rendu/reinitialise
      const id = this.product_components.length || 0;
      const id_comp = Date.now();

      // on demande à Vue d'ajouter un item de manière reactive
      this.$set(this.product_components, id, {
        comp: AddSingleProductVue,
        id: id_comp
      });
    },
    addPanier(produit) {
      // on verifie si le produit existe deja dans le panier_cat
      const index_product = this.panier_cat.produits.findIndex(
        p => p.id === produit.id
      );
      if (index_product < 0) {
        this.panier_cat.produits.push(produit);
        this.panier_cat.price = this.total_ttc;
      }
      // on envoie les datas au panier store
      this.$store.commit(
        "MAJ_PANIER",
        JSON.parse(JSON.stringify(this.panier_cat))
      );
    },
    // on envoie l'id de lenregistrement a supprimer
    removePanier(id_product, id_component) {
      // on supprime le produit dans le panier_cat grace a l'id en param
      this.panier_cat.produits = this.panier_cat.produits.filter(p => {
        return p.id != id_product;
      });
      this.panier_cat.price = this.total_ttc;
      // on recupere l'index du composant ayant 'id_component' en index
      const index_comp = this.product_components.findIndex(
        c => c.id === id_component
      );
      // on dit à Vue de supprimer l'item de l'array de manière reactive
      this.$delete(this.product_components, index_comp);

      // on envoie les datas au panier store
      this.$store.commit(
        "MAJ_PANIER",
        JSON.parse(JSON.stringify(this.panier_cat))
      );
    },
    majPanier(new_data) {
      let index_to_remove = this.panier_cat.produits.findIndex(
        p => p.id === new_data.id
      );
      this.panier_cat.produits.push(new_data);
      this.panier_cat.produits.splice(index_to_remove, 1);
      this.panier_cat.price = this.total_ttc;
      // on envoie les datas au panier store
      this.$store.commit(
        "MAJ_PANIER",
        JSON.parse(JSON.stringify(this.panier_cat))
      );
    }
  },
  created() {
    const _this = this;
    this.panier_cat = {
      id_cat: this.categorie_id,
      price: 0,
      produits: []
    };

    if (this.recovered_data) {
      this.recovered_data.forEach(function(cat) {
        if (cat.id_cat === _this.categorie_id) {
          cat.produits.forEach(function(produit) {
            _this.recovered_article.push(produit);
            _this.addProductLine();
          });
        }
      });
    } else {
      this.addProductLine();
    }
  },
  mounted() {}
};
</script>

<style></style>

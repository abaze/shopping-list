<template>
  <div>
    <b-row align-h="center">
      <b-col lg="7">
        <b-card
          v-if="data_liste"
          no-body
          class="animate__animated animate__fadeInRight"
          variant="color-primary"
        >
          <b-card-header class="bg-color-primary">
            Récapitulatif courses du {{ data_liste.date }}
          </b-card-header>
          <b-list-group flush class="text-center">
            <b-list-group-item>
              <span class="prix_ttc"
                >{{
                  parseFloat(animateTTC)
                    .toFixed(2)
                    .replace(".", ",")
                }}
                &#8364;</span
              >
              <span class="info-text">
                / sur les
                <strong>{{ data_liste.budget }}</strong> &#8364; prévus
              </span>
            </b-list-group-item>
            <b-list-group-item>
              <strong>{{ data_liste.count_produits }}</strong> articles dans le
              caddie
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-col>
    </b-row>
    <br />
    <b-row v-if="data_by_cat">
      <b-col>
        <h1 class="animate__animated animate__fadeInRight">
          Répartition du budget
        </h1>
        <br />
        <b-row align-h="start">
          <b-col
            md="6"
            xl="4"
            v-for="(categorie, index) in data_by_cat"
            :class="
              'animate__animated animate__fadeInRight animate__delay-' +
                index +
                's'
            "
            :key="index"
          >
            <b-card no-body>
              <b-card-header class="bg-color-primary">
                <div class="text-center">
                  <div>
                    <span class="h4 align-middle">{{ categorie.name }}</span>
                  </div>
                  <span class="h6">
                    {{ parseFloat(categorie.total_price).toFixed(2) }} &#8364;/
                    {{ categorie.total_product }} articles
                  </span>
                </div>
              </b-card-header>
              <b-card-body>
                <circle-bar
                  :name="'cat-' + index"
                  :value="categorie.total_price"
                  :max="data_liste.budget"
                  :color="'green'"
                ></circle-bar>
                <b-list-group flush>
                  <b-list-group-item
                    v-for="(article, index2) in categorie.list_articles"
                    :key="index2"
                  >
                    <span
                      class="item-by-cat d-flex align-items-center justify-content-between"
                    >
                      <span class="mr-2">
                        <img width="40" :src="article.image" class="mr-1" />
                      </span>
                      <span class="mr-2">x {{ article.quantity }}</span>
                      <span>
                        total : <strong>{{ article.price }} &#8364;</strong>
                      </span>
                    </span>
                  </b-list-group-item>
                </b-list-group>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["id"],
  head: () => {
    return {
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"
        }
      ]
    };
  },
  data: () => {
    return {
      data_liste: null,
      data_by_cat: [],
      animateTTC: 0,
      TVA: 1.196
    };
  },
  computed: {
    ...mapState({
      categories: state => state.categories,
      all_products: state => state.all_products
    })
  },
  watch: {
    "data_liste.prix": function(val) {
      this.animateNumber({ val, targetVar: "animateTTC" });
    }
  },
  methods: {
    async getListe(id) {
      const _this = this;
      if (id) {
        await this.$axios.get(process.env.api.listes + "/" + id).then(data => {
          let resp = data.data;
          this.data_liste = {
            date: resp.date,
            count_produits: resp.count_produits,
            prix: parseFloat(resp.price).toFixed(2),
            budget: resp.budget
          };
          // on recupere tous les produits pour les tirer par cat (prix total/cat etc)
          this.getCatData(resp.produits);
        });
      }
    },
    getCatData(produits) {
      const _this = this;
      const data_by_cat = [];
      let i = 0;
      for (const produit of produits) {
        let cat = this.categories.find(cat => cat.id === produit.id_cat);
        this.data_by_cat.push({
          name: cat.name,
          total_price: 0,
          total_product: 0,
          list_articles: []
        });

        produit.produits.forEach(function(article) {
          const quantityArticle = parseInt(article.quantity);
          const prixUnitaire = _this.$store.state.all_products.find(
            p => p.id === article.id
          ).price;
          const prixArticle = prixUnitaire * quantityArticle;
          _this.data_by_cat[i].list_articles.push({
            name: _this.$store.state.all_products.find(p => p.id === article.id)
              .name,
            image: _this.$store.state.all_products.find(
              p => p.id === article.id
            ).image,
            quantity: quantityArticle,
            price: parseFloat(prixArticle * _this.TVA).toFixed(2)
          });

          _this.data_by_cat[i].total_price =
            _this.data_by_cat[i].total_price + prixArticle * _this.TVA;

          _this.data_by_cat[i].total_product += quantityArticle;
        });
        i++;
      }
    },
    animateNumber({ val, duration = 1, targetVar }) {
      gsap.to(this.$data, {
        duration: duration,
        [targetVar]: val
      });
    }
  },
  mounted() {
    this.getListe(this.id);
  }
};
</script>

<style scoped>
.prix_ttc {
  font-size: 5rem;
  font-weight: bold;
}
.item-by-cat {
  font-size: 11px;
}
.info-text {
  font-size: 0.7rem;
}
</style>

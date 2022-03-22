<template>
  <div>
    <box-stats-moy :data="data_depense"></box-stats-moy>
    <b-row align-h="start">
      <b-col sm="6" xl="4" class="text-center">
        <line-chart
          class="m-3 shadow-sm bg-white rounded animate__animated animate__fadeInUp"
          v-if="!loader.line"
          :data="data_chart"
          :options="options"
        ></line-chart>
        <loader v-else :show="loader" class="m-5"></loader>
      </b-col>
      <b-col sm="6" xl="4" class="text-center">
        <doughnut-chart
          class="m-3 shadow-sm bg-white rounded animate__animated animate__fadeInUp animate__delay-1s"
          v-if="!loader.doughnut"
          :data="data_doughnut"
          :options="options"
        ></doughnut-chart>
        <loader v-else :show="loader" class="m-5"></loader>
      </b-col>
      <b-col xl="4" class="p-3 text-center">
        <b-card
          v-if="data_depense"
          no-body
          class="animate__animated animate__fadeInUp animate__delay-2s shadow-sm h-100"
        >
          <b-card-header>
            <h6>Dépenses par catégorie</h6>
          </b-card-header>
          <b-list-group flush class="rounded bg-white">
            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
              v-for="(cat, index) in data_depense.depense_cat"
              :key="index"
            >
              <span>
                <b-icon
                  icon="circle-fill"
                  class="mr-2"
                  :style="{
                    color: categories.find((c) => c.id === cat.id_cat).color,
                  }"
                ></b-icon>
                {{ categories.find((c) => c.id === cat.id_cat).name }}
              </span>
              <span>{{ parseFloat(cat.price).toFixed(2) }} €</span>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-if="best_product">
      <b-col class="p-3">
        <div
          class="shadow-sm bg-white rounded animate__animated animate__fadeInRight"
        >
          <h5 class="p-3">
            Top achat depuis le
            {{
              all_listes
                ? `${new Date(all_listes[0].date).getDate()}/${
                    new Date(all_listes[0].date).getMonth() + 1
                  }/${new Date(all_listes[0].date).getFullYear()}`
                : "??/??/???"
            }}
          </h5>
          <b-table
            v-if="best_product.items"
            id="topAchat"
            :fields="best_product.fields"
            :items="best_product.items"
            responsive
            small
          >
            <!-- A custom formatted column -->
            <template v-slot:cell(photo)="data">
              <img :src="data.value" alt="" width="50" />
            </template>
            <template v-slot:cell(pu)="data">
              {{ data.value }} &#8364;
            </template>
            <template v-slot:cell(prix)="data">
              <strong>{{ parseFloat(data.value).toFixed(2) }} &#8364;</strong>
            </template>
          </b-table>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LineChart from "~/components/line-chart";
export default {
  middleware: ["auth"],
  components: {
    LineChart,
  },
  async asyncData({ app, params, store }) {
    // on lance la recuperation des produits et categories globales
    await store.dispatch("GET_PRODUITS");
    await store.dispatch("GET_CATEGORIES");
    await store.dispatch("GET_LISTES");

    const resp = await app.$axios.get(
      process.env.api.stats + "?user=" + store.state.user.id
    );

    const data = resp.data[0];
    return {
      data_depense: {
        depense_moy: data.price_moy,
        article_moy: data.articles_moy,
        frequence_moy: data.frequence_moy,
        depense_cat: data.depense_cat,
      },
    };
  },
  data: () => {
    return {
      loader: {
        line: false,
        doughnut: false,
      },
      options: {
        animation: {
          duration: 3000,
        },
      },
    };
  },
  computed: {
    ...mapState({
      all_listes: (state) => state.all_listes,
      categories: (state) => state.categories,
      all_products: (state) => state.all_products,
    }),
    data_chart() {
      if (this.all_listes) {
        return {
          labels: this.all_listes.map(
            (stat) =>
              `${new Date(stat.date).getDate()}/${
                new Date(stat.date).getMonth() + 1
              }/${new Date(stat.date).getFullYear()}`
          ),
          datasets: [
            {
              label: "Courbe des dépenses",
              backgroundColor: "#14ABEF",
              borderColor: "rgb(70,151,255)",
              data: this.all_listes.map((stat) => stat.price),
              pointStyle: "rectRot",
              pointRadius: 5,
              pointBorderWidth: 5,
              pointBorderColor: "orange",
              pointBackgroundColor: "orange",
            },
          ],
        };
      }
    },
    data_doughnut() {
      if (this.categories && this.data_depense) {
        return {
          labels: this.data_depense.depense_cat.map(
            (dcat) => this.categories.find((cat) => cat.id === dcat.id_cat).name
          ),
          datasets: [
            {
              label: "Répartition par catégorie",
              backgroundColor: this.data_depense.depense_cat.map(
                (dcat) =>
                  this.categories.find((cat) => cat.id === dcat.id_cat).color
              ),
              data: this.data_depense.depense_cat.map((cat) => cat.price),
            },
          ],
        };
      }
    },
    best_product() {
      const _this = this;
      let fields_table = [
        { key: "photo", label: "Produit" },
        { key: "pu", label: "Prix HT" },
        "quantite",
        { key: "prix", label: "Total TTC" },
      ];
      let produits_buy = [];
      if (this.all_listes) {
        this.all_listes.forEach(function (liste) {
          liste.produits.forEach(function (cat) {
            cat.produits.forEach(function (p, i) {
              const price = _this.all_products.find(
                (pr) => pr.id === p.id
              ).price;
              const photo = _this.all_products.find(
                (pr) => pr.id === p.id
              ).image;
              const quantity = p.quantity;
              // si le produit nexiste pas dans le tableau de cumul on lajoute
              if (!produits_buy.find((article) => article.id === p.id)) {
                produits_buy.push({
                  id: p.id,
                  photo: photo,
                  pu: price,
                  quantite: p.quantity,
                  prix: parseFloat(price * p.quantity * process.env.TVA),
                });
              } else {
                // sinon sil existe deja, on maj la quantite et le prix
                produits_buy.find((prod) => prod.id === p.id).quantite +=
                  parseInt(p.quantity);
                produits_buy.find((prod) => prod.id === p.id).prix +=
                  parseFloat(quantity * price * process.env.TVA);
              }
            });
          });
        });
        return {
          fields: fields_table,
          items: produits_buy.sort(
            (a, b) => parseFloat(b.prix) - parseFloat(a.prix)
          ),
        };
      }
    },
  },
  methods: {
    initLineChart() {
      // on recupe les listes pour les graphs
      this.data_chart.labels = this.all_listes.map(
        (stat) =>
          `${new Date(stat.date).getDate()}/${
            new Date(stat.date).getMonth() + 1
          }/${new Date(stat.date).getFullYear()}`
      );

      this.data_chart.datasets[0].data = this.all_listes.map(
        (stat) => stat.price
      );

      this.loader.doughnut = false;
    },
    initDoughnutChart() {
      // on recupe les listes pour les graphs
      this.data_doughnut.labels = this.data_depense.depense_cat.map(
        (cat) => cat.name
      );

      this.data_doughnut.datasets[0].data = this.data_depense.depense_cat.map(
        (cat) => parseFloat(cat.price).toFixed(2)
      );

      this.data_doughnut.datasets[0].backgroundColor =
        this.data_depense.depense_cat.map((cat) => cat.color);

      this.loader.line = false;
    },
  },
};
</script>

<style>
#topAchat td {
  vertical-align: middle;
  font-size: 0.8rem;
}
</style>

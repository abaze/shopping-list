<template>
  <div>
    <b-overlay v-if="!show_recap" :show="show_save_overlay">
      <h1>Modifiez votre liste de course</h1>
      <b-form>
        <b-form-group
          class="animate__animated animate__fadeInRight position-relative"
          style="z-index:1"
          label="Date de vos course"
        >
          <b-form-datepicker
            disabled
            v-model="form.dateCourse"
            class="mb-2 w-25 min-w-300"
          ></b-form-datepicker>
        </b-form-group>

        <b-form-group
          label="Votre limite de budget ?"
          class="animate__animated animate__fadeInRight"
        >
          <b-row>
            <b-col sm="6">
              <b-input-group size="lg" append="€" class="w-25 min-w-300">
                <b-form-input disabled v-model="form.budget_max"></b-form-input>
              </b-input-group>
            </b-col>
            <b-col
              class="h1 animate__animated animate__zoomIn min-w-300 text-right"
              :class="'text-' + status_color"
            >
              Total TTC :
              <strong>{{ parseFloat(animatedTTC).toFixed(2) }} &#8364;</strong>
            </b-col>
          </b-row>
          <b-progress
            class="animate__animated animate__fadeInLeft mt-2"
            :max="form.budget_max"
            height="2rem"
            :variant="status_color"
          >
            <b-progress-bar
              :value="total_restant_depense < 0 ? 0 : total_restant_depense"
              striped
              animated
            >
              <span>
                <strong v-if="status_color == 'success'">
                  <b-iconstack font-scale="1.5" class="align-middle mr-1">
                    <b-icon stacked icon="circle"></b-icon>
                    <b-icon stacked icon="check"></b-icon>
                  </b-iconstack>
                  Reste {{ parseFloat(animatedRestant).toFixed(2) }} &#8364; à
                  dépenser
                </strong>
                <strong v-else-if="status_color == 'warning'">
                  <b-icon
                    icon="exclamation-circle"
                    class="align-middle mr-1"
                    font-scale="1.5"
                  ></b-icon>
                  Reste {{ parseFloat(animatedRestant).toFixed(2) }} &#8364; à
                  dépenser
                </strong>
                <strong v-else class="text-danger">
                  <b-icon
                    icon="exclamation-triangle-fill"
                    animation="throb"
                    class="align-middle mr-1"
                    font-scale="1.5"
                  ></b-icon>
                  Vous dépassez votre budget de
                  {{ parseFloat(animatedRestant).toFixed(2) }} &#8364;
                </strong>
              </span>
            </b-progress-bar>
          </b-progress>
        </b-form-group>

        <b-form-group
          v-if="form.budget_max"
          label="De quoi avez-vous besoin ?"
          description="Remplissez chaque catégorie des produits dont vous avez besoin"
        >
          <b-form-row>
            <b-col
              cols="12"
              xl="6"
              v-for="(categorie, index) in categories"
              :key="categorie.id"
            >
              <add-products
                v-if="ready_product_line"
                :key="categorie.name"
                :categorie_id="categorie.id"
                :recovered_data="panier_recovered"
                @majProduct="maj_product"
                :class="
                  'animate__animated animate__bounceInRight animate__delay-' +
                    index +
                    's'
                "
              ></add-products>
            </b-col>
          </b-form-row>
        </b-form-group>

        <b-button
          v-if="total_facture_ttc > 0"
          v-b-modal.modal-save
          size="lg"
          class="w-100 animate__animated animate__fadeInRight"
          variant="color-primary"
          >Enregistrer les modifications</b-button
        >
        <b-modal id="modal-save" title="Confirmation" @ok="saveListe">
          <p class="my-4">Êtes-vous sûr de n'avoir rien oublié ?</p>
        </b-modal>
      </b-form>
    </b-overlay>
    <!-- RECAP VIEW -->
    <div v-else>
      <b-row>
        <b-col>
          <span class="h3">Votre liste a été modifiée avec succès !</span>
          <hr />
        </b-col>
      </b-row>
      <recap-liste :id="id_recap"></recap-liste>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  data: () => {
    return {
      // boolean qui permettra de remettre les composants enfants à 0 (via v-if dans le template)
      ready_product_line: true,
      // pour les envoyer aux composants enfants
      categories: null,
      // pour authentificaton via store/localstorage
      user: {
        jwt: null
      },
      form: {
        dateCourse: null,
        budget_max: null
      },
      // contiendra l'ensemble des listes de chaque categories
      panier: [],
      // animation du total TTC
      animatedTTC: 0,
      animatedRestant: 0,
      show_save_overlay: false,
      show_recap: false,
      id_recap: null,
      datesListes: []
    };
  },
  head: () => {
    return {
      title: "Composez votre liste de course tout en surveillant votre budget",
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"
        }
      ]
    };
  },
  async asyncData({ params, $axios }) {
    const data = await $axios.$get("/listes/" + params.id);
    return {
      form: {
        dateCourse: data.date || null,
        budget_max: data.budget || null
      },
      panier_recovered: data.produits || null,
      id_liste: params.id
    };
  },
  computed: {
    state_date() {
      if (this.form.dateCourse) {
        return !this.datesListes.includes(this.form.dateCourse);
      } else {
        return null;
      }
    },
    total_facture_ht() {
      if (this.panier.length > 0) {
        let total = 0;
        this.panier.forEach(cat => {
          cat.produits.forEach(p => {
            total += parseFloat(p.price * parseInt(p.quantity));
          });
        });
        return total;
      } else {
        return 0;
      }
    },
    total_facture_ttc() {
      if (this.total_facture_ht) {
        return this.total_facture_ht > 0
          ? parseFloat(this.total_facture_ht * 1.196).toFixed(2)
          : 0;
      }
    },
    count_produits() {
      if (this.panier.length > 0) {
        let total = 0;
        this.panier.forEach(cat => {
          cat.produits.forEach(p => {
            total += parseInt(p.quantity);
          });
        });
        return total;
      } else {
        return 0;
      }
    },
    total_restant_depense() {
      if (this.form.budget_max && this.total_facture_ttc) {
        return parseFloat(
          this.form.budget_max - this.total_facture_ttc
        ).toFixed(2);
      }
    },
    status_color() {
      const trancheGood = parseInt(this.form.budget_max / 2);
      if (this.total_restant_depense >= trancheGood) {
        return "success";
      } else if (this.total_restant_depense <= 0) {
        return "danger";
      } else {
        return "warning";
      }
    }
  },
  watch: {
    total_facture_ttc: function(val) {
      this.animateNumber({ val, targetVar: "animatedTTC" });
    },
    total_restant_depense: function(val) {
      this.animateNumber({ val, targetVar: "animatedRestant" });
    }
  },
  methods: {
    dateDisabled(ymd, date) {
      // on disable toutes les dates passées
      let today = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      );
      return date < today;
    },
    async getDatesListes() {
      this.datesListes = await this.$axios
        .get(process.env.api.listes)
        .then(resp => resp.data)
        .then(listes => {
          return listes.map(liste => liste.date);
        });
    },
    listExist(ymd, date) {
      return this.datesListes.includes(ymd) ? "bg-warning disable" : "";
    },
    maj_product(saved_info) {
      // si le panier est totalement vide alors on push toute la data
      if (
        this.panier.length == 0 ||
        this.panier.filter(cat => cat.id_cat == saved_info.id_cat).length == 0
      ) {
        this.panier.push(saved_info);
      } else {
        this.panier.forEach(function(item) {
          if (item.id_cat == saved_info.id_cat) {
            item = saved_info;
          }
        });
      }
    },
    saveListe() {
      const _this = this;
      this.show_save_overlay = true;

      // injection data dans la BDD
      this.$axios
        .put(
          process.env.api.listes + "/" + this.id_liste,
          {
            date: this.form.dateCourse,
            budget: this.form.budget_max,
            prix: this.total_facture_ttc,
            produits: this.panier,
            count_produits: this.count_produits
          },
          {
            headers: {
              Authorization: `Bearer ${this.user.jwt}`
            }
          }
        )
        .then(res => {
          // on reset toutes les var pour preparer une nouvelle liste
          this.form.dateCourse = null;
          this.panier = [];
          this.ready_product_line = false;
          this.id_recap = res.data.id;

          setTimeout(() => {
            _this.show_save_overlay = false;

            _this.show_recap = true;
          }, 3000);
        });
    },
    animateNumber({ val, duration = 0.5, targetVar }) {
      if (gsap) {
        gsap.to(this.$data, {
          duration: duration,
          [targetVar]: val
        });
      }
    }
  },
  // on recupere les categories au chargement de la page via le store
  async fetch({ store, params }) {
    await store.dispatch("GET_CATEGORIES");
  },
  mounted() {
    this.categories = this.$store.state.categories;
    this.user.jwt = this.$store.state.user.jwt;
    this.ready_product_line = true;
    this.getDatesListes();
  }
};
</script>

<style scoped>
.progress-bar {
  overflow: initial;
}
</style>

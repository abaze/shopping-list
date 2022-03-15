<template>
<div>
  <overlay-load :show="show_save_overlay"></overlay-load>
  <div v-if="!show_recap">
      <h1>Créez votre liste de course</h1>
      <b-form>
        <b-form-group
          class="animate__animated animate__fadeInRight position-relative"
          style="z-index:1"
          label="Pour quel jour ?"
          description="A quelle date souhaitez-vous faire vos courses ?"
        >
          <b-form-datepicker
            id="example-datepicker"
            v-model="form.dateCourse"
            class="mb-2 w-25 min-w-300"
            :date-disabled-fn="dateDisabled"
            aria-describedby="input-live-date"
            :date-info-fn="listExist"
            :state="state_date"
            dropright
          ></b-form-datepicker>
          <b-form-invalid-feedback id="input-live-date">
            Il y a déjà des courses prévues à cette date
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          v-if="form.dateCourse && state_date == true"
          label="Votre limite de budget ?"
          class="animate__animated animate__fadeInRight"
        >
          <b-row>
            <b-col sm="6">
              <b-input-group size="lg" append="€" class="w-25 min-w-300">
                <b-form-input v-model="form.budget_max" id="budgetMax"></b-form-input>
              </b-input-group>
            </b-col>
            <b-col
              v-if="total_facture_ttc > 0"
              class="h1 animate__animated animate__zoomIn min-w-300 text-right"
              :class="'text-' + status_color"
            >
              Total TTC :
              <strong>{{ parseFloat(animatedTTC).toFixed(2) }} &#8364;</strong>
            </b-col>
          </b-row>
          <b-progress
            class="animate__animated animate__fadeInLeft mt-2"
            v-if="total_facture_ttc"
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
          v-if="show_list_products"
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
          >Enregistrer ma liste</b-button
        >
        <b-modal id="modal-save" title="Confirmation" @ok="saveListe">
          <p class="my-4">Êtes-vous sûr de n'avoir rien oublié ?</p>
        </b-modal>
      </b-form>
    </div>
    <!-- RECAP VIEW -->
    <div v-else>
      <b-row>
        <b-col>
          <span class="h3">Votre commande a été sauvegardée avec succès !</span>
          <hr />
        </b-col>
      </b-row>
      <recap-liste :id="id_recap"></recap-liste>
    </div>
  </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  middleware: "auth",
  data: () => {
    return {
      // boolean qui permettra de remettre les composants enfants à 0 (via v-if dans le template)
      ready_product_line: true,
      show_list_products: false,
      form: {
        dateCourse: null,
        budget_max: null
      },
      total_facture_ht: 0,
      total_quantity: 0,
      // animation du total TTC
      animatedTTC: 0,
      animatedRestant: 0,
      show_save_overlay: false,
      show_recap: false,
      id_recap: null
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
  computed: {
    ...mapState({
      categories: state => state.categories,
      user: state => state.user,
      panier: state => state.panier,
      all_listes: state => state.all_listes
    }),
    datesListes() {
      if (this.all_listes) {
        return this.all_listes.map(liste => liste.date);
      }
    },
    state_date() {
      if (this.form.dateCourse) {
        return !this.datesListes.includes(this.form.dateCourse);
      } else {
        return null;
      }
    },
    total_facture_ttc() {
      if (this.total_facture_ht) {
        return this.total_facture_ht > 0
          ? parseFloat(this.total_facture_ht * 1.196).toFixed(2)
          : 0;
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
    "panier.produits": function(panier) {
      if (panier) {
        let totalht = 0;
        let totalqt = 0;
        panier.forEach(cat => {
          cat.produits.forEach(p => {
            let product_price = this.$store.state.all_products.find(
              article => article.id === p.id
            ).price;
            totalht += parseFloat(product_price * parseInt(p.quantity));
            totalqt += parseInt(p.quantity);
          });
        });
        this.total_facture_ht = totalht;

        this.$store.commit("GLOBAL_DATA_PANIER", {
          date: this.form.dateCourse,
          count_produits: totalqt,
          price: this.total_facture_ttc,
          budget: this.form.budget_max,
          user: this.user.id
        });
      }
    },
    "form.budget_max": function(val){
      let input = document.querySelector("#budgetMax");
      const _this = this;

        setTimeout(function (){
          input.blur();
          _this.show_list_products = val ? true : false;
          },1000)

    },
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
      const save_panier = this.panier;

      // injection data dans la BDD
      this.$axios
        .post(
          process.env.api.listes,
          {
            date: save_panier.date,
            price: save_panier.price,
            budget: save_panier.budget,
            count_produits: save_panier.count_produits,
            produits: save_panier.produits,
            user: save_panier.user
          },
          {
            headers: {
              Authorization: `Bearer ${this.user.jwt}`
            }
          }
        )
        .then(res => {
          this.$store.dispatch("ADD_STATS").then(resp => {
            _this.id_recap = res.data.id;
            _this.show_save_overlay = false;
            _this.show_recap = true;
            _this.$store.commit("RESET_PANIER");
            // on reset toutes les var pour preparer une nouvelle liste
            _this.form.dateCourse = null;
            _this.ready_product_line = false;
          });
        });
    },
    animateNumber({ val, duration = 0.5, targetVar }) {
      gsap.to(this.$data, {
        duration: duration,
        [targetVar]: val
      });
    }
  },
  mounted() {
    this.$store.commit("RESET_PANIER");
    this.ready_product_line = true;
  },
  beforeDestroy() {
    Object.assign(this.$data, this.$options.data());
    this.$store.commit("RESET_PANIER");
  }
};
</script>

<style scoped>
.progress-bar {
  overflow: initial;
}
</style>

!<template>
  <div>
    <b-row id="zoneMoy" align-h="start">
      <b-col cols="6" md="3" class="mb-1">
        <b-card
          v-if="data.depense_moy"
          no-body
          bg-variant="primary"
          text-variant="white"
          class="animate__animated animate__fadeInRight shadow-sm"
        >
          <b-card-header
            class="d-flex justify-content-between align-items-center "
          >
            <span>Dépense moyenne</span>
            <b-icon scale="2" icon="cash-stack"></b-icon>
          </b-card-header>
          <b-card-body>
            <b-card-text class="text-center h4"
              >{{ data.depense_moy }} €</b-card-text
            >
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="3" class="mb-1">
        <b-card
          v-if="data.article_moy"
          no-body
          bg-variant="warning"
          text-variant="white"
          class="animate__animated animate__fadeInRight animate__delay-1s shadow-sm"
        >
          <b-card-header
            class="d-flex justify-content-between align-items-center"
          >
            <span>Nombre d'article</span>
            <b-icon scale="2" icon="cart4"></b-icon>
          </b-card-header>
          <b-card-body>
            <b-card-text class="text-center h4"
              >{{ data.article_moy }} articles</b-card-text
            >
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="3" class="mb-1">
        <b-card
          v-if="data.frequence_moy"
          no-body
          bg-variant="secondary"
          text-variant="white"
          class="animate__animated animate__fadeInRight animate__delay-2s shadow-sm"
        >
          <b-card-header
            class="d-flex justify-content-between align-items-center"
          >
            <span>Fréquence</span>
            <b-icon scale="2" icon="calendar"></b-icon>
          </b-card-header>
          <b-card-body>
            <b-card-text class="text-center"
              >+/- tous les
              <span class="h4"
                >{{ data.frequence_moy }} jours</span
              ></b-card-text
            >
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="3" class="mb-1">
        <b-card
          v-if="expansive_cat.price"
          no-body
          bg-variant="success"
          text-variant="white"
          class="animate__animated animate__fadeInRight animate__delay-3s shadow-sm"
        >
          <b-card-header
            class="d-flex justify-content-between align-items-center"
          >
            <span>Le plus coûteux</span>
            <b-icon scale="2" icon="calculator"></b-icon>
          </b-card-header>
          <b-card-body>
            <b-card-text class="text-center"
              ><span class="h4 mr-1">{{ expansive_cat.name }}</span>
              <span>({{ expansive_cat.price }} €)</span></b-card-text
            >
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ["data"],
  computed: {
    expansive_cat() {
      return {
        name: this.data.depense_cat[0]
          ? this.$store.state.categories.find(
              cat => cat.id == this.data.depense_cat[0].id_cat
            ).name
          : "nc",
        price: this.data.depense_cat[0]
          ? parseFloat(this.data.depense_cat[0].price).toFixed(2)
          : "0"
      };
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
#zoneMoy .card {
  height: 100%;
  .card-header {
    font-size: 0.8rem;
  }
  .card-body {
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .h4 {
      font-size: 1.5rem;
    }
  }
}

@media (max-width: 620px) {
  /* #zoneMoy .card-header {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
  #zoneMoy .card-header svg {
    width: 0.4rem;
  }
  #zoneMoy .card-body {
    font-size: 0.55rem;
    padding: 0.5rem;
  }
  #zoneMoy .card-body .h4 {
    font-size: 1rem;
  } */
}
</style>

<template>
  <div class="planning">
    <b-row>
      <b-col lg="6" offset-lg="3" class="text-center">
        <b-overlay :show="show_overlay">
          <h1 class="h2 mt-3 mb-3">Selectionnez une date</h1>
          <b-calendar
            block
            v-model="selectedDate"
            locale="fr-FR"
            hide-header
            :date-info-fn="listExist"
            :date-disabled-fn="disableDate"
            class="mb-3 align-v"
          ></b-calendar>
          <template v-slot:overlay>
            <div class="text-center">
              <loader :show="true"></loader>
            </div>
          </template>
        </b-overlay>
      </b-col>
    </b-row>

    <div
      id="popRecap"
      ref="popRecap"
      v-if="id_recap"
      class="animate__animated animate__fadeInRight animate__fast text-center"
    >
      <b-container fluid>
        <b-button-group size="sm">
          <b-button variant="primary" @click="close_pop_recap">
            <b-icon icon="caret-left-fill" aria-hidden="true"></b-icon> Retour
          </b-button>
          <b-button v-b-modal.modal-delete type="button" variant="danger">
            <b-icon icon="x" aria-hidden="true"></b-icon> Supprimer la liste
          </b-button>
        </b-button-group>
        <b-modal
          id="modal-delete"
          title="Confirmation"
          @ok="deleteListe(id_recap)"
        >
          <p class="my-4">
            Êtes-vous sûr de vouloir supprimer cette liste de courses ?
          </p>
        </b-modal>
        <br /><br />
        <div>
          <recap-liste :id="id_recap"></recap-liste>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  middleware: "auth",
  data() {
    return {
      loading: true,
      selectedDate: null,
      id_recap: null,
      show_overlay: true,
      show_msg_alert: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
      all_listes: (state) => state.all_listes,
    }),
    allDatesList() {
      if (this.all_listes) {
        return this.all_listes.map((liste) => liste.date);
      }
    },
  },
  watch: {
    allDatesList(val) {
      if (val) {
        this.show_overlay = false;
      } else {
        this.show_overlay = true;
      }
    },
    selectedDate(val) {
      if (val) {
        this.showListes(val);
      }
    },
  },
  methods: {
    ...mapActions({
      getListes: "GET_LISTES",
    }),
    close_pop_recap() {
      let popRecap = document.querySelector("#popRecap");
      const _this = this;
      popRecap.classList.add("animate__fadeOutRight");
      setTimeout(function () {
        _this.id_recap = null;
      }, 1000);
    },
    // pour mettre en surbrillance les jours ayant une liste
    listExist(ymd, date) {
      if (this.allDatesList) {
        return this.allDatesList.includes(ymd) ? "bg-warning" : "";
      }
    },
    // pour desactiver les jours où ya pas de liste
    disableDate(ymd, date) {
      if (this.allDatesList) {
        return !this.allDatesList.includes(ymd);
      }
    },
    showListes(selectDate) {
      const _this = this;
      this.show_msg_alert = false;
      //this.loading = true;
      this.show_overlay = true;
      this.id_recap = null;
      this.$axios
        .$get(
          process.env.api.listes +
            "?date=" +
            selectDate +
            "&user=" +
            this.user.id
        )
        .then((liste) => {
          setTimeout(() => {
            _this.id_recap = liste[0].id;
            _this.show_overlay = false;
          }, 500);
        });
    },
    majListe(id) {
      this.$router.push("/listes/maj/" + id);
    },
    deleteListe(id) {
      const _this = this;
      this.show_overlay = true;

      // injection data dans la BDD
      this.$axios
        .delete("/listes/" + id, {
          headers: {
            Authorization: `Bearer ${this.user.jwt}`,
          },
        })
        .then((res) => {
          // on reset toutes les var pour preparer une nouvelle liste
          this.id_recap = null;
          this.selectedDate = null;
          this.loading = false;
          this.getListes();
          this.$bvToast.toast("Votre liste a bien été supprimée", {
            title: "Suppression réussie",
            toaster: "b-toaster-bottom-right",
            appendToast: true,
            variant: "success",
          });

          setTimeout(() => {
            _this.show_overlay = false;
          }, 2000);
        });
    },
    forceRerender() {
      this.componentKey += 1;
    },
  },
  mounted() {
    if (this.allDatesList) {
      this.show_overlay = false;
    }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/vars/vars";
.planning {
  overflow-x: hidden;
  #popRecap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: $color1;
    min-height: 100%;
    width: 100%;
    overflow: hidden auto;

    .btn-group {
      width: 100%;
      button {
        font-size: clamp(0.7rem, 2vmin, 1rem);
        flex: 1;
        text-transform: uppercase;
      }
    }
  }
}
</style>

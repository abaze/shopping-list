let data_state = () => ({});
// list of store variable
export const state = () => ({
  user: null,
  categories: null,
  all_products: null,
  all_listes: null,
  panier: {
    date: null,
    price: 0,
    count_produits: 0,
    budget: 0,
    produits: [],
    user: null,
  },
});

// mutations for set variable
export const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  },
  SET_PRODUITS(state, produits) {
    state.all_products = produits;
  },
  SET_LISTES(state, listes) {
    state.all_listes = listes;
    console.log("listes : ", state.all_listes);
  },
  GLOBAL_DATA_PANIER(state, data) {
    state.panier.date = data.date;
    state.panier.price = data.price;
    state.panier.count_produits = data.count_produits;
    state.panier.budget = data.budget;
    state.panier.user = data.user;
  },
  MAJ_PANIER(state, data) {
    // a chaque ajout on verifie si la categorie est deja dans le panier
    // si elle existe, on la supprime du panier apres avoir ajouter les nouvelles donnees
    if (state.panier.produits.find((cat) => cat.id_cat === data.id_cat)) {
      let index_to_remove = state.panier.produits.findIndex(
        (cat) => cat.id_cat === data.id_cat
      );
      state.panier.produits.push(data);
      state.panier.produits.splice(index_to_remove, 1);
    } else {
      state.panier.produits.push(data);
    }
  },
  RESET_PANIER(state) {
    state.panier.date = null;
    state.panier.price = 0;
    state.panier.count_produits = 0;
    state.panier.budget = 0;
    state.panier.produits = [];
    state.panier.user = null;
  },
};

// actions to put some logic in ServerSide or ClientSide in all pages
export const actions = {
  // nuxtClientInit is a custom plugin (il n'existe pas nativement d'équivalent à nuxtServerInit)
  async nuxtClientInit({ commit, dispatch }, { req }) {
    // check if the localstorage exist
    if (
      window.localStorage.getItem("shoppingList-user-" + process.env.env_name)
    ) {
      // if ok, get the token, username and email from the localstorage (have to JSON Parse)
      const { id, jwt, username, email } = JSON.parse(
        window.localStorage.getItem("shoppingList-user-" + process.env.env_name)
      );
      // finally, send the data to SET_USER mutation in order to fill the user var
      commit("SET_USER", { id, jwt, username, email });
    }
  },
  async logout({ commit }) {
    // on vide notre var dans le state
    commit("SET_USER", null);
    // on vide localStorage
    window.localStorage.removeItem("shoppingList-user-" + process.env.env_name);
  },
  async GET_CATEGORIES({ commit, state }) {
    if (!state.categories) {
      const resp = await this.$axios.get(process.env.api.categories);
      const categories = resp.data.map((cat) => {
        return {
          id: cat.id,
          name: cat.name,
          image: `${process.env.base_image_url.categorie}/${cat.image}`,
          color: cat.color,
        };
      });
      commit("SET_CATEGORIES", categories);
    }
  },
  async GET_PRODUITS({ commit, state }) {
    if (!state.all_products) {
      const resp = await this.$axios.get(process.env.api.produits);
      let produits = resp.data.map((produit) => {
        return {
          id: produit.id,
          id_cat: produit.categories.id,
          name: produit.name,
          image: `${process.env.base_image_url.produit}/${produit.image}`,
          price: produit.price,
        };
      });
      commit("SET_PRODUITS", produits);
    }
  },
  async GET_LISTES({ commit, state }) {
    const resp = await this.$axios.get(
      process.env.api.listes + "?user=" + state.user.id + "&_sort=date:ASC"
    );
    let listes = [];
    resp.data.forEach(function (liste) {
      listes.push({
        id: liste.id,
        date: liste.date,
        price: liste.price,
        count_produits: liste.count_produits,
        budget: liste.budget,
        produits: liste.produits,
      });
    });
    commit("SET_LISTES", listes);
  },
  async ADD_STATS({ commit, dispatch, state }) {
    await dispatch("GET_LISTES");
    let panier = state.panier;
    let data_listes = state.all_listes;
    // calcul depense moyenne
    const sum_price = data_listes
      .map((liste) => liste.price)
      .reduce((sum, price) => sum + price, 0);
    const price_moy = parseFloat(sum_price / data_listes.length).toFixed(2);

    // calcul depense moyenne
    const sum_budget = data_listes
      .map((liste) => liste.budget)
      .reduce((sum, price) => sum + price, 0);
    const budget_moy = parseFloat(sum_budget / data_listes.length).toFixed(2);

    // calcul article moyen
    const sum_art = data_listes
      .map((liste) => liste.count_produits)
      .reduce((sum, count) => sum + count, 0);
    const articles_moy = parseInt(sum_art / data_listes.length);

    // calcul frequence
    let sum_days = 0;
    let frequence_moy = 0;
    if (data_listes.length >= 2) {
      data_listes.forEach(function (liste, i) {
        if (data_listes[i + 1]) {
          const date1 = new Date(liste.date);
          const date2 = new Date(data_listes[i + 1].date);
          const diff_time = date2.getTime() - date1.getTime();
          const diff_days = diff_time / (1000 * 3600 * 24);
          sum_days += diff_days;
        }
      });
      // la frequence est divisé par le total de liste -1 car on calcul entre 2 dates à chaque fois
      frequence_moy = parseInt(sum_days / (data_listes.length - 1));
    }

    //calcul depense par cat
    let depense_cat = [];
    data_listes.forEach(function (liste, i) {
      liste.produits.forEach(function (cat, y) {
        if (!depense_cat.find((cats) => cats.id_cat === cat.id_cat)) {
          depense_cat.push({
            id_cat: cat.id_cat,
            price: parseFloat(cat.price),
          });
        } else {
          depense_cat.find((cats) => cats.id_cat == cat.id_cat).price +=
            parseFloat(cat.price);
        }
      });
    });

    depense_cat.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    if (price_moy || articles_moy || frequence_moy || depense_cat) {
      const resp = await this.$axios.get(
        process.env.api.stats + "?user=" + state.user.id
      );
      if (resp.data.length <= 0) {
        // injection data dans la BDD
        this.$axios.post(
          process.env.api.stats,
          {
            price_moy,
            articles_moy,
            frequence_moy,
            budget_moy,
            depense_cat,
            user: state.user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${state.user.jwt}`,
            },
          }
        );
      } else {
        // injection data dans la BDD
        this.$axios.put(
          process.env.api.stats + "/" + resp.data[0].id,
          {
            price_moy,
            articles_moy,
            frequence_moy,
            budget_moy,
            depense_cat,
            user: state.user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${state.user.jwt}`,
            },
          }
        );
      }
    }
  },
};

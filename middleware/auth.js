// This store redirect to the login page if user is not connect (if state.user is empty)
export default function({ store, redirect }) {
  if (!store.state.user) {
    return redirect("/login");
  } else {
    if (!store.all_listes) {
      console.log("all_listes null");
      store.dispatch("GET_LISTES");
    }
  }
}

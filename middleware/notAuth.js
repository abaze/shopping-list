// This store redirect to the homepage if user is connected (if state.user is filled)
export default function ({ store, redirect, dispatch }) {
  if (store.state.user) {
    // si user est ok...
    // on redirige vers la home
    return redirect("/");
  }
}

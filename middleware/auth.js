// This store redirect to the login page if user is not connect (if state.user is empty)
export default function ({ store, redirect }) {
  if (!store.state.user) {
    return redirect("/login");
  }
}

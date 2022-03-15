// This store redirect to the homepage if user is connected (if state.user is filled)
export default function({ store, redirect }) {
  if (store.state.user) {
    return redirect("/");
  }
}

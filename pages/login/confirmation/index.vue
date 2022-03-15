<template>
  <div>
    <b-row>
      <b-col class="bg-gradient-primary min-vh-100">
        <div class="logoSite h1 mt-5">
          <b-icon
            icon="cart"
            class="animate__animated animate__fadeInLeft animate__delay-4s"
          ></b-icon>
          <span class="animate__animated animate__slideInRight"
            >Shopping List</span
          >
        </div>
        <b-row align-h="center">
          <b-col lg="6" class="rounded bg-white my-5 p-2 text-center">
            <b-icon
              icon="check-circle"
              font-scale="7"
              variant="success"
              class="mb-4"
            ></b-icon>
            <p class="h2 mb-4">Email confirmé avec succés !</p>
            <p>
              Vous pouvez vous <a href="./login">connecter</a> à votre compte
              depuis la page de connexion
            </p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  // call the 'notAuth' middleware
  // if the user is logged, he will be redirect to the homepage
  middleware: "notAuth",
  // specific layout pour page confirmation
  layout: "login"
};
</script>

<style lang="scss">
@import "~assets/scss/vars/vars";
body {
  overflow: auto;
}
.logoSite {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  font-size: 4rem;
  color: #fff;
}
@media (min-width: 768px) {
  body {
    overflow: hidden;
  }
}

@media (max-width: 576px) {
  .logoSite {
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 2rem;
    margin: auto;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1rem;
  }
}
</style>

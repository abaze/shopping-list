# Shopping-Budget

![Home Shopping-Budget](/static/img/screen/home.jpg)

Application de gestion du budget alloué aux courses.
On peut déterminer la fréquence des courses, la moyenne des dépenses, les produits les plus consommés etc.

# Stack Technique

## Backend

Pour le Back j'ai opté pour une solution de CMS Headless, en l'occurrence STRAPI.
Cela m'a permis de mettre en place rapidement une base de données avec un système d'API pour l'authentification, affichage des données etc.

## Frontend

Le Front repose sur du NuxtJS et le framework CSS Boostrap-Vue.
La communication avec le Back se fait exclusivement via API.
J'ai opté pour un hebergement sur Netlify.

## Mise en route

```bash
# installation des modules
$ npm install

# rendu local
$ npm run dev

# build pour la prod et lancement du projet
$ npm run build
$ npm run start

# generation du projet en static
$ npm run generate
```

Pour plus d'informations [Nuxt.js docs](https://nuxtjs.org).

# Informations sur les modules supplementaires

### Axios - Gestion des requêtes HTTP etc.

```bash
# ajout d'Axios dans Nuxt
$ npm i @nuxtjs/axios

# dans nuxt.config.js
modules : [
   '@nuxtjs/axios'
],
```

### Node SASS & SASS Loader - Gestion du SCSS

```bash
# install
$ npm i --save-dev node-sass sass-loader

# example de config dans nuxt.config.js
css: ['~/assets/global.scss', '~/assets/scss/animation.scss'],
styleRessources: {
   scss: ['./assets/scss/vars/*.scss'],
},
```

### Icons Bootstrap Vue

```bash
# j'active les icones Bootstrap dans nuxt.config.js
modules: [
    [
      'bootstrap-vue/nuxt',
      {
        icons: true,
      },
    ],
    ...
  ],
```

---

<br>
<br>

## Vous pouvez utiliser la [démo en ligne](https://shopping-budget.netlify.app/)

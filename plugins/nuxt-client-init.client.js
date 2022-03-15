// create a equivalent function of nuxtServerInit in Client Side
export default async context => {
  await context.store.dispatch("nuxtClientInit", context);
};

(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{226:function(t,e,o){var content=o(228);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(31).default)("75643320",content,!0,{sourceMap:!1})},227:function(t,e,o){"use strict";var r=o(226);o.n(r).a},228:function(t,e,o){(e=o(30)(!1)).push([t.i,".label-icon{font-size:.7rem}",""]),t.exports=e},231:function(t,e,o){"use strict";o.r(e);var r={props:["show"]},n=(o(227),o(24)),component=Object(n.a)(r,(function(){var t=this.$createElement,e=this._self._c||t;return this.show?e("div",[e("span",{staticClass:"text-center text-color-primary"},[e("b-iconstack",{attrs:{"font-scale":"3",animation:"cylon"}},[e("b-icon",{attrs:{stacked:"",icon:"cart4",animation:"cylon",variant:"color-primary"}})],1),this._v(" "),e("p",{staticClass:"label-icon"},[this._v("Chargement...")])],1)]):this._e()}),[],!1,null,null,null);e.default=component.exports},234:function(t,e,o){var content=o(390);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(31).default)("5f660ca3",content,!0,{sourceMap:!1})},245:function(t,e,o){"use strict";o.r(e);var r={props:["show"]},n=o(24),component=Object(n.a)(r,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("b-overlay",{attrs:{fixed:"","no-wrap":"",show:this.show},scopedSlots:this._u([{key:"overlay",fn:function(){return[e("div",{staticClass:"text-center"},[e("loader",{attrs:{show:!0}})],1)]},proxy:!0}])})],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{Loader:o(231).default})},389:function(t,e,o){"use strict";var r=o(234);o.n(r).a},390:function(t,e,o){(e=o(30)(!1)).push([t.i,"body{overflow:hidden}.logoSite{position:relative;top:0;width:100%;background-color:#174069;text-align:center;display:flex;justify-content:center;align-items:center;font-weight:600;font-size:2rem;margin:auto}.logoSite .title-part{color:#fff}@media (min-width:768px){.logoSite{position:absolute;background-color:transparent;top:10px;right:0;left:0;text-align:center;display:flex;justify-content:center;z-index:1;align-items:center;font-weight:800;font-size:4rem}.logoSite .title-icon,.logoSite .title-part.first-part{color:#174069}h1{font-size:1.5rem}h2{font-size:1rem}}",""]),t.exports=e},416:function(t,e,o){"use strict";o.r(e);var r={middleware:"notAuth",layout:"login",data:function(){return{show_success_msg:!1,show_login:!0,mdp_forget:!1,loader:!1,show_overlay:!1,form:{username:"",email:"",password:"",error:null,msg:{status:null,text:null}}}},methods:{reset:function(){this.form={username:"",email:"",password:"",error:null,msg:{status:null,text:null}}},login:function(t){var e=this;this.loader=!0,this.$axios.post("/auth/local",{identifier:this.form.email,password:this.form.password}).then((function(t){var o=t.data.jwt,r=t.data.user,n=r.id,l=r.username,c=r.email;e.$store.commit("SET_USER",{id:n,jwt:o,username:l,email:c}),window.localStorage.setItem("shoppingList-user-prod",JSON.stringify({id:n,jwt:o,username:l,email:c})),e.loader=!1,e.show_overlay=!0,setTimeout((function(){e.$router.push("/")}),2e3)})).catch((function(t){e.loader=!1,e.form.error="Identifiant ou mot de passe incorrect"}))},register:function(t){var e=this;this.loader=!0,this.$axios.post("/auth/local/register",{username:this.form.username,email:this.form.email,password:this.form.password,confirmed:!1}).then((function(t){e.loader=!1,e.show_success_msg=!0,setTimeout((function(){e.show_login=!0,e.show_success_msg=!1}),1e4)})).catch((function(t){e.loader=!1,e.form.error=t.response}))},forget_mdp:function(){var t=this;this.loader=!0,this.$axios.post("/auth/forgot-password",{email:this.form.email}).then((function(e){setTimeout((function(){t.form.msg.status="success",t.form.msg.text="Vous allez recevoir un mail de réintitialisation",t.loader=!1}),3e3)})).catch((function(e){t.form.msg.status="error",t.form.msg.text=e.message,t.loader=!1}))}},watch:{show_login:function(t){this.reset(),window.scroll(0,0)}}},n=(o(389),o(24)),component=Object(n.a)(r,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("overlay-load",{attrs:{show:t.show_overlay}}),t._v(" "),o("b-row",[o("div",{staticClass:"logoSite h1"},[o("b-icon",{staticClass:"title-part title-icon animate__animated animate__fadeInLeft animate__delay-4s",attrs:{icon:"cart"}}),t._v(" "),o("span",{staticClass:"title-part first-part animate__animated animate__slideInRight"},[t._v("Shop")]),t._v(" "),o("span",{staticClass:"title-part animate__animated animate__slideInRight"},[t._v("\n        ping\n      ")]),t._v(" "),o("span",{staticClass:"title-part animate__animated animate__fadeInRight"},[t._v("List")])],1),t._v(" "),o("b-col",{attrs:{md:"6"}},[o("b-row",{staticClass:"min-vh-100",attrs:{"align-v":"center","align-h":"center"}},[o("transition",{attrs:{"enter-active-class":"animate__animated animate__fadeInDown animate__faster","leave-active-class":"animate__animated animate__fadeOutDown animate__faster",mode:"out-in",appear:""}},[t.show_login?o("b-col",{key:"old_user",staticClass:"text-center",attrs:{lg:"8"}},[t.mdp_forget?o("b-row",{staticClass:"position-absolute h-100 w-100 bg-white positon-relative animate__animated animate__fadeInDown animate__faster",attrs:{id:"mdpForget"}},[o("a",{staticClass:"close position-absolute right-0 top-0 cursor-pointer",staticStyle:{"z-index":"10"},on:{click:function(e){t.mdp_forget=!1,t.form.msg.status=null,t.form.msg.text=null}}},[o("b-icon",{staticClass:"h1",attrs:{icon:"x"}})],1),t._v(" "),o("b-col",[o("p",{staticClass:"h1"},[t._v("Mot de passe oublié")]),t._v(" "),o("p",[t._v("\n                  Veuillez entrer votre adresse email afin de procéder à\n                  l'envoi d'un mail de réinitialisation\n                ")]),t._v(" "),o("b-form",[o("b-form-group",{attrs:{id:"input-group-1","label-for":"input-1"}},[o("b-form-input",{attrs:{id:"input-email-mdp",type:"email",required:"",placeholder:"Email",size:"lg"},model:{value:t.form.email,callback:function(e){t.$set(t.form,"email",e)},expression:"form.email"}})],1),t._v(" "),o("p",{directives:[{name:"show",rawName:"v-show",value:t.form.error,expression:"form.error"}],staticClass:"text-white bg-danger p-2 mb-3"},[t._v("\n                    "+t._s(t.form.error)+"\n                  ")]),t._v(" "),t.form.msg.status?o("b-alert",{attrs:{show:"",variant:t.form.msg.status}},[t._v("\n                    "+t._s(t.form.msg.text)+"\n                  ")]):o("b-button",{staticClass:"text-uppercase",attrs:{pill:"",size:"lg",type:"button",variant:"color-primary"},on:{click:t.forget_mdp}},[t.loader?o("span",[o("b-spinner",{attrs:{small:""}}),t._v(" Vérification...")],1):o("span",[t._v("Demander un nouveau mot de passe")])])],1)],1)],1):t._e(),t._v(" "),o("h1",{staticClass:"mb-2"},[t._v("Déjà inscrit ?")]),t._v(" "),o("h2",{staticClass:"mb-3"},[t._v("Connectez-vous")]),t._v(" "),o("p",{staticClass:"mb-3"},[t._v("\n              Pour accéder à tous les services, veuillez vous connecter à\n              votre compte\n            ")]),t._v(" "),o("b-form",[o("b-form-group",{attrs:{id:"input-group-1","label-for":"input-1"}},[o("b-form-input",{attrs:{id:"input-1",type:"email",required:"",placeholder:"Email",size:"lg"},model:{value:t.form.email,callback:function(e){t.$set(t.form,"email",e)},expression:"form.email"}})],1),t._v(" "),o("b-form-group",{attrs:{id:"input-group-2","label-for":"input-2"}},[o("b-form-input",{attrs:{id:"input-2",type:"password",required:"",placeholder:"Mot de passe",size:"lg"},model:{value:t.form.password,callback:function(e){t.$set(t.form,"password",e)},expression:"form.password"}}),t._v(" "),o("template",{slot:"description"},[o("p",{staticClass:"text-right"},[o("a",{staticClass:"cursor-pointer",on:{click:function(e){t.mdp_forget=!0}}},[t._v("Mot de passe oublié ?")])])])],2),t._v(" "),o("p",{directives:[{name:"show",rawName:"v-show",value:t.form.error,expression:"form.error"}],staticClass:"text-white bg-danger p-2 mb-3"},[t._v("\n                "+t._s(t.form.error)+"\n              ")]),t._v(" "),o("b-button",{staticClass:"text-uppercase",attrs:{pill:"",size:"lg",type:"button",variant:"color-primary"},on:{click:t.login}},[t.loader?o("span",[o("b-spinner",{attrs:{small:""}}),t._v(" Connexion...")],1):o("span",[t._v("Se connecter")])]),t._v(" "),o("b-button",{staticClass:"d-block d-sm-none mx-auto mt-2 text-color-primary",attrs:{variant:"link"},on:{click:function(e){t.show_login=!t.show_login}}},[t._v("\n                Vous n'avez pas de compte ? C'est par ici\n              ")])],1)],1):o("b-col",{key:"new_user",staticClass:"text-center",attrs:{lg:"8"}},[o("h1",[t._v("Rejoignez-nous")]),t._v(" "),o("h2",{staticClass:"mb-3"},[t._v("Créez votre compte")]),t._v(" "),o("p",{staticClass:"mb-3"},[t._v("\n              Pour accéder à tous les services, veuillez créer un compte\n            ")]),t._v(" "),t.show_success_msg?o("b-alert",{attrs:{show:"",variant:"success"}},[o("h4",{staticClass:"alert-heading"},[t._v("Inscription réussie !")]),t._v(" "),o("p",[t._v("\n                Bienvenue parmis nous, vous allez recevoir un email de\n                confirmation sur "+t._s(t.form.email)+"."),o("br"),t._v("\n                Une fois votre email confirmé, vous pourrez alors vous\n                connecter à votre compte.\n              ")]),t._v(" "),o("hr"),t._v(" "),o("p",{staticClass:"mb-0"},[t._v("\n                Redirection vers le formulation de login en cours...\n              ")])]):o("b-form",[o("b-form-group",{attrs:{id:"input-group-1","label-for":"input-1"}},[o("b-form-input",{attrs:{id:"input-1",type:"text",required:"",placeholder:"Pseudo",size:"lg"},model:{value:t.form.username,callback:function(e){t.$set(t.form,"username",e)},expression:"form.username"}})],1),t._v(" "),o("b-form-group",{attrs:{id:"input-group-2","label-for":"input-2"}},[o("b-form-input",{attrs:{id:"input-2",type:"email",required:"",placeholder:"Email",size:"lg"},model:{value:t.form.email,callback:function(e){t.$set(t.form,"email",e)},expression:"form.email"}})],1),t._v(" "),o("b-form-group",{attrs:{id:"input-group-3","label-for":"input-3"}},[o("b-form-input",{attrs:{id:"input-3",type:"password",required:"",placeholder:"Mot de passe",size:"lg"},model:{value:t.form.password,callback:function(e){t.$set(t.form,"password",e)},expression:"form.password"}})],1),t._v(" "),o("br"),o("br"),t._v(" "),o("b-button",{staticClass:"text-uppercase",attrs:{pill:"",size:"lg",type:"button",variant:"color-primary"},on:{click:t.register}},[t.loader?o("span",[o("b-spinner",{attrs:{small:""}}),t._v(" Chargement...")],1):o("span",[t._v("S'enregister")])]),t._v(" "),o("b-button",{staticClass:"d-block d-sm-none mx-auto mt-2 text-color-primary",attrs:{variant:"link"},on:{click:function(e){t.show_login=!t.show_login}}},[t._v("\n                Vous avez déjà un compte ? C'est par ici\n              ")])],1)],1)],1)],1)],1),t._v(" "),o("b-col",{staticClass:"d-none d-md-block",class:{"bg-gradient-primary":t.show_login,"bg-gradient-secondary":!t.show_login},attrs:{md:"6"}},[o("transition",{attrs:{"enter-active-class":"animate__animated animate__fadeInUp animate__faster","leave-active-class":"animate__animated animate__fadeOutUp animate__faster",mode:"out-in",appear:""}},[t.show_login?o("b-row",{key:"panel_new_member",staticClass:"min-vh-100",attrs:{"align-v":"center","align-h":"center"}},[o("b-col",{staticClass:"text-center",attrs:{lg:"8"}},[o("h1",[t._v("Bienvenue")]),t._v(" "),o("br"),o("br"),t._v(" "),o("p",{staticClass:"h5 text-white"},[t._v("\n              Rejoignez-nous pour gérer au mieux votre budget pour les courses\n            ")]),t._v(" "),o("br"),o("br"),t._v(" "),o("b-button",{staticClass:"text-uppercase font-weight-bold",attrs:{pill:"",size:"lg",type:"button",variant:"success"},on:{click:function(e){t.show_login=!t.show_login}}},[t._v("\n              Créez votre compte\n            ")])],1)],1):o("b-row",{key:"panel_old_member",staticClass:"min-vh-100",attrs:{"align-v":"center","align-h":"center"}},[o("b-col",{staticClass:"text-center",attrs:{lg:"8"}},[o("h1",[t._v("Déjà membre ?")]),t._v(" "),o("br"),o("br"),t._v(" "),o("p",{staticClass:"h5 text-white"},[t._v("\n              Identifiez-vous et c'est parti pour les courses !\n            ")]),t._v(" "),o("br"),o("br"),t._v(" "),o("b-button",{staticClass:"text-uppercase font-weight-bold",attrs:{pill:"",size:"lg",type:"button",variant:"success"},on:{click:function(e){t.show_login=!t.show_login}}},[t._v("\n              Me connecter\n            ")])],1)],1)],1)],1)],1)],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{OverlayLoad:o(245).default})}}]);
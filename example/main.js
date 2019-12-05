import Vue from "vue";
import App from "./App.vue";
Vue.config.productionTip = false;
import pullRefresh from "../src/index";
Vue.use(pullRefresh);

import "./reset.css";

new Vue({
  el: "#app",
  components: {
    App
  },
  template: "<App/>"
});
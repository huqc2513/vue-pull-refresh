import pullRefresh from "./pullRefresh.vue";
const install = function(Vue, options) {
  Vue.component("pull-refresh", pullRefresh);
};
pullRefresh.install = install;
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(pullRefresh);
}

export default pullRefresh;

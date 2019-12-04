import pullRefresh from './pullRefresh.vue'

pullRefresh.install = function (Vue) {
  Vue.component('pull-refresh', pullRefresh)
}

if (window.Vue) {
  window.Vue && window.vue.use(pullRefresh)
}
export default pullRefresh

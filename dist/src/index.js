import pullRefresh from './pullRefresh.vue'

const install = function (Vue, options) {
  Vue.component('pull-refresh', pullRefresh)
}
pullRefresh.install = install
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(pullRefresh)
  console.log('我被注册le', window.Vue, pullRefresh)
}


export default pullRefresh
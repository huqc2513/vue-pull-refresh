import pullRefresh from './pullRefresh.vue'

const install = function (Vue,options) {
  Vue.component('pull-refresh', pullRefresh)
}

// 同样，Vue 作为全局变量时自动 install
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(pullRefresh)
}

  
export default {
  install,
  pullRefresh
}

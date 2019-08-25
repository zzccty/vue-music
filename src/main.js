import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/sass/index.sass'
Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  loading: require('common/images/loading.gif')
})

fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

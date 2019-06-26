import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.css'
import '@/vendor/gt'

Vue.config.productionTip = false
Vue.prototype.$https = axios
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App),
  created () {
    this.$router.push('/')
  }
}).$mount('#app')

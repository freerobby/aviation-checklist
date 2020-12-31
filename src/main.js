import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

var v = new Vue({
  render: h => h(App)
})
v.$mount('#app');

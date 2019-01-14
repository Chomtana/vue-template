import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import Vuex from 'vuex'
import { mapState } from 'vuex'

Vue.use(BootstrapVue)

//const store = Vue.store

import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})

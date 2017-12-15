import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import googleMap from './components/gMaps'

Vue.use(Vuetify)

Vue.component('google-map', googleMap)

new Vue({
  el: '#app',
  render: h => h(App),
  components: {
    googleMap: googleMap
  }
})

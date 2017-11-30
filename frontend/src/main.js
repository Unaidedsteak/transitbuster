import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import worldMap from './components/Map'

Vue.use(Vuetify)

Vue.component('world-map', worldMap)

new Vue({
  el: '#app',
  render: h => h(App),
  components: {
    worldMap: worldMap
  }
})

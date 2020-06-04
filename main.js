import Vue from 'vue'
import App from './App'
import api from './common/api.js'
import store from './store'

Vue.prototype.$api = api
Vue.prototype.$store = store
Vue.prototype.$eventHub = new Vue()
import loading from './components/loading.vue'
Vue.component('loading', loading)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
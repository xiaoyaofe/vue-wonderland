import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import { createProvider } from "./vue-apollo";
import "./plugins/element";
import "./plugins/iview";
import axios from 'axios'



Vue.prototype.$http = axios.create({
  baseURL: ' http://172.16.10.124:8191',
})

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");

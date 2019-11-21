import Vue, { ComponentOptions } from "vue";
import App from "./App.vue";
import router from "./router/index";
import store, { $commit, apolloProvider } from "./store";
// import "./registerServiceWorker";
import "./plugins/element";
import "./plugins/iview";
import { CommitOptions } from "types/vuex";
var flat = require("array.prototype.flat");
flat.shim();

console.log("version: v2.3.3")

const config: ComponentOptions<Vue> = {
  beforeCreate() {
    const prototype = Vue.prototype, { state, commit, getters } = store, { $module } = state
    prototype.$state = new Proxy({}, {
      get(target, key: string) {
        if (typeof key === "string") return state[$module][key]
      }
    }) as any
    prototype.$commit = new Proxy({}, {
      get(target, key: string) {
        return function (payload?: any, options?: CommitOptions) {
          return commit(`${$module}/${key}`, payload, options)
        }
      }
    }) as any
    prototype.$getter = new Proxy({}, {
      get(target, key: string) {
        if (typeof key === "string") return getters[`${$module}/${key}`]
      }
    }) as any
    prototype.$dispatch = new Proxy({}, {
      get(target, key: string) {
        return function (payload = {}) {
          return store.dispatch(`${$module}/${key}`, payload)
        }
      }
    }) as any
    $commit("$state", prototype.$state)
    $commit("$commit", prototype.$commit)
    $commit("$getter", prototype.$getter)
    $commit("$dispatch", prototype.$dispatch)
  },
  router,
  store,
  apolloProvider,
  render: h => h(App)
}

new Vue(config).$mount("#app");

// const polyfills = ["Promise", "Array.prototype.flat"]
// const polyfillUrl = "https://polyfill.io/v3/polyfill.min.js"
// const features: string[] = [];
// polyfills.forEach(feature => {
//   if (!(feature in window)) {
//     features.push(feature)
//   }
// })
// if (features.length) {
//   const s = document.createElement("script");
//   s.src = `${polyfillUrl}?features=${features.join(",")}&flags=gated,always&rum=0`;
//   s.async = true;
//   document.head.appendChild(s);
//   s.onload = function () {
//     new Vue(config).$mount("#app");
//   }
// } else {
//   new Vue(config).$mount("#app");
// }





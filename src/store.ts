
import Vue, { DirectiveOptions } from "vue"
import Vuex from "vuex"
import oa from "src/store/oa"
import axios from "axios"
import { Notification, Input } from "element-ui"
import { createApolloProvider } from "src/vue-apollo"
import { $Commit } from "types/vuex";

Vue.use(Vuex)

const apolloProvider = createApolloProvider()
const HTTP = axios.create({
  baseURL: process.env.VUE_APP_CLIENT_REQUEST,
})
HTTP.interceptors.request.use(function (config) {
  if (config.data) {
    config.data = Object.keys(config.data).map(key => {
      return `${key}=${config.data[key]}`
    }).join("&")
  }
  return config;
}, function (error) {
  return Promise.reject(error);
})
HTTP.interceptors.response.use(function (config) {
  return config.data
})
const store = (function () {
  const state = {
    $module: "",
    $commit: "",
    $getter: "",
    $dispatch: "",
    $get: HTTP.get,
    $post: HTTP.post,
    $notify: Notification,
    $query: apolloProvider.defaultClient.query,
    $mutate: apolloProvider.defaultClient.mutate,
  }
  const mutations = {
    $set(state: any, { k, v }: { k: string, v: any }) {
      state[k] = v
    }
  }
  const modules = {
    oa,
    $oa: require("src/modules/oa/store").default,
  } as any
  const store = new Vuex.Store({
    state,
    mutations,
    modules,
  })
  return store
})()
Vue.prototype.$base = (function () {
  return process.env.VUE_APP_CLIENT_REQUEST
})()
Vue.prototype.$language = (function () {
  return "zh"
})()
Vue.prototype.$hourCalculate = (function () {
  const c = {}, D = "天", d = 7.5, H = "h"
  return function (h: number) {
    if (h) {
      if (!c[h]) {
        if (h > 0) {
          c[h] = {
            d: Math.floor(h / d),
            h: h % d
          }
        } else {
          c[h] = {
            d: Math.floor(h / -d),
            h: h % -d
          }
        }
      }
      return `${c[h].d ? (c[h].d + D) : ""}${c[h].h ? (c[h].h + H) : ""}`
    }
    return 0 + D
  }
})()
Vue.directive("required", (function () {
  const expressionMap = {} as {
    [key: string]: {
      els: HTMLElement[]
      ins: Input[]
    }
  }
  return {
    bind() { },
    inserted(el, binding, vnode) {
      const expression = binding.expression
      if (!expression) {
        console.error("v-required needs expression")
        return
      }
      switch (expression) {
        case "submit":
          el.onclick = function () {
            const expressions = Object.keys(expressionMap)
            const errors = [] as any
            expressions.forEach(expression => {
              expressionMap[expression].els.forEach(function (el) {
                el.classList.add("v_required_submit")
              })

              if (expression.match(/\[*\]/)) {
                if (expressionMap[expression].ins.filter(_in => {
                  if (_in.$el.classList.contains("el-checkbox-group")) {
                    return !(_in.value as any).length
                  } else {
                    return !_in.value
                  }
                }).length !== 0) {
                  errors.push(expression)
                }
              } else {
                if (expressionMap[expression].ins.filter(_in => {
                  if (_in.$el.classList.contains("el-checkbox-group")) {
                    return !(_in.value as any).length
                  } else {
                    return !_in.value
                  }
                }).length === expressionMap[expression].ins.length) {
                  errors.push(expression)
                }
              }
            })
            if (errors.length === 0) {
              binding.value()
            } else {
              console.error(errors)
            }
          }
          break;
        case "confirm":
          el.onclick = function () {
            const expressions = Object.keys(expressionMap)
            const errors = [] as any
            expressions.forEach(expression => {
              expressionMap[expression].els.forEach(function (el) {
                el.classList.add("v_required_submit")
              })
              if (expressionMap[expression].ins.filter(_in => {
                if (_in.$el.classList.contains("el-checkbox-group")) {
                  return !(_in.value as any).length
                } else {
                  return !_in.value
                }
              }).length === expressionMap[expression].ins.length) {
                errors.push(expression)
              }
            })
            if (errors.length === 0) {
              binding.value(1)
            } else {
              console.error(errors)
            }
          }
          break;
        default:
          if (!binding.value) {
            el.classList.add("v_required_error")
          }
          if (!expressionMap[expression]) {
            expressionMap[expression] = {
              els: [el],
              ins: [vnode.componentInstance as Input]
            }
          } else {
            expressionMap[expression].els.push(el)
            expressionMap[expression].ins.push(vnode.componentInstance as Input)
          }
          break;
      }
    },
    update(el, binding) {
      if (binding.value !== binding.oldValue) {
        if (!binding.oldValue) {
          el.classList.remove("v_required_error")
        }
        else if (!binding.value) {
          el.classList.add("v_required_error")
        }
      }
    },
    componentUpdated() { },
    unbind(el, binding) {
      delete expressionMap[binding.expression]
    },
  } as DirectiveOptions
})())

/**
 * 根状态提交
 * @param k 
 * @param v 
 */
function $commit(k: keyof $Commit, v: $Commit[keyof $Commit]) {
  store.commit("$set", { k, v })
}

export {
  $commit,
  apolloProvider,
}
export default store


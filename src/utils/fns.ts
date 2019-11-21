import { RG_SERVER_RES, Vuex, $Commit } from "types/vuex";

/**
 * GET 参数获取
 * @param name 参数名称
 */
export const get_parameter_by_name = (function () {
  let url_param_map = {}
  let interrogation_index = location.href.indexOf("?") + 1
  let search = interrogation_index === 0 ? "" : location.href.slice(interrogation_index)
  if (search) {
    search.split(/&|%26/).forEach(item => {
      const [key, val] = item.split(/=|%3D/)
      url_param_map[key] = val
    })
  }
  return function (name: string) {
    return url_param_map.hasOwnProperty(name) ? url_param_map[name] : null
  }
})()

export const action = function (fn: (
  args: {
    [key in keyof $Commit]: any
  },
  param?: any,
  config?: any,
) => Promise<any>) {
  return function (
    { commit, dispatch, getters, rootGetters, state, rootState }: {
      commit: any
      dispatch: any
      getters: any
      rootGetters: any
      state: any
      rootState: {
        [key in keyof $Commit]: any
      }
    },
    param?: any,
    config?: any,
  ) {
    return fn(rootState, param, config)
  }
}

export const getter = function (fn: (args: {
  state: Vuex.OA.State
  getters: Vuex.OA.Getters
}) => void) {
  return function ({ state, getters, rootState, rootGetters }: {
    state: Vuex.OA.State
    getters: Vuex.OA.Getters
    rootState: any
    rootGetters: any
  }) {
    fn({ state, getters })
  }
}

export const Cache = (class Cache {
  static _ins: Cache
  constructor() {
    Cache._ins = this
  }
  static get instance() {
    return this._ins ? this._ins : new Cache
  }

  cache_map = {}

  cache = (key, args: () => Promise<any>) => {
    if (this.cache_map.hasOwnProperty(key)) {
      return Promise.resolve(this.cache_map[key])
    } else {
      return args().then(res => {
        if (res.code === 200) {
          this.cache_map[key] = res
        }
        return res
      })
    }
  }

}).instance.cache
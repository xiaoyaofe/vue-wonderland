import State from "./state"

const SystemConfig = function (state, { child, key, val }) {
  state.SystemConfig[child][key] = val
}

const Mutations = {
  SystemConfig
}

export default Mutations


const SystemConfig = (function () {
  const state = {
    components: {}
  }
  if (require.context) {
    const files = require.context('src/modules/oa/packages/system_config/components', false, /\.vue$/)
    const keys = files.keys()
    keys.forEach(key => {
      const component = files(key).default
      const name = key.replace('./', '').replace('.vue', '')
      state.components[name] = component
      state[name] = component.storeState
    })
  }
  return state
})()

const State = {
  SystemConfig
}

export default State 
const SystemConfigAttendance = function (state, getters) {
  let ret = {
    list: [],
    map: {}
  }, { query, start, offset } = state.SystemConfig.Attendance;
  if (query.length) {
    ret.list = query.slice(start, start + offset)
    query.forEach((item: any, index) => {
      item.index = index
      ret.map[item.id] = item
    })
  }
  return ret
}

const SystemConfigSpecial = function (state, getters) {
  let ret = {
    list: [],
    map: {}
  }, { query, start, offset } = state.SystemConfig.Special;
  if (query.length) {
    ret.list = query.slice(start, start + offset)
    query.forEach((item: any, index) => {
      item.index = index
      ret.map[item.id] = item
    })
  }
  return ret
}

const Getters = {
  SystemConfigAttendance, SystemConfigSpecial
}

export default Getters


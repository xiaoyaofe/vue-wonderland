import { OA } from "types";

/**
  * 根据条件查询休息日
  */
const attendanceQuery = async function ({ commit, dispatch, getters, rootGetters, state, rootState: { http: { post, get }, notify: { success, error } } }: any, data: {
  id: number // 否	主键ID
  leaveInLieuDate: string //	否	休息日日期 格式如：2019-01-01
  times: number // 否	工资倍数
  isNewYear: number // 否	是否是春节 0：不是 1：是
  remark: string //	否	备注
}) {
  console.log(
    state
  )
  return post('/attendance/query', data).then(function (res: {
    data: OA.RgServerRes<{
      dataWeekWorkList: {
        id: number // 主键ID
        leaveInLieuDate: string // 休息日日期
        isNewYear: number // 是否是春节
        times: number // 工资倍数
        remark: string // 备注
      }[]
    }>
  }) {
    if (res.data.code === 200) {
      commit("SystemConfig", {
        child: "attendance",
        key: "query",
        val: res.data.data.dataWeekWorkList.sort(function (a, b) {
          return new Date(a.leaveInLieuDate) > new Date(b.leaveInLieuDate) ? 1 : -1
        })
      })
    } else {
      error(res.data.message)
    }
  })
}

/**
 * 添加休息日接口
 */
const attendanceAdd = async function ({ commit, dispatch, getters, rootGetters, state, rootState: { http: { post, get }, notify: { success, error } } }: any, data: {
  id?: number
  leaveInLieuDate: string //	否	休息日日期 格式如：2019- 01 - 01
  times: number // 否	工资倍数
  isNewYear: number // 否	是否是春节 0：不是 1：是
  remark: string //	否	备注
}) {

  return post('/attendance/add', data).then(function (res: {
    data: OA.RgServerRes<{
      id: number
    }>
  }) {
    if (res.data.code === 200) {
      success(res.data.message)
      data.id = res.data.data.id
      commit("SystemConfig", {
        child: "attendance",
        key: "query",
        val: Array.prototype.concat([], [data], state.SystemConfig.Attendance.query)
      })
      return res.data
    } else {
      error(res.data.message)
    }
  })
}

/**
 * 更新休息日信息
 */
const attendanceUpdate = async function ({ commit, dispatch, getters, rootGetters, state, rootState: { http: { post, get }, notify: { success, error } } }: any, data: {
  index?: number
  id: number // 主键ID
  leaveInLieuDate: string //	否	休息日日期 格式如：2019- 01 - 01
  times: number // 否	工资倍数
  isNewYear: number // 否	是否是春节 0：不是 1：是
  remark: string //	否	备注
}) {
  return post('/attendance/update', data).then(function (res: {
    data: OA.RgServerRes<undefined>
  }) {
    if (res.data.code === 200) {
      success(res.data.message)
      const id = data.id
      const { list, map } = getters.SystemConfigAttendance
      const index = map[id].index
      data.index = index
      const query = JSON.parse(JSON.stringify(state.SystemConfig.Attendance.query))
      query[index] = data
      commit("SystemConfig", {
        child: "attendance",
        key: "query",
        val: query
      })
      return res.data
    } else {
      error(res.data.message)
    }
  })
}

/**
 * 删除休息日
 */
const attendanceDelete = async function ({ commit, dispatch, getters, rootGetters, state, rootState: { http: { post, get }, notify: { success, error } } }: any, data: {
  index?: number
  id: number // 主键ID
}) {
  return post('/attendance/deleteWeekWork', data).then(function (res: {
    data: OA.RgServerRes<undefined>
  }) {
    if (res.data.code === 200) {
      success(res.data.message)
      const id = data.id
      const { list, map } = getters.SystemConfigAttendance
      const index = map[id].index
      data.index = index
      state.SystemConfig.Attendance.query.splice(index, 1)
      return res.data
    } else {
      error(res.data.message)
    }
  })
}

/**
 * 查询所有特殊考勤信息
 */
const specialQuery = async function ({ commit, dispatch, getters, rootGetters, state, rootState: { http: { post, get }, notify: { success, error } } }: any, data: {
  id: number // 否	主键ID
  leaveInLieuDate: string //	否	休息日日期 格式如：2019- 01 - 01
  times: number // 否	工资倍数
  isNewYear: number // 否	是否是春节 0：不是 1：是
  remark: string //	否	备注
}) {
  return get('/special/allInfo').then(function (res: {
    data: OA.RgServerRes<{
      specialAttendanceList: {
        id: number	// 主键ID
        type: string	// 类型(work, off) work：上班 off：下班
        date: string	// 日期 格式如：2019 - 01 - 01
        remark: string	// 备注
        time: string	// 上、下班时间 格式如：10: 30: 00
      }[]
    }>
  }) {
    if (res.data.code === 200) {
      commit("SystemConfig", {
        child: "Special",
        key: "query",
        val: res.data.data.specialAttendanceList
      })
    } else {
      error(res.data.message)
    }
  })
}

/**
 * 新增特殊考勤信息
 */
const specialAdd = async function ({ commit, dispatch, getters, rootGetters, state, rootState: { http: { post, get }, notify: { success, error } } }: any, data: {
  id?: number
  type: string //	否	类型(work,off) work：上班 off：下班
  date: string //	否	日期 格式如：2019-01-01
  remark: string //	否	备注
  time: string //	否	上、下班时间 格式如：10:30:00
}) {
  return post('/special/add', data).then(function (res: {
    data: OA.RgServerRes<{
      id: number
    }>
  }) {
    if (res.data.code === 200) {
      success(res.data.message)
      data.id = res.data.data.id
      commit("SystemConfig", {
        child: "Special",
        key: "query",
        val: Array.prototype.concat([], state.SystemConfig.Special.query, [data])
      })
      return res.data
    } else {
      error(res.data.message)
    }
  })
}

/**
 * 更新特殊考勤信息
 */
const specialUpdate = async function ({ commit, dispatch, getters, rootGetters, state, rootState: { http: { post, get }, notify: { success, error } } }: any, data: {
  index?: number
  id: number //	否	主键ID
  type: string //	否	类型(work,off) work：上班 off：下班
  date: string //	否	日期 格式如：2019-01-01
  remark: string //	否	备注
  time: string //	否	上、下班时间 格式如：10:30:00
}) {
  return post('/special/update', data).then(function (res: {
    data: OA.RgServerRes<undefined>
  }) {
    if (res.data.code === 200) {
      success(res.data.message)
      const id = data.id
      const { list, map } = getters.SystemConfigSpecial
      const index = map[id].index
      data.index = index
      const query = JSON.parse(JSON.stringify(state.SystemConfig.Special.query))
      query[index] = data
      commit("SystemConfig", {
        child: "Special",
        key: "query",
        val: query
      })
      return res.data
    } else {
      error(res.data.message)
    }
  })
}

/**
 * 删除特殊考勤信息
 */
const specialDelete = async function ({ commit, dispatch, getters, rootGetters, state, rootState: { http: { post, get }, notify: { success, error } } }: any, data: {
  index?: number
  id: number // 主键ID
}) {
  return post('/special/delete', data).then(function (res: {
    data: OA.RgServerRes<undefined>
  }) {
    if (res.data.code === 200) {
      success(res.data.message)
      const id = data.id
      const { list, map } = getters.SystemConfigSpecial
      const index = map[id].index
      data.index = index
      state.SystemConfig.Special.query.splice(index, 1)
      return res.data
    } else {
      error(res.data.message)
    }
  })
}

const Actions = {
  attendanceQuery,
  attendanceAdd,
  attendanceUpdate,
  attendanceDelete,
  specialQuery,
  specialAdd,
  specialUpdate,
  specialDelete
}

export default Actions


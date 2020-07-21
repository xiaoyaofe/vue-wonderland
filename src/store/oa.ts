import { APOLLO, OA } from "types";
import moment from "moment"
import UserPermission from "./oa/Model/UserPermission";
import { Vuex, RG_SERVER_RES, RG_SERVER_RES_BASE, Mutation, Getter, Action } from 'types/vuex';
import { action, Cache } from "src/utils/fns";
import { OA as Const } from "apollo-server/utils/const";
import axios from "axios"

const SQL = require("src/graphql/oa.gql")

export default {
  namespaced: true,
  state: {
    code: "",
    user_permission: UserPermission.instance.state,
    access_token: "" as any,
    member_info: "" as any,
    user: "" as any,
    user_info: "" as any,
    userList: "" as any,
    user_all: "" as any,
    userDepartment: "" as any,
    department_list: "" as any,
    work_process: "" as any,
    work_wait: "" as any,
    work_over: "" as any,
    work_all: "" as any,
    leave_type_list: [],
    MemberInfo: (function () {
      const files = require.context("src/modules/oa/packages/member_info/components", true, /\.vue$/)
      const keys = files.keys()
      const map = {}
      keys.forEach(item => {
        let split = item.split("/")
        if (!map[split[1]]) {
          map[split[1]] = files(item).default.storeState
        }
      })
      return map
    })(),
    SystemConfig: (function () {
      const files = require.context("src/modules/oa/packages/system_config/components", false, /\.vue$/)
      const keys = files.keys()
      const state = {
        components: {}
      }
      keys.forEach(key => {
        const component = files(key).default
        const name = key.replace("./", "").replace(".vue", "")
        state.components[name] = component
        state[name] = component.storeState
      })
      return state
    })()
  } as Vuex.OA.State,
  mutations: {
    MemberInfo(state, { key, val, child }) {
      state.MemberInfo[child][key] = val
    },
    SystemConfig(state, { key, val, child }) {
      state.SystemConfig[child][key] = val
    },
    leave_type_list(state, data) {
      state.leave_type_list = data
    },
    member_info(state, data) {
      state.member_info = data
    },
    user_permission(state, data) {
      state.user_permission = data
    },
    work_process(state, data) {
      state.work_process = data
    },
    work_wait(state, data) {
      state.work_wait = data
    },
    work_over(state, data) {
      state.work_over = data
    },
    work_all(state, data) {
      state.work_all = data
    },
    access_token(state, data) {
      state.access_token = data
    },
    user_info(state, data) {
      state.user_info = data
    },
    user(state, { id, data }) {
      // User.map.set(id, data)
      state.user = data
    },
    user_all(state, data) {
      state.user_all = data
    },
    userList(state, data) {
      state.userList = data
    },
    userDepartment(state, data) {
      state.userDepartment = data
    },
    department_list(state, data) {
      state.department_list = data
    },
  } as {
      [key in keyof Vuex.OA.Mutations]: Mutation<Vuex.OA.State>
    },
  getters: {
    department_map(state) {
      if (state.department_list) {
        const maps = {
          id: {},
          parent: {}
        }
        const returnData = function (list: any[]) {
          list.forEach(item => {
            if (!maps.parent[item.parentid]) {
              maps.parent[item.parentid] = [{
                departmentId: item.id,
                order: item.order
              }]
            } else {
              let add = {
                departmentId: item.id,
                order: item.order
              }
              let arr = maps.parent[item.parentid]
              let len = arr.length
              let last = arr[len - 1]
              if (add.order > last.order) {
                arr.unshift(add)
              } else {
                arr.push(add)
              }
            }
            if (item.children) {
              returnData(item.children)
            } else {
              maps.id[item.id] = item
            }
          })
        }
        returnData(state.department_list)
        return maps
      } else {
        return undefined
      }
    },
    leave_type_map(state) {
      const leave_type_map = {}
      if (state.leave_type_list && state.leave_type_list.length) {
        state.leave_type_list.forEach(
          ({ id, leaveName, children }) => {
            leave_type_map[id + ""] = { id, leaveName, field: "" }
            switch (id) {
              case 1: // 调休
                leave_type_map[id].field = "availableLeaveInLieu"
                break;
              case 2: // 年假
                leave_type_map[id].field = "availableAnnualLeave"
                break;
            }
            if (children) {
              leave_type_map[id].children = (function (children) {
                const _ = {}
                children.forEach((id, leaveName) => {
                  _[id + ""] = {
                    id, leaveName
                  }
                })
                return _
              })(children)
            }
          }
        )
      }
      return leave_type_map
    },

    MemberInfoAttendanceLg25(state, getters) {
      return state.MemberInfo.attendance.CurDate >= 25
    },
    MemberInfoAttendanceIs1(state, getters) {
      return state.MemberInfo.attendance.CurMonth === 1
    },
    MemberInfoAttendanceIs12(state, getters) {
      return state.MemberInfo.attendance.CurMonth === 12
    },
    // member_info_attendance_data: getter(function ({ state, getters }) {
    //   return {}
    // }),
    MemberInfoAttendanceData(state, getters) {
      return {
        StartDate: getters.MemberInfoAttendanceLg25 ? moment(new Date(`${state.MemberInfo.attendance.CurYear}-${state.MemberInfo.attendance.CurMonth}-25`)).format("YYYY-MM-DD") : moment(new Date(`${state.MemberInfo.attendance.CurYear}-${state.MemberInfo.attendance.CurMonth}-25`)).add(-1, "month").format("YYYY-MM-DD"),
        EndDate: getters.MemberInfoAttendanceLg25 ? moment(new Date(`${state.MemberInfo.attendance.CurYear}-${state.MemberInfo.attendance.CurMonth}-24`)).add(1, "month").format("YYYY-MM-DD") : moment(new Date(`${state.MemberInfo.attendance.CurYear}-${state.MemberInfo.attendance.CurMonth}-24`)).format("YYYY-MM-DD"),
        LastDate: getters.MemberInfoAttendanceLg25 ? new Date(state.MemberInfo.attendance.CurYear, state.MemberInfo.attendance.CurMonth, 0).getDate() : new Date(state.MemberInfo.attendance.CurYear, getters.MemberInfoAttendanceIs1 ? 12 : state.MemberInfo.attendance.CurMonth - 1, 0).getDate()
      }
    },
    SystemConfigAttendance(state, getters) {
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
    },
    SystemConfigSpecial(state, getters) {
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
  } as {
      [key in keyof Vuex.OA.Getters]: Getter<Vuex.OA.State, any>
    },

  actions: {
    access_token: action(function ({ $mutate, $commit }) {
      return $mutate({
        mutation: SQL.oa,
        variables: {
          options: {
            name: Const.QUERY.ACCESS_TOKEN
          }
        }
      }).then(function (res: RG_SERVER_RES<{ oa: any }>) {
        $commit.access_token(res.data.oa);
      })
    }),
    user_info: action(function ({ $state, $mutate }, { code }) {
      return $mutate({
        mutation: SQL.oa,
        variables: {
          options: {
            name: Const.QUERY.USER_INFO,
            access_token: $state.access_token,
            code
          }
        },
      }).then(function (res: RG_SERVER_RES<{ oa: any }>) {
        localStorage.setItem("UserId", res.data.oa.UserId)
      })
    }),
    user: async function ({ rootState: { $mutate, $post, $state, $dispatch, $commit } }, { UserId }: { UserId: number } = { UserId: 0 }) {
      let [user1_, user2, user3, user4, user5]: [
        APOLLO.ServerRes<OA.Res<Vuex.OA.Response.user>>,
        RG_SERVER_RES<OA.USER.RgUserRes>,
        RG_SERVER_RES<OA.USER.RgLeaveInfo>,
        any,
        any,
      ] = await Promise.all([
        $mutate({
          mutation: SQL.oa,
          variables: {
            options: {
              name: Const.QUERY.USER,
              access_token: $state.access_token,
              userid: UserId
            }
          }
        }),
        $post("/user/userInfo", {
          userId: UserId
        }).then(res => res),
        $dispatch.leaveAnnualLeaveDetailInfo({
          userId: UserId
        }),
        $dispatch.fetchLeave({
          action: "leaveInfoList",
          userIds: UserId
        }),
        $dispatch.leaveOvertimeDetailInfo({
          userId: UserId
        }),
      ]);
      const leaveInfo = {
        availableAnnualLeave: 0,
        availableLeaveInLieu: 0,
        bereavementLeave: 0,
        marriageLeave: 0,
        maternityLeave: 0,
        paternityLeave: 0,
        personalLeave: 0,
        sickLeave: 0
      };
      const leaveInfoList: any = [];
      (function () {
        user4.data.leaveInfoList.forEach(item => {
          if (new Date(item.endTime) > new Date) { // 可用
            leaveInfoList.push(item)
            for (let name in leaveInfo) {
              leaveInfo[name] += item[name]
            }
          }
        })
        return leaveInfo
      })();
      user5.data.hrSettingInfoList && user5.data.hrSettingInfoList.forEach(item => {
        if (item.leaveType === 1) { // 调休
          user5.data.overtimeInfoList.push({
            userId: item.userId,
            overtimeDate: item.settingDate,
            overtimeTotal: item.duration,
            hrSettingType: item.settingType,
            overtimeType: "3",
            remark: item.remark
          })
        }
      })
      user3.data.hrSettingInfoList && user3.data.hrSettingInfoList.forEach(item => {
        if (item.leaveType === 2) { // 年假
          user3.data.produceDetailInfoList.push({
            userId: item.userId,
            produceDate: item.settingDate,
            leaveTotal: item.duration,
            hrSettingType: item.settingType,
            remark: item.remark
          } as any)
        }
      })
      user5.data.overtimeInfoList.sort(function (a, b) {
        return new Date(b.overtimeDate).getTime() - new Date(a.overtimeDate).getTime()
      })
      user5.data.useDetailInfoList.sort(function (a, b) {
        return new Date(b.useDate).getTime() - new Date(a.useDate).getTime()
      })
      user3.data.produceDetailInfoList.sort(function (a, b) {
        return new Date(b.produceDate).getTime() - new Date(a.produceDate).getTime()
      })
      user3.data.useDetailInfoList.sort(function (a, b) {
        return new Date(b.useDate).getTime() - new Date(a.useDate).getTime()
      })
      const user = Object.assign(
        user2.data.userInfo,
        {
          leaveDetailInfo: user3.data,
          overtimeDetailInfo: user5.data,
          leaveInfo,
          leaveInfoList,
          availableLeaveInLieu: user4.data.availableLeaveInLieu[UserId] || 0
        },
        user1_.data.oa
      )
      if (user.userid === localStorage.UserId) {
        $commit.member_info(user)
      }
      return Promise.resolve(user)
    },
    department_list: action(async function ({ $state, $mutate, $commit }, { id } = { id: 0 }) {
      let res: APOLLO.ServerRes<OA.Res<OA.DEPARTMENT.DepartmentListRes>> = await $mutate({
        mutation: SQL.oa,
        variables: {
          options: id ? {
            name: Const.QUERY.DEPARTMENT_LIST,
            access_token: $state.access_token,
            id,
          } : {
              name: Const.QUERY.DEPARTMENT_LIST,
              access_token: $state.access_token,
            }
        }
      })
      id ? $commit.userDepartment(res.data.oa) : $commit.department_list(res.data.oa)
      return Promise.resolve(res.data.oa)
    }),
    user_list: action(async function ({ $commit, $state, $mutate }, { department_id }) {
      let res: APOLLO.ServerRes<OA.Res<OA.USER.User[]>> = await $mutate({
        mutation: SQL.oa,
        variables: {
          options: {
            name: Const.QUERY.USER_LIST,
            access_token: $state.access_token,
            department_id
          }
        }
      })
      $commit.userList((function () {
        let ret = {}
        res.data.oa.forEach(item => {
          ret[item.userid] = item
        })
        return ret
      })())
      return Promise.resolve(res.data.oa)
    }),
    /** 更新个人年假 */
    update: action(function ({ $post }, { action, ...rest }) {
      return $post("/" + action + (action === "leave" ? "/updateExtraInfo" : "/update"), rest).then(function (res) {
        return res
      })
    }),
    fetchLeave: action(function ({ $post, $get }, { action, ...rest }) {
      let url = "/leave/" + action
      return action === "leaveInfoList" ?
        $post(url, rest).then(function (res) {
          return res
        }) :
        $get(url).then(function (res) {
          return res
        })
    }),
    user_permission: UserPermission.instance.action,
    /** 获取用户年假明细 */
    leaveAnnualLeaveDetailInfo: action(function ({ $post }, { userId }) {
      return $post("/leave/annualLeaveDetailInfo", {
        userId
      }).then(function (res) {
        return res
      })
    }),
    /** 获取所有假期类型 */
    leave_type_list: action(function ({ $commit, $get }) {
      return $get("/leave/allType").then(function (res: RG_SERVER_RES<{
        LeaveTypeList: Vuex.OA.Response.leave_type_list
      }>) {
        res.code === 200 && $commit.leave_type_list(res.data.LeaveTypeList)
        return res
      })
    }),
    /** 获取用户加班与调休信息接口 */
    leaveOvertimeDetailInfo: action(function ({ $post }, { userId }) {
      return $post("/leave/overtimeDetailInfo", {
        userId
      }).then(function (res: RG_SERVER_RES<OA.LeaveOvertimeDetailInfo>) {
        return res
      })
    }),
    /** 提交请休假审批申请接口 */
    // approvalLeaveApplication: action(function ({ $post }, { data }: {
    //   data: { /** 请求参数 */
    //     userId: string // 用户ID（微信提供的用户ID）
    //     userName: string // 用户名称
    //     employeeNumber: string // 员工工号
    //     departmentId: number // 部门ID
    //     departmentName: string // 部门名称
    //     applicationDate: string // 申请日期 格式如：2019- 01 - 01
    //     leaveType: string // 假期类型 1：调休 2：年假 3：事假 4：病假 5：婚假 6：护理假 7：产假 8：丧假 9：计划生育假 10 孕期检查假
    //     startTime: string // 请假开始时间 格式如：2019-01 - 01 09: 30: 00
    //     endTime: string // 请假结束时间 格式如：2019-01 - 01 18: 30: 00
    //     duration: number, // 假期时长 如：0.5
    //     positionProxyId?: string // 职务代理人ID （申请时间超过两天，需传值）
    //     positionProxyName?: string // 职务代理人名称（申请时间超过两天，需传值）
    //     position?: string // 职务信息     
    //     reason?: string // 请假事由
    //     handover?: string // 交接事项
    //   }
    // }) {
    //   return $post("/approval/leaveApplication", data).then(function (res: RG_SERVER_RES_BASE) {
    //     return res
    //   })
    // }),
    /** interface 根据用户id查询审批信息 */
    /**
    approval_approval_info: async function ({ commit, dispatch, $getter, rootGetters, state, rootState: { http: { $post, get }, notify: {  $notify }, apollo: { query, $mutate }, vue: { $commit } } }, { userId }: {
      userId: string // 用户ID（微信提供的用户ID）
    }) {
      return $post("/approval/approvalInfo", { userId }).then(function (res: RG_SERVER_RES<Vuex.OA.Response.approval_approval_info>) {
        commit("workList", res.data.approvalInfo)
        return res
      })
    },
    */
    /** 根据流水号查询审批详细信息 */
    approval_detail_info: action(function ({ $post }, { serialNumber }: {
      serialNumber: string // 流水号
    }) {
      return $post("/approval/approvalDetailInfo", { serialNumber }).then(function (res: RG_SERVER_RES<Vuex.OA.Response.approval_detail_info>) {
        return res
      })
    }),
    /** 申请接口 */
    approval_application: action(function ({ $post, $notify }, param) {
      if (param instanceof FormData) {
        return axios.create({
          baseURL: process.env.VUE_APP_CLIENT_REQUEST,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).post("/approval/application", param).then(function ({ data }) {
          if (data.code === 200) {
            $notify.success(data.message);
            return data
          } else {
            $notify.error(data.message)
            Promise.reject(data.message)
          }
        })
      }
      return $post("/approval/application", param).then(function (res: any) {
        if (res.code === 200) {
          $notify.success(res.message);
          return res
        } else {
          $notify.error(res.message)
          Promise.reject(res.message)
        }
      })
    }),
    /** 根据流水号查询申请详细信息 */
    approval_application_detail_info: action(function ({ $post }, param: Vuex.OA.Args.approval_application_detail_info) {
      return $post("/approval/applicationDetailInfo", param).then(function (res: RG_SERVER_RES<Vuex.OA.Response.approval_application_detail_info>) {
        return res
      })
    }),
    /** 根据用户id查询正在办理的审批 */
    approval_processing_info: action(function ({ $commit, $post }) {
      return $post("/approval/approvalProcessingInfo", { userId: localStorage.UserId }).then(function (res: RG_SERVER_RES<Vuex.OA.Response.approval_processing_info>) {
        $commit.work_process(res.data.approvalInfo)
        return res
      })
    }),
    /** 根据用户id查询等待办理的审批 */
    approval_wait_info: action(function ({ $post, $commit }) {
      return $post("/approval/approvalWaitInfo", { userId: localStorage.UserId }).then(function (res: RG_SERVER_RES<Vuex.OA.Response.approval_wait_info>) {
        $commit.work_wait(res.data.approvalInfo)
        return res
      })
    }),
    /** 根据用户id查询完成办理的审批 */
    approval_completed_info: action(function ({ $post, $commit }) {
      return $post("/approval/approvalCompletedInfo", { userId: localStorage.UserId }).
        then(function (res: RG_SERVER_RES<Vuex.OA.Response.approval_completed_info>) {
          $commit.work_over(res.data.approvalInfo)
          return res
        })
    }),
    /** 根据用户id查询全部办理的审批 */
    approval_all_info: action(function ({ $post, $commit }) {
      return $post("/approval/approvalAllInfo", { userId: localStorage.UserId }).then(function (res: RG_SERVER_RES<Vuex.OA.Response.approval_all_info>) {
        $commit.work_all(res.data.approvalInfo)
        return res
      })
    }),
    approval_confirm: action(function ({ $post }, data) {
      return $post("/approval/confirm", data).then(function (res: RG_SERVER_RES_BASE) {
        return res
      })
    }),
    /** 删除申请 */
    approval_delete_application: action(function ({ $post }, { serialNumber }: {
      serialNumber: string // 是	流水号
    }) {
      return $post("/approval/deleteApplication", { serialNumber }).then(function (res: RG_SERVER_RES_BASE) {
        return res
      })
    }),
    /** 提交加班申请接口 */
    approvalOvertimeApplication: action(function ({ $post }, data: {
      userId: string // 是	用户ID（微信提供的用户ID）
      departmentId: number // 是	部门ID
      applicationDate: string // 是	申请日期 格式如：2019- 01 - 01
      reason: string // 否	请假事由
      startTime: string // 是	请假开始时间 格式如：2019-01 - 01 09: 30: 00
      endTime: string // 是	请假结束时间 格式如：2019-01 - 01 18: 30: 00
      duration: number //	是	假期时长 如：0.5 单位h，最小单位0.5h（7.5h算一天）
    }) {
      return $post("/approval/overtimeApplication", data).then(function (res: RG_SERVER_RES_BASE) {
        return res
      })
    }),
    /** 查询所有审批流程模板接口 */
    approvalSelectAllConfig: action(function ({ $get }) {
      return $get("/approval/selectAllConfig").then(function (res: RG_SERVER_RES<{
        approvalTemplateInfo: {
          departmentId: number // 部门ID
          departmentName: string // 部门名称
          processType: number // 流程类型 1: 补签到 2：加班 3：请休假
          approvalRoleIds: string // 审批角色ID 每级以; 隔开，同一级多角色以, 隔开，审批顺序从左到右
          approvalRoleNames: string // 审批角色名称 每级以; 隔开，同一级多角色以, 隔开，审批顺序从左到右
        }
      }>) {
        return res.data.approvalTemplateInfo
      })
    }),
    /** 审批流程配置接口 */
    approvalApprovalConfig: action(function ({ $post }, data: {
      departmentId: number //是	部门ID
      departmentName: string // 否	部门名称
      processType: number //是	流程类型 1: 补签到 2：加班 3：请休假
      approvalRoleIds: string // 是	审批角色ID 每级以; 隔开，同一级多角色以, 隔开
      approvalRoleNames: string // 是	审批角色名称 每级以; 隔开，同一级多角色以, 隔开
    }) {
      return $post("/approval/approvalConfig", data).then(function (res: RG_SERVER_RES_BASE) {
        return res
      })
    }),
    /** 提交补签到申请接口 */
    approvalCheckInApplication: action(function ({ $post }, data: {
      userId: string // 是	用户ID（微信提供的用户ID）
      departmentId: number //	是	部门ID
      checkInDate: string // 是	补签到日期 格式如：2019- 01 - 01 多个时间以逗号隔开
      checkInType: string // 否	补签到类型 1：忘记打卡 2：外出办事， 多个类型以逗号隔开
      timeSlot: string // 否	时段 1：上班 2：下班 3：全天， 多个时段以逗号隔开
      checkInTime: string // 是	补签到打卡时间 格式如：2019-01 - 01 18: 30: 00 多个时间以逗号隔开
      reason: string // 是	事由 多个事由以 | 隔开
    }) {
      return $post("/approval/checkInApplication", data).then(function (res: RG_SERVER_RES_BASE) {
        return res
      })
    }),
    /** 提交补签到申请接口 */
    approvalCheckInRecord: action(function ({ $post }, data: {
      userId: string //	是	用户id
      startTime: string //	是	开始时间
      endTime: string //	是	结束时间
    }) {
      return $post("/approval/checkInRecord", data).then(function (res: RG_SERVER_RES<{
        onInfo: {	//	已补签上班卡信息
          serialNumber: string//	流水号
          userId: string //	用户id
          checkInDate: string //	补签到日期 格式如：2019- 01 - 01
          checkInReason: number //	补签原因 1：迟到 2：早退 3：旷工
          isCheck: number  //	是否补签 0：否 1：是
        }[]
        offInfo: {	//	已补签下班卡信息
          serialNumber: string//	流水号
          userId: string //	用户id
          checkInDate: string //	补签到日期 格式如：2019- 01 - 01
          checkInReason: number //	补签原因 1：迟到 2：早退 3：旷工
          isCheck: number  //	是否补签 0：否 1：是
        }[]
        onInfoSize: number //	已补签上班卡次数
        offInfoSize: number //	已补签下班卡次数
      }>) {
        return res
      })
    }),
    /** 根据条件查询休息日 */
    attendanceQuery: action(function ({ $post, $commit, $notify }, data: {
      id: number // 否	主键ID
      leaveInLieuDate: string //	否	休息日日期 格式如：2019- 01 - 01
      times: number // 否	工资倍数
      isNewYear: number // 否	是否是春节 0：不是 1：是
      remark: string //	否	备注
    }) {
      return $post("/attendance/query", data).then(function (res: RG_SERVER_RES<{
        dataWeekWorkList: {
          id: number // 主键ID
          leaveInLieuDate: string // 休息日日期
          isNewYear: number // 是否是春节
          times: number // 工资倍数
          remark: string // 备注
        }[]
      }>) {
        if (res.code === 200) {
          $commit.SystemConfig({
            child: "Attendance",
            key: "query",
            val: res.data.dataWeekWorkList.sort(function (a, b) {
              return new Date(a.leaveInLieuDate) > new Date(b.leaveInLieuDate) ? 1 : -1
            })
          })
        } else {
          $notify.error(res.message);
        }
      })
    }),
    /** 添加休息日接口 */
    attendanceAdd: action(function ({ $post, $commit, $state, $notify }, data: {
      id?: number
      leaveInLieuDate: string //	否	休息日日期 格式如：2019- 01 - 01
      times: number // 否	工资倍数
      isNewYear: number // 否	是否是春节 0：不是 1：是
      remark: string //	否	备注
    }) {
      return $post("/attendance/add", data).then(function (res: RG_SERVER_RES<{
        id: number
      }>) {
        if (res.code === 200) {
          $notify.success(res.message)
          data.id = res.data.id
          $commit.SystemConfig({
            child: "Attendance",
            key: "query",
            val: Array.prototype.concat([], [data], $state.SystemConfig.Attendance.query)
          })
          return res
        } else {
          $notify.error(res.message)
        }
      })
    }),

    /** 更新休息日信息 */
    attendanceUpdate: action(function ({ $post, $commit, $notify, $state, $getter }, data: {
      index?: number
      id: number // 主键ID
      leaveInLieuDate: string //	否	休息日日期 格式如：2019- 01 - 01
      times: number // 否	工资倍数
      isNewYear: number // 否	是否是春节 0：不是 1：是
      remark: string //	否	备注
    }) {
      return $post("/attendance/update", data).then(function (res: RG_SERVER_RES_BASE) {
        if (res.code === 200) {
          $notify.success(res.message)
          const id = data.id
          const { map } = $getter.SystemConfigAttendance
          const index = map[id].index
          data.index = index
          const query = JSON.parse(JSON.stringify($state.SystemConfig.Attendance.query))
          query[index] = data
          $commit.SystemConfig({
            child: "Attendance",
            key: "query",
            val: query
          })
          return res
        } else {
          $notify.error(res.message)
        }
      })
    }),
    /** 删除休息日 */
    attendanceDelete: action(function ({ $post, $getter, $notify, $state }, data: {
      index?: number
      id: number // 主键ID
    }) {
      return $post("/attendance/deleteWeekWork", data).then(function (res: RG_SERVER_RES_BASE) {
        if (res.code === 200) {
          $notify.success(res.message)
          const id = data.id
          const { list, map } = $getter.SystemConfigAttendance
          const index = map[id].index
          data.index = index
          $state.SystemConfig.Attendance.query.splice(index, 1)
          return res
        } else {
          $notify.error(res.message)
        }
      })
    }),
    /** 查询所有特殊考勤信息 */
    specialQuery: action(function ({ $get, $commit, $notify }, data: {
      id: number // 否	主键ID
      leaveInLieuDate: string //	否	休息日日期 格式如：2019- 01 - 01
      times: number // 否	工资倍数
      isNewYear: number // 否	是否是春节 0：不是 1：是
      remark: string //	否	备注
    }) {
      return $get("/special/allInfo").then(function (res: RG_SERVER_RES<{
        specialAttendanceList: {
          id: number	// 主键ID
          type: string	// 类型(work, off) work：上班 off：下班
          date: string	// 日期 格式如：2019 - 01 - 01
          remark: string	// 备注
          time: string	// 上、下班时间 格式如：10: 30: 00
        }[]
      }>) {
        if (res.code === 200) {
          $commit.SystemConfig({
            child: "Special",
            key: "query",
            val: res.data.specialAttendanceList
          })
        } else {
          $notify.error(res.message)
        }
      })
    }),
    /** 新增特殊考勤信息 */
    specialAdd: action(function ({ $post, $notify, $commit, $state }, data: {
      id?: number
      type: string //	否	类型(work,off) work：上班 off：下班
      date: string //	否	日期 格式如：2019-01-01
      remark: string //	否	备注
      time: string //	否	上、下班时间 格式如：10:30:00
    }) {
      return $post("/special/add", data).then(function (res: RG_SERVER_RES<{
        id: number
      }>) {
        if (res.code === 200) {
          $notify.success(res.message)
          data.id = res.data.id
          $commit.SystemConfig({
            child: "Special",
            key: "query",
            val: Array.prototype.concat([], $state.SystemConfig.Special.query, [data])
          })
          return res
        } else {
          $notify.error(res.message)
        }
      })
    }),
    /** 更新特殊考勤信息 */
    specialUpdate: action(function ({ $post, $commit, $notify, $state, $getter }, data: {
      index?: number
      id: number //	否	主键ID
      type: string //	否	类型(work,off) work：上班 off：下班
      date: string //	否	日期 格式如：2019-01-01
      remark: string //	否	备注
      time: string //	否	上、下班时间 格式如：10:30:00
    }) {
      return $post("/special/update", data).then(function (res: RG_SERVER_RES_BASE) {
        if (res.code === 200) {
          $notify.success(res.message)
          const id = data.id
          const { list, map } = $getter.SystemConfigSpecial
          const index = map[id].index
          data.index = index
          const query = JSON.parse(JSON.stringify($state.SystemConfig.Special.query))
          query[index] = data
          $commit.SystemConfig({
            child: "Special",
            key: "query",
            val: query
          })
          return res
        } else {
          $notify.error(res.message)
        }
      })
    }),
    /** 删除特殊考勤信息 */
    specialDelete: action(function ({ $post, $getter, $state, $notify }, data: {
      index?: number
      id: number // 主键ID
    }) {
      return $post("/special/delete", data).then(function (res: RG_SERVER_RES_BASE) {
        if (res.code === 200) {
          $notify.success(res.message)
          const id = data.id
          const { map } = $getter.SystemConfigSpecial
          const index = map[id].index
          data.index = index
          $state.SystemConfig.Special.query.splice(index, 1)
          return res
        } else {
          $notify.error(res.message)
        }
      })
    }),
    /** 查询页面展示的考勤记录 */
    attendancePageRecord: action(function ({ $post, $commit, $notify }, data: {
      userId: string //	是	用户ID
      startTime: string //	是	需要查询的开始日期 格式如：2019- 02 - 25
      endTime: string //	是	需要查询的结束日期 格式如：2019-03 - 24
    }) {
      return $post("/attendance/pageRecord", data).then(function (res: RG_SERVER_RES<{
        AttendanceInfo: {
          remark: string
          date: string
        }[]
      }>) {
        if (res.code === 200) {
          $commit.MemberInfo({
            child: "attendance",
            key: "pageRecord",
            val: (function () {
              let map = {}
              res.data.AttendanceInfo.forEach(element => {
                map[element.date] = element.remark.split(",")
              });
              return map
            })()
          })
          return res
        } else {
          $notify.error(res.message)
        }
      })
    }),
    /* 未补签考勤记录查询 */
    attendanceNoSignInquery: action(function ({ $post, $commit, $notify }, data: {
      userId: string //	是	用户ID
      startTime: string //	是	需要查询的开始日期 格式如：2019- 02 - 25
      endTime: string //	是	需要查询的结束日期 格式如：2019-03 - 24
    }) {
      return $post("/attendance/noSignInquery", data).then(function (res: RG_SERVER_RES<{
        recordInfoList: {
          "id": number;
          "userId": string;
          "checkInDate": string;   //需补签日期
          "checkInType": number;
          "checkInReason": number;            //1=迟到 2=下班未打卡 3=旷工
          "isCheck": number;
        }[]
      }>) {
        if (res.code === 200) {
          return res
        } else {
          $notify.error(res.message)
        }
      })
    }),
    /** 查询页面展示的考勤记录 */
    attendanceMonthlySummary: action(function ({ $post, $commit, $notify }, data: {
      userId: string //	是	用户ID
      startTime: string //	是	需要查询的开始日期 格式如：2019- 02 - 25
      endTime: string //	是	需要查询的结束日期 格式如：2019-03 - 24
    }) {
      return $post("/attendance/monthlySummary", data).then(function (res: RG_SERVER_RES<{
        monthAttendance: {
          employeeNumber: string //	工号
          departmentName: string //	部门名称
          userName: string //	用户名
          deduction: number //	扣款金额
          late: number //	迟到次数
          early: number //	早退次数
          absent: number //	旷工次数
          personalLeave: number //	事假 单位：h
          sickLeave: number //	病假 单位：h
          annualLeave: number //	年假 单位：h
          marriageLeave: number //	婚假 单位：h
          maternityLeave: number //	产假 单位：h
          nursingLeave: number //	护理假 单位：h
          prenatalCheckUpLeave: number //	孕检假 单位：h
          familyPlanningLeave: number //	计生假 单位：h
          bereavementLeave: number //	丧假 单位：h
          leaveInLieu: number //	调休 单位：h
          complementSignedTimes: number //	补签卡次数
          noCheckTimes: number //	未打卡次数
          fullAttendance: number //	全勤奖
          threeTimes: number //	三倍时长 单位：h
          overtime: number //	加班时长 单位：h
        }
      }>) {
        if (res.code === 200) {
          $commit.MemberInfo({
            child: "attendance",
            key: "monthAttendance",
            val: res.data.monthAttendance
          })
          return res
        } else {
          $notify.error(res.message)
        }
      })
    }),
    /** 查询指定日期的打卡记录 */
    attendanceQueryPunchRecord: action(function ({ $state, $post, $notify }, data: {
      userId: string //	是	用户ID
      date: string //	是	需要查询的日期 格式如：2019-02-01
    }) {
      if (!$state.MemberInfo.attendance.queryPunchRecord[data.userId]) {
        $state.MemberInfo.attendance.queryPunchRecord[data.userId] = {}
      }
      if ($state.MemberInfo.attendance.queryPunchRecord[data.userId][data.date]) {
        return $state.MemberInfo.attendance.queryPunchRecord[data.userId][data.date]
      } else {
        return $post("/attendance/queryPunchRecord", data).then(function (res: RG_SERVER_RES<{
          punchRecordList: string[]
        }>) {
          if (res.code === 200) {
            $state.MemberInfo.attendance.queryPunchRecord[data.userId][data.date] = res.data.punchRecordList
            return res.data.punchRecordList
          } else {
            $notify.error(res.message)
          }
        })
      }
    }),
    /** 问卷查询 */
    questionnaire_query: action(function ({ $post, $notify, $commit }, data) {
      return Cache(
        "/questionnaire/query",
        function () {
          return $post("/questionnaire/query", data).then(function (res: RG_SERVER_RES<{
            /** 1=离职问卷 */
            type: number
            /** 问卷模板id */
            templateId: number
            /** 申请人填写问题 */
            applicantTopicList: {
              /** 问题顺序 */
              order: number
              /** 题目id */
              topicId: number
              /** 题目类型 1=单选 2=多选 3=问答 */
              topicType: number
              /** 问题 */
              topicContent: string
              answerList: {
                /** 答案顺序 */
                order: number
                /** 答案类型  1=选择题   2=问答 */
                answerType: number
                /** 答案内容 */
                answerContent: string
              }[]
            }[]
            /** 人事填写问题 */
            personnelTopicList: {
              order: number
              topicContent: string
              topicId: number
              topicType: number
            }[]
          }>) {
            if (res.code === 200) {
              return res
            } else {
              $notify.error(res.message)
            }
          })
        }
      )
    })
  } as { [key in keyof Vuex.OA.Actions]: Action<Vuex.OA.State, any> }
}

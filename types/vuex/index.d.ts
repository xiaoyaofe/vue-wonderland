export type NumberBoolean = 0 | 1

/** 0 = 不限，1 = 男性，2 = 女性 */
export type GenderKind = "0" | "1" | "2"

export interface RG_SERVER_RES_BASE {
  code: number
  message: string
}

export type RG_SERVER_RES<D> = RG_SERVER_RES_BASE & {
  data: D
}

export namespace Vuex {
  namespace OA {
    namespace Interface {
      interface DEPARTMENT_MAP_ID_BASE {
        id: number
        name: string
        order: number
        parentid: number
      }
      interface DEPARTMENT_MAP_PARENT {
        [key: string]: {
          departmentId: number
          order: number
        }[]
      }
      interface DEPARTMENT_MAP_ID {
        [key: string]: DEPARTMENT_MAP_ID_BASE & {
          children?: DEPARTMENT_MAP_ID_BASE[]
        }
      }
      interface APPROVAL_INFO {
        /** 流水号 */
        serialNumber: string
        /** 审批发起人ID */
        userId: string
        /** 审批发起人名称 */
        userName: string
        /** 流程类型 1: 补签到 2：加班 3：请休假 */
        processType: number
        /** 审批结果 1: 同意 2：驳回 3：审批中 4：已撤回 */
        result: number
        /** 创建时间 格式如：2019 - 01 - 01 18: 30: 00 */
        createTime: string
      }
      interface APPROVAL_DETAIL_INFO {
        /** 流水号 */
        serialNumber: string
        /** 审批人排序 从0开始 数字越小，排序越靠前 */
        order: number
        /** 当前审批人ID */
        userId: string
        /** 当前审批人名称 */
        userName: string
        /** 当前审批人部门ID */
        departmentId: number
        /** 当前审批人意见 */
        opinion: string
        /** 审批结果 1：同意 2：驳回 3: 待审批 4：已转审 5：已撤回 */
        approvalResult: number
        /** 下一级审批人ID（没有下一级审批人则无此字段返回） */
        nextApproverId: string
        /** 下一级审批人名称（没有下一级审批人则无此字段返回） */
        nextApproverName: string
        /** 下一级审批人部门ID */
        nextDepartmentId: number
        /** 下级审批人是否是最终审批人 0：否 1：是 */
        isEnd: number
        /** 创建时间 格式如：2019 - 01 - 01 10: 00: 00 */
        createTime: string
      }
      interface APPLICATION_DETAIL_INFO {
        /** 流水号 */
        serialNumber: string
        /** 员工工号 */
        employeeNumber: string
        /** 用户ID */
        userId: string
        /** 用户名称 */
        userName: string
        /** 部门ID */
        departmentId: string
        /** 部门名称 */
        departmentName: string
        /** 职务信息 */
        position: string
        /** 假期类型 1：调休 2：年假 3：事假 4：病假 5：婚假 6：护理假 7：产假 8：丧假 9：计划生育假 10 孕期检查假 */
        leaveType: string
        /** 请假事由 */
        reason: string
        /** 交接事项 */
        handover: string
        /** 职务代理人ID */
        positionProxyId: string
        /** 职务代理人名称 */
        positionProxyName: string
        /** 请假开始时间 格式如：2019-01-01 15:30:00 */
        startTime: string
        /** 请假结束时间 格式如：2019-01-01 15:30:00 */
        endTime: string
        /** 假期时长 如：0.5 单位h，最小单位0.5h（7.5h算一天） */
        duration: number
        /** 创建时间 格式如：2019-01-01 15:30:00  */
        createTime: string
        /** any */
        checkInType: string
        /** any */
        timeSlot: string
        /** any */
        checkInDate: string
        /** any */
        companyId: string
      }
      interface APPOVAL_DETAIL_INFO {
        approvalResult: number
        createTime: string
        departmentId: number
        id: number
        isEnd: NumberBoolean
        nextApproverId: string
        nextApproverName: string
        nextDepartmentId: string
        order: number
        serialNumber: string
        userId: string
        userName: string
        approverRoleId?: number
        exInfo?: any
      }
    }
    namespace Args {
      interface approval_processing_info {
        /** 用户id */
        UserId: string
      }
      interface approval_wait_info {
        /** 用户id */
        UserId: string
      }
      interface approval_completed_info {
        /** 用户id */
        UserId: string
      }
      interface approval_all_info {
        /** 用户id */
        UserId: string
      }
      interface approval_delete_application {
        /** 流水号 */
        serialNumber: string
      }
      interface approval_application_detail_info {
        /** 流水号 */
        serialNumber: string
      }
      interface approval_detail_info {
        /** 流水号 */
        serialNumber: string
      }
      interface user {
        /** 用户id */
        UserId: string
      }
      interface user_list {
        /** 部门id */
        department_id: string
      }
      interface approval_confirm {
        /** 流水号 */
        serialNumber: string
        /** 审批人排序 从0开始 数字越小，排序越靠前 */
        order: number
        /** 当前审批人ID */
        userId: string
        /** 当前审批人名称 */
        userName: string
        /** 审批结果 1：同意 2：驳回 3: 待审批 4：已转审 5：已撤回  */
        approvalResult: number
        /** 当前审批人意见 */
        opinion?: string
        /** 下一级审批人ID（没有下一级审批人则无此字段） */
        nextApproverId?: string
        /** 下一级审批人名称（没有下一级审批人则无此字段） */
        nextApproverName?: string
        /** 下一级审批人部门ID */
        nextDepartmentId?: string
        /** 下级审批人是否是最终审批人 0：否 1：是 */
        isEnd?: number
        /** 创建时间 格式如：2019-01-01 10:00:00 */
        createTime?: string
      }
      interface user_permission {
        UserId: string
      }
      interface user_info {
        code: string
      }

      interface questionnaire_query {
        /** 问卷类型 1=离职问卷 */
        type: number
      }

      /**
       * 申请接口
       * /oa-server/approval/application
       * POST
       */
      namespace approval_application {
        /** BASE */
        interface base {
          /** 
           * 1、请休假申请
           * 2、加班申请  
           * 3、补签到申请 
           * 4、新员工入职申请  
           * 5、离职申请 
           * 6、人员需求申请  
           * 7、出差申请  
           * 8、采购申请  
           * 9、新旧电脑置换申请  
           * 10、名片制作申请  
           * 11、固定资产处置申请 
           * 12、用印申请  
           * 13、文印资质借用申请 
           */
          applicationType: number
        }
        /** 新员工入职申请 */
        interface admission extends base {
          /** 申请人用户id */
          userId: string
          /** 公司id 0 = 逍遥盛世，1 = 昊立信 */
          companyId: number
          /** 入职人员中文名 */
          userNameCn: string
          /** 入职人员英文名 */
          userNameEn: string
          /** 部门名称 */
          departmentName: string
          /** 职位 */
          position: string
          /** 业务导师用户名 */
          businessTutorUserName: string
          /** 汇报上级用户名 */
          spervisorUserName: string
          /** 入职日期 */
          entryDate: string
          /** 员工工号 */
          employeeNumber: string
          /** 电脑配置 1: 普通电脑标配 2: 美术电脑 + 手写板 3: 普通电脑标配 + 固态硬盘 4: 内外网双机 */
          computerConfiguration: number
          /** 是否准备办公用品 0: 未准备 1：已准备 */
          isOfficeSupplies: number
        }
        /** 离职申请  */
        interface dismission extends base { }
        /** 人员需求申请 */
        interface demand extends base {
          /** 需求部门Id */
          departmentId: string
          /** 申请人用户id */
          userId: string
          /** 申请日期 例：2019-09-09 */
          applicationDate: string
          /** 需求岗位 */
          position: string
          /** 需求人数 */
          positionNumber: number
          /** 需求到岗日期 例：2019-10-01 */
          arrivalDate: string
          /** 岗位定编人数 */
          fixedPeople: number
          /** 岗位现有人数 */
          alreadyPeople: number
          /** 
           * 需求原因 
           * 格式：{ "inCompilation": 1, "outsideCompilation": 2 }
           * 编制内（inCompilation）：1 = 离职补充 2 = 员工内部调动补充 3 = 拟替换不合格者
           * 编制外（outsideCompilation）：1 = 工作量增加 2 = 新业务拓展
           */
          demandCause: string
          /** 工作职责 */
          jobResponsibilities: string
          /** 任职资格 */
          qualifications: string
          /** 年龄 */
          age: number
          /** 学历 */
          education: string
          /** 专业 */
          profession: string
          /** 性别： 0 = 不限，1 = 男性，2 = 女性 */
          gender: number
          /** 特殊要求 */
          specialRequirements: string
          /** 建议薪资范围 例：10000, 15000 */
          salaryRange: string
        }
        /** 出差申请 */
        interface business extends base {
          /** 申请人部门Id */
          departmentId: string
          /** 申请人用户id */
          userId: string
          /** 申请日期 例：2019-09-09 */
          applicationDate: string
          /** 职务 */
          position: string
          /** 出差地点：0=国内，1=国外 */
          travelLocation: number
          /** 国家 */
          country: string
          /** 城市 */
          city: string
          /** 出差事由 */
          travelCause: string
          /** 代理事务 */
          agencyTransaction: string
          /** 职务代理人Id */
          positionProxyId: string
          /** 出差预估时间 例：2019-01-01,2019-01-05 */
          travelTimeEstimate: string
          /** 出差合计天数，最小0.5天 */
          travelDays: number
          /** 餐费 */
          mealFee: number
          /** 交通费 */
          transportationFee: number
          /** 住宿费 */
          accommodationFee: number
          /** 应酬费 */
          entertainmentExpenses: number
          /** 其他费用 */
          otherFee: number
          /** 合计费用 */
          totalCost: number
          /** 签证申请人名称 */
          visaApplicantName: string
          /** 签证人户籍 */
          visaHouseholdRegistration: string
          /** 预计停留时间 例：2019-01-01,2019-01-05 */
          residenceTime: string
          /** 护照签发地 */
          passportIssuingPlace: string
          /** 护照号码 */
          passportNumber: string
          /** 需签证国家 */
          visaCountry: string
          /** 签证类型 0=商务，1=旅行 */
          visaType: number
        }
        /** 采购申请 */
        interface purchase extends base {
          /** 公司id 0=逍遥盛世，1=昊立信 */
          companyId: number
          /** 单据编号 */
          documentNumber: string
          /** 申请人部门Id */
          departmentId: string
          /** 申请人用户id */
          userId: string
          /** 申请日期 例：2019-09-09 */
          applicationDate: string
          /** 需求项目类型 0=其他 1=公共项目 */
          projectType: number
          /** 采购类型 0=办公用品 1=日常用品 2=IT设备（键盘、鼠标、显卡、硬盘、显示器等） 3=办公电脑、笔记本电脑 4=测试服务器、渲染服务器 5=测试手机 6=电子产品（平板等） 7=外包服务 8=装修工程 9=其他 */
          purchaseType: number
          /** 采购物品信息集合 */
          purchaseList: {
            /** 物品类型（同采购类型） */
            itemType: number
            /** 型号/配置 */
            itemConfiguration: string
            /** 需求数量 */
            requiredQuantity: number
            /** 预算单价 */
            budgetUnitPrice: number
            /** 预算总额 */
            totalBudget: number
            /** 计划到货日期 例：2019-10-01 */
            arrivalDate: string
            /** 采购目的 */
            purchasePurpose: string
          }[]
        }
        /** 新旧电脑置换申请 */
        interface displace extends base {
          /** 公司id 0=逍遥盛世，1=昊立信 */
          companyId: number
          /** 申请人部门Id */
          departmentId: string
          /** 申请人用户id */
          userId: string
          /** 申请日期 例：2019-09-09 */
          applicationDate: string
          /** 申请原因 */
          reason: string
          /** 诊断人用户ID */
          diagnosticId: string
          /** 处理意见 */
          opinion: string
          /** 原有资产编号 */
          oldSn: string
          /** 资产申请类型 1：办公机 2：程序机 3：美工机 */
          assetType: number
        }
        /** 名片制作申请 */
        interface card extends base { }
      }
    }
    namespace Response {
      interface approval_processing_info {
        approvalInfo: Interface.APPROVAL_INFO[]
      }
      interface approval_wait_info {
        approvalInfo: Interface.APPROVAL_INFO[]
      }
      interface approval_completed_info {
        approvalInfo: Interface.APPROVAL_INFO[]
      }
      interface approval_all_info {
        approvalInfo: Interface.APPROVAL_INFO[]
      }
      interface approval_application_detail_info {
        applicationDetailInfo: Interface.APPLICATION_DETAIL_INFO
      }
      interface approval_detail_info {
        approvalDetailInfo: Interface.APPOVAL_DETAIL_INFO[]
      }
      interface user {
        address: string
        alias: string
        /** 单位：h */
        availableLeaveInLieu: number
        avatar: string
        contractExpirationDate: string
        correctionDate: string
        createTime: string
        department: number[]
        email: string
        employeeNumber: string
        enable: NumberBoolean
        english_name: string
        entryDate: string
        eparationDate: string
        errcode: number
        errmsg: string
        extattr: { attrs: any[] }
        externalPosition: ""
        external_profile: { external_attr: any[], external_corp_name: string }
        gender: GenderKind
        hide_mobile: NumberBoolean
        id: number
        isAttendance: NumberBoolean
        isLeaderInDept: string
        is_leader_in_dept: number[]
        isleader: NumberBoolean
        leaveDetailInfo: {
          hrSettingInfoList: {
            annualLeaveId: number
            duration: number
            id: number
            leaveType: number
            settingDate: string
            settingType: number
            userId: string
          }[]
          useDetailInfoList: any[]
          produceDetailInfoList: any[]
        }
        leaveInfo: {
          availableAnnualLeave: number
          availableLeaveInLieu: number
          bereavementLeave: number
          marriageLeave: number
          maternityLeave: number
          paternityLeave: number
          personalLeave: number
          sickLeave: number
        }
        leaveInfoList: {
          availableAnnualLeave: number
          endTime: string
          startTime: string
          userId: string
        }[]
        mobile: string
        modifyTime: string
        name: string
        newContractDate: string
        order: number[]
        overtimeDetailInfo: { hrSettingInfoList: any[], useDetailInfoList: any[], overtimeInfoList: any[] }
        position: string
        qr_code: string
        status: number
        telephone: string
        userId: string
        userName: string
        userStatus: number
        userid: string
        workYears: number
      }
      type leave_type_list = (Item.leave_type_list_item & {
        children?: Item.leave_type_list_item[]
      })[]
      interface user_info {

      }
      interface user_permission {
        roleInfo: user_permission
      }
    }
    namespace Map {
      type department_map = {
        id: Interface.DEPARTMENT_MAP_ID
        parent: Interface.DEPARTMENT_MAP_PARENT
      }
      interface leave_type_map {
        [key: number]: Item.leave_type_list_item & {
          field: string
          children?: Item.leave_type_list_item
        }
      }
      interface member_info_attendance_data {
        start_date: string
        end_date: string
        last_date: string
      }
    }
    namespace Item {
      interface leave_type_list_item {
        id: number
        leaveName: string
      }
      interface user_permission {
        /** 授权等级 1-15 */
        permissionLevel: number
        /** 角色信息描述 */
        roleDescription: string
        /** 角色id */
        roleId: number
        /** 角色名称 */
        roleName: string
        /** 角色状态 */
        roleStatus: NumberBoolean
      }
    }
    type $commit = (payload?: any, options?: CommitOptions) => void
    interface Mutations {
      member_info: $commit
      leave_type_list: $commit
      user_permission: $commit
      user: $commit
      access_token: $commit
      user_all: $commit
    }
    interface Getters {
      department_map: Map.department_map
      leave_type_map: Map.leave_type_map
      // member_info_attendance_data: Map.member_info_attendance_data
      MemberInfoAttendanceLg25: any
    }

    interface State {
      leave_type_list: Response.leave_type_list
      member_info: Response.user
      user_permission: Item.user_permission

      code: any
      access_token: any
      user: any
      user_info: any
      userList: any
      user_all: any[]
      userDepartment: any
      department_list: any
      work_process: any
      work_wait: any
      work_over: any
      work_all: any
      MemberInfo: any
      SystemConfig: any
    }
    interface Actions {
      /** 获取个人正在办理的审批列表 */
      approval_processing_info: (args: Args.approval_processing_info) => Promise<RG_SERVER_RES<Response.approval_processing_info>>
      /** 等待办理 */
      approval_wait_info: (args: Args.approval_wait_info) => Promise<RG_SERVER_RES<Response.approval_wait_info>>
      /** 完成办理 */
      approval_completed_info: (args: Args.approval_completed_info) => Promise<RG_SERVER_RES<Response.approval_completed_info>>
      /** 全部办理 */
      approval_all_info: (args: Args.approval_all_info) => Promise<RG_SERVER_RES<Response.approval_all_info>>
      /** 删除申请 */
      approval_delete_application: (args: Args.approval_delete_application) => Promise<RG_SERVER_RES_BASE>
      /** 根据流水号查询申请详细信息 */
      approval_application_detail_info: (args: Args.approval_application_detail_info) => Promise<RG_SERVER_RES<Response.approval_application_detail_info>>
      /** 根据流水号查询审批详细信息 */
      approval_detail_info: (args: Args.approval_detail_info) => Promise<RG_SERVER_RES<Response.approval_detail_info>>
      /** 提交审批 */
      approval_confirm: (args: Args.approval_confirm) => Promise<RG_SERVER_RES_BASE>
      /** 获取用户信息 */
      user: (args: Args.user) => Promise<Response.user>
      /** 获取用户列表 */
      user_list: (args: Args.user_list) => Promise<any>
      /** 获取假别类型 */
      leave_type_list: () => Promise<RG_SERVER_RES<Response.leave_type_list>>
      /** 获取部门列表 */
      department_list: (args?: any) => Promise<any>
      /** 获取用户权限信息 */
      user_permission: (args: Args.user_permission) => Promise<any>
      /** user_info */
      user_info: (args: Args.user_info) => Promise<RG_SERVER_RES<Response.user_info>>
      /** approval_application */
      approval_application: (args: Args.approval_application.admission | Args.approval_application.business, config?: any) => Promise<RG_SERVER_RES_BASE>
      /** 获取access_token */
      access_token: () => Promise<RG_SERVER_RES<{ oa: any }>>
      /** questionnaire_query */
      questionnaire_query: (args: Args.questionnaire_query) => Promise<RG_SERVER_RES<any>>
    }
  }
}

import _Vue, { WatchOptions } from "vue";
import "./vue";
import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from "./helpers";
import { UserInfo, type } from "os";
import { user_info } from "apollo-server/utils/db";
export * from "./helpers";
export declare class Store<S> {
  constructor(options: StoreOptions<S>);

  readonly state: S;
  readonly getters: any;

  replaceState(state: S): void;

  dispatch: Dispatch;
  commit: Commit;

  subscribe<P extends MutationPayload>(fn: (mutation: P, state: S) => any): () => void;
  subscribeAction<P extends ActionPayload>(fn: SubscribeActionOptions<P, S>): () => void;
  watch<T>(getter: (state: S, getters: any) => T, cb: (value: T, oldValue: T) => void, options?: WatchOptions): () => void;

  registerModule<T>(path: string, module: Module<T, S>, options?: ModuleOptions): void;
  registerModule<T>(path: string[], module: Module<T, S>, options?: ModuleOptions): void;

  unregisterModule(path: string): void;
  unregisterModule(path: string[]): void;

  hotUpdate(options: {
    actions?: ActionTree<S, S>;
    mutations?: MutationTree<S>;
    getters?: GetterTree<S, S>;
    modules?: ModuleTree<S>;
  }): void;
}
export declare function install(Vue: typeof _Vue): void;
export interface Dispatch {
  (type: string, payload?: any, options?: DispatchOptions): Promise<any>;
  <P extends Payload>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
}
export type $Commit = {
  $module: any

  $state: Vuex.OA.State
  $commit: any
  $getter: any
  $dispatch: any

  $get: any
  $post: any
  $notify: any
  $query: any
  $mutate: any
}
export interface Commit {
  (type: keyof $Commit, payload?: any, options?: CommitOptions): void;
  <P extends Payload>(payloadWithType: P, options?: CommitOptions): void;
}
export interface ActionContext<S, R> {
  dispatch: Dispatch;
  commit: Commit;
  state: S;
  getters: any;
  rootState: R;
  rootGetters: any;
}
export interface Payload {
  type: string;
}
export interface MutationPayload extends Payload {
  payload: any;
}
export interface ActionPayload extends Payload {
  payload: any;
}
export type ActionSubscriber<P, S> = (action: P, state: S) => any;
export interface ActionSubscribersObject<P, S> {
  before?: ActionSubscriber<P, S>;
  after?: ActionSubscriber<P, S>;
}
export type SubscribeActionOptions<P, S> = ActionSubscriber<P, S> | ActionSubscribersObject<P, S>;
export interface DispatchOptions {
  root?: boolean;
}
export interface CommitOptions {
  silent?: boolean;
  root?: boolean;
}
export interface StoreOptions<S> {
  state?: S | (() => S);
  getters?: GetterTree<S, S>;
  actions?: ActionTree<S, S>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<S>;
  plugins?: Plugin<S>[];
  strict?: boolean;
}
export type ActionHandler<S, R> = (this: Store<R>, injectee: ActionContext<S, R>, payload?: any) => any;
export interface ActionObject<S, R> {
  root?: boolean;
  handler: ActionHandler<S, R>;
}
export type Getter<S, R> = (state: S, getters: any, rootState: R, rootGetters: any) => any;
export type Action<S, R> = ActionHandler<S, R> | ActionObject<S, R>;
export type Mutation<S> = (state: S, payload?: any) => any;
export type Plugin<S> = (store: Store<S>) => any;
export interface Module<S, R> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: GetterTree<S, R>;
  actions?: ActionTree<S, R>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<R>;
}
export interface ModuleOptions {
  preserveState?: boolean;
}
export type GetterTree<S, R> = {
  [key in keyof Vuex.OA.Getters]: Getter<S, R>;
};
export type ActionTree<S, R> = {
  [key in keyof Vuex.OA.Actions]: Action<S, R>;
}
export interface MutationTree<S> {
  [key: string]: Mutation<S>;
}
export interface ModuleTree<R> {
  [key: string]: Module<any, R>;
}
declare const _default: {
  Store: typeof Store;
  install: typeof install;
  mapState: typeof mapState,
  mapMutations: typeof mapMutations,
  mapGetters: typeof mapGetters,
  mapActions: typeof mapActions,
  createNamespacedHelpers: typeof createNamespacedHelpers,
};
export default _default;
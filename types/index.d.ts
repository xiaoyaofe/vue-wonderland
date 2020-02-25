import { Store, Vuex, Commit, $Commit } from "./vuex/index"

declare module "vue/types/vue" {
  interface Vue {
    $language: "zh"
    $hourCalculate: (h: number) => string
    // $store: Store<any>
    $dispatch: Vuex.OA.Actions
    $getter: Vuex.OA.Getters
    $commit: Vuex.OA.Mutations
    $state: Vuex.OA.State
  }
}

declare namespace BaseDataType {
  type NumberBoolean = 0 | 1
  /**
   * 1：女
   * 2：男
   */
  type GenderKind = "1" | "2"
}

type UploadFileList = {
  name: string;
  percentage: number;
  raw: File;
  size: number;
  status: string;
  uid: number;
}[]

type NumberBoolean = 0 | 1

export namespace APOLLO {
  interface ServerRes<T> {
    data: T
    error: string
    loading: NumberBoolean
    networkStatus: number
  }
}

export namespace OA {
  export type WwLogin = Function
  export interface Args {
    options: {
      name: string
      data: {
        code: string
        access_token: string
        department_id: DEPARTMENT.DepartmentId
        fetch_child?: NumberBoolean
        userid: string
        id: string
      }
    }
  }
  export interface ServerRes {
    /** 返回码 */
    errcode: number;
    /** 对返回码的文本描述内容 */
    errmsg: string;
  }
  export interface RgServerResBase {
    code: number
    message: string
  }
  export type RgServerRes<R> = RgServerResBase & {
    data: R
  }
  /**
   * 获取所有假期类型
   */
  export interface LeaveAllType {
    LeaveTypeList: {
      id: number
      leaveName: string
      leaveDesc: string
    }[]
  }
  /**
  * 获取所有假期类型
  */
  export interface LeaveOvertimeDetailInfo {
    useDetailInfoList: {
      userId: string
      leaveType: string
      useDate: string
      duration: number
    }[]
    overtimeInfoList: {
      userId: string
      overtimeType: string
      overtimeTotal: number
      overtimeDate: string
    }[]
  }

  export interface Res<T> {
    oa: T
  }

  export interface AccessTokenRes extends ServerRes {
    /** 获取到的凭证，最长为512字节 */
    access_token: string;
    /** 凭证的有效时间（秒） */
    expires_in: number;
  }
  export namespace USER {
    /** 性别。0表示未定义，1表示男性，2表示女性 */
    type Gender = "0" | "1" | "2"
    /** 成员启用状态。1表示启用的成员，0表示被禁用。服务商调用接口不会返回此字段 */
    type Enable = 0 | 1
    /** 激活状态: 1 = 已激活，2 = 已禁用，4 = 未激活 已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。 */
    type Status = 1 | 2 | 4
    export interface User {
      /** 成员UserID。对应管理端的帐号 */
      userid: string
      /** 成员名称 */
      name: string
      /** 手机号码，第三方仅通讯录套件可获取 */
      mobile: string
      /** 成员所属部门id列表 */
      department: DEPARTMENT.DepartmentId[]
      /** 部门内的排序值，默认为0。数量必须和department一致，数值越大排序越前面。值范围是[0, 2 ^ 32) */
      order: number[]
      /** 职务信息；第三方仅通讯录应用可获取 */
      position: string
      gender: Gender
      /** 邮箱，第三方仅通讯录应用可获取 */
      email: string
      /** 标示是否为上级；第三方仅通讯录应用可获取 */
      isleader: NumberBoolean
      /** 头像url。注：如果要获取小图将url最后的”/0”改成”/100”即可。第三方仅通讯录应用可获取 */
      avatar: string
      /** 座机。第三方仅通讯录应用可获取 */
      telephone: string
      enable: Enable
      /** 别名；第三方仅通讯录应用可获取 */
      alias: string
      status: Status
      /** 员工个人二维码，扫描可添加为外部联系人；第三方仅通讯录应用可获取 */
      qr_code: string
      /** 对外职务。 第三方仅通讯录应用可获取 */
      external_position: string
      /** 成员对外属性，字段详情见对外属性；第三方仅通讯录应用可获取 */
      external_profile: any
      /** 扩展属性，第三方仅通讯录套件可获取 */
      extattr: any
    }
    export interface UserListRes extends ServerRes {
      /** 部门列表数据 */
      userlist: User[]
    }
    export type UserRes = User & ServerRes
    export type UserAll = any
    // User & RgUser & RgLeaveInfo & RgOvertimeInfo
    export interface RgUser {
      alias: string
      department: string
      email: string
      enable: number
      entryDate: string
      externalPosition: string
      gender: string
      id: number
      isLeaderInDept: string
      mobile: string
      order: string
      position: string
      telephone: string
      userId: string
      userName: string
      userStatus: number
      workYears: number
    }
    export interface RgUserRes {
      userInfo: RgUser
    }
    export interface UseDetailInfo {
      id: number
      serialNumber: string
      userId: string
      leaveType: string
      useDate: string
      startTime: string
      endTime: string
      duration: number
    }
    export interface ProduceDetailInfo {
      id: number
      userId: string
      leaveTotal: number
      useLeave: number
      availableLeave: number
      extraLeave: number
      extraLeaveType: number
      produceDate: string
      expireDate: string
      isReset: number
      remark:string
    }
    export interface RgLeaveInfo {
      hrSettingInfoList: {
        annualLeaveId: number
        duration: number
        id: number
        leaveType: number
        settingDate: string
        settingType: number
        userId: string,
        remark:string
      }[]
      useDetailInfoList: UseDetailInfo[]
      produceDetailInfoList: ProduceDetailInfo[]
    }
    export interface RgOvertimeInfo {
      hrSettingInfoList: {
        duration: number
        id: number
        leaveType: number
        settingDate: string
        settingType: number
        userId: string
      }[]
      useDetailInfoList: UseDetailInfo[]
      overtimeInfoList: ProduceDetailInfo[]
    }

    export type UserInfoRes = {
      /** 成员UserID。若需要获得用户详情信息，可调用通讯录接口 */
      UserId: string
      /** 手机设备号(由企业微信在安装时随机生成，删除重装会改变，升级不受影响) */
      DeviceId: number
    } & ServerRes
  }
  export namespace DEPARTMENT {
    export type DepartmentId = number
    export interface Department extends Object {
      /** 创建的部门id */
      id: DepartmentId
      /** 部门名称 */
      name: string
      /** 父亲部门id。根部门为1 */
      parentid: number
      /** 在父部门中的次序值。order值大的排序靠前。值范围是[0, 2 ^ 32) */
      order: number
    }
    export interface DepartmentListRes extends ServerRes {
      /** 部门列表数据 */
      department: Department[]
    }
    export interface DepartmentTreeDataItem extends Department {
      children?: DepartmentTreeDataItem[]
    }
  }

  /** 角色授权信息 */
  export interface UserPermission {
    roleInfo: {
      permissionLevel: number // 授权等级 1-15
      roleDescription: string // 角色信息描述
      roleId: number // 角色id
      roleName: string // 角色名称
      roleStatus: 0 | 1 // 角色状态
    }
  }

  /** action */
  export interface ActionArg1<R, P> {
    state: any
    commit: any
    dispatch: any
    getters: any
    rootGetters: any
    rootState: {
      [key in keyof $Commit]: any
    }
  }

}
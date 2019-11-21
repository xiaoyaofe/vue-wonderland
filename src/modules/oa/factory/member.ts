import { BaseDataType } from "types"

export declare interface user {
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
  enable: BaseDataType.NumberBoolean
  english_name: string
  entryDate: string
  eparationDate: string
  errcode: number
  errmsg: string
  extattr: { attrs: any[] }
  externalPosition: ""
  external_profile: { external_attr: any[], external_corp_name: string }
  gender: BaseDataType.GenderKind
  hide_mobile: BaseDataType.NumberBoolean
  id: number
  isAttendance: BaseDataType.NumberBoolean
  isLeaderInDept: string
  is_leader_in_dept: number[]
  isleader: BaseDataType.NumberBoolean
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

class Member {
  /** 地址 */
  address!: string
  /** 别名 */
  alias!: string
  /** 可用假期（单位：h） */
  availableLeaveInLieu!: number
}

class MemberFactory {

  /**
   * 查询用户信息
   */
  getMemberInfo(UserId: string) {

  }
}
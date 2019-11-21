import { OA } from "types";

enum ApplicationType {
  Admission = 4
}

export default class ApprovalApplication {

  constructor() {
    ApprovalApplication.ins = this
  }

  private static ins: ApprovalApplication

  static get instance() {
    return ApprovalApplication.ins || new ApprovalApplication
  }

  params: {
    [ApplicationType.Admission]: {
      // 申请类型
      applicationType: number
      // 公司ID 1：逍遥盛世，2：昊立信
      companyId: number
      // 申请人用户id
      userId: string
      // 入职人员中文名
      userNameCn: string
      // 入职人员英文名
      userNameEn: string
      // 部门名称
      departmentName: string
      // 职位
      position: string
      // 业务导师用户名
      businessTutorUserName: string
      // 汇报上级用户名
      spervisorUserName: string
      // 入职日期
      entryDate: string
      // 员工工号
      employeeNumber: string
      // 电脑配置 1: 普通电脑标配 2: 美术电脑+手写板 3: 普通电脑标配+固态硬盘 4: 内外网双机
      computerConfiguration: number
      // 是否准备办公用品 0: 未准备 1：已准备
      isOfficeSupplies: number
    }
  } = {
      [ApplicationType.Admission]: {
        applicationType: ApplicationType.Admission,
        companyId: -1,
        userId: "",
        userNameCn: "",
        userNameEn: "",
        departmentName: "",
        position: "",
        businessTutorUserName: "",
        spervisorUserName: "",
        entryDate: "",
        employeeNumber: "",
        computerConfiguration: -1,
        isOfficeSupplies: -1,
      }
    }

  async action(_: OA.ActionArg1<Response, {
    userId: number
  }>, p) {
    return _.rootState.$post("/approval/application", p).then(function (res) {
      if (res.code === 200) {
        _.commit("user_Permission", res.data)
      }
      return res.data
    })
  }

}
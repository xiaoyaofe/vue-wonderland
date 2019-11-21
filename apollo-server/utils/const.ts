export namespace OA {
  export const BASE_URL = "https://qyapi.weixin.qq.com"
  export const CORP_ID = process.env.VUE_APP_CORP_ID || ""
  export const AGENT_ID = process.env.VUE_APP_AGENT_ID || ""
  export const CORP_SECRET = process.env.VUE_APP_CORP_SECRET
  export const CODE = "code"
  export const ACCESS_TOKEN = "access_token"
  export const ACCESS_TOKEN_TIMESTAMP = "timestamp"
  export const ACCESS_TOKEN_EXP_TIMESTAMP = "expires_timestamp"
  export enum QUERY {
    ACCESS_TOKEN = "accessToken",
    USER_INFO = "userInfo",
    DEPARTMENT_LIST = "departmentList",
    USER_LIST = "userList",
    USER = "user",
    CODE = "code",
  }
  export enum QUERY_URL {
    ACCESS_TOKEN = "/cgi-bin/gettoken",
    USER_INFO = "/cgi-bin/user/getuserinfo",
    DEPARTMENT_LIST = "/cgi-bin/department/list",
    USER_LIST = "/cgi-bin/user/list",
    USER = "/cgi-bin/user/get"
  }

}
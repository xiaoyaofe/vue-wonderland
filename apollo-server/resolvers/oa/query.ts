import Axios from "axios"
import { OA as Const } from "../../utils/const"
import { access_token, user_info } from "../../utils/db"
import { OA as OA_TYPES } from "types"

export const code = function (UserId) {
  return new Promise(function (resolve, reject) {
    const jsonTable = user_info()
    const code = jsonTable.get(UserId).value()
    resolve(code || "")
  })
}

export const accessToken = function () {
  return new Promise(function (resolve, reject) {
    const jsonTable = access_token()
    const expires_timestamp: number = jsonTable.get(Const.ACCESS_TOKEN_EXP_TIMESTAMP).value()
    if (!expires_timestamp || expires_timestamp <= Date.now()) {
      Axios.get(Const.BASE_URL + Const.QUERY_URL.ACCESS_TOKEN, {
        params: {
          corpid: Const.CORP_ID,
          corpsecret: Const.CORP_SECRET,
        }
      }).then(function (response) {
        return response.data
      }).then(function (data: OA_TYPES.AccessTokenRes) {
        if (data.errcode === 0) {
          const access_token = data.access_token
          const timestamp = Date.now()
          const expiresTimestamp = timestamp + data.expires_in * 1000
          jsonTable.set(Const.ACCESS_TOKEN, access_token).set(Const.ACCESS_TOKEN_TIMESTAMP, timestamp).set(Const.ACCESS_TOKEN_EXP_TIMESTAMP, expiresTimestamp).write()
          resolve(access_token)
        } else {
          reject(data.errmsg)
        }
      }).catch(function (error) {
        reject(error)
      })
    } else {
      resolve(jsonTable.get(Const.ACCESS_TOKEN).value())
    }
  })
}

export const departmentList = function (access_token: string, id?: string) {
  return new Promise(function (resolve, reject) {
    if (!access_token) {
      reject('!access_token')
      return
    }
    Axios.get(Const.BASE_URL + Const.QUERY_URL.DEPARTMENT_LIST, {
      params: id ? { access_token, id } : { access_token }
    }).then(function (response) {
      return response.data
    }).then(function (data: OA_TYPES.DEPARTMENT.DepartmentListRes) {
      if (data.errcode === 0) {
        resolve(data.department)
      } else {
        reject(data.errmsg)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}

export const userInfo = function (access_token: string, code: string) {
  return new Promise(function (resolve, reject) {
    if (!access_token || !code) {
      reject('!access_token || !code')
      return
    }
    const jsonTable = user_info()
    const res = jsonTable.get(code).value()
    if (res) {
      resolve(res)
    } else {
      Axios.get(Const.BASE_URL + Const.QUERY_URL.USER_INFO, {
        params: {
          access_token,
          code
        }
      }).then(function (response) {
        return response.data
      }).then(function (data: OA_TYPES.USER.UserInfoRes) {
        if (data.errcode === 0) {
          const preCode = jsonTable.get(data.UserId).value()
          jsonTable.set(code, data).set(data.UserId, code).write()
          if (preCode) {
            jsonTable.unset(preCode).write()
          }
          resolve(data)
        } else {
          reject(data.errmsg)
        }
      }).catch(function (error) {
        reject(error)
      })
    }
  })
}

export const userList = function (access_token: string, department_id: number, fetch_child: number = 1) {
  return new Promise(function (resolve, reject) {
    if (!access_token || !department_id) {
      reject('!access_token || !department_id')
      return
    }
    Axios.get(Const.BASE_URL + Const.QUERY_URL.USER_LIST, {
      params: {
        access_token,
        department_id,
        fetch_child
      }
    }).then(function (response) {
      return response.data
    }).then(function (data: OA_TYPES.USER.UserListRes) {
      if (data.errcode === 0) {
        resolve(data.userlist)
      } else {
        reject(data.errmsg)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}

export const user = function (access_token: string, userid: string) {
  return new Promise(function (resolve, reject) {
    if (!access_token || !userid) {
      reject('!access_token || !userid')
      return
    }
    Axios.get(Const.BASE_URL + Const.QUERY_URL.USER, {
      params: {
        access_token,
        userid
      }
    }).then(function (response) {
      return response.data
    }).then(function (data: OA_TYPES.USER.UserRes) {
      if (data.errcode === 0) {
        resolve(data)
      } else {
        reject(data.errmsg)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}
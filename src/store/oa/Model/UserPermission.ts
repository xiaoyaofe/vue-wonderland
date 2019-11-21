import { action } from "src/utils/fns";
import { Vuex, RG_SERVER_RES } from "types/vuex";

export default class UserPermission {

  constructor() {
    UserPermission.ins = this
  }

  private static ins: UserPermission

  static get instance() {
    return UserPermission.ins || new UserPermission
  }

  state: Vuex.OA.Item.user_permission = {
    permissionLevel: 1,
    roleDescription: "",
    roleId: 0,
    roleName: "",
    roleStatus: 0,
  }

  action = action(async function ({ $post, $commit }, { UserId }) {
    return $post("/user/userPermission", {
      userId: UserId
    }).then(function (res: RG_SERVER_RES<Vuex.OA.Response.user_permission>) {
      res.code === 200 && $commit.user_permission(res.data.roleInfo);
      return res
    })
  })
}
<template>
  <div class="oa">
    <div v-if="qrCodeState === 1" class="wwlogin" id="wwlogin_oa"></div>
    <div v-else-if="qrCodeState === 0" class="main">
      <h1 class="title">{{ title }} 111</h1>
      <el-tabs v-model="active_name">
        <el-tab-pane v-for="({ name, label, component }, index) in menu" :key="index" :label="label" :name="name">
          <div v-if="condition">
            <component v-if="active_name === name" :is="require(`./packages/${component}/index.vue`).default" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Inject } from "vue-property-decorator";
import { get_parameter_by_name } from "src/utils/fns";
import { OA as Const } from "apollo-server/utils/const";
import { OA as Types } from "types";
import { Notification } from "element-ui";
import * as CryptoJS from "crypto-js";
const SQL = require("src/graphql/oa.gql");
//


let wwLoginScript = document.createElement("script");
document.body.appendChild(wwLoginScript);
let wwLoginScriptPromise = (function() {
  let resolve;
  let promise = new Promise(_ => {
    resolve = _;
  });
  return { promise, resolve };
})();
wwLoginScript.src = "https://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js";
wwLoginScript.onload = () => {
  wwLoginScriptPromise.resolve();
};

@Component<OA>({
  async created() {
    await this.$dispatch.access_token();
    const UserId = localStorage.UserId;
    if (UserId) {
      this.$dispatch.user({ UserId });
      this.$dispatch.leave_type_list();
      this.$dispatch.department_list().then(res => {
        const parent = this.$getter.department_map.parent;
        const parent_root = Object.keys(parent)[0];
        Promise.all(parent[parent_root].map(({ departmentId }) => this.$dispatch.user_list({ department_id: departmentId + "" }).then(list => list))).then(data => {
          const user_all = data.flat()
          this.$commit.user_all(user_all);
        });
      });
    }
    let code1, code2, code;
    code1 = get_parameter_by_name(Const.CODE);
    if (UserId) {
      code2 = (<Types.RgServerRes<Types.Res<string>>>await this.$apollo.mutate({
        mutation: SQL.oa,
        variables: {
          options: {
            name: Const.CODE,
            UserId
          }
        }
      })).data.oa;
      if (!code2) {
        localStorage.UserId = "";
        this.codeResolve("");
      } else {
        code = code2;
        this.codeResolve(code);
      }
    } else {
      if (code1) {
        await this.$dispatch.user_info({ code: code1 });
        location.href = process.env.VUE_APP_HTTP_ORIGIN + "/oa";
        this.codeReject();
      } else {
        this.codeResolve("");
      }
    }

    if (code) {
      const user_permission = await this.$dispatch.user_permission({ UserId });
      if (user_permission.data.roleInfo.roleStatus) {
        const banList = (process as any).env.VUE_APP_MOUDLE_BAN.split(",");
        if (user_permission.data.roleInfo.permissionLevel >= 15) {
          this.menu = [{ name: "member-info", label: "个人信息", component: "member_info" }, { name: "member-edit", label: "成员编辑", component: "member_edit" }, { name: "member-examine-approve", label: "我的审批", component: "member_examine_approve" }, { name: "system-config", label: "系统配置", component: "system_config" }].filter(item => !banList.includes(item.name));
        } else {
          this.menu = [{ name: "member-info", label: "个人信息", component: "member_info" }, { name: "member-examine-approve", label: "我的审批", component: "member_examine_approve" }].filter(item => !banList.includes(item.name));
        }
      } else {
        Notification.info("权限不足");
      }
    }
  },
  async mounted() {
    this.codePromise.then(code => {
      this.qrCodeState = code ? 0 : 1;
      !code &&
        wwLoginScriptPromise.promise.then(function() {
          let config: {
            id: string;
            appid: string;
            agentid: string;
            redirect_uri: string;
            href?: string;
            state?: string;
          } = {
            id: "wwlogin_oa",
            appid: Const.CORP_ID,
            agentid: Const.AGENT_ID,
            redirect_uri: encodeURIComponent(process.env.VUE_APP_HTTP_ORIGIN + "/oa")
          };
          window.WwLogin(config);
        });
    });
  }
})
export default class OA extends Vue {
  @Provide() get provider() {
    return this;
  }

  get condition() {
    return this.$state.member_info && this.$state.leave_type_list;
  }

  codeReject;
  codeResolve;
  codePromise = new Promise((resolve, reject) => {
    this.codeResolve = resolve;
    this.codeReject = reject;
  });
  qrCodeState: number = -1;
  title = "OA管理系统";
  active_name = process.env.VUE_APP_MOUDLE_DEFAULT;
  menu: any[] = [];

  createNonceStr() {
    return "0123456789ABCDEF";
  }

  getSignPackage() {
    let $jsapiTicket = "HoagFKDcsGMVCIY2vOjf9oeAOqoE-xI0_1a_qeo8xwa7a6uSUBFuMPNtmKoeasYOLj1RbLfR3THscJzoNmN3CA";
    let $url = `http://www.shindousaigo.com:4001/oa`;
    let $timestamp = Math.floor(Date.now() / 1000);
    let $nonceStr = this.createNonceStr();
    let $string = `jsapi_ticket=${$jsapiTicket}&noncestr=${$nonceStr}&timestamp=${$timestamp}&url=${$url}`;
    let $signature = CryptoJS.SHA1($string).toString();
    let $signPackage = {
      appId: "wwc5265d7ecd0d5d29",
      nonceStr: $nonceStr,
      timestamp: $timestamp,
      url: $url,
      signature: $signature,
      rawString: $string
    };
    return $signPackage;
  }
}
</script>

<style lang="scss">
.oa {
  margin: 0 auto;
  width: 1200px;
  font-family: "Raleway", sans-serif;
  .el-tabs__nav-wrap {
    display: flex;
    justify-content: left;
    margin: 24px 0 0 0;
  }
  .el-tabs__item {
    font-size: 18px;
    font-weight: 900;
    color: #515a6e;
    margin: 0 0 5px 0;
  }
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .title {
    margin-top: 40px;
  }
  .wwlogin {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: -10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

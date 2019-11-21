<template>
  <div class="displace approve_desc_page">
    <div v-if="detail">
      <!-- 办理流程 -->
      <el-row type="flex">
        <el-col class="label">办理流程：</el-col>
        <el-col class="value fixed">
          <span v-html="manager"></span>
        </el-col>
      </el-row>
      <!-- 下一办理人 -->
      <el-row type="flex">
        <el-col class="label">下一办理人：</el-col>
        <el-col class="value fixed">
          <span v-html="nextManager" />
        </el-col>
        <!-- <el-col>
          <el-popover placement="right" width="300" trigger="click">
            <div slot style="height:500px">
              <el-input :size="input_size" style="width:240px;position:fixed;" clearable v-model="xzry_search"></el-input>
              <div style="position:absolute;height:464px;overflow:auto;bottom:10px;width:285px;padding-right: 8px;">
                <div v-for="item in user_all" :key="item.userid" :class="nextApproverId.includes(item.userid) ? 'xzry active' : 'xzry'" @click="xzry.call(this, item)">
                  <div v-if="!xzry_search || (xzry_search && (item.userid + item.name).indexOf(xzry_search) !== -1)">{{ item.userid }} ({{ item.name }})</div>
                </div>
              </div>
            </div>
            <el-button slot="reference" :size="input_size" style="margin-left: 10px;" v-if="base[userId]">选择人员</el-button>
          </el-popover>
        </el-col> -->
      </el-row>
      <!-- 日期 -->
      <el-row type="flex">
        <el-col class="label">日期：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.applicationDate }}</el-col>
      </el-row>
      <!-- 公司 -->
      <el-row type="flex">
        <el-col class="label">
          公司：
        </el-col>
        <el-col class="value">
          {{ ["逍遥盛世", "昊立信"][approval_application_detail_info.applicationDetailInfo.companyId * 1] }}
        </el-col>
      </el-row>
      <!-- 诊断者 -->
      <el-row type="flex">
        <el-col class="label">
          诊断者：
        </el-col>
        <el-col class="value"> {{ this.user_all && this.user_all.find(item => item.userid === approval_application_detail_info.applicationDetailInfo.diagnosticId).name }}({{ approval_application_detail_info.applicationDetailInfo.diagnosticId }}) </el-col>
      </el-row>
      <!-- 原有资产编号 -->
      <el-row type="flex">
        <el-col class="label">
          原有资产编号：
        </el-col>
        <el-col class="value">{{ approval_application_detail_info.applicationDetailInfo.oldSn }}</el-col>
        <el-col class="label">
          申请资产类型：
        </el-col>
        <el-col class="value">{{ ["", "办公机", "程序机", "美工机"][approval_application_detail_info.applicationDetailInfo.assetType * 1] }}</el-col>
      </el-row>
      <!-- 申请原因 -->
      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.reason">
        <el-col class="label">
          申请原因：
        </el-col>
        <el-col class="value"> {{ approval_application_detail_info.applicationDetailInfo.reason }}</el-col>
      </el-row>
      <!-- 运维处理意见 -->
      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.opinion">
        <el-col class="label">
          运维处理意见：
        </el-col>
        <el-col class="value full">
          {{ approval_application_detail_info.applicationDetailInfo.opinion }}
        </el-col>
      </el-row>
      <el-row type="flex" v-if="base.approverRoleId == 3">
        <el-col class="label">
          *运维处理意见：
        </el-col>
        <el-col class="value full">
          <el-input type="textarea" v-model="model.opinion" v-required="model.opinion" />
        </el-col>
      </el-row>

      <!-- confirm -->
      <el-row v-if="base.userId === $state.member_info.userid" type="flex" style="padding:0 24px 0 12px;margin: 25px 0 0 0;">
        <el-button :size="input_size" class="full" @click="confirm.call(this, 2)">否决</el-button>
        <el-button :size="input_size" class="full" v-required="confirm">同意</el-button>
      </el-row>
    </div>
    <div v-else>
      <!-- 申请人 -->
      <el-row type="flex">
        <el-col class="label">
          申请人：
        </el-col>
        <el-col class="value fixed">
          {{ userId }}
        </el-col>
        <el-col class="label">
          需求部门：
        </el-col>
        <el-col class="value fixed">
          {{ $store.state.oa.userDepartment[0].name }}
        </el-col>
        <el-col class="label">
          申请日期：
        </el-col>
        <el-col class="value fixed">
          {{ model.applicationDate }}
        </el-col>
      </el-row>

      <!-- 公司 -->
      <el-row type="flex">
        <el-col class="label">
          *公司：
        </el-col>
        <el-col class="value">
          <el-select :size="input_size" v-model="model.companyId" v-required="model.companyId">
            <el-option :value="`0`" label="逍遥盛世" />
            <el-option :value="`1`" label="昊立信" />
          </el-select>
        </el-col>
      </el-row>

      <!-- *诊断者 -->
      <el-row type="flex" v-if="user_all">
        <el-col class="label">
          *诊断者：
        </el-col>
        <el-col class="value">
          <el-select :size="input_size" v-model="model.diagnosticId" v-required="model.diagnosticId">
            <el-option v-for="user in user_all.filter(item => item.department.includes(1487015645))" :key="user.userid" :value="user.userid" :label="user.name" />
          </el-select>
        </el-col>
      </el-row>

      <!-- 申请原因 -->
      <el-row type="flex">
        <el-col class="label">申请原因：</el-col>
        <el-col class="value full">
          <el-input type="textarea" autosize v-model="model.reason" />
        </el-col>
      </el-row>

      <!-- 运维处理意见 -->
      <el-row type="flex">
        <el-col class="label">资产申请明细</el-col>
      </el-row>

      <!-- 原有资产编号 -->
      <el-row type="flex">
        <el-col class="label">
          *原有资产编号：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" v-model="model.oldSn" v-required="model.oldSn" />
        </el-col>
      </el-row>

      <!-- 申请资产类型 -->
      <el-row type="flex">
        <el-col class="label">
          *申请资产类型：
        </el-col>
        <el-col class="value">
          <el-select :size="input_size" v-model="model.assetType" v-required="model.assetType">
            <el-option :value="`1`" label="办公机" />
            <el-option :value="`2`" label="程序机" />
            <el-option :value="`3`" label="美工机" />
          </el-select>
        </el-col>
      </el-row>
      <el-row type="flex" style="margin: 0 0 0 18px;line-height:24px">
        说明：<br />
        办公机：适用于普通办公（无独立显卡）需求，为团队常规采购机型，型号：I3-2120/500G<br />
        程序机：适用于程序部门的需求，根据团队程序部门定义机器（程序机=办公机+64G固态硬盘）<br />
        美工机：DELL品牌机器，适用于美术员工及有独立显卡需求的申请（显示器根据需求配置）<br />
      </el-row>

      <!-- 提交 -->
      <el-row type="flex" style="padding: 0 24px 0 12px;margin: 20px 0 0 0;">
        <el-button class="full submit" :size="input_size" v-required="submit">提交</el-button>
      </el-row>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { getDateByFormat, getHoursByFormat } from "src/service/date";
import { OA } from "types";
import { Vuex } from "types/vuex";
import { Detail } from "src/modules/oa/packages/member_examine_approve/_works.vue";

@Component
export default class Displace extends Vue {
  input_size = "small";
  @Prop() detail!: Detail;
  approval_application_detail_info: Vuex.OA.Response.approval_application_detail_info = this.detail && this.detail.approval_application_detail_info;
  approval_detail_info: Vuex.OA.Response.approval_detail_info = this.detail && this.detail.approval_detail_info;
  get user_all() {
    return this.$state.user_all;
  }
  xzry_search = "";
  nextApproverId: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverId ? this.approval_detail_info.approvalDetailInfo[0].nextApproverId.split(",") : [];
  nextApproverName: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverName ? this.approval_detail_info.approvalDetailInfo[0].nextApproverName.split(",") : [];
  get department_map() {
    return this.$getter.department_map;
  }
  get leave_type_map() {
    return this.$getter.leave_type_map;
  }
  get userId() {
    return localStorage.UserId;
  }
  get base() {
    return (this.approval_detail_info.approvalDetailInfo.find(item => item.approvalResult === 3) as Vuex.OA.Interface.APPOVAL_DETAIL_INFO) || ({} as any);
  }
  get manager() {
    let m = ["同意", "驳回", "待审批", "已转审", "已撤回"],
      f = {},
      s = "",
      d = "&nbsp;&nbsp;->&nbsp;&nbsp;";
    [
      ...[
        {
          label: `${this.approval_application_detail_info.applicationDetailInfo.userId}(申请人)`,
          s: d
        }
      ],
      ...this.approval_detail_info.approvalDetailInfo.map(({ order, userId, approvalResult }) => {
        const r = {
          label: `${userId}(${m[approvalResult - 1]})`,
          s: f[order] ? "," : d
        };
        f[order] = true;
        return r;
      })
    ].forEach((item, index, array) => {
      const n = array[index + 1];
      s += item.label + (n ? n.s : "");
    });
    return s;
  }
  get nextManager() {
    return (this.base && this.base.nextApproverId) || "无";
  }
  changeNextManager(el) {
    if (el.target.classList.contains("el-icon-circle-close")) {
      let name = el.target.getAttribute("name");
      this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
    }
  }
  confirm(approvalResult) {
    var data = Object.assign({}, this.base, { approvalResult });
    this.$dispatch.approval_confirm(data).then(data => {
      if (data.code === 200) {
        this.$emit("success", 0);
        this.$notify.success("操作完成");
        this.$dispatch.approval_wait_info({
          UserId: localStorage.UserId
        });
        this.$dispatch.approval_completed_info({
          UserId: localStorage.UserId
        });
      } else {
        this.$notify.error(data.message);
      }
    });
  }
  xzry(userInfo) {
    let userid = userInfo.userid;
    let name = userInfo.name;
    let index = this.nextApproverId.indexOf(userid);
    if (index === -1) {
      this.nextApproverId.push(userid);
      this.nextApproverName.push(name);
    } else {
      this.nextApproverId.splice(index, 1);
      this.nextApproverName.splice(index, 1);
    }
  }
  model = {
    /** 申请类型 */
    applicationType: "9",
    /** 公司id 0=逍遥盛世，1=昊立信 */
    companyId: "",
    /** 申请人部门Id */
    departmentId: this.$state.member_info.department[0] + "",
    /** 申请人用户id */
    userId: localStorage.UserId,
    /** 申请日期 例：2019-09-09 */
    applicationDate: getDateByFormat("yyyy-MM-dd"),
    /** 申请原因 */
    reason: "",
    /** 诊断人用户ID */
    diagnosticId: "",
    /** 处理意见 */
    opinion: "",
    /** 原有资产编号 */
    oldSn: "",
    /** 资产申请类型 1：办公机 2：程序机 3：美工机 */
    assetType: ""
  };

  @Watch("model.opinion")
  changed_model_opinion(opinion) {
    if (this.base) {
      this.base.exInfo = JSON.stringify({
        opinion
      });
    }
  }

  async submit() {
    let form_data = {};
    for (let key in this.model) {
      switch (key) {
        default:
          form_data[key] = this.model[key].trim();
          break;
      }
    }
    this.$dispatch.approval_application(form_data as any).then(res => {
      if (res.code === 200) {
        this.$emit("success", 0);
      }
    });
  }
}
</script>

<style lang="scss">
// .displace.approve_desc_page {
// }
</style>

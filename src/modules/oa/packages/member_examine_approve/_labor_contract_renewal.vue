<template>
  <div class="approve_desc_page labor_contract_renewal">
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
      </el-row>
      <!-- 日期 -->
      <el-row type="flex">
        <el-col class="label">日期：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.createTime }}</el-col>
      </el-row>

      <!-- 部门意见 -->
      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.departmentOpinion">
        <el-col class="label">部门意见：</el-col>
        <el-col class="value fixed">{{ ["不再续聘", "续聘"][approval_application_detail_info.applicationDetailInfo.departmentOpinion] }}</el-col>
      </el-row>

      <!-- 部门原因 -->
      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.departmentReason">
        <el-col class="label">部门原因：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.departmentReason }}</el-col>
      </el-row>

      <!-- 人事处理意见 -->
      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.hrOpinion">
        <el-col class="label">人事处理意见：</el-col>
        <el-col class="value fixed">{{ ["终止", "续签合同"][approval_application_detail_info.applicationDetailInfo.hrOpinion] }}</el-col>
      </el-row>

      <!-- 续签合同类型 -->
      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.renewType">
        <el-col class="label">续签合同类型：</el-col>
        <el-col class="value fixed">{{ ["无固定期限", "有固定期限"][approval_application_detail_info.applicationDetailInfo.renewType] }}</el-col>
      </el-row>

      <!-- 续签合同期限 -->
      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.renewType == 1">
        <el-col class="label">续签合同期限：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.renewStartTime }} 至 {{ approval_application_detail_info.applicationDetailInfo.renewEndTime }}</el-col>
      </el-row>

      <div v-if="base.approverRoleId == 5">
        <el-row type="flex">
          <el-col class="label">
            用人部门意见
          </el-col>
        </el-row>
        <el-row type="flex">
          <div class="item">
            <el-col class="label">
              *意见：
            </el-col>
            <el-col class="value">
              <el-select :size="input_size" v-model="model.departmentOpinion" v-required="model.departmentOpinion">
                <el-option label="续聘" value="1" />
                <el-option label="不再续聘" value="0" />
              </el-select>
            </el-col>
          </div>
        </el-row>
        <el-row type="flex">
          <!-- <div class="item"> -->
          <el-col class="label">
            *原因：
          </el-col>
          <el-col class="value full">
            <el-input type="textarea" :size="input_size" v-model="model.departmentReason" v-required="model.departmentReason" />
          </el-col>
          <!-- </div> -->
        </el-row>
      </div>

      <el-row type="flex" v-if="base.approverRoleId == 4">
        <el-row type="flex">
          <el-col class="label">
            人事行政部意见：
          </el-col>
          <el-col class="value">
            <el-select :size="input_size" v-model="model.hrOpinion" v-required="model.hrOpinion">
              <el-option label="续签合同" value="1"></el-option>
              <el-option label="终止" value="0"></el-option>
            </el-select>
          </el-col>
          <el-col class="value" v-if="model.hrOpinion == 1">
            <el-select :size="input_size" v-model="model.renewType" v-required="model.renewType">
              <el-option label="有固定期限" value="1"></el-option>
              <el-option label="无固定期限" value="0"></el-option>
            </el-select>
          </el-col>
          <el-col class="value" v-if="model.renewType == 1">
            <el-date-picker :size="input_size" v-model="renewLimit" v-required="renewLimit" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
          </el-col>
        </el-row>
      </el-row>
      <!-- confirm -->
      <el-row v-if="base.userId === $state.member_info.userid" type="flex" style="padding:0 24px 0 12px;margin: 25px 0 0 0;">
        <el-button :size="input_size" class="full" @click="confirm.call(this, 2)">否决</el-button>
        <el-button :size="input_size" class="full" v-required="confirm">同意</el-button>
      </el-row>
    </div>
    <div v-else>
      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            姓名：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.name }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            部门：
          </el-col>
          <el-col class="value fixed">
            {{ $store.state.oa.userDepartment[0].name }}
          </el-col>
        </div>
      </el-row>
      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            职务：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.position }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            入职时间：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.entryDate }}
          </el-col>
        </div>
      </el-row>
      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            原合同起始时间：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.newContractDate }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            原合同终止时间：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.contractExpirationDate }}
          </el-col>
        </div>
      </el-row>
      <el-row type="flex" style="padding: 0 24px 0 12px;margin: 20px 0 0 0;">
        <el-button class="submit" v-required="submit">
          提交
        </el-button>
      </el-row>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Vuex } from "../../../../../types/vuex";
import { Detail } from "src/modules/oa/packages/member_examine_approve/_works.vue";
import { getDateByFormat } from "src/service/date";

@Component<Card>({
  // created() {
  //   console.log(this.$state.member_info);
  // }
})
export default class Card extends Vue {
  @Prop() detail!: Detail;
  xzry_search = "";
  userAll = "";
  approval_application_detail_info: Vuex.OA.Response.approval_application_detail_info = this.detail && this.detail.approval_application_detail_info;
  approval_detail_info: Vuex.OA.Response.approval_detail_info = this.detail && this.detail.approval_detail_info;
  nextApproverId: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverId ? this.approval_detail_info.approvalDetailInfo[0].nextApproverId.split(",") : [];
  nextApproverName: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverName ? this.approval_detail_info.approvalDetailInfo[0].nextApproverName.split(",") : [];
  get department_map() {
    return this.$getter.department_map;
  }
  get userId() {
    return localStorage.UserId;
  }
  get base() {
    return (this.approval_detail_info.approvalDetailInfo.find(item => item.approvalResult === 3) as Vuex.OA.Interface.APPOVAL_DETAIL_INFO) || ({} as any);
  }
  get user() {
    return this.$state.member_info;
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
  public userInfo: Vuex.OA.Response.user = this.$state.member_info;
  input_size = "small";
  renewLimit = "";
  @Watch("renewLimit")
  renewLimitChanged(value) {
    this.model.renewStartTime = value[0];
    this.model.renewEndTime = value[1];
  }
  model = {
    /** 申请类型 */
    applicationType: "14",

    /** 申请人部门Id */
    departmentId: this.$state.member_info.department[0],
    /** 申请人用户id */
    userId: this.$state.member_info.userid,
    /** 职务 */
    position: this.$state.member_info.position,
    /** 入职日期 例：2019-09-09 */
    entryDate: this.$state.member_info.entryDate,
    /** 原合同开始日期 例：2019-09-09 */
    oldContractStartTime: this.$state.member_info.newContractDate,
    /** 原合同结束日期 例：2019-09-09 */
    oldContractEndTime: this.$state.member_info.contractExpirationDate,
    /** 部门意见 0=不再续聘 1=续聘 */
    departmentOpinion: "",
    /** 部门原因 */
    departmentReason: "",
    /** 人事处理意见 0=终止 1=续签合同 */
    hrOpinion: "",
    /** 续签合同类型 0=无固定期限 1=有固定期限 */
    renewType: "",
    /** 续签合同开始时间 例：2019-09-09 */
    renewStartTime: "",
    /** 续签合同结束时间 例：2019-09-09 */
    renewEndTime: ""
  };

  check() {
    if (this.base.approverRoleId == 5) {
      this.base.exInfo = JSON.stringify({
        departmentReason: this.model.departmentReason,
        departmentOpinion: this.model.departmentOpinion
      });
    }
    if (this.base.approverRoleId == 4) {
      this.base.exInfo = JSON.stringify({
        hrOpinion: this.model.hrOpinion,
        renewType: this.model.renewType,
        renewStartTime: this.model.renewStartTime,
        renewEndTime: this.model.renewEndTime
      });
    }
  }

  submit() {
    let form_data = {};
    for (let key in this.model) {
      switch (key) {
        default:
          form_data[key] = this.model[key].trim ? this.model[key].trim() : this.model[key];
          break;
      }
    }
    this.$dispatch.approval_application(form_data as any).then(res => {
      if (res.code === 200) {
        this.$emit("success", 0);
      }
    });
  }
  confirm(approvalResult) {
    this.check();
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
  changeNextManager(name) {
    this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
  }
}
</script>

<style lang="scss">
.labor_contract_renewal {
  .el-range-editor--small .el-range-separator {
    line-height: 32px;
  }
}
</style>

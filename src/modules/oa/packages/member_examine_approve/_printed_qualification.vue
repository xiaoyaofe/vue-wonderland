<template>
  <div class="printed_qualification approve_desc_page">
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
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.createTime }}</el-col>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            公司名称：
          </el-col>
          <el-col class="value">
            {{ options_company_id.find(item => item.value == approval_application_detail_info.applicationDetailInfo.companyId).label }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            借用印章/证照：
          </el-col>
          <el-col class="value">
            {{ options_borrow_type.find(item => item.value == approval_application_detail_info.applicationDetailInfo.borrowType).label }}
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            使用方式：
          </el-col>
          <el-col class="value">
            {{ options_use_type.find(item => item.value == approval_application_detail_info.applicationDetailInfo.useType).label }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            借用时间：
          </el-col>
          <el-col class="value">
            {{ approval_application_detail_info.applicationDetailInfo.borrowDate }}
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          借用事由：
        </el-col>
        <el-col class="value full">
          {{ approval_application_detail_info.applicationDetailInfo.borrowReason }}
        </el-col>
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
            申请人：
          </el-col>
          <el-col class="value fixed">
            {{ userInfo.userName }}
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
        <div class="item">
          <el-col class="label">
            申请日期：
          </el-col>
          <el-col class="value fixed">
            {{ model.applicationDate }}
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *公司名称：
          </el-col>
          <el-col class="value">
            <el-select :size="input_size" v-model="model.companyId" v-required="model.companyId">
              <el-option v-for="item in options_company_id" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *借用印章/证照：
          </el-col>
          <el-col class="value">
            <el-select :size="input_size" v-model="model.borrowType" v-required="model.borrowType">
              <el-option v-for="item in options_borrow_type" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *使用方式：
          </el-col>
          <el-col class="value">
            <el-select :size="input_size" v-model="model.useType" v-required="model.useType">
              <el-option v-for="item in options_use_type" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *借用时间：
          </el-col>
          <el-col class="value">
            <el-date-picker class="date_picker" type="date" style="width: 156px;" :size="input_size" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="model.borrowDate" v-required="model.borrowDate" />
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *借用事由：
        </el-col>
        <el-col class="value full">
          <el-input type="textarea" :size="input_size" v-model="model.borrowReason" v-required="model.borrowReason" />
        </el-col>
      </el-row>

      <el-row type="flex" style="padding: 0 24px 0 12px;margin: 20px 0 0 0;">
        <el-button class="submit full" v-required="submit">
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

@Component
export default class PrintedQualification extends Vue {
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
  model = {
    /** 申请类型 */
    applicationType: "13",
    /** 公司id 0=逍遥盛世，1=昊立信，2=HONGKONG IPOCKET，3=HONGKONG ROYALE GAMES */
    companyId: "",
    /** 申请人部门Id */
    departmentId: this.$state.member_info.department[0],
    /** 申请人用户id */
    userId: this.$state.member_info.userid,
    /** 申请日期 例：2019-09-09 */
    applicationDate: getDateByFormat("yyyy-MM-dd"),
    /** 借用印章/证照 1：公章 2：法人章 3：财务章 4：营业执照正本 5：营业执照副本 */
    borrowType: "",
    /** 借用事由 */
    borrowReason: "",
    /** 借用日期 例：2019-09-09 */
    borrowDate: "",
    /** 使用方式 1：外带 2：公司使用 */
    useType: ""
  };

  options_company_id = [
    {
      value: "0",
      label: "逍遥盛世"
    },
    {
      value: "1",
      label: "昊立信"
    },
    {
      value: "2",
      label: "HONGKONG IPOCKET"
    },
    {
      value: "3",
      label: "HONGKONG ROYALE GAMES"
    }
  ];

  options_borrow_type = [
    {
      value: "1",
      label: "公章"
    },
    {
      value: "2",
      label: "法人章"
    },
    {
      value: "3",
      label: "财务章"
    },
    {
      value: "4",
      label: "营业执照正本"
    },
    {
      value: "5",
      label: "营业执照副本"
    }
  ];

  options_use_type = [
    {
      value: "1",
      label: "外带"
    },
    {
      value: "2",
      label: "公司使用"
    }
  ];

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
// .printed_qualification {
// }
</style>

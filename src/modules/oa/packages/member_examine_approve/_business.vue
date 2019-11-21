<template>
  <div class="business approve_desc_page">
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
        <!-- -------------------------------------------------- -->
        <el-col class="label">职务：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.position }}</el-col>
      </el-row>
      <el-row type="flex">
        <!-- -------------------------------------------------- -->
        <el-col class="label">出差地点：</el-col>
        <el-col class="value fixed">{{ ["国内", "国外"][approval_application_detail_info.applicationDetailInfo.travelLocation * 1] }}</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.address }}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="label">出差事由：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.travelCause }}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="label">代理事务：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.agencyTransaction }}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="label">代理人用户id：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.positionProxyId }}</el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">出差预估时间：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.travelTimeEstimate.replace(",", " 至 ") }}</el-col>

        <el-col class="label">出差合计天数：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.travelDays + "天" }}</el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">餐费：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.mealFee + "元" }}</el-col>
        <el-col class="label">交通费：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.transportationFee + "元" }}</el-col>
        <el-col class="label">住宿费：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.accommodationFee + "元" }}</el-col>
        <div v-if="approval_application_detail_info.applicationDetailInfo.entertainmentExpenses">
          <el-col class="label">应酬费：</el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.entertainmentExpenses + "元" }}</el-col>
        </div>
        <div v-if="approval_application_detail_info.applicationDetailInfo.otherFee">
          <el-col class="label">其他费用：</el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.otherFee + "元" }}</el-col>
        </div>

        <el-col class="label">合计费用：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.totalCost + "元" }}</el-col>
      </el-row>

      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.visaApplicantName || approval_application_detail_info.applicationDetailInfo.visaHouseholdRegistration || approval_application_detail_info.applicationDetailInfo.residenceTime">
        <div v-if="approval_application_detail_info.applicationDetailInfo.visaApplicantName">
          <el-col class="label">签证申请人名称：</el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.visaApplicantName }}</el-col>
        </div>

        <div v-if="approval_application_detail_info.applicationDetailInfo.visaHouseholdRegistration">
          <el-col class="label">签证人户籍：</el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.visaHouseholdRegistration }}</el-col>
        </div>

        <div v-if="approval_application_detail_info.applicationDetailInfo.residenceTime">
          <el-col class="label">预计停留时间：</el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.residenceTime.replace(",", " 至 ") }}</el-col>
        </div>
      </el-row>

      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.passportIssuingPlace || approval_application_detail_info.applicationDetailInfo.passportNumber || approval_application_detail_info.applicationDetailInfo.visaCountry || approval_application_detail_info.applicationDetailInfo.visaType">
        <div v-if="approval_application_detail_info.applicationDetailInfo.passportIssuingPlace">
          <el-col class="label">护照签发地：</el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.passportIssuingPlace }}</el-col>
        </div>

        <div v-if="approval_application_detail_info.applicationDetailInfo.passportNumber">
          <el-col class="label">护照号码：</el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.passportNumber }}</el-col>
        </div>

        <div v-if="approval_application_detail_info.applicationDetailInfo.visaCountry">
          <el-col class="label">需签证国家：</el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.visaCountry }}</el-col>
        </div>

        <div v-if="approval_application_detail_info.applicationDetailInfo.visaType">
          <el-col class="label">签证类型：</el-col>
          <el-col class="value fixed">{{ ["商务", "旅行"][approval_application_detail_info.applicationDetailInfo.visaType * 1] }}</el-col>
        </div>
      </el-row>

      <!-- confirm -->
      <el-row v-if="base.userId === $state.member_info.userid" type="flex" style="padding:0 24px 0 12px;margin: 25px 0 0 0;">
        <el-button :size="input_size" class="full" @click="confirm.call(this, 2)">否决</el-button>
        <el-button :size="input_size" class="full" v-required="confirm">同意</el-button>
      </el-row>
    </div>
    <div v-else>
      <el-row type="flex">
        <el-col class="label">
          申请人：
        </el-col>
        <el-col class="value fixed">
          {{ userInfo.userName }}
        </el-col>
        <el-col class="label">
          部门：
        </el-col>
        <el-col class="value fixed">
          {{ $store.state.oa.userDepartment[0].name }}
        </el-col>
        <el-col class="label">
          职务：
        </el-col>
        <el-col class="value fixed">
          {{ user_position }}
        </el-col>
        <el-col class="label">
          申请日期：
        </el-col>
        <el-col class="value fixed">
          {{ model.applicationDate }}
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *出差地点：
        </el-col>
        <el-col class="value">
          <el-select :size="input_size" v-model="model.travelLocation" v-required="model.travelLocation">
            <el-option label="国内" value="0" />
            <el-option label="国外" value="1" />
          </el-select>
        </el-col>
        <el-col class="label" v-show="model.travelLocation">
          *地址：
        </el-col>
        <el-col v-show="model.travelLocation" class="value full">
          <el-input :size="input_size" v-model="model.address" v-required="model.address" />
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *出差事由：
        </el-col>
        <el-col class="value full">
          <el-input type="textarea" :size="input_size" v-model="model.travelCause" v-required="model.travelCause" />
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *代理事务：
        </el-col>
        <el-col class="value full">
          <el-input type="textarea" :size="input_size" v-model="model.agencyTransaction" v-required="model.agencyTransaction" />
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *职务代理人：
        </el-col>
        <el-col class="value full">
          <el-input type="textarea" :size="input_size" v-model="model.positionProxyId" v-required="model.positionProxyId" />
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *出差预估时间：
        </el-col>
        <el-col class="value">
          <el-date-picker class="date_picker" type="daterange" :size="input_size" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="model.travelTimeEstimate" range-separator="至" v-required="model.travelTimeEstimate" />
        </el-col>

        <el-col class="label">
          合计：
        </el-col>
        <el-col class="value">
          {{ sum }}
        </el-col>
      </el-row>

      <el-row style="color:red;line-height:25px;margin:0 0 0 16px;">
        备注：1、需提前两天以上申请，方可出差。 <br />
        2、若出差时间包含节假日且属于加班的，请另外提交该节假日区间的加班。
      </el-row>

      <el-row style="margin:15px 0 10px 0;">
        <el-col class="label">
          一、费用预估明细（元）
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *餐费：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" type="number" v-model="model.mealFee" v-required="model.mealFee" />
        </el-col>

        <el-col class="label">
          *交通费：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" type="number" v-model="model.transportationFee" v-required="model.transportationFee" />
        </el-col>

        <el-col class="label">
          *住宿费：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" type="number" v-model="model.accommodationFee" v-required="model.accommodationFee" />
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          应酬费：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" type="number" v-model="model.entertainmentExpenses" />
        </el-col>
        <el-col class="label">
          其他费用：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" type="number" v-model="model.otherFee" />
        </el-col>

        <el-col class="label">
          合计费用：
        </el-col>
        <el-col class="value">
          {{ totalCost }}
        </el-col>
      </el-row>

      <el-row style="color:red;line-height:25px;margin:0 0 0 16px;">
        <span style="color:#000;line-height:28px;">酒店住宿标准及餐费补助说明：</span><br />
        <div style="margin: 0 0 0 5px;">
          1、境外：一类国家，&lt;1200元/晚，早餐40，午餐80，晚餐80；<br />
          <span style="padding: 0 0 0 22px;">二类国家，&lt;1000元/晚，早餐40，午餐80，晚餐80；</span><br />
          2、境内：港澳台，&lt;1000元/晚，早餐40，午餐80，晚餐80；<br />
          <span style="padding: 0 0 0 22px;">一类城市，&lt;500元/晚，早餐15，午餐30，晚餐30；</span><br />
          <span style="padding: 0 0 0 22px;">二类城市，&lt;400元/晚，早餐15，午餐30，晚餐30；</span><br />
          &nbsp;注：酒店含早或者有公务应酬，则抵消相应餐补。<br />
        </div>

        <span style="color:#000;line-height:28px;">差旅国家及城市分类表：</span><br />
        <div style="margin: 0 0 0 5px;">
          一类国家或地区：亚洲（日本、韩国、新加坡），欧洲（英国、法国、德国、意大利、荷兰），北<br />
          美洲（美国、加拿大），大洋洲（新西兰、澳大利亚）<br />
          二类国家或地区：亚洲（越南、泰国、印尼、印度、土耳其）<br />
          一级城市：北京、上海、广州、深圳<br />
          二级城市：除一级城市外的其他城市；<br />
          港澳台：香港、澳门、台湾<br />
        </div>
      </el-row>

      <el-row style="margin:15px 0 10px 0;">
        <el-col class="label">
          二、办理签证申请表
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          申请人姓名 <br />
          （与有效身份<br />
          证姓名一致）
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" v-model="model.visaApplicantName" />
        </el-col>

        <el-col class="label">
          户籍：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" v-model="model.visaHouseholdRegistration" />
        </el-col>

        <el-col class="label">
          预计停留时间：
        </el-col>
        <el-col class="value">
          <el-date-picker class="date_picker" type="daterange" :size="input_size" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="model.residenceTime" range-separator="至" />
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          护照签发地：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" v-model="model.passportIssuingPlace" />
        </el-col>

        <el-col class="label">
          护照号码：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" v-model="model.passportNumber" />
        </el-col>

        <el-col class="label">
          需签证国家：
        </el-col>
        <el-col class="value">
          <el-input :size="input_size" v-model="model.visaCountry" />
        </el-col>

        <el-col class="label">
          签证类型 ：
        </el-col>
        <el-col class="value">
          <el-select :size="input_size" v-model="model.visaType">
            <el-option label="商务" value="0" />
            <el-option label="旅行" value="1" />
          </el-select>
        </el-col>
      </el-row>

      <el-row class="value full" style="margin: 15px 0 0 0;">
        <el-button class="submit full" v-required="submit">
          提交
        </el-button>
      </el-row>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import moment from "moment";
import { OA } from "types";
import { Gender, DemandCause } from "../config";
import axios from "axios";
import { Vuex } from "../../../../../types/vuex";
import { Detail } from "./_works.vue";
import { getDateByFormat, getHoursByFormat } from "src/service/date";

@Component<Business>({
  computed: {
    genderOptions() {
      return Object.keys(Gender).map(function(key) {
        return {
          key,
          val: Gender[key]
        };
      });
    },
    innerOptions() {
      return Object.keys(DemandCause.inner).map(function(key) {
        return {
          key,
          val: DemandCause.inner[key]
        };
      });
    },
    outerOptions() {
      return Object.keys(DemandCause.outer).map(function(key) {
        return {
          key,
          val: DemandCause.outer[key]
        };
      });
    }
  },
  components: {}
})
export default class Business extends Vue {
  public userInfo = this.$state.member_info;
  model = {
    /** 申请类型 */
    applicationType: "7",
    /** 申请人部门Id */
    departmentId: this.$store.state.oa.userDepartment[0].id + "",
    /** 申请人用户id */
    userId: this.userInfo.userId,
    /** 申请日期 例：2019-09-09 */
    applicationDate: getDateByFormat("yyyy-MM-dd"),
    /** 职务 */
    position: this.user_position,
    /** 出差地点 */
    /** 出差地点：0=国内，1=国外 */
    travelLocation: "",
    /** 地址 */
    address: "",
    /** 出差事由 */
    travelCause: "",
    /** 代理事务 */
    agencyTransaction: "",
    /** 职务代理人Id */
    positionProxyId: "",
    /** 出差预估时间 例：2019-01-01,2019-01-05 */
    travelTimeEstimate: [],
    /** 出差合计天数，最小0.5天 */
    travelDays: "",
    /** 餐费 */
    mealFee: "",
    /** 交通费 */
    transportationFee: "",
    /** 住宿费 */
    accommodationFee: "",
    /** 应酬费 */
    entertainmentExpenses: "",
    /** 其他费用 */
    otherFee: "",
    /** 合计费用 */
    totalCost: "",
    /** 签证申请人名称 */
    visaApplicantName: "",
    /** 签证人户籍 */
    visaHouseholdRegistration: "",
    /** 预计停留时间 例：2019-01-01,2019-01-05 */
    residenceTime: [],
    /** 护照签发地 */
    passportIssuingPlace: "",
    /** 护照号码 */
    passportNumber: "",
    /** 需签证国家 */
    visaCountry: "",
    /** 签证类型 0=商务，1=旅行 */
    visaType: ""
  };
  input_size = "small";

  get sum() {
    const hours = ((new Date(this.model.travelTimeEstimate[1]).getTime() - new Date(this.model.travelTimeEstimate[0]).getTime()) / 1000 / 60 / 60 / 24) * 7.5 + 7.5;
    const sum = this.$hourCalculate(hours);
    this.model.travelDays = sum.replace("天", "");
    return sum;
  }

  get totalCost() {
    const totalCost = Number(this.model.mealFee) + Number(this.model.transportationFee) + Number(this.model.accommodationFee) + Number(this.model.entertainmentExpenses) + Number(this.model.otherFee);
    this.model.totalCost = totalCost + "";
    return totalCost + "元";
  }

  @Prop() detail!: Detail;
  approval_application_detail_info: Vuex.OA.Response.approval_application_detail_info = this.detail && this.detail.approval_application_detail_info;
  approval_detail_info: Vuex.OA.Response.approval_detail_info = this.detail && this.detail.approval_detail_info;
  userAll?: any = "";
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

  get user_position() {
    return this.$state.member_info.position;
  }

  submit() {
    const form_data = {};
    for (const key in this.model) {
      switch (key) {
        case "travelTimeEstimate":
          form_data[key] = this.model[key].join(",");
          break;
        case "residenceTime":
          form_data[key] = this.model[key].join(",");
          break;
        default:
          form_data[key] = this.model[key].trim();
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
.business {
  .el-range-editor--small .el-range-separator {
    line-height: 32px !important;
  }
  .el-range-editor--small .el-range__close-icon,
  .el-range-editor--small .el-range__icon {
    line-height: 34px !important;
  }
}
</style>

<template>
  <div class="jbsq approve_desc_page">
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
      <!-- 加班时间 -->
      <el-row type="flex">
        <el-col class="label">加班时间：</el-col>
        <el-col class="value fixed">
          <div v-for="(i, index) in approval_application_detail_info.applicationDetailInfo.startTime.split(',')" :key="i">{{ i }} 至 {{ approval_application_detail_info.applicationDetailInfo.endTime.split(",")[index] }}</div>
        </el-col>
      </el-row>
      <!-- 加班事由 -->
      <el-row type="flex">
        <el-col class="label">加班事由：</el-col>
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.reason || "无" }}</el-col>
      </el-row>
      <!-- confirm -->
      <el-row v-if="base.userId === $state.member_info.userid" type="flex" style="padding:0 24px 0 12px;margin: 25px 0 0 0;">
        <el-button :size="input_size" class="full" @click="confirm.call(this, 2)">否决</el-button>
        <el-button :size="input_size" class="full" v-required="confirm">同意</el-button>
      </el-row>
    </div>
    <div v-else>
      <!-- 日期 -->
      <el-row type="flex">
        <el-col class="label">日期：</el-col>
        <el-col class="value fixed">{{ model.date }}</el-col>
      </el-row>
      <!-- 加班时间 -->
      <el-row type="flex">
        <el-col class="label">加班时间：</el-col>
        <el-col class="value">
          <el-row type="flex" class="sumsize">
            总计：&nbsp;{{ model.days }}&nbsp;天&nbsp;{{ model.hours }}&nbsp;小时
            <i class="el-icon-circle-plus" @click="dates.push('')"></i>
          </el-row>
          <el-row type="flex" align="middle" class="from-end" v-for="(i, index) in dates" :key="index">
            <el-date-picker size="small" v-model="model.dates[index]" placeholder="选择日期" @change="startDatePickerChange.call(this, index)" style="width:145px"> </el-date-picker>
            <el-select v-model="model.period1[index]" size="small" placeholder="请选择" @change="period1Change.call(this, index)" style="width:105px;margin-left:10px;" ref="period1">
              <el-option v-for="item in period" :key="item.label" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <div style="text-align:center;width:36px;">至</div>
            <el-select v-model="model.period2[index]" size="small" placeholder="请选择" @change="period2Change.call(this, index)" style="width:105px;margin-left:0;" ref="period2">
              <el-option v-for="item in period" :key="item.label" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <i class="el-icon-remove" v-if="index" @click="dates.splice(index, 1) && model.dates.splice(index, 1) && model.period1.splice(index, 1) && model.period2.splice(index, 1) && hours()"></i>
          </el-row>
        </el-col>
      </el-row>
      <!-- 加班事由 -->
      <el-row type="flex">
        <el-col class="label">加班事由：</el-col>
        <el-col class="value full">
          <el-input ref="reason" type="textarea" autosize v-model="model.reason"></el-input>
        </el-col>
      </el-row>
      <!-- 提交 -->
      <el-row type="flex" style="padding: 0 24px 0 12px;margin: 25px 0 0 0">
        <el-col class="value full">
          <el-button style="width: 100%" :size="input_size" @click="submit">提交</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getHoursByFormat, getDateByFormat } from "src/service/date";
import { Detail } from "src/modules/oa/packages/member_examine_approve/_works.vue";
import { Vuex } from "../../../../../types/vuex";

@Component<Overtime>({
  created() {
    this.$store.dispatch("oa/department_list").then(res => {
      const base_one = this.department_map.id[Object.keys(this.department_map.id)[0]];
      Promise.all(
        Object.keys(this.department_map.id)
          .filter(id => this.department_map.id[id].parentid === base_one.parentid)
          .map(id => {
            return this.$store.dispatch("oa/user_list", {
              department_id: id
            });
          })
      ).then(data => {
        this.userAll = Array.prototype.flat.call(data) as any;
      });
    });
  }
})
export default class Overtime extends Vue {
  input_size = "small";
  @Prop() detail!: Detail;
  approval_application_detail_info: Vuex.OA.Response.approval_application_detail_info = this.detail && this.detail.approval_application_detail_info;
  approval_detail_info: Vuex.OA.Response.approval_detail_info = this.detail && this.detail.approval_detail_info;
  userAll = "";
  xzry_search = "";
  get department_map() {
    return this.$getter.department_map;
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
  nextApproverId: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverId ? this.approval_detail_info.approvalDetailInfo[0].nextApproverId.split(",") : [];
  nextApproverName: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverName ? this.approval_detail_info.approvalDetailInfo[0].nextApproverName.split(",") : [];
  changeNextManager(el) {
    if (el.target.classList.contains("el-icon-circle-close")) {
      let name = el.target.getAttribute("name");
      this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
    }
  }
  period = (function() {
    let arr: any = [];
    for (let i = 6; i <= 23; i++) {
      // if (i === 13) continue
      arr.push({
        label: i + ":00",
        value: i
      });
      arr.push({
        label: i + ":30",
        value: i + 0.5
      });
    }
    return arr;
  })();
  dates = [""];
  model = {
    date: getDateByFormat("yyyy-MM-dd"),
    jiabie: "",
    start: "",
    end: "",
    days: 0,
    hours: 0,
    period1: [],
    period2: [],
    duration: [],
    dates: [],
    reason: ""
  };
  hours() {
    (this.model.duration as any) = [];
    this.model.dates.forEach((item, index) => {
      if (this.model.dates[index] && this.model.period1[index] && this.model.period2[index]) {
        (this.model.duration as any)[index] = Math.min(this.model.period2[index] - this.model.period1[index], 7.5);
      }
    });
    let hours = 0;
    this.model.duration.forEach(item => {
      if (item) {
        hours += item;
      }
    });
    this.model.days = Math.floor(hours / 7.5);
    this.model.hours = hours - this.model.days * 7.5;
  }
  startDatePickerChange(index: number) {
    let D: Date = this.model.dates[index];
    for (let i = 0; i < this.model.dates.length; i++) {
      if (i !== index) {
        let date: Date = this.model.dates[i];
        if (D && date.getTime() === D.getTime()) {
          this.model.dates.splice(index, 1);
        }
      }
    }
    this.hours();
  }
  period1Change(index) {
    if (this.model.period2[index]) {
      if (this.model.period1[index] >= this.model.period2[index]) {
        (this.model.period1 as any)[index] = "";
      } else {
        this.hours();
      }
    }
  }
  period2Change(index) {
    if (this.model.period1[index]) {
      if (this.model.period1[index] >= this.model.period2[index]) {
        (this.model.period2 as any)[index] = "";
      } else {
        this.hours();
      }
    }
  }

  async submit() {
    let isValid = false;
    for (let i = 0; i < this.model.dates.length; i++) {
      if (!this.model.dates[i] || !this.model.period1[i] || !this.model.period2[i]) {
        isValid = true;
        this.$notify.error("参数不完整");
      }
    }
    if (!isValid) {
      let form_data = {
        applicationType: 2,
        userId: localStorage.UserId,
        applicationDate: this.model.date,
        reason: this.model.reason,
        startTime: this.model.dates
          .map((item, index) => {
            return getDateByFormat("yyyy-MM-dd", this.model.dates[index] as any) + " " + this.$refs.period1[index]["selectedLabel"] + ":00";
          })
          .join(","),
        endTime: this.model.dates
          .map((item, index) => {
            return getDateByFormat("yyyy-MM-dd", this.model.dates[index] as any) + " " + this.$refs.period2[index]["selectedLabel"] + ":00";
          })
          .join(","),
        duration: this.model.duration.join(","),
        departmentId: this.$state.member_info && this.$state.member_info.department[0]
      };
      this.$dispatch.approval_application(form_data as any).then(res => {
        this.$emit("success", 0);
      });
    }
  }
}
</script>

<style lang="scss">
.jbsq {
  width: 1000px;
  padding: 0 0 50px 0;
  .flex {
    margin: 15px 0 -5px 0;
    display: flex;
    align-items: center;
    .l {
      width: 78px;
    }
    .down {
      position: relative;
      width: auto;
    }
    .sumsize {
      display: flex;
      align-items: center;
    }
    .from-end {
      margin-top: 10px;
    }
  }
  .submit {
    margin: 30px 0 0 -380px;
  }
  .el-icon-circle-plus,
  .el-icon-remove {
    color: #a6c5f6;
    font-size: 20px;
    margin-left: 15px;
    cursor: pointer;
  }
}
</style>

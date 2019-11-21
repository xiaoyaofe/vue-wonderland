<template>
  <div class="attendance">
    <el-row>
      <el-button size="mini" @click="$emit(`click`)">
        返回
      </el-button>
    </el-row>

    <el-row>
      <div class="flex">
        <div style="width:100%;position:absolute;top:20px;">
          <component :is="require(`./date_select.vue`).default" :CurYear="lg25 && is12 ? CurYear + 1 : CurYear" :CurMonth="lg25 ? (is12 ? 1 : CurMonth + 1) : CurMonth" @over="DateSelect" />
        </div>
        <span style="font-size:16px;font-weight:700;margin:20px 0;">{{ Title }}</span>
        <el-button style="position:absolute;right:0" size="mini" @click="kqxz">
          公司考勤.xls
        </el-button>
      </div>
      <component :is="require(`./overview.vue`).default" />
      <component :is="require(`./calendar.vue`).default" />
    </el-row>

    <div class="extra-area">
      <div class="extra-area-item">
        <span class="item title-item">
          <span class="rt-box-title">可用调休：</span>
          <span class="rt-box-title">{{ $hourCalculate(member_info.availableLeaveInLieu) }}</span>
        </span>
        <div class="leave-detail" style="margin: 0">
          <div>
            <el-row type="flex" align="middle" class="sub-titile">
              加班明细 [产生]：
            </el-row>
            <div v-if="member_info.overtimeDetailInfo.overtimeInfoList.length > 0">
              <div class="leave-detail-item" v-for="item in member_info.overtimeDetailInfo.overtimeInfoList" :key="item.id">
                <span v-if="item.overtimeType === '1'" v-html="`[${item.overtimeDate}] &#8593; ${$hourCalculate(item.overtimeTotal)}`" />
                <span v-if="item.overtimeType === '3'" v-html="`[${item.overtimeDate}] ${['&#8593;', '&#8595;'][item.hrSettingType - 1]} ${$hourCalculate(item.overtimeTotal)} [HR]`" />
              </div>
            </div>
            <div v-else>
              <div class="leave-detail-item">空</div>
            </div>
          </div>

          <div>
            <el-row class="sub-titile" type="flex" align="middle">
              调休明细 [使用]：
            </el-row>
            <div v-if="member_info.overtimeDetailInfo.useDetailInfoList.length > 0">
              <div class="leave-detail-item" v-for="item in member_info.overtimeDetailInfo.useDetailInfoList" :key="item.id">
                <span v-html="`[${item.useDate}] &#8595; ${$hourCalculate(item.duration)}`" />
                <!-- [{{item.useDate}}] {{}} ({{leaveTypes[item.leaveType].leaveName}}) -->
              </div>
            </div>
            <div v-else>
              <div class="leave-detail-item">空</div>
            </div>
          </div>
        </div>
      </div>

      <div class="extra-area-item">
        <span class="item title-item">
          <span class="rt-box-title">有效年假：</span>
          <span class="rt-box-title">
            <span v-for="(item, index) in member_info.leaveInfoList" :key="index">
              <div v-if="item.availableAnnualLeave">{{ $hourCalculate(item.availableAnnualLeave) }}（到期时间：{{ item.endTime }}）</div>
            </span>
          </span>
        </span>
        <div class="leave-detail">
          <div>
            <el-row class="sub-titile" type="flex" align="middle">
              年假明细 [产生]：
            </el-row>
            <div v-if="member_info.leaveDetailInfo && member_info.leaveDetailInfo.produceDetailInfoList.length > 0">
              <div class="leave-detail-item" v-for="item in member_info.leaveDetailInfo.produceDetailInfoList" :key="item.id">
                <span v-if="item.hrSettingType" v-html="`[${item.produceDate}] ${['&#8593;', '&#8595;'][item.hrSettingType - 1]} ${$hourCalculate(item.leaveTotal)} [HR]`" />
                <!-- <span v-else-if="item.extraLeave">
                  <div>[{{item.produceDate}}] {{$hourCalculate(item.leaveTotal)}}</div>
                  <div>[{{item.produceDate}}] {{['&#8593;','&#8595;'][item.extraLeaveType-1]}} {{$hourCalculate(item.extraLeave)}} [手动编辑]
                </span> -->
                <span v-else v-html="`[${item.produceDate}] &#8593; ${$hourCalculate(item.leaveTotal)}`" />
              </div>
            </div>
            <div v-else>
              <div class="leave-detail-item">空</div>
            </div>
          </div>

          <div>
            <el-row class="sub-titile" type="flex" align="middle">
              年假明细 [使用]：
            </el-row>
            <div v-if="member_info.leaveDetailInfo && member_info.leaveDetailInfo.useDetailInfoList.length > 0">
              <div class="leave-detail-item" v-for="item in member_info.leaveDetailInfo.useDetailInfoList" :key="item.id">
                <span v-html="`[${item.useDate}] &#8595; ${$hourCalculate(item.duration)}`" />
              </div>
            </div>
            <div v-else>
              <div class="leave-detail-item">空</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import moment from "moment";
import { Component, Prop, Vue, Provide, Watch } from "vue-property-decorator";

@Component<Attendance>({
  created() {
    this.userIdChanged();
  }
})
export default class Attendance extends Vue {
  member_info = this.$state.member_info;
  get CurYear() {
    return this.$store.state.oa.MemberInfo.attendance.CurYear;
  }
  get CurMonth() {
    return this.$store.state.oa.MemberInfo.attendance.CurMonth;
  }
  get is1() {
    return this.$store.getters["oa/MemberInfoAttendanceIs1"];
  }
  get is12() {
    return this.$store.getters["oa/MemberInfoAttendanceIs12"];
  }
  get lg25() {
    return this.$store.getters["oa/MemberInfoAttendanceLg25"];
  }
  get Title() {
    return this.$store.getters["oa/MemberInfoAttendanceData"].StartDate + " 至 " + this.$store.getters["oa/MemberInfoAttendanceData"].EndDate + " 考勤记录";
  }
  @Provide() get Index() {
    return this;
  }
  userId = this.$state.member_info.userId;
  @Watch("userId")
  userIdChanged() {
    let startTime = this.$store.getters["oa/MemberInfoAttendanceData"].StartDate;
    let endTime = this.$store.getters["oa/MemberInfoAttendanceData"].EndDate;
    Promise.all([
      this.$store.dispatch("oa/attendanceMonthlySummary", {
        userId: this.userId,
        startTime,
        endTime
      }),
      this.$store.dispatch("oa/attendancePageRecord", {
        userId: this.userId,
        startTime,
        endTime
      })
    ]);
  }
  static date = new Date();
  static storeState = {
    CurYear: Attendance.date.getFullYear(),
    CurMonth: Attendance.date.getMonth() + 1,
    CurDate: Attendance.date.getDate(),
    pageRecord: {},
    monthAttendance: null,
    queryPunchRecord: {}
  };
  async DateSelect(data: { CurYear: number; CurMonth: number }) {
    let startTime = moment(new Date(`${data.CurYear}-${data.CurMonth}-25`))
      .add(-1, "month")
      .format("YYYY-MM-DD");
    let endTime = moment(new Date(`${data.CurYear}-${data.CurMonth}-24`)).format("YYYY-MM-DD");

    await Promise.all([
      this.$store.dispatch("oa/attendanceMonthlySummary", {
        userId: this.userId,
        startTime,
        endTime
      }),
      this.$store.dispatch("oa/attendancePageRecord", {
        userId: this.userId,
        startTime,
        endTime
      })
    ]);
    if (this.lg25) {
      this.$store.state.oa.MemberInfo.attendance.CurYear = data.CurYear;
      this.$store.state.oa.MemberInfo.attendance.CurMonth = data.CurMonth - 1 || ((this.$store.state.oa.MemberInfo.attendance.CurYear = data.CurYear - 1) && 12);
    } else {
      this.$store.state.oa.MemberInfo.attendance.CurMonth = data.CurMonth;
      this.$store.state.oa.MemberInfo.attendance.CurYear = data.CurYear;
    }
  }
  kqxz() {
    window.open(`${process.env.VUE_APP_CLIENT_REQUEST}/file/attendance?startTime=${this.$store.getters["oa/MemberInfoAttendanceData"].StartDate}&endTime=${this.$store.getters["oa/MemberInfoAttendanceData"].EndDate}`);
  }
}
</script>

<style lang="scss">
.oa .member-info .attendance {
  .flex {
    display: flex;
    justify-content: center;
  }
  .calendar {
    margin-top: 20px;
  }
  .extra-area {
    display: flex;
  }
  .extra-area-item {
    margin: 0 60px 0 10px;
  }
  .title-item {
    font-size: 16px;
  }
  .leave-detail-item {
    margin: 6px 0;
  }
  .sub-titile {
    font-weight: bold;
    font-size: 14px;
    line-height: 20px;
    margin-top: 10px;
  }
  .rt-box-title {
    font-weight: bold;
    font-size: 17px;
  }
}
</style>

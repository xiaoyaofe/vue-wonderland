<template>
  <div class="member-info">
    <div v-if="inner" :is="require('./components/attendance/index.vue').default" @click="inner = ''"></div>
    <div v-if="!inner">
      <div class="top-row">
        <span class="userid"> {{ member_info.userid }} </span>
        <span class="position">{{ member_info.position }}</span>
      </div>
      <div class="main">
        <div class="main_left">
          <img class="avatar" :src="member_info.avatar || require(`src/assets/oa/rg.png`)" />
          <el-button style="margin-top:15px" size="mini" @click="quit">
            退出
          </el-button>
          <el-button style="margin:15px 0 0 0" size="mini" @click="inner = `attendance`">
            考勤系统
          </el-button>
        </div>
        <div class="rt-box">
          <span class="item">
            <span class="rt-box-title">工号：</span>
            <span class="content">{{ member_info.employeeNumber }}</span>
          </span>
          <span class="item">
            <span class="rt-box-title">姓名：</span>
            <span class="content">{{ member_info.name }}</span>
          </span>
          <span class="item">
            <span class="rt-box-title">电话：</span>
            <span class="content">{{ member_info.mobile }}</span>
          </span>
          <span class="item">
            <span class="rt-box-title">部门：</span>
            <span class="content" :key="department.id" v-for="department in userDepartment">{{ department.name }}</span>
          </span>
          <span class="item">
            <span class="rt-box-title">成员状态：</span>
            <span class="content">{{ user_status_map[member_info.userStatus] }}</span>
          </span>
          <span class="item">
            <span class="rt-box-title">入职日期：</span>
            <span class="content">{{ member_info.entryDate || defaultDate }}</span>
          </span>
          <span class="item" v-if="member_info.userStatus >= 2">
            <span class="rt-box-title">转正日期：</span>
            <span class="content">{{ member_info.correctionDate || defaultDate }}</span>
          </span>
          <span class="item" v-if="member_info.userStatus === 3">
            <span class="rt-box-title">离职日期：</span>
            <span class="content">{{ member_info.eparationDate || defaultDate }}</span>
          </span>

          <span class="item">
            <span class="rt-box-title">新签合同日期：</span>
            <span class="content">{{ member_info.newContractDate || defaultDate }}</span>
          </span>
          <span class="item">
            <span class="rt-box-title">合同到期时间：</span>
            <span class="content">{{ member_info.contractExpirationDate || defaultDate }}</span>
          </span>

          <span class="item">
            <span class="rt-box-title">调休：</span>
            <span class="content">{{ $hourCalculate(member_info.availableLeaveInLieu) }}</span>
          </span>
          <div class="leave-detail" style="margin: 0">
            <div>
              <el-row type="flex" align="middle">
                加班明细 [产生]：
                <i v-if="member_info.overtimeDetailInfo.overtimeInfoList.length > 1" :class="OvertimeProduceMore ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'" @click="more.call(this, 0)"> </i>
              </el-row>
              <div v-if="member_info.overtimeDetailInfo.overtimeInfoList.length > 0">
                <div class="leave-detail-item" v-for="item in OvertimeProduceMore ? member_info.overtimeDetailInfo.overtimeInfoList.slice(0, 1) : member_info.overtimeDetailInfo.overtimeInfoList" :key="item.id">
                  <span>[{{ item.overtimeDate }}] {{ { 1: "加班", 2: "结算到工资", 3: "HR" }[item.overtimeType] }}{{ item.overtimeType === "3" ? { 1: "增加", 2: "减少" }[item.hrSettingType] : "" }} {{ $hourCalculate(item.overtimeTotal) }}</span>
                </div>
                <div style="margin: -5px 0 0 8px;" v-if="OvertimeProduceMore">... ...</div>
              </div>
              <div v-else>
                <div class="leave-detail-item">空</div>
              </div>
            </div>

            <div style="margin-left:66px;">
              <el-row type="flex" align="middle">
                调休明细 [使用]：
                <i v-if="member_info.overtimeDetailInfo.useDetailInfoList.length > 1" :class="OvertimeUseMore ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'" @click="more.call(this, 1)"> </i>
              </el-row>
              <div v-if="member_info.overtimeDetailInfo.useDetailInfoList.length > 0">
                <div class="leave-detail-item" v-for="item in use_detail_info_list" :key="item.id">
                  <span>[{{ item.useDate }}] {{ leave_type_map[item.leaveType] ? leave_type_map[item.leaveType].leaveName : "null" }} {{ $hourCalculate(item.duration) }}</span>
                </div>
                <div style="margin: -5px 0 0 8px;" v-if="OvertimeUseMore">... ...</div>
              </div>
              <div v-else>
                <div class="leave-detail-item">空</div>
              </div>
            </div>
          </div>

          <span class="item">
            <span class="rt-box-title">年假：</span>
            <span class="content" style="display:flex">
              <span v-for="(item, index) in member_info.leaveInfoList" :key="index" style="margin: 0 0 8px 0;">
                <div v-if="item.availableAnnualLeave">{{ $hourCalculate(item.availableAnnualLeave) }} （到期时间：{{ item.endTime }}）</div>
              </span>
            </span>
          </span>
          <div class="leave-detail">
            <div>
              <el-row type="flex" align="middle">
                年假明细 [产生]：
                <i v-if="member_info.leaveDetailInfo && member_info.leaveDetailInfo.produceDetailInfoList.length > 1" :class="LeaveProduceMore ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'" @click="more.call(this, 2)"> </i>
              </el-row>
              <div v-if="member_info.leaveDetailInfo && member_info.leaveDetailInfo.produceDetailInfoList.length > 0">
                <div class="leave-detail-item" v-for="item in LeaveProduceMore ? member_info.leaveDetailInfo.produceDetailInfoList.slice(0, 1) : member_info.leaveDetailInfo.produceDetailInfoList" :key="item.id">
                  <div v-if="item.extraLeave">
                    <div>[{{ item.produceDate }}] {{ $hourCalculate(item.leaveTotal) }}</div>
                    <div>[{{ item.produceDate }}] {{ { 1: "+", 2: "-" }[item.extraLeaveType] }}{{ $hourCalculate(item.extraLeave) }}(手动编辑)</div>
                  </div>
                  <div v-else>[{{ item.produceDate }}] {{ $hourCalculate(item.leaveTotal) }}</div>
                </div>
                <div style="margin: -5px 0 0 8px;" v-if="LeaveProduceMore">... ...</div>
              </div>
              <div v-else>
                <div class="leave-detail-item">空</div>
              </div>
            </div>

            <div style="margin-left:66px;">
              <el-row type="flex" align="middle">
                年假明细 [使用]：
                <i v-if="member_info.leaveDetailInfo && member_info.leaveDetailInfo.useDetailInfoList.length > 1" :class="LeaveUseMore ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'" @click="more.call(this, 3)"> </i>
              </el-row>
              <div v-if="member_info.leaveDetailInfo && member_info.leaveDetailInfo.useDetailInfoList.length > 0">
                <div class="leave-detail-item" v-for="item in LeaveUseMore ? member_info.leaveDetailInfo.useDetailInfoList.slice(0, 1) : member_info.leaveDetailInfo.useDetailInfoList" :key="item.id">
                  <span>[{{ item.useDate }}] {{ $hourCalculate(item.duration) }}</span>
                </div>
                <div style="margin: -5px 0 0 8px;" v-if="LeaveUseMore">... ...</div>
              </div>
              <div v-else>
                <div class="leave-detail-item">空</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component<MemberInfo>({
  async created() {
    console.log(require("src/modules/oa/store").default);
    this.OvertimeProduceMore = this.member_info.overtimeDetailInfo.overtimeInfoList.length > 1;
    this.OvertimeUseMore = this.member_info.overtimeDetailInfo.useDetailInfoList.length > 1;
    this.LeaveProduceMore = this.member_info.leaveDetailInfo.produceDetailInfoList.length > 1;
    this.LeaveUseMore = this.member_info.leaveDetailInfo.useDetailInfoList.length > 1;
    this.member_info.department.forEach(id => {
      this.$dispatch.department_list({ id });
    });
  }
})
export default class MemberInfo extends Vue {
  inner = "";
  defaultDate = "1970-01-01";
  user_status_map = ["实习生", "试用期", "正式员工", "离职员工"];
  OvertimeProduceMore = false;
  OvertimeUseMore = false;
  LeaveProduceMore = false;
  LeaveUseMore = false;
  get leave_type_map() {
    const map = this.$getter.leave_type_map;
    return map;
  }
  get use_detail_info_list() {
    let list = this.OvertimeUseMore ? this.member_info.overtimeDetailInfo.useDetailInfoList.slice(0, 1) : this.member_info.overtimeDetailInfo.useDetailInfoList;
    return list || [];
  }
  get member_info() {
    return this.$state.member_info;
  }
  get userDepartment() {
    return this.$state.userDepartment || [];
  }
  more(i) {
    const key = ["OvertimeProduceMore", "OvertimeUseMore", "LeaveProduceMore", "LeaveUseMore"][i];
    this[key] = !this[key];
  }
  quit() {
    localStorage.removeItem("UserId");
    location.reload()
  }
}
</script>

<style lang="scss">
.oa .member-info {
  font-family: "Raleway", sans-serif;
  width: 1200px;
  margin: 0 auto;
  .top-row {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 30px 0 36px 0;
    .userid {
      text-transform: uppercase;
      letter-spacing: 4px;
      font-size: 50px;
    }
    .position {
      margin: -15px 0 0 0;
      font-size: 14px;
      letter-spacing: 10px;
    }
  }
  .main {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    margin-top: 12px;
    .main_left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .avatar {
      width: 120px;
      height: 120px;
    }
    .rt-box {
      margin: 0 0 0 40px;
      font-size: 15px;
      display: flex;
      flex-direction: column;
      .item {
        position: relative;
        line-height: 18px;
        margin: 12px 0;
        display: flex;
        .rt-box-title {
          display: inline-block;
          width: 160px;
        }
        .content {
          display: flex;
          flex-direction: column;
        }
      }
    }
    .leave-detail {
      display: flex;
      font-size: 12px;
      color: #a77474;
      margin-bottom: 60px;
      margin-top: -10px;
      .leave-detail-item {
        line-height: 28px;
      }
    }
    .el-icon-circle-plus-outline,
    .el-icon-remove-outline {
      font-size: 19px;
      cursor: pointer;
      position: relative;
      top: 1px;
    }
  }
}
</style>

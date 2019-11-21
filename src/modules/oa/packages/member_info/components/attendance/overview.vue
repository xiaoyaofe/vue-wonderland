<template>
  <div class="overview" v-if="$state.MemberInfo.attendance.monthAttendance">
    <el-table :data="[$state.MemberInfo.attendance.monthAttendance]" size="mini" border>
      <el-table-column :width="v.width || 60" v-for="(v, k) in columns" :key="k" :label="v.label" :prop="v.prop" align="center">
        <template slot slot-scope="{ row, column }">
          <div v-if="column.property === 'userName'">
            <div v-if="$state.user_permission.permissionLevel >= 15">
              <el-select v-model="userid" filterable placeholder="请选择" size="mini">
                <el-option v-for="item in user_all" :key="item.userid" :label="item.name" :value="item.userid" />
              </el-select>
            </div>
            <div v-else>
              {{ row[column.property] }}
            </div>
          </div>
          <div v-else-if="column.property === 'personalLeave' || column.property === 'annualLeave'">
            {{ $hourCalculate(row[column.property]) }}
          </div>
          <div v-else>
            {{ row[column.property] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import moment from "moment";

@Component
export default class AttendanceOverview extends Vue {
  @Inject() Index;
  get user_all() {
    return this.$state.user_all;
  }
  get columns() {
    const columns = [{ label: "工号", prop: "employeeNumber" }, { label: "姓名", prop: "userName", width: "120" }, { label: "扣款", prop: "deduction" }, { label: "迟到", prop: "late" }, { label: "早退", prop: "early" }, { label: "旷工", prop: "absent" }, { label: "事假", prop: "personalLeave" }, { label: "年假", prop: "annualLeave" }, { label: "病假", prop: "sickLeave" }, { label: "婚假", prop: "marriageLeave" }, { label: "产假", prop: "maternityLeave" }, { label: "护理假", prop: "nursingLeave" }, { label: "孕检假", prop: "prenatalCheckUpLeave" }, { label: "计生假", prop: "familyPlanningLeave" }, { label: "丧假", prop: "bereavementLeave" }, { label: "调休", prop: "leaveInLieu" }, { label: "补签卡", prop: "complementSignedTimes" }, { label: "未打卡", prop: "noCheckTimes" }, { label: "全勤奖", prop: "fullAttendance" }, { label: "3倍", prop: "threeTimes" }, { label: "加班", prop: "overtime" }];
    return columns.filter((item, index, array) => {
      const value = this.$state.MemberInfo.attendance.monthAttendance[item.prop];
      if (value) {
        const span = document.createElement("span");
        const appH = <HTMLDivElement>document.getElementById("app-hidden");
        span.innerHTML = value;
        span.style.padding = "0 20px";
        span.style.fontSize = "30px";
        appH.appendChild(span);
        (array as any)[index]["width"] = span.offsetWidth;
      }
      return value;
    });
  }
  userid = (() => {
    console.log(this.Index.userId);
    return this.Index.userId;
  })();
  @Watch("userid")
  useridChanged(UserId) {
    this.$dispatch.user({ UserId }).then(info => {
      this.Index.member_info = info;
      this.Index.userId = UserId;
    });
  }
}
</script>

<style lang="scss">
.oa .member-info .attendance .overview {
  transform-origin: 0;
  transform: scale(0.92);
  th,
  td {
    font-size: 12px;
  }
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
    border-right: 2px solid #e4e7ed;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 2px solid #e4e7ed;
  }
  .el-table--border,
  .el-table--group {
    border-top-color: #e4e7ed;
    border-top-style: solid;
    border-top-width: 2px;
    border-left-color: #e4e7ed;
    border-left-style: solid;
    border-left-width: 2px;
    border-image-source: initial;
    border-image-slice: initial;
    border-image-width: initial;
    border-image-outset: initial;
    border-image-repeat: initial;
  }
  .el-table {
    display: table;
    width: auto;
  }
  .extra-area {
    position: fixed;
    right: 0;
    top: 0;
  }
}
</style>

<template>
  <el-popover ref="popover" placement="bottom-start" width="322" trigger="click" popper-class="oa-member-info-attendance-dateselect" @hide="$emit('over', { CurYear: curYear, CurMonth: curMonth })">
    <div slot>
      <div class="el-date-picker__header el-date-picker__header--bordered">
        <button v-if="level" type="button" aria-label="前一年" class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left" @click="Offset -= 10"></button>
        <span role="button" class="el-date-picker__header-label" @click="level = 1">
          {{ level ? Data.start + " 年 - " + Data.end + " 年" : curYear + " 年" }}
        </span>
        <button v-if="level" type="button" aria-label="后一年" class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right" @click="Offset += 10"></button>
      </div>
      <div class="el-picker-panel__content">
        <table class="el-year-table" v-show="level">
          <tbody>
            <tr v-for="(v, k) in 3" :key="v">
              <td :class="'available' + (k * 4 + m === Data.digit && !Offset ? ' today' : '')" v-for="(n, m) in 4" :key="n">
                <a
                  class="cell"
                  v-if="k * 4 + m <= 9"
                  @click="
                    curYear = Data.start * 1 + k * 4 + m;
                    Offset = 0;
                    level = 0;
                  "
                  >{{ Data.start * 1 + k * 4 + m }}</a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <table class="el-month-table" v-show="!level">
          <tbody>
            <tr v-for="(v, k) in 3" :key="v">
              <td :class="k * 4 + m + 1 === curMonth ? 'today' : ''" v-for="(n, m) in 4" :key="n">
                <a
                  class="cell"
                  @click="
                    curMonth = k * 4 + m + 1;
                    $refs.popover.$data.showPopper = false;
                  "
                  >{{ Months[k * 4 + m] }}</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <el-button slot="reference" size="mini"> {{ curYear }}-{{ curMonth }} </el-button>
  </el-popover>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import moment from "moment";

@Component
export default class AttendanceDateSelect extends Vue {
  @Prop() CurYear!: number;
  @Prop() CurMonth!: number;
  Offset = 0;
  curYear = this.CurYear;
  curMonth = this.CurMonth;
  get Data() {
    let year = this.curYear + this.Offset;
    let split = [Math.floor((year % 10000) / 1000), Math.floor((year % 1000) / 100), Math.floor((year % 100) / 10), Math.floor(year % 10)];
    let digit = split[3];
    let start = split.slice(0, 3).join("") + 0;
    let end = split.slice(0, 3).join("") + 9;
    return {
      digit,
      start,
      end
    };
  }
  /**
   * 0、1
   */
  level = 0;
  Months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
}
</script>

<style lang="scss">
.oa-member-info-attendance-dateselect {
  padding: 0;
  height: 314px;
  .el-picker-panel__icon-btn {
    margin-top: 5px;
  }
  .el-month-table,
  .el-year-table {
    margin: 13px 0 0 0;
    td {
      width: 73px;
    }
  }
}
</style>

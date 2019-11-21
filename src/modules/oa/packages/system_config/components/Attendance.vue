<template>
  <div>
    <el-row style="margin: 5px 0 10px 0">
      <el-button
        @click="$emit('back')"
        size="mini"
        style="margin: 0 0 0 10px"
      >
        返回
      </el-button>
      <el-button
        size="mini"
        style="margin: 0 0 0 16px"
        @click="dialogData={
          id: 0,
          leaveInLieuDate: '',
          times: '',
          isNewYear: '',
          remark: ''
        };visible=true"
      >
        添加数据
      </el-button>
      <el-dialog
        :visible.sync="visible"
        :show-close="false"
        width="380px"
        custom-class="oa-system-config-attendace-dialog"
      >
        <template slot="title">
          {{dialogData.id?"修改数据":"新增数据"}}
        </template>
        <template slot="footer">
          <el-button
            size="mini"
            @click="visible=false"
          >取消</el-button>
          <el-button
            size="mini"
            @click="submit"
          >提交</el-button>
        </template>
        <template slot>
          <el-row
            type="flex"
            align="middle"
            style="margin: 0 0 10px 0"
          >
            <div style="width:105px">调休日期</div>
            <el-date-picker
              size="mini"
              style="width:220px"
              v-model="dialogData.leaveInLieuDate"
              type="date"
              :clearable="false"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            style="margin: 0 0 10px 0"
          >
            <div style="width:105px">倍数</div>
            <el-input
              size="mini"
              style="width:220px"
              v-model="dialogData.times"
              placeholder="填写倍数"
            ></el-input>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            style="margin: 0 0 10px 0"
          >
            <div style="width:105px">是否为春节</div>
            <el-select
              size="mini"
              style="width:220px"
              v-model="dialogData.isNewYear"
            >
              <el-option
                :value="0"
                label="否"
              ></el-option>
              <el-option
                :value="1"
                label="是"
              ></el-option>
            </el-select>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            style="margin: 0 0 10px 0"
          >
            <div style="width:105px">备注</div>
            <el-input
              size="mini"
              style="width:220px"
              v-model="dialogData.remark"
              placeholder="填写备注"
            ></el-input>
          </el-row>
        </template>
      </el-dialog>
    </el-row>

    <el-table
      size="mini"
      :data="getterData.list"
    >
      <el-table-column
        prop="leaveInLieuDate"
        label="调休日期"
        width="163"
      ></el-table-column>
      <el-table-column
        prop="times"
        label="倍数"
        width="163"
      >
        <template
          slot
          slot-scope="{row}"
        >
          {{row.times?row.times:1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isNewYear"
        label="是否是春节"
        width="163"
      >
        <template
          slot
          slot-scope="{row}"
        >
          {{row.isNewYear?"是":"否"}}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="163"
      ></el-table-column>
      <el-table-column
        width="163"
        label="操作"
      >
        <template
          slot
          slot-scope="{row}"
        >
          <el-button
            size="mini"
            @click="edit(row);visible=true"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            @click="del(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="$store.state.oa.SystemConfig.Attendance.query.length>$store.state.oa.SystemConfig.Attendance.offset"
      layout="prev,pager,next"
      :pageSize="$store.state.oa.SystemConfig.Attendance.offset"
      :total="$store.state.oa.SystemConfig.Attendance.query.length"
      @current-change="paginationChange"
      style="margin-top:16px"
    >
    </el-pagination>

  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import moment from "moment"

@Component<Attendance>({
  created() {
    this.$store.dispatch("oa/attendanceQuery")
  },
  computed: {
    getterData() {
      return this.$store.getters["oa/SystemConfigAttendance"]
    }
  }
})
export default class Attendance extends Vue {
  static $name = "Attendance"
  static icon = require(`src/assets/oa/icon-examine-approve.svg`)
  static title = `添加考勤休假`
  static storeState = {
    query: [],
    start: 0,
    offset: 16
  }
  visible = false
  dialogData: {
    id: number
    leaveInLieuDate: string
    times: string | number
    isNewYear: string | number
    remark: string
  } = {
      id: 0,
      leaveInLieuDate: '',
      times: '',
      isNewYear: '',
      remark: ''
    }

  paginationChange(page) {
    this.$store.commit("oa/SystemConfig", {
      child: "attendance",
      key: "start",
      val: Attendance.storeState.offset * (page - 1)
    })
  }

  submit() {
    let data: any = {}
    if (!this.dialogData.leaveInLieuDate) {
      this.$notify.error("请选择日期")
      return
    } else {
      data.leaveInLieuDate = moment(this.dialogData.leaveInLieuDate).format("YYYY-MM-DD")
    }
    data.times = this.dialogData.times ? this.dialogData.times : ''
    data.isNewYear = this.dialogData.isNewYear || ''
    data.remark = this.dialogData.remark
    if (this.dialogData.id) {
      data.id = this.dialogData.id
      this.$store.dispatch("oa/attendanceUpdate", data).then(data => {
        this.visible = false
      })
    } else {
      this.$store.dispatch("oa/attendanceAdd", data).then(data => {
        this.visible = false
      })
    }
  }

  edit(row) {
    let data = Object.assign({}, row)
    data.times = data.times ? data.times : 1
    data.remark = data.remark ? data.remark : ''
    this.dialogData = data
  }

  del(row) {
    this.$store.dispatch("oa/attendanceDelete", {
      id: row.id
    })
  }

}
</script>

<style lang="scss">
.oa-system-config-attendace-dialog {
  .el-dialog__header {
    font-size: 15px;
  }
  .el-dialog__body {
    padding: 13px 20px 0 20px;
  }
  .el-dialog__footer {
    display: flex;
    justify-content: center;
    padding: 12px 15px 20px 0;
    button {
      margin-left: 18px;
    }
  }
}
</style>

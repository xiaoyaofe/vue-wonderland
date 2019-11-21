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
          date: '',
          time: '',
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
            <div style="width:105px">日期</div>
            <el-date-picker
              size="mini"
              style="width:220px"
              v-model="dialogData.date"
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
            <div style="width:105px">时间</div>
            <el-time-select
              size="mini"
              v-model="dialogData.time"
              :picker-options="{
                start: '09:30',
                step: '00:30',
                end: '18:30'
              }"
              placeholder="选择时间"
            >
            </el-time-select>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            style="margin: 0 0 10px 0"
          >
            <div style="width:105px">类型</div>
            <el-select
              size="mini"
              style="width:220px"
              v-model="dialogData.type"
            >
              <el-option
                value="work"
                label="work"
              ></el-option>
              <el-option
                value="off"
                label="off"
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
        prop="date"
        label="日期"
        width="163"
      ></el-table-column>
      <el-table-column
        prop="time"
        label="时间"
        width="163"
      >
        <!-- <template
          slot
          slot-scope="{row}"
        >
          {{row.time?row.time:1}}
        </template> -->
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="163"
      >
        <!-- <template
          slot
          slot-scope="{row}"
        >
          {{row.type?"是":"否"}}
        </template> -->
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
          <el-button size="mini">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="$store.state.oa.SystemConfig.Special.query.length>$store.state.oa.SystemConfig.Special.offset"
      layout="prev,pager,next"
      :pageSize="$store.state.oa.SystemConfig.Special.offset"
      :total="$store.state.oa.SystemConfig.Special.query.length"
      @current-change="paginationChange"
      style="margin-top:16px"
    >
    </el-pagination>

  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import moment from "moment"

@Component<Special>({
  created() {
    this.$store.dispatch("oa/specialQuery")
  },
  computed: {
    getterData() {
      return this.$store.getters["oa/SystemConfigSpecial"]
    }
  }
})
export default class Special extends Vue {
  static $name = "Special"
  static icon = require(`src/assets/oa/icon-examine-approve.svg`)
  static title = `特殊考勤事件`
  static storeState = {
    query: [],
    start: 0,
    offset: 16
  }
  visible = false
  dialogData: {
    id: number
    date: string
    time: string | number
    type: string
    remark: string
  } = {
      id: 0,
      date: '',
      time: '',
      type: '',
      remark: ''
    }

  paginationChange(page) {
    this.$store.commit("oa/SystemConfig", {
      child: "Special",
      key: "start",
      val: Special.storeState.offset * (page - 1)
    })
  }

  submit() {
    let data: any = {}
    if (!this.dialogData.date) {
      this.$notify.error("请选择日期")
      return
    } else {
      data.date = moment(this.dialogData.date).format("YYYY-MM-DD")
    }
    if (!this.dialogData.time) {
      this.$notify.error("请选择时间")
      return
    } else {
      data.time = (this.dialogData.time as string).length === 8 ? this.dialogData.time : this.dialogData.time + ":00"
    }
    if (!this.dialogData.type) {
      this.$notify.error("请选择类型")
      return
    } else {
      data.type = this.dialogData.type
    }
    if (!this.dialogData.remark) {
      this.$notify.error("请填写备注")
      return
    } else {
      data.remark = this.dialogData.remark
    }

    if (this.dialogData.id) {
      data.id = this.dialogData.id
      this.$store.dispatch("oa/specialUpdate", data).then(data => {
        this.visible = false
      })
    } else {
      this.$store.dispatch("oa/specialAdd", data).then(data => {
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

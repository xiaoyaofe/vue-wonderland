<template>
  <div class="work approve_desc_page">
    <el-tabs v-model="active_name">
      <el-tab-pane v-for="{ label, name } in menu" :key="label" :label="label" :name="name" />
    </el-tabs>
    <el-row type="flex" class="search-colunm">
      <el-col class="label">{{ text.process_type }}：&nbsp;</el-col>
      <el-col class="value">
        <el-select :size="input_size" v-model="model.process_type" :placeholder="text.placeholder" clearable>
          <el-option-group v-for="group in data.process_type" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.type" :label="item.title" :value="item.type" />
          </el-option-group>
        </el-select>
      </el-col>
      <el-col class="label">{{ text.serial_number }}：&nbsp;</el-col>
      <el-col class="value">
        <el-input :size="input_size" v-model="model.serial_number" clearable />
      </el-col>
    </el-row>
    <el-table :data="workList.slice(start, start + offset)" border size="small" style="width: 751px;">
      <el-table-column prop="serialNumber" :label="text.serial_number" width="150"> </el-table-column>
      <el-table-column prop="processType" :label="text.process_type" width="150" :formatter="process_type_formatter"> </el-table-column>
      <el-table-column prop="userId" :label="text.sponsor" width="150"> </el-table-column>
      <el-table-column prop="createTime" :label="text.application_date" width="160" :formatter="application_date_formatter"> </el-table-column>
      <el-table-column :label="text.operation" width="140">
        <template slot slot-scope="{ row, colunm, $index }">
          <div class="operate">
            <div class="operate-item" @click="operate_handler.call(this, { row, colunm, $index, action: 1 })">
              {{ text.see }}
            </div>
            <div class="operate-item" v-if="active_name === 'work_process'" @click="operate_handler.call(this, { row, colunm, $index, action: 0 })">
              {{ text.delete }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="workList.length" layout="prev,pager,next" :pageSize="offset" :total="workList.length" @current-change="page_change" style="margin-top:16px" />
  </div>
</template>
 
<script lang="ts">

export type Detail = {
  title: string
  component: any
  approval_application_detail_info: Vuex.OA.Response.approval_application_detail_info
  approval_detail_info: Vuex.OA.Response.approval_detail_info
}

import { Component, Prop, Vue, Inject } from "vue-property-decorator"
import MemberExamineApprove from "./index.vue"
import moment from "moment"
import { Vuex } from '../../../../../types/vuex';

@Component<Work>({
  beforeCreate() {
    this.$dispatch.approval_processing_info({
      UserId: localStorage.UserId
    })
    this.$dispatch.approval_wait_info({
      UserId: localStorage.UserId
    })
    this.$dispatch.approval_completed_info({
      UserId: localStorage.UserId
    })
    this.$dispatch.approval_all_info({
      UserId: localStorage.UserId
    })
  },
  computed: {
    workList() {
      let workList = this.$store.state.oa[this.active_name] || []
      workList = this.model.process_type ? workList.filter(item => item.processType === this.model.process_type) : workList
      workList = this.model.serial_number ? workList.filter(item => item.serialNumber.toLowerCase().includes(this.model.serial_number.toLowerCase())) : workList
      return workList
    }
  }
})
export default class Work extends Vue {
  @Inject() provider
  private input_size = "small"
  private static text = {
    zh: {
      /**
      * 正在办理
      */
      work_process: "正在办理",
      /**
       * 等待办理
       */
      work_wait: "等待办理",
      /**
       * 完成办理
       */
      work_over: "完成办理",
      /**
       * 全部办理
       */
      work_all: "全部办理",
      /**
        * 搜索
        */
      search: "搜索",
      /**
       * 流程类型
       */
      process_type: "流程类型",
      /**
       * 流水号
       */
      serial_number: "流水号",
      /**
       * 发起人
       */
      sponsor: "发起人",
      /**
       * 请选择
       */
      placeholder: "请选择",
      /**
       * 申请时间
       */
      application_date: "申请时间",
      /**
       * 操作
       */
      operation: "操作",
      /**
       * 删除
       */
      delete: "删除",
      /**
       * 返回
       */
      return: "返回",
      /**
       * 查看
       */
      see: "查看",
      /**
       * 删除成功
       */
      delete_success: "删除成功",
    },
  }
  private get text() {
    return Work.text[this.$language]
  }
  private menu = [
    {
      label: this.text.work_process,
      /** 正在办理 */
      name: "work_process",
    },
    {
      label: this.text.work_wait,
      /** 等待办理 */
      name: "work_wait",
    },
    {
      label: this.text.work_over,
      /** 完成办理 */
      name: "work_over",
    },
    {
      label: this.text.work_all,
      /** 全部办理 */
      name: "work_all",
    },
  ]
  private user_id = localStorage.UserId
  private active_name = this.menu[0].name
  private start = 0
  private offset = 14
  private detail: unknown | {
    component: any
    data: any
  } = null
  private data = {
    process_type: [
      {
        label: this.text.process_type,
        options: MemberExamineApprove.menu_items
      }
    ]
  }
  private model = {
    process_type: "",
    serial_number: "",
  }
  private process_type = ""
  private type_map: {
    [key: string]: {
      title: string
      component: string
    }
  } = (function () {
    const type_map = {} as any
    MemberExamineApprove.menu_items.forEach(item => {
      type_map[String(item.type)] = item
    })
    return type_map
  })()
  private page_change(page) {
    this.start = this.offset * (page - 1)
  }
  private process_type_formatter({ processType }) {
    return this.type_map[processType].title
  }
  private application_date_formatter({ createTime }) {
    return moment(createTime).format("YYYY-MM-DD hh:mm:ss")
  }
  private async operate_handler({ row, colunm, $index, action }) {
    let { serialNumber, processType } = row
    if (action) {
      const [applicationDetailInfo, approvalDetailInfo] = await Promise.all([
        this.$dispatch.approval_application_detail_info({ serialNumber }),
        this.$dispatch.approval_detail_info({ serialNumber }),
      ])
      const detail: Detail = {
        title: this.process_type_formatter({ processType }),
        component: require(`./${this.type_map[processType].component}.vue`).default,
        approval_application_detail_info: applicationDetailInfo.data,
        approval_detail_info: approvalDetailInfo.data,
      }
      this.$emit("detail", detail)
    } else {
      this.$dispatch.approval_delete_application({
        serialNumber
      }).then(data => {
        if (data.code === 200) {
          this.$emit("success", 0)
          this.$notify.success(this.text.delete_success)
          this.$dispatch.approval_processing_info({
            UserId: localStorage.UserId
          })
          this.$dispatch.approval_all_info({
            UserId: localStorage.UserId
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.work {
  .el-tabs__nav-wrap {
    margin: 8px 0 0 8px;
    display: flex;
    justify-content: left;
  }
  .el-tabs__item {
    font-size: 15px;
    margin: 0 0 0 0;
  }
  .operate {
    display: flex;
    justify-content: flex-start;
    .operate-item {
      margin: 0 10px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }
  .wrapper-detail_title {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-top: 17px;
    .item-detail_title {
      text-align: center;
      font-size: 18px;
    }
  }
  .search-colunm {
    margin: 0 0 14px 14px;
  }
  .back {
    margin-top: 12px;
    font-size: 22px;
    cursor: pointer;
  }
}
</style>

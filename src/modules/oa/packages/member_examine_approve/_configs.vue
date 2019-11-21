<template>
  <div class="config">
    <el-collapse v-model="active_name">
      <el-collapse-item v-for="item in itemList" :key="item.title" :name="item.title">
        <template slot="title">
          {{ item.title }} &nbsp; <i class="header-icon el-icon-info" style="color:#a6c5f6"></i>
        </template>
        <div>
          <div v-for="i in department_map.id" :key="i.id" class="departments">
            <div>{{ i.name }}：&nbsp;</div>
            <div v-if="isEditType === item.type && isEditId === i.id">
              <div class="wrapper1" v-for="(ise, index) in isEditIds" :key="index">
                <el-select v-model="isEditModel[index]" multiple placeholder="请选择" size="mini" style="width:350px;margin:5px 8px" filterable>
                  <el-option v-for="itemn in userAll" :key="itemn.userid" :label="`${itemn.userid}(${itemn.name})`" :value="`${itemn.userid}`"> </el-option>
                </el-select>

                <i class="el-icon-circle-close-outline" @click="remove.call(this, index)"></i>
              </div>
            </div>
            <div v-else-if="listMap[item.type] && listMap[item.type][i.id]">{{ listMap[item.type][i.id].approvalRoleNames.replace(/;/g, " >>> ") }}</div>
            <div v-else>""</div>

            <div v-if="isEditType === item.type && isEditId === i.id">
              <el-button size="mini" style="margin-left:20px" @click="add">新增</el-button>
              <el-button size="mini" style="margin-left:10px" @click="save">保存</el-button>
              <el-button
                size="mini"
                style="margin-left:10px"
                @click="
                  isEditType = 0;
                  isEditId = 0;
                "
                >取消</el-button
              >
            </div>
            <div v-else>
              <el-button size="mini" style="margin-left:20px" @click="edit.call(this, i.id, item.type)">编辑</el-button>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getDateByFormat } from 'src/service/date';
@Component<Attendance>({
  created() {
    this.$store.dispatch('oa/department_list').then(res => {
      const base_one = this.department_map.id[
        Object.keys(this.department_map.id)[0]
      ]
      Promise.all(
        Object.keys(this.department_map.id).filter(id => this.department_map.id[id].parentid === base_one.parentid).map(id => {
          return this.$store.dispatch('oa/user_list', {
            department_id: id
          })
        })
      ).then(data => {
        this.userAll = Array.prototype.flat.call(data) as any
      })
    })
    this.$store.dispatch("oa/approvalSelectAllConfig").then(data => {
      this.approvalSelectAllConfig = data
    })
  },
  computed: {
    department_map() {
      return this.$store.getters["oa/department_map"]
    },
    listMap() {
      let map: Object = {} as any
      if (this.approvalSelectAllConfig.length) {
        this.approvalSelectAllConfig.forEach((item, index) => {
          let type = item.processType
          if (!map.hasOwnProperty(type)) {
            map[type] = {}
          }
          item.$index = index
          map[type][item.departmentId] = item
        })
      }
      return map
    },

  }
})

export default class Attendance extends Vue {
  department_map
  @Prop() itemList!: any[]
  approvalSelectAllConfig: any[] = []
  active_name = this.itemList[0].title
  listMap
  userAll = []
  value5 = ''
  xzry_search = ''
  isEditType = 0
  isEditId = 0
  isEditNames: any = []
  isEditIds: any = []
  isEditModel: any = []

  remove(index) {
    if (this.isEditIds.length > 1) {
      this.isEditIds.splice(index, 1)
      let arr: any = []
      this.isEditIds.forEach(item => {
        if (item) {
          arr.push(
            item.split(',').map(item => {
              return item
            })
          )
        } else {
          arr.push("")
        }
      })
      this.isEditModel = arr
    }
  }

  add() {
    this.isEditIds.push("")
  }

  save() {
    let isErr = false
    let isEditIds: any = []
    for (let i = 0; i < this.isEditModel.length; i++) {
      if (!this.isEditModel[i].length) {
        this.$notify.error("参数错误")
        isErr = true
        break
      } else {
        isEditIds.push(this.isEditModel[i].join(','))
      }
    }
    if (!isErr) {
      let param = {
        departmentId: this.isEditId,
        processType: this.isEditType,
        approvalRoleIds: isEditIds.join(';'),
        approvalRoleNames: isEditIds.map(item => {
          return item.split(',').map(item => {
            return this.$store.state.oa.userList[item].name
          }).join(',')
        }).join(';')
      }
      this.$store.dispatch("oa/approvalApprovalConfig", param).then(data => {
        if (data.code === 200) {
          this.$emit('success', 0)
          this.$notify.success("修改参数成功")
          let index = this.listMap[this.isEditType][this.isEditId].$index
          this.approvalSelectAllConfig[index].approvalRoleIds = param.approvalRoleIds
          this.approvalSelectAllConfig[index].approvalRoleNames = param.approvalRoleNames
          this.isEditType = 0
          this.isEditId = 0
        }
      })

    }
  }

  edit(id, type) {
    let arr: any = []
    if (this.listMap[type] && this.listMap[type][id]) {
      this.isEditIds = this.listMap[type][id].approvalRoleIds.split(';')
      this.isEditIds.forEach(item => {
        arr.push(
          item.split(',').map(item => {
            return item
          })
        )
      })
    } else {
      this.isEditIds = ['']
      arr = []
    }
    this.isEditModel = arr
    this.isEditType = type
    this.isEditId = id
  }
}
</script>

<style lang="scss">
.config {
  width: 1000px;
  margin-top: 25px;
  .departments {
    display: flex;
    line-height: 18px;
    margin: 14px 0;
    align-items: center;
  }
  .el-icon-circle-close-outline {
    font-size: 16px;
    cursor: pointer;
    color: rgb(192, 196, 204);
  }
  .wrapper1 {
    display: flex;
    align-items: center;
  }
}
</style>

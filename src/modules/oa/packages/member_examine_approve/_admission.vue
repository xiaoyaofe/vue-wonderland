<template>
  <div class="admission approve_desc_page">
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
        <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.createTime }}</el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          一、入职基本信息
        </el-col>
      </el-row>
      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *入职时间：
          </el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.entryDate }}</el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *工号：
          </el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.employeeNumber }}</el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *公司：
          </el-col>
          <el-col class="value fixed">{{ ["逍遥盛世", "昊立信"][approval_application_detail_info.applicationDetailInfo.companyId * 1] }}</el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *中文名：
          </el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.userNameCn }}</el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *英文名：
          </el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.userNameEn }}</el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *所属部门：
          </el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.departmentName }}</el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *职位：
          </el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.position }}</el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *业务导师：
          </el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.businessTutorUserName }}</el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *汇报上级：
          </el-col>
          <el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.spervisorUserName }}</el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          二、入职成员基础办公用品准备
        </el-col>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *电脑配置：
          </el-col>
          <el-col class="value fixed">{{ ["", "普通电脑标配", "美术电脑+手写板", "普通电脑标配+固态硬盘", "内外网双机"][approval_application_detail_info.applicationDetailInfo.computerConfiguration * 1] }}</el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *办公用品：
          </el-col>
          <el-col class="value fixed">{{ ["未准备", "已准备"][approval_application_detail_info.applicationDetailInfo.isOfficeSupplies * 1] }}</el-col>
        </div>
      </el-row>
      <el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.annexPath">
        <img :src="require(`src/assets/oa/icon-folder-blue.png`)" style="padding: 0 10px 0 12px" />
        <el-col class="label">
          <a :href="$base + '/file/download?filePath=' + approval_application_detail_info.applicationDetailInfo.annexPath" target="_blank">附件查看</a>
        </el-col>
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
          一、入职基本信息
        </el-col>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *入职时间：
          </el-col>
          <el-col class="value">
            <el-date-picker class="date_picker" style="width: 156px;" type="date" :size="input_size" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="model.entryDate" v-required="model.entryDate" />
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *工号：
          </el-col>
          <el-col class="value">
            <el-input :size="input_size" v-model="model.employeeNumber" v-required="model.employeeNumber" />
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *公司：
          </el-col>
          <el-col class="value">
            <el-select :size="input_size" v-model="model.companyId" v-required="model.companyId">
              <el-option :value="`0`" label="逍遥盛世" />
              <el-option :value="`1`" label="昊立信" />
            </el-select>
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *中文名：
          </el-col>
          <el-col class="value">
            <el-input :size="input_size" v-model="model.userNameCn" v-required="model.userNameCn" />
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *英文名：
          </el-col>
          <el-col class="value">
            <el-input :size="input_size" v-model="model.userNameEn" v-required="model.userNameEn" />
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *所属部门：
          </el-col>
          <el-col class="value">
            <el-input :size="input_size" v-model="model.departmentName" v-required="model.departmentName" />
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *职位：
          </el-col>
          <el-col class="value">
            <el-input :size="input_size" v-model="model.position" v-required="model.position" />
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *业务导师：
          </el-col>
          <el-col class="value">
            <el-input :size="input_size" v-model="model.businessTutorUserName" v-required="model.businessTutorUserName" />
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *汇报上级：
          </el-col>
          <el-col class="value">
            <el-input :size="input_size" v-model="model.spervisorUserName" v-required="model.spervisorUserName" />
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          其他配置：
        </el-col>
        <el-col class="value full">
          <el-input :size="input_size" type="textarea" v-model="model.otherConfiguration" />
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          二、入职成员基础办公用品准备
        </el-col>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            *电脑配置：
          </el-col>
          <el-col class="value">
            <el-select :size="input_size" v-model="model.computerConfiguration" v-required="model.computerConfiguration">
              <el-option :value="`1`" label="普通电脑标配" />
              <el-option :value="`2`" label="美术电脑+手写板" />
              <el-option :value="`3`" label="普通电脑标配+固态硬盘" />
              <el-option :value="`4`" label="内外网双机" />
            </el-select>
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *办公用品：
          </el-col>
          <el-col class="value">
            <el-select :size="input_size" v-model="model.isOfficeSupplies" v-required="model.isOfficeSupplies">
              <el-option :value="`0`" label="未准备" />
              <el-option :value="`1`" label="已准备" />
            </el-select>
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          三、可上传文件（可选）
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-upload ref="upload" class="upload-box" action drag multiple :auto-upload="false" :before-upload="() => false" :on-change="on_file_changed">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-col>
      </el-row>

      <el-button class="submit full" v-required="submit">
        提交申请
      </el-button>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { UploadFileList } from "types";
import { Vuex } from "../../../../../types/vuex";
import { Detail } from "src/modules/oa/packages/member_examine_approve/_works.vue";

@Component
export default class Admission extends Vue {
  input_size = "small";
  @Prop() detail!: Detail;
  xzry_search = "";
  userAll = "";
  approval_application_detail_info: Vuex.OA.Response.approval_application_detail_info = this.detail && this.detail.approval_application_detail_info;
  approval_detail_info: Vuex.OA.Response.approval_detail_info = this.detail && this.detail.approval_detail_info;
  nextApproverId: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverId ? this.approval_detail_info.approvalDetailInfo[0].nextApproverId.split(",") : [];
  nextApproverName: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverName ? this.approval_detail_info.approvalDetailInfo[0].nextApproverName.split(",") : [];
  get department_map() {
    return this.$getter.department_map;
  }
  get userId() {
    return localStorage.UserId;
  }
  get base() {
    return (this.approval_detail_info.approvalDetailInfo.find(item => item.approvalResult === 3) as Vuex.OA.Interface.APPOVAL_DETAIL_INFO) || ({} as any);
  }
  get user() {
    return this.$state.member_info;
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
  changeNextManager(el) {
    if (el.target.classList.contains("el-icon-circle-close")) {
      let name = el.target.getAttribute("name");
      this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
    }
  }

  model = {
    applicationType: "4",
    userId: localStorage.UserId,
    companyId: "",
    userNameCn: "",
    userNameEn: "",
    departmentName: "",
    position: "",
    businessTutorUserName: "",
    spervisorUserName: "",
    otherConfiguration: "",
    entryDate: "",
    employeeNumber: "",
    computerConfiguration: "",
    isOfficeSupplies: "",
    fileList: [] as UploadFileList
  };
  submit() {
    let form_data = new FormData();
    for (let key in this.model) {
      switch (key) {
        case "fileList":
          this.model.fileList.forEach((item, index) => {
            form_data.set("file" + index, item.raw);
          });
          break;
        default:
          form_data.set(key, this.model[key].trim());
          break;
      }
    }
    this.$dispatch.approval_application(form_data as any).then(res => {
      if (res.code === 200) {
        this.$emit("success", 0);
      }
    });
  }
  on_file_changed(file, fileList) {
    this.model.fileList = fileList;
  }
}
</script>

<style lang="scss">
.admission {
  display: flex;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  .el-col {
    &:first-child {
      margin-left: 10px;
    }
  }
  .item {
    display: flex;
    align-items: center;
  }
  .el-row--flex {
    min-height: 48px;
    align-items: center;
  }
  .el-input__inner {
    min-width: 60px;
  }
  .el-input__inner,
  .el-textarea__inner {
    font-size: 14px;
    background: transparent;
    border: 0;
    margin: 10px 0;
    padding: 0 8px;
    box-shadow: 1px 0 3px rgba(0, 0, 0, 0.5);
  }
  .el-textarea__inner {
    min-height: 48px !important;
    padding: 8px 12px;
    overflow: hidden;
  }
  .el-input__prefix {
    display: none;
  }
  .date_picker {
    .el-input__suffix {
      left: 100px;
      top: 2px;
      font-size: 15px;
    }
  }
  .upload-box {
    display: flex;
    margin: 10px 0 0 0;
  }
  .el-upload-list {
    margin: 0 0 0 30px;
  }
  .submit {
    margin: 24px 0;
  }
}
</style>

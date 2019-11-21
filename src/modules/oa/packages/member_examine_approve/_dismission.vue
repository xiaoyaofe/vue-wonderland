<template>
  <div class="dismission approve_desc_page">
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
        <div class="item">
          <el-col class="label">
            姓名：
          </el-col>
          <el-col class="value fixed">
            {{ approval_application_detail_info.applicationDetailInfo.userName }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            部门：
          </el-col>
          <el-col class="value fixed">
            {{ [approval_application_detail_info.applicationDetailInfo.departmentId].map(department_id => $state.department_list.find(department => department.id == department_id).name).join("，") }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            职务：
          </el-col>
          <el-col class="value fixed">
            {{ approval_application_detail_info.applicationDetailInfo.position }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            工号：
          </el-col>
          <el-col class="value fixed">
            {{ approval_application_detail_info.applicationDetailInfo.employeeNumber }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            邮箱：
          </el-col>
          <el-col class="value fixed">
            {{ approval_application_detail_info.applicationDetailInfo.email }}
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            入职时间：
          </el-col>
          <el-col class="value fixed">
            {{ approval_application_detail_info.applicationDetailInfo.entryDate }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            申请时间：
          </el-col>
          <el-col class="value fixed">
            {{ approval_application_detail_info.applicationDetailInfo.applicationDate }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            预离职时间：
          </el-col>
          <el-col class="value fixed">
            {{ approval_application_detail_info.applicationDetailInfo.estimatedDepartureDate }}
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          离职原因：
        </el-col>
        <el-col class="value full">
          {{ approval_application_detail_info.applicationDetailInfo.reason }}
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *成员离职问卷调查：
        </el-col>
      </el-row>

      <div class="questions">
        <el-row type="flex" v-for="item in applicant_topic_list" :key="item.order">
          <el-col class="label" style="font-weight:500"> {{ item.order }}. {{ item.topicContent }} </el-col>
          <el-col class="value" style="font-size:15px;margin-left:16px;font-weight:700;">
            {{
              (function() {
                let applicant_topic_item = approval_application_detail_info.applicationDetailInfo.applicantTopicList.find(_ => _.topicId == item.topicId);

                if (applicant_topic_item.content) {
                  return applicant_topic_item.content;
                } else {
                  return item.answerList.find(_ => _.order == applicant_topic_item.select).answerContent;
                }
              })()
            }}
          </el-col>
        </el-row>
      </div>

      <div v-if="approval_application_detail_info.applicationDetailInfo.personnelTopicList.filter(_ => _.content || _.select).length">
        <el-row type="flex">
          <el-col class="label">
            *以下内容由人事部访谈后补充填写：
          </el-col>
        </el-row>

        <el-row type="flex" v-for="item in personnel_topic_list" :key="item.order">
          <el-col class="label" style="font-weight:500"> {{ item.order }}. {{ item.topicContent }} </el-col>
          <el-col class="value" style="font-size:15px;margin-left:16px;font-weight:700;">
            {{
              (function() {
                let applicant_topic_item = approval_application_detail_info.applicationDetailInfo.personnelTopicList.find(_ => _.topicId == item.topicId);

                if (applicant_topic_item.content) {
                  return applicant_topic_item.content;
                } else {
                  return item.answerList.find(_ => _.order == applicant_topic_item.select).answerContent;
                }
              })()
            }}
          </el-col>
        </el-row>
      </div>

      <div v-if="base.approverRoleId == 4">
        <el-row type="flex">
          <el-col class="label">
            以下内容由人事部访谈后补充填写
          </el-col>
        </el-row>
        <div style="margin-left:24px">
          <div v-for="(item, index) in personnel_topic_list" :key="item.order">
            <el-row type="flex">{{ item.order }}. {{ item.topicContent }}</el-row>
            <el-row type="flex">
              <div v-if="item.topicType === 1">
                <el-radio v-for="item in item.answerList" :key="item.order" v-required="model.personnelTopics[index].select" v-model="model.personnelTopics[index].select" :label="item.order" @change="change.call(this, item, model.personnelTopics[index])">
                  {{ item.answerContent }}
                </el-radio>
              </div>
              <div v-if="item.topicType === 2">
                <el-checkbox-group v-required="model.personnelTopics[index].select" v-model="model.personnelTopics[index].select">
                  <el-checkbox v-for="item in item.answerList" :key="item.order" :label="item.order" @change="change.call(this, item, model.personnelTopics[index])">{{ item.answerContent }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <el-row type="flex" v-if="item.topicType === 3" class="full">
                <el-col class="value full">
                  <el-input type="textarea" v-required="model.personnelTopics[index].content" v-model="model.personnelTopics[index].content"></el-input>
                </el-col>
              </el-row>
            </el-row>
          </div>
        </div>
      </div>

      <!-- confirm -->
      <el-row v-if="base.userId === $state.member_info.userid" type="flex" style="padding:0 24px 0 12px;margin: 25px 0 0 0;">
        <el-button :size="input_size" class="full" @click="confirm.call(this, 2)">否决</el-button>
        <el-button :size="input_size" class="full" v-required="confirm">同意</el-button>
      </el-row>
    </div>
    <div v-else>
      <div class="dismission_abstract">
        离职流程：<br />
        1、提出离职申请，试用期员工提前3天、正式员工提前1个月申请 <br />
        2、离职访谈，人事部会根据所提离职申请，安排时间进行相应的离职访谈 <br />
        3、离职交接，离职当天办理离职交接手续，填写《离职交接表》，人事部出具离职证明。<br />
      </div>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            姓名：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.name }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            部门：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.department.map(department_id => $state.department_list.find(department => department.id == department_id).name).join("，") }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            职务：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.position }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            工号：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.employeeNumber }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            邮箱：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.email }}
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <div class="item">
          <el-col class="label">
            入职时间：
          </el-col>
          <el-col class="value fixed">
            {{ $state.member_info.entryDate }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            申请时间：
          </el-col>
          <el-col class="value fixed">
            {{ this.model.applicationDate }}
          </el-col>
        </div>
        <div class="item">
          <el-col class="label">
            *预离职时间：
          </el-col>
          <el-col class="value fixed">
            <el-date-picker class="date_picker" style="width:130px" :size="input_size" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="model.estimatedDepartureDate" range-separator="至" v-required="model.estimatedDepartureDate" />
          </el-col>
        </div>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *离职原因：
        </el-col>
        <el-col class="value full">
          <el-input type="textarea" v-model="model.reason" v-required="model.reason"></el-input>
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col class="label">
          *成员离职问卷调查：
        </el-col>
      </el-row>

      <div class="survey">
        <div class="servey_abstract">
          亲爱的成员：<br />
          非常感谢您在工作的日子里对团队做出的贡献，为您即将离开团队，我们表示深切的遗憾，并送上真挚的祝福。为了使我们对您辞职的真正原因有所了解，从而改进我们的工作，特请您协助填写以下的表格，一切有关您所反馈的信息，仅作为改进工作的依据，请客观填写以下内容，感谢您的配合！
        </div>
        <div class="questions">
          <div v-for="(item, index) in applicant_topic_list" :key="item.order">
            <el-row type="flex">{{ item.order }}. {{ item.topicContent }}</el-row>
            <el-row type="flex">
              <div
                :style="{
                  display: 'flex',
                  'align-items': 'center',
                  'flex-wrap': 'wrap'
                }"
                v-if="item.topicType === 1"
              >
                <el-radio
                  :style="{
                    display: 'flex',
                    'align-items': 'center'
                  }"
                  v-for="item in item.answerList"
                  :key="item.order"
                  v-required="model.applicantTopics[index].select"
                  v-model="model.applicantTopics[index].select"
                  :label="item.order"
                  @change="change.call(this, item, model.applicantTopics[index])"
                >
                  <span v-if="model.applicantTopics[index].answerType === 2 && item.answerType === 2">
                    <el-input type="textarea" :placeholder="item.answerContent" size="small" v-required="model.applicantTopics[index].content" v-model="model.applicantTopics[index].content"></el-input>
                  </span>
                  <span style="line-height: 28px" v-else>
                    {{ item.answerContent }}
                  </span>
                </el-radio>
              </div>
              <div
                :style="{
                  display: 'flex',
                  'align-items': 'center',
                  'flex-wrap': 'wrap'
                }"
                v-if="item.topicType === 2"
              >
                <el-checkbox-group v-required="model.applicantTopics[index].select" v-model="model.applicantTopics[index].select">
                  <el-checkbox
                    :style="{
                      display: 'flex',
                      'align-items': 'center'
                    }"
                    v-for="item in item.answerList"
                    :key="item.order"
                    :label="item.order"
                    @change="change.call(this, item, model.applicantTopics[index])"
                  >
                    <span v-if="model.applicantTopics[index].answerType === 2 && item.answerType === 2">
                      <el-input type="textarea" :placeholder="item.answerContent" size="small" v-required="model.applicantTopics[index].content" v-model="model.applicantTopics[index].content"></el-input>
                    </span>
                    <span style="line-height: 28px" v-else>
                      {{ item.answerContent }}
                    </span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <el-row type="flex" v-if="item.topicType === 3" class="full">
                <el-col class="value full">
                  <el-input type="textarea" v-required="model.applicantTopics[index].content" v-model="model.applicantTopics[index].content"></el-input>
                </el-col>
              </el-row>
            </el-row>
          </div>
        </div>
      </div>
      <el-row class="value full" style="margin: 15px 0 0 0;">
        <el-button class="submit full" v-required="submit">
          提交
        </el-button>
      </el-row>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Vuex } from "../../../../../types/vuex";
import { Detail } from "src/modules/oa/packages/member_examine_approve/_works.vue";
import { getDateByFormat } from "src/service/date";

@Component<Dismission>({
  created() {
    this.$dispatch
      .questionnaire_query({
        type: 1
      })
      .then(res => {
        /** 问答 */
        res.data.applicantTopicList.forEach(item => {
          if (item.topicType === 1) {
            // 单选
            this.model.applicantTopics.push({
              topicId: item.topicId,
              answerType: "",
              select: "",
              content: ""
            });
          } else if (item.topicType === 2) {
            // 多选
            this.model.applicantTopics.push({
              topicId: item.topicId,
              answerType: [],
              select: "",
              content: ""
            });
          } else if (item.topicType === 3) {
            // 问答
            this.model.applicantTopics.push({
              topicId: item.topicId,
              content: ""
            });
          }
        });

        /** 后续补充 */
        res.data.personnelTopicList.forEach(item => {
          if (item.topicType === 1) {
            // 单选
            this.model.personnelTopics.push({
              topicId: item.topicId,
              answerType: "",
              select: "",
              content: ""
            });
          } else if (item.topicType === 2) {
            // 多选
            this.model.personnelTopics.push({
              topicId: item.topicId,
              answerType: [],
              select: "",
              content: ""
            });
          } else if (item.topicType === 3) {
            // 问答
            this.model.personnelTopics.push({
              topicId: item.topicId,
              content: ""
            });
          }
        });

        this.applicant_topic_list = res.data.applicantTopicList;
        this.personnel_topic_list = res.data.personnelTopicList;
        this.model.templateId = res.data.templateId;
      });
  }
})
export default class Dismission extends Vue {
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
  public userInfo: Vuex.OA.Response.user = this.$state.member_info;
  input_size = "small";
  model = {
    /** 申请类型：5 */
    applicationType: 5,
    /** 申请人用户id */
    userId: this.$state.member_info.userid,
    /** 申请人姓名 */
    userName: this.$state.member_info.name,
    /** 申请人部门id */
    departmentId: this.$state.member_info.department[0],
    /** 职务 */
    position: this.$state.member_info.position,
    /** 工号 */
    employeeNumber: this.$state.member_info.employeeNumber,
    /** 邮箱 */
    email: this.$state.member_info.email,
    /** 入职日期 格式 例：2019-01-01 */
    entryDate: this.$state.member_info.entryDate,
    /** 预离职日期 格式 例：2019-01-01 */
    estimatedDepartureDate: "",
    /** 离职原因 */
    reason: "",
    /** 模板id 接口四，问卷查询接口获得 */
    templateId: "",
    /** 申请人填写问题 */
    applicantTopics: [] as any,
    /** 人事填写问题 */
    personnelTopics: [] as any,
    /** 申请日期 格式 例：2019-01-01 */
    applicationDate: getDateByFormat("yyyy-MM-dd")
  };

  radio = "";
  applicant_topic_list = "";
  personnel_topic_list = "";

  change(item, model) {
    model.answerType = item.answerType;
  }

  submit() {
    let form_data = {};
    for (let key in this.model) {
      switch (key) {
        case "applicantTopics":
          form_data[key] = JSON.stringify(this.model[key]);
          break;
        case "personnelTopics":
          form_data[key] = JSON.stringify(this.model[key]);
          break;
        default:
          form_data[key] = this.model[key].trim ? this.model[key].trim() : this.model[key];
          break;
      }
    }
    this.$dispatch.approval_application(form_data as any).then(res => {
      if (res.code === 200) {
        this.$emit("success", 0);
      }
    });
  }
  confirm(approvalResult) {
    var data = Object.assign({}, this.base, { approvalResult });
    if (this.base.approverRoleId == 4) {
      data.exInfo = JSON.stringify({
        personnelTopics: JSON.stringify(this.model.personnelTopics)
      });
    }
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
  changeNextManager(name) {
    this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
  }
}
</script>

<style lang="scss">
.dismission {
  .el-input__suffix {
    top: 2px !important;
  }
  textarea {
    min-width: 320px;
  }
}
</style>

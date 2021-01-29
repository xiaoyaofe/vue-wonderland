<template>
	<div class="demand approve_desc_page">
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
						需求部门：
					</el-col>
					<el-col class="value fixed">
						{{ $store.state.oa.userDepartment[0].name }}
					</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						申请人：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.userName }}</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						申请日期：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.applicationDate }}</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item">
					<el-col class="label">
						*需求岗位：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.position }}</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*需求人数：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.positionNumber }}</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*期待到岗日：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.arrivalDate }}</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item">
					<el-col class="label">
						*岗位定编人数：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.fixedPeople }}</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*岗位现有人数：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.alreadyPeople }}</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item">
					<el-col class="label">*需求原因：</el-col>
					<el-col class="value fixed">{{ ["", "离职补充", "员工内部调动补充", "拟替换不合格者", "工作量增加", "新业务拓展"][approval_application_detail_info.applicationDetailInfo.demandCause * 1] }}</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item full">
					<el-col class="label">*主要工作职责：</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.jobResponsibilities }}</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<el-col class="label fixed">
					任职资格
				</el-col>
			</el-row>
			<el-row type="flex" style="margin: -10px 0 0 0;">
				<div class="item">
					<el-col class="label">
						*年龄：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.age }}</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*学历：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.education }}</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*专业：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.profession }}</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*性别：
					</el-col>
					<el-col class="value fixed">{{ ["不限", "男", "女"][approval_application_detail_info.applicationDetailInfo.gender * 1] }}</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item">
					<el-col class="label">
						*建议岗位薪资范围：
					</el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.salaryRange }}</el-col>
					<el-col class="value">元/月</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item full">
					<el-col class="label" v-html="`特殊要求（行业经验、地域<br>、相关企业工作经验等）：`"></el-col>
					<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.specialRequirements }}</el-col>
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
				<div class="item">
					<el-col class="label">
						需求部门：
					</el-col>
					<el-col class="value fixed">
						{{ $store.state.oa.userDepartment[0].name }}
					</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						申请人：
					</el-col>
					<el-col class="value fixed">
						{{ userInfo.userName }}
					</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						申请日期：
					</el-col>
					<el-col class="value fixed">
						{{ model.applicationDate }}
					</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item">
					<el-col class="label">
						*需求岗位：
					</el-col>
					<el-col class="value">
						<el-input :size="input_size" v-model="model.position" v-required="model.position" />
					</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*需求人数：
					</el-col>
					<el-col class="value">
						<el-input :size="input_size" v-model="model.positionNumber" v-required="model.positionNumber" type="number" />
					</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*期待到岗日：
					</el-col>
					<el-col class="value">
						<el-date-picker class="date_picker" style="width: 156px;" type="date" :size="input_size" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="model.arrivalDate" v-required="model.arrivalDate" />
					</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item">
					<el-col class="label">
						*岗位定编人数：
					</el-col>
					<el-col class="value">
						<el-input :size="input_size" v-model="model.fixedPeople" v-required="model.fixedPeople" type="number" />
					</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*岗位现有人数：
					</el-col>
					<el-col class="value">
						<el-input :size="input_size" v-model="model.alreadyPeople" v-required="model.alreadyPeople" type="number" />
					</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item">
					<el-col class="label">*需求原因：</el-col>
					<el-col class="value">
						<el-row type="flex">
							<el-col class="label">编制内增加：</el-col>
							<el-col class="value">
								<el-select :size="input_size" v-model="demandCause1" v-required="model.demandCause">
									<el-option v-for="item in innerOptions" :key="item.key" :label="`${item.key}`" :value="`${item.val}`"></el-option>
								</el-select>
							</el-col>
						</el-row>
						<el-row type="flex">
							<el-col class="label">编制外增加：</el-col>
							<el-col class="value">
								<el-select :size="input_size" v-model="demandCause2" v-required="model.demandCause">
									<el-option v-for="item in outerOptions" :key="item.key" :label="`${item.key}`" :value="`${item.val}`"></el-option>
								</el-select>
							</el-col>
						</el-row>
					</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item full">
					<el-col class="label">*主要工作职责：</el-col>
					<el-col class="value full">
						<el-input type="textarea" autosize v-model="model.jobResponsibilities" v-required="model.jobResponsibilities" />
					</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<el-col class="label fixed">
					任职资格
				</el-col>
			</el-row>
			<el-row type="flex" style="margin: -10px 0 0 0;">
				<div class="item">
					<el-col class="label">
						*年龄：
					</el-col>
					<el-col class="value" style="width: 70px;">
						<el-input :size="input_size" v-model="model.age" v-required="model.age" type="number" />
					</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*学历：
					</el-col>
					<el-col class="value">
						<el-input :size="input_size" v-model="model.education" v-required="model.education" />
					</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*专业：
					</el-col>
					<el-col class="value">
						<el-input :size="input_size" v-model="model.profession" v-required="model.profession" />
					</el-col>
				</div>
				<div class="item">
					<el-col class="label">
						*性别：
					</el-col>
					<el-col class="value" style="width: 70px;">
						<el-select :size="input_size" v-model="model.gender">
							<el-option v-for="item in genderOptions" :key="item.key" :label="`${item.key}`" :value="`${item.val}`"></el-option>
						</el-select>
					</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item">
					<el-col class="label">
						*建议岗位薪资范围：
					</el-col>
					<el-col class="value">
						<el-input :size="input_size" v-model="salaryRange1" v-required="salaryRange1" type="number" />
					</el-col>
					<el-col class="value" style="margin: 0 14px 0 -12px">
						至
					</el-col>
					<el-col>
						<el-input :size="input_size" v-model="salaryRange2" v-required="salaryRange2" type="number" />
					</el-col>
					<el-col class="value">元/月</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<div class="item full">
					<el-col class="label" v-html="`特殊要求（行业经验、地域<br>、相关企业工作经验等）：`"></el-col>
					<el-col class="value full">
						<el-input type="textarea" style="padding-left: 20px;" autosize v-model="model.specialRequirements" />
					</el-col>
				</div>
			</el-row>
			<el-row type="flex">
				<!-- 三、可上传文件（可选） -->
				<el-col class="label">上传文件</el-col>
				<el-col style="margin: 0 auto;">
					<el-upload ref="upload" class="upload-box" action drag multiple :auto-upload="false" :before-upload="() => false" :on-change="on_file_changed">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
				</el-col>
			</el-row>
			<el-row type="flex">
				<el-button class="submit full" v-required="submit">
					提交
				</el-button>
			</el-row>
		</div>
	</div>
</template>
 
<script lang="ts">
	import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
	import moment from "moment";
	import { OA, UploadFileList } from "types";
	import { Gender, DemandCause } from "../config";
	import axios from "axios";
	import { isNumber } from "util";
	import { Vuex } from "../../../../../types/vuex";
	import { Detail } from "src/modules/oa/packages/member_examine_approve/_works.vue";

	@Component<Demand>({
		created() {}
	})
	export default class Demand extends Vue {
		@Prop() detail!: Detail;
		xzry_search = "";
		get user_all() {
			return this.$state.user_all;
		}
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
		get genderOptions() {
			return Object.values(Gender)
				.filter(val => isNumber(val))
				.map(function(val) {
					return {
						key: Gender[val],
						val
					};
				});
		}
		get innerOptions() {
			return Object.keys(DemandCause.inner).map(function(key) {
				return {
					key,
					val: DemandCause.inner[key]
				};
			});
		}
		get outerOptions() {
			return Object.keys(DemandCause.outer).map(function(key) {
				return {
					key,
					val: DemandCause.outer[key]
				};
			});
		}

		public Gender = Gender;
		public userInfo: Vuex.OA.Response.user = this.$state.member_info;
		input_size = "small";
		model = {
			/** 申请类型 */
			applicationType: "6",
			/** 需求部门id */
			departmentId: this.userInfo.department[0] + "",
			/** 申请人	 */
			userId: localStorage.UserId,
			/** 申请日期	 */
			applicationDate: moment().format("YYYY-MM-DD"),
			/** 需求岗位 */
			position: "",
			/** 需求人数 */
			positionNumber: "",
			/** 期待到岗日 */
			arrivalDate: "",
			/** 岗位定编人数 */
			fixedPeople: "",
			/** 岗位现有人数 */
			alreadyPeople: "",
			/** 需求原因 */
			demandCause: "",
			/** 主要工作职责 */
			jobResponsibilities: "",
			/** 年龄 */
			age: "",
			/** 学历 */
			education: "",
			/** 专业 */
			profession: "",
			/** 性别 */
			gender: "0",
			/** 建议薪资范围 */
			salaryRange: "",
			/** 特殊要求 */
			specialRequirements: "",
			/** 文件列表 */
			fileList: [] as UploadFileList
		};
		on_file_changed(file, fileList) {
			this.model.fileList = fileList;
		}
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
						const val = this.model[key].trim();
						form_data.set(key, val);
						break;
				}
			}

			this.$dispatch.approval_application(form_data as any).then(res => {
				if (res.code === 200) {
					this.$emit("success", 0);
				}
			});
		}

		salaryRange1 = "";
		salaryRange2 = "";
		@Watch("salaryRange1")
		salaryRange1Change() {
			this.model.salaryRange = [this.salaryRange1, this.salaryRange2].join(",");
		}
		@Watch("salaryRange2")
		salaryRange2Change() {
			this.model.salaryRange = [this.salaryRange1, this.salaryRange2].join(",");
		}
		demandCause1 = "";
		demandCause2 = "";
		@Watch("demandCause1")
		demandCause1Change(val) {
			if (val) {
				this.model.demandCause = val;
				this.demandCause2 = "";
				console.log("this.model.demandCause", this.model.demandCause);
			}
		}
		@Watch("demandCause2")
		demandCause2Change(val) {
			if (val) {
				this.model.demandCause = val;
				this.demandCause1 = "";
				console.log("this.model.demandCause", this.model.demandCause);
			}
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
		changeNextManager(name) {
			this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
		}
	}
</script>

<style lang="scss">
	.demand {
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
		.el-icon-circle-close {
			cursor: pointer;
			margin-left: 5px;
		}
	}
</style>

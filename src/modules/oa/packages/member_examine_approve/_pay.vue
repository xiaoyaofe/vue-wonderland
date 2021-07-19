<template>
	<div class="pay approve_desc_page">
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
			</el-row>
			<!-- 日期 -->
			<el-row type="flex">
				<el-col class="label">日期：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.applicationDate }}</el-col>

				<el-col class="label">部门：</el-col>
				<el-col class="value fixed">{{ department_map.id[approval_application_detail_info.applicationDetailInfo.departmentId].name }}</el-col>
				<!-- -------------------------------------------------- -->
				<el-col class="label">申请人：</el-col>
				<el-col class="value fixed">{{ userList[approval_application_detail_info.applicationDetailInfo.userId].name }}</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">付款事由：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.reason }}</el-col>
			</el-row>
			<el-row type="flex">
				<el-col class="label">付款金额：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.amount }}</el-col>
			</el-row>
			<el-row type="flex">
				<el-col class="label">收款人名称：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.payeeName }}</el-col>
			</el-row>
			<el-row type="flex">
				<el-col class="label">收款人账号：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.payeeAccount }}</el-col>
			</el-row>
			<el-row type="flex">
				<el-col class="label">收款人银行：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.payeeBank }}</el-col>
			</el-row>
			<el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.remark ">
				<el-col class="label">备注：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.remark }}</el-col>
			</el-row>
			<!-- 附件查看 -->
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
					申请人：
				</el-col>
				<el-col class="value fixed">
					{{ userInfo.userName }}
				</el-col>
				<el-col class="label">
					部门：
				</el-col>
				<el-col class="value fixed">
					{{ $store.state.oa.userDepartment[0].name }}
				</el-col>
				<el-col class="label">
					申请日期：
				</el-col>
				<el-col class="value fixed">
					{{ model.applicationDate }}
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*付款事由：
				</el-col>
				<el-col class="value full">
					<el-input type="textarea" :size="input_size" v-model="model.reason" v-required="model.reason" />
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*付款金额 ：
				</el-col>
				<el-col class="value full">
					<el-input type="number" :size="input_size" v-model="model.amount" />
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*收款人名称：
				</el-col>
				<el-col class="value full">
					<el-input type="text" :size="input_size" v-model="model.payeeName" v-required="model.payeeName" />
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*收款人账号：
				</el-col>
				<el-col class="value full">
					<el-input type="text" :size="input_size" v-model="model.payeeAccount" v-required="model.payeeAccount" />
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*收款人银行：
				</el-col>
				<el-col class="value full">
					<el-input type="text" :size="input_size" v-model="model.payeeBank" v-required="model.payeeBank" />
				</el-col>
			</el-row>
			<el-row type="flex">
				<el-col class="label">
					备注：
				</el-col>
				<el-col class="value full">
					<el-input type="textarea" :size="input_size" v-model="model.remark" v-required="model.remark" />
				</el-col>
			</el-row>
			<el-row type="flex" style="margin: 8px 0 0 0;">
				<el-col class="label">
					上传附件：
				</el-col>
				<el-col style="margin: 0 auto;">
					<el-upload ref="upload" class="upload-box" action drag multiple :auto-upload="false" :before-upload="() => false" :on-change="on_file_changed">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
				</el-col>
			</el-row>
			<el-row class="value full" style="margin: 15px 0 0 0;">
				<el-button class="submit full" v-required="submit">
					提交
				</el-button>
			</el-row>
		</div>
	</div>
</template>
 
<script lang="ts">
	import { Component, Prop, Vue, Watch } from "vue-property-decorator";
	import moment from "moment";
	import { OA } from "types";
	import axios from "axios";
	import { Vuex } from "../../../../../types/vuex";
	import { Detail } from "./_works.vue";
	import { getDateByFormat, getHoursByFormat } from "src/service/date";
	import { UploadFileList } from "../../../../../types";

	@Component
	export default class Pay extends Vue {
		public userInfo = this.$state.member_info;
		model = {
			/** 申请类型 */
			applicationType: "15",
			/** 申请人部门Id */
			departmentId: this.$store.state.oa.userDepartment[0].id + "",
			/** 申请人用户id */
			userId: this.userInfo.userId,
			/** 申请日期 例：2019-09-09 */
			applicationDate: getDateByFormat("yyyy-MM-dd"),
			/** 付款事由 */
			reason: "",
			/** 付款金额 */
			amount: 0,
			/** 收款人名称 */
			payeeName: "",
			/** 收款人账户 */
			payeeAccount: "",
			/** 收款银行 */
			payeeBank: "",
			/** 备注 */
			remark: "",

			fileList: [] as UploadFileList
		};
		input_size = "small";

		@Prop() detail!: Detail;
		approval_application_detail_info: Vuex.OA.Response.approval_application_detail_info = this.detail && this.detail.approval_application_detail_info;
		approval_detail_info: Vuex.OA.Response.approval_detail_info = this.detail && this.detail.approval_detail_info;
		userAll?: any = "";
		xzry_search = "";
		nextApproverId: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverId ? this.approval_detail_info.approvalDetailInfo[0].nextApproverId.split(",") : [];
		nextApproverName: string[] = this.approval_detail_info && this.approval_detail_info.approvalDetailInfo.length && this.approval_detail_info.approvalDetailInfo[0].nextApproverName ? this.approval_detail_info.approvalDetailInfo[0].nextApproverName.split(",") : [];
		get department_map() {
			return this.$getter.department_map;
		}
		mounted() {
			console.log(this.approval_application_detail_info);
		}
		// get leave_type_map() {
		// 	return this.$getter.leave_type_map;
		// }
		// get userId() {
		// 	return localStorage.UserId;
		// }
		get base() {
			return (this.approval_detail_info.approvalDetailInfo.find(item => item.approvalResult === 3) as Vuex.OA.Interface.APPOVAL_DETAIL_INFO) || ({} as any);
		}
		get userList() {
			return this.$store.state.oa.userList;
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
		on_file_changed(file, fileList) {
			this.model.fileList = fileList;
		}
		// changeNextManager(el) {
		// 	if (el.target.classList.contains("el-icon-circle-close")) {
		// 		let name = el.target.getAttribute("name");
		// 		this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
		// 	}
		// }
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

		submit() {
			const form_data = new FormData();
			for (const key in this.model) {
				switch (key) {
					case "fileList":
						this.model.fileList.forEach((item, index) => {
							form_data.set("file" + index, item.raw);
						});
						break;
					default:
						const val = this.model[key].trim ? this.model[key].trim() : this.model[key];
						form_data.set(key, val);
				}
			}
			this.$dispatch.approval_application(form_data as any).then(res => {
				if (res.code === 200) {
					this.$emit("success", 0);
				}
			});
		}
	}
</script>

<style lang="scss">
	.pay {
		.el-range-editor--small .el-range-separator {
			line-height: 32px !important;
		}
		.el-range-editor--small .el-range__close-icon,
		.el-range-editor--small .el-range__icon {
			line-height: 34px !important;
		}
	}
</style>

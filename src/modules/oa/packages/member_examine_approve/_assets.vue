<template>
	<div class="card approve_desc_page">
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
					*资产信息
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*资产名称：
				</el-col>
				<el-col class="value">
					{{ approval_application_detail_info.applicationDetailInfo.assetName }}
				</el-col>
				<el-col class="label">
					*资产编号：
				</el-col>
				<el-col class="value">
					{{ approval_application_detail_info.applicationDetailInfo.assetSn }}
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*资产类别：
				</el-col>
				<el-col class="value">
					{{ options_asset_type.find(item => item.value == approval_application_detail_info.applicationDetailInfo.assetType).label }}
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*使用人：
				</el-col>
				<el-col class="value">
					<!-- {{ $state.user_all.find(item => item.userid === approval_application_detail_info.applicationDetailInfo.assetUserId).name }} -->
				</el-col>
				<el-col class="label">
					*使用部门：
				</el-col>
				<el-col class="value">
					{{ $state.department_list.find(item => item.id == approval_application_detail_info.applicationDetailInfo.assetUseDepartmentId).name }}
				</el-col>
				<el-col class="label">
					*使用年限：
				</el-col>
				<el-col class="value">
					{{ approval_application_detail_info.applicationDetailInfo.assetUseYears }}
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*原值：
				</el-col>
				<el-col class="value">
					{{ approval_application_detail_info.applicationDetailInfo.originalAmount }}
				</el-col>
				<el-col class="label">
					累计折旧：
				</el-col>
				<el-col class="value">
					{{ approval_application_detail_info.applicationDetailInfo.depreciationAmount }}
				</el-col>
				<el-col class="label">
					净值：
				</el-col>
				<el-col class="value">
					{{ approval_application_detail_info.applicationDetailInfo.netAmount }}
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*申请处理方式
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*处理方式：
				</el-col>
				<el-col class="value">
					{{ options_disposal_type.find(item => item.value == approval_application_detail_info.applicationDetailInfo.disposalType).label }}
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*处置原因：
				</el-col>
				<el-col class="value full">
					{{ approval_application_detail_info.applicationDetailInfo.disposalReason }}
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					处置方案：
				</el-col>
				<el-col class="value full">
					{{ approval_application_detail_info.applicationDetailInfo.disposalPlan }}
				</el-col>
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
				<el-col class="label">
					*资产信息
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*资产名称：
				</el-col>
				<el-col class="value">
					<el-input :size="input_size" v-model="model.assetName" v-required="model.assetName" />
				</el-col>
				<el-col class="label">
					*资产编号：
				</el-col>
				<el-col class="value">
					<el-input :size="input_size" v-model="model.assetSn" v-required="model.assetSn" />
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*资产类别：
				</el-col>
				<el-col class="value">
					<el-select :size="input_size" v-model="model.assetType" v-required="model.assetType" style="width: 340px">
						<el-option v-for="item in options_asset_type" :value="item.value" :label="item.label" :key="item.value" />
					</el-select>
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*使用人：
				</el-col>
				<el-col class="value">
					<component :size="input_size" :is="require(`src/modules/oa/packages/member_examine_approve/items/users_select.vue`).default" v-required="model.assetUserId" @changed="changed_asset_userId" />
				</el-col>
				<el-col class="label">
					*使用部门：
				</el-col>
				<el-col class="value">
					<component :size="input_size" :is="require(`src/modules/oa/packages/member_examine_approve/items/departments_select.vue`).default" v-required="model.assetUseDepartmentId" @changed="changed_assetUseDepartmentId" />
				</el-col>
				<el-col class="label">
					*使用年限：
				</el-col>
				<el-col class="value">
					<el-input :size="input_size" v-required="model.assetUseYears" v-model="model.assetUseYears" />
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*原值：
				</el-col>
				<el-col class="value">
					<el-input :size="input_size" v-required="model.originalAmount" v-model="model.originalAmount" />
				</el-col>
				<el-col class="label">
					累计折旧：
				</el-col>
				<el-col class="value">
					<el-input :size="input_size" v-model="model.depreciationAmount" />
				</el-col>
				<el-col class="label">
					净值：
				</el-col>
				<el-col class="value">
					<el-input :size="input_size" v-model="model.netAmount" />
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*申请处理方式
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*处理方式：
				</el-col>
				<el-col class="value">
					<el-select :size="input_size" v-model="model.disposalType" v-required="model.disposalType">
						<el-option v-for="item in options_disposal_type" :value="item.value" :label="item.label" :key="item.value" />
					</el-select>
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*处置原因：
				</el-col>
				<el-col class="value full">
					<el-input :size="input_size" type="textarea" v-model="model.disposalReason" />
				</el-col>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					*处置方案：
				</el-col>
				<el-col class="value full">
					<el-input :size="input_size" type="textarea" v-model="model.disposalPlan" />
				</el-col>
			</el-row>
			<el-row type="flex"  style="margin: 8px 0 0 0;">
				<el-col  style="margin: 0 auto;">
					<el-upload ref="upload" class="upload-box" action drag multiple :auto-upload="false" :before-upload="() => false" :on-change="on_file_changed">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
				</el-col>
			</el-row>
			<el-row type="flex" style="padding: 0 24px 0 12px;margin: 20px 0 0 0;">
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
	import { UploadFileList } from "../../../../../types";

	@Component
	export default class Card extends Vue {
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
			/** 申请类型 */
			applicationType: "11",
			/** 申请人用户id */
			userId: this.$state.member_info.userid,
			/** 申请日期 例：2019-09-09 */
			applicationDate: getDateByFormat("yyyy-MM-dd"),
			/** 资产名称 */
			assetName: "",
			/** 资产类别 */
			assetType: "",
			/** 资产编号 */
			assetSn: "",
			/** 资产使用者用户id */
			assetUserId: "",
			/** 资产使用者部门Id */
			assetUseDepartmentId: "",
			/** 资产使用年限 */
			assetUseYears: "",
			/** 原值 */
			originalAmount: "",
			/** 累计折旧金额 */
			depreciationAmount: "",
			/** 净值 */
			netAmount: "",
			/** 处置方式 1:出售 2：出租 3：外借 4：报废 5：其他 */
			disposalType: "",
			/** 处置原因 */
			disposalReason: "",
			/** 处置方案 */
			disposalPlan: "",
			fileList: [] as UploadFileList
		};

		options_asset_type = [
			{
				value: "1",
				label: "办公用品"
			},
			{
				value: "2",
				label: "日常用品"
			},
			{
				value: "3",
				label: "IT设备（键盘、鼠标、显卡、硬盘、显示器等）"
			},
			{
				value: "4",
				label: "办公电脑、笔记本电脑"
			},
			{
				value: "5",
				label: "测试服务器、渲染服务器"
			},
			{
				value: "6",
				label: "测试手机"
			},
			{
				value: "7",
				label: "电子产品（平板等）"
			},
			{
				value: "8",
				label: "外包服务"
			},
			{
				value: "9",
				label: "装修工程"
			},
			{
				value: "10",
				label: "其他"
			}
		];

		options_disposal_type = [
			{
				label: "出售",
				value: "1"
			},
			{
				label: "出租",
				value: "2"
			},
			{
				label: "外借",
				value: "3"
			},
			{
				label: "报废",
				value: "4"
			},
			{
				label: "其他",
				value: "5"
			}
		];

		changed_asset_userId(val) {
			this.model.assetUserId = val;
		}

		changed_assetUseDepartmentId(val) {
			this.model.assetUseDepartmentId = val;
		}
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
						const val = this.model[key].trim ? this.model[key].trim() : this.model[key];
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
		// xzry(userInfo) {
		//   let userid = userInfo.userid;
		//   let name = userInfo.name;
		//   let index = this.nextApproverId.indexOf(userid);
		//   if (index === -1) {
		//     this.nextApproverId.push(userid);
		//     this.nextApproverName.push(name);
		//   } else {
		//     this.nextApproverId.splice(index, 1);
		//     this.nextApproverName.splice(index, 1);
		//   }
		// }
		changeNextManager(name) {
			this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
		}
	}
</script>

<style lang="scss">
	// .card {
	// }
</style>

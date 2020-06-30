<template>
	<div class="purchase approve_desc_page">
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
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.applicationDate }}</el-col>
			</el-row>
			<el-row type="flex">
				<!-- 公司名称 -->
				<el-col class="label">
					*公司名称：
				</el-col>
				<el-col class="value">
					{{ ["逍遥盛世", "昊立信"][approval_application_detail_info.applicationDetailInfo.companyId * 1] }}
				</el-col>
				<!-- 需求项目 -->
				<el-col class="label">
					*需求项目：
				</el-col>
				<el-col class="value">
					{{ ["其他", "公共项目"][approval_application_detail_info.applicationDetailInfo.projectType * 1] }}
				</el-col>
			</el-row>

			<el-row type="flex" style="flex-direction: column">
				<el-col class="item-container" v-for="(item, index) in JSON.parse(this.approval_application_detail_info.applicationDetailInfo.purchaseList)" :key="`num_${index}`">
					<el-row type="flex" class="full">
						<div class="item">
							<el-col style="width: 45px">
								序号：
							</el-col>
							<el-col class="value fixed">
								{{ index + 1 }}
							</el-col>
						</div>
						<div class="item">
							<el-col class="label">
								*型号/配置：
							</el-col>
							<el-col class="value full">
								{{ item.itemConfiguration }}
							</el-col>
						</div>
						<div class="item">
							<el-col class="label">
								*采购类型：
							</el-col>
							<el-col class="value">
								{{ purchaseTypeOptions[item.itemType].label }}
							</el-col>
						</div>
					</el-row>

					<el-row type="flex">
						<div class="item">
							<el-col class="label">
								*需求数量：
							</el-col>
							<el-col class="value" style="width: 72px">
								{{ item.requiredQuantity }}
							</el-col>
						</div>

						<div class="item">
							<el-col class="label">
								*预算单价：
							</el-col>
							<el-col class="value" style="width: 84px">
								{{ item.budgetUnitPrice }}
							</el-col>
						</div>

						<div class="item">
							<el-col class="label">
								*预算总额：
							</el-col>
							<el-col class="value" style="width: 84px">
								{{ item.totalBudget }}
							</el-col>
						</div>

						<div class="item">
							<el-col class="label">
								*计划到货日期：
							</el-col>
							<el-col class="value">
								{{ item.arrivalDate }}
							</el-col>
						</div>
					</el-row>

					<el-row type="flex">
						<div class="item full">
							<el-col class="label">
								*采购目的：
							</el-col>
							<el-col class="value full">
								{{ item.purchasePurpose }}
							</el-col>
						</div>
					</el-row>
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
						部门：
					</el-col>
					<el-col class="value fixed">
						{{ $store.state.oa.userDepartment[0].name }}
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
						*公司名称：
					</el-col>
					<el-col class="value">
						<el-select :size="input_size" v-model="model.companyId" v-required="model.companyId">
							<el-option value="0" label="逍遥盛世" />
							<el-option value="1" label="昊立信" />
						</el-select>
					</el-col>
				</div>

				<div class="item">
					<el-col class="label">
						*需求项目：
					</el-col>
					<el-col class="value">
						<el-select :size="input_size" v-model="model.projectType" v-required="model.projectType">
							<el-option value="0" label="其他" />
							<el-option value="1" label="公共项目" />
						</el-select>
					</el-col>
				</div>
			</el-row>

			<el-row type="flex">
				<el-col class="label">
					采购物品信息
				</el-col>
			</el-row>

			<el-row type="flex" style="flex-direction: column">
				<el-col class="item-container" v-for="(item, index) in model.purchaseList" :key="`num_${index}`">
					<div class="icon" @click="renderItem.call(this, index)">
						<i :class="index ? 'el-icon-minus' : 'el-icon-plus'"></i>
					</div>

					<el-row type="flex" class="full">
						<div class="item">
							<el-col style="width: 45px">
								序号：
							</el-col>
							<el-col class="value fixed">
								{{ index + 1 }}
							</el-col>
						</div>

						<div class="item">
							<el-col class="label">
								*采购类型：
							</el-col>
							<el-col class="value">
								<el-select :size="input_size" v-model="model.purchaseList[index].itemType" v-required="model.purchaseList[index].itemType">
									<el-option v-for="item in purchaseTypeOptions" :value="item.value" :label="item.label" :key="item.label" />
								</el-select>
							</el-col>
						</div>

						<div class="item" style="width: 100%; flex-shrink: 8;">
							<el-col class="label">
								*型号/配置：
							</el-col>
							<el-col class="value full">
								<el-input :size="input_size" v-model="model.purchaseList[index].itemConfiguration" v-required="model.purchaseList[index].itemConfiguration" />
							</el-col>
						</div>
					</el-row>

					<el-row type="flex">
						<div class="item">
							<el-col class="label">
								*需求数量：
							</el-col>
							<el-col class="value" style="width: 72px">
								<el-input :size="input_size" v-model="model.purchaseList[index].requiredQuantity" v-required="model.purchaseList[index].requiredQuantity" type="number" />
							</el-col>
						</div>

						<div class="item">
							<el-col class="label">
								*预算单价：
							</el-col>
							<el-col class="value" style="width: 84px">
								<el-input :size="input_size" v-model="model.purchaseList[index].budgetUnitPrice" v-required="model.purchaseList[index].budgetUnitPrice" type="number" />
							</el-col>
						</div>

						<div class="item">
							<el-col class="label">
								*预算总额：
							</el-col>
							<el-col class="value" style="width: 84px">
								{{ model.purchaseList[index].budgetUnitPrice * model.purchaseList[index].requiredQuantity }}
								<!-- <el-input hidden :size="input_size" v-model="model.purchaseList[index].totalBudget" v-required="model.purchaseList[index].totalBudget" type="number" /> -->
							</el-col>
						</div>

						<div class="item">
							<el-col class="label">
								*计划到货日期：
							</el-col>
							<el-col class="value">
								<el-date-picker class="date_picker" type="date" style="width: 156px;" :size="input_size" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="model.purchaseList[index].arrivalDate" v-required="model.purchaseList[index].arrivalDate" />
							</el-col>
						</div>
					</el-row>

					<el-row type="flex">
						<div class="item full">
							<el-col class="label">
								*采购目的：
							</el-col>
							<el-col class="value full">
								<el-input type="textarea" :size="input_size" v-model="model.purchaseList[index].purchasePurpose" v-required="model.purchaseList[index].purchasePurpose" />
							</el-col>
						</div>
					</el-row>
				</el-col>
			</el-row>

			<el-row>
				<el-button class="full" v-required="submit">提交</el-button>
			</el-row>
		</div>
	</div>
</template>
 
<script lang="ts">
	import { Component, Prop, Vue, Watch } from "vue-property-decorator";
	import moment from "moment";
	import { OA, UploadFileList } from "types";
	import { Gender, DemandCause } from "../config";
	import axios from "axios";
	import { Vuex } from "../../../../../types/vuex";
	import { Detail } from "./_works.vue";

	@Component<Purchase>({
		async created() {
			this.createItem();
		},
		computed: {
			purchaseTypeOptions() {
				return [
					{ value: "0", label: "办公用品" },
					{ value: "1", label: "日常用品" },
					{ value: "2", label: "IT设备（键盘、鼠标、显卡、硬盘、显示器等）" },
					{ value: "3", label: "办公电脑、笔记本电脑" },
					{ value: "4", label: "测试服务器、渲染服务器" },
					{ value: "5", label: "测试手机" },
					{ value: "6", label: "电子产品（平板等）" },
					{ value: "7", label: "外包服务" },
					{ value: "8", label: "装修工程" },
					{ value: "9", label: "其他" }
				];
			},
			user_position() {
				return this.$state.member_info.position;
			},
			genderOptions() {
				return Object.keys(Gender).map(function(key) {
					return {
						key,
						val: Gender[key]
					};
				});
			},
			innerOptions() {
				return Object.keys(DemandCause.inner).map(function(key) {
					return {
						key,
						val: DemandCause.inner[key]
					};
				});
			},
			outerOptions() {
				return Object.keys(DemandCause.outer).map(function(key) {
					return {
						key,
						val: DemandCause.outer[key]
					};
				});
			}
		},
		components: {}
	})
	export default class Purchase extends Vue {
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
		get leave_type_map() {
			return this.$getter.leave_type_map;
		}
		get userId() {
			return localStorage.UserId;
		}
		get base() {
			return (this.approval_detail_info.approvalDetailInfo.find(item => item.approvalResult === 3) as Vuex.OA.Interface.APPOVAL_DETAIL_INFO) || ({} as any);
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
		changeNextManager(el) {
			if (el.target.classList.contains("el-icon-circle-close")) {
				let name = el.target.getAttribute("name");
				this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
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
		public userInfo = this.$state.member_info;

		createItem() {
			const purchaseList = {
				/** 采购类型 0=办公用品 1=日常用品 2=IT设备（键盘、鼠标、显卡、硬盘、显示器等） 3=办公电脑、笔记本电脑 4=测试服务器、渲染服务器 5=测试手机 6=电子产品（平板等） 7=外包服务 8=装修工程 9=其他 */
				itemType: "",
				/** 型号/配置 */
				itemConfiguration: "",
				/** 需求数量 */
				requiredQuantity: "",
				/** 预算单价 */
				budgetUnitPrice: "",
				/** 预算总额 */
				totalBudget: "",
				/** 计划到货日期 */
				arrivalDate: "",
				/** 采购目的 */
				purchasePurpose: ""
			};
			this.model.purchaseList.push(purchaseList);
		}
		model = {
			/** 申请类型 */
			applicationType: "8",
			/** 申请人	 */
			userId: localStorage.UserId,
			/** 需求部门Id */
			departmentId: this.userInfo.department[0] + "",
			/** 申请日期	 */
			applicationDate: moment().format("YYYY-MM-DD"),
			/** 公司id 0=逍遥盛世，1=昊立信 */
			companyId: "",
			projectType: "",
			purchaseList: [] as any
		};

		submit() {
			let form_data = {};
			for (let key in this.model) {
				switch (key) {
					case "purchaseList":
						this.model[key].forEach((item, index, array) => {
							array[index].budgetUnitPrice *= 1;
							array[index].totalBudget = 	array[index].budgetUnitPrice  *  array[index].requiredQuantity ;
						});
						form_data[key] = JSON.stringify(this.model[key]);
						break;
					default:
						form_data[key] = this.model[key].trim();
						break;
				}
			}
			this.$dispatch.approval_application(form_data as any).then(res => {
				if (res.code === 200) {
					this.$emit("success", 0);
				}
			});
		}

		renderItem(index) {
			if (index) {
				this.model.purchaseList.splice(index, 1);
			} else {
				this.createItem();
			}
		}
	}
</script>

<style lang="scss">
	.purchase {
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
		.item-container {
			width: 100% !important;
			position: relative;
			border: 1px dashed #409eff;
			padding: 22px 14px 12px 10px !important;
			margin: 2px 0 15px 0 !important;
			margin-left: 0 !important;
			overflow: hidden;
			.icon {
				$width: 70px;
				z-index: 10;
				cursor: pointer;
				position: absolute;
				right: $width * -0.5;
				top: $width * -0.6;
				height: $width;
				width: $width * 1.5;
				background: #409eff;
				transform: rotate(40deg);
				color: #fff;
				i {
					font-weight: 700;
					font-size: 18px;
					position: absolute;
					transform: rotate(-40deg) translate(17px, 74px);
				}
			}
		}
	}
</style>

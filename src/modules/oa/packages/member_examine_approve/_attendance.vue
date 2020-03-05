<template>
	<div class="attendance approve_desc_page">
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
			<!-- 表格 -->
			<el-row type="flex">
				<el-col class="value">
					<el-table header-cell-class-name="theadcenter" border :data="dataTable" style="margin-top:16px">
						<el-table-column prop="checkInDate" label="日期" width="146"> </el-table-column>
						<el-table-column prop="checkInType" label="类别" width="124">
							<template slot slot-scope="scope">
								{{ ["", "忘记打卡", "外出办事"][scope.row.checkInType] }}
							</template>
						</el-table-column>
						<el-table-column prop="timeSlot" label="时段" width="114">
							<template slot slot-scope="scope">
								{{ ["", "上班 ", "下班", "全天"][scope.row.timeSlot] }}
							</template>
						</el-table-column>
						<el-table-column prop="reason" label="说明" width="245">
							<template slot slot-scope="scope">
								{{ scope.row.reason || "无" }}
							</template>
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
			<!-- confirm -->
			<el-row v-if="base.userId === $state.member_info.userid" type="flex" style="padding:0 24px 0 12px;margin: 25px 0 0 0;">
				<el-button :size="input_size" class="full" @click="confirm.call(this, 2)">否决</el-button>
				<el-button :size="input_size" class="full" v-required="confirm">同意</el-button>
			</el-row>
		</div>
		<div v-else>
			<div style="margin: 0 0 10px 10px">
				<div>您上月({{ model.startTime1 }}~{{ model.endTime1 }})已补签上班卡{{ model.checkInRecord1.onInfoSize }}次，下班卡{{ model.checkInRecord1.offInfoSize }}次</div>
				<div>您本月({{ model.startTime2 }}~{{ model.endTime2 }})已补签上班卡{{ model.checkInRecord2.onInfoSize }}次，下班卡{{ model.checkInRecord2.offInfoSize }}次</div>
				<div>备注</div>
				<div v-html="beizhu"></div>
			</div>

			<!-- 日期 -->
			<el-row type="flex">
				<el-col class="label">日期：</el-col>
				<el-col class="value fixed">{{ model.checkInDate }}</el-col>
			</el-row>
			<div v-if="(noSignInquerys && noSignInquerys.length > 0) || (noSignInquerysLast && noSignInquerysLast.length > 0)">
				<div v-if="noSignInquerysLast && noSignInquerysLast.length > 0">
					<p style="margin-bottom:10px;">您上月的未补签的记录：</p>
					<p style="font-weight:bold;color:red;text-indent:1em;" v-for="(item, index) in noSignInquerysLast">{{ `${index + 1}.  ${item.userId} -- ${item.checkInDate} -- ` }}{{ item.checkInReason | checkInReason }}</p>
				</div>
				<div v-if="noSignInquerys && noSignInquerys.length > 0">
					<p style="margin-bottom:10px;">您本月的未补签的记录：</p>
					<p style="font-weight:bold;color:red;text-indent:1em;" v-for="(item, index) in noSignInquerys">{{ `${index + 1}.  ${item.userId} -- ${item.checkInDate} -- ` }}{{ item.checkInReason | checkInReason }}</p>
				</div>
			</div>
			<div v-else>您本月不需要补签</div>

			<el-row type="flex">
				<el-col class="label">签卡人：</el-col>
				<el-col class="value fixed">{{ user.userid }}</el-col>
				<i class="el-icon-circle-plus" style="margin: 8px 0 0 490px;font-size:30px;color:#a6c5f6" @click="add"></i>
			</el-row>

			<el-table header-cell-class-name="theadcenter" border :data="model.table" style="width: 730px;">
				<el-table-column prop="date" label="日期" width="146">
					<template slot slot-scope="{ row, colunm, $index }">
						<el-date-picker v-model="model.table[$index].date" align="right" type="date" placeholder="选择日期" :size="input_size" class="date" format="yyyy-MM-dd" @change="change"> </el-date-picker>
					</template>
				</el-table-column>
				<el-table-column prop="userId" label="类别" width="124">
					<template slot slot-scope="{ row, colunm, $index }">
						<el-select :size="input_size" v-model="model.table[$index].type" placeholder="请选择">
							<el-option v-for="item in model.type" :key="item.value" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="userId" label="时段" width="114">
					<template slot slot-scope="{ row, colunm, $index }">
						<el-select :size="input_size" v-model="model.table[$index].timeBucket" placeholder="请选择">
							<el-option v-for="item in model.timeBucket" :key="item.value" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="userId" label="说明" width="245">
					<template slot slot-scope="{ row, colunm, $index }">
						<el-input v-model="model.table[$index].state" type="textarea" autosize></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="userId" label="操作" width="100">
					<template slot slot-scope="{ row, colunm, $index }">
						<el-button :size="input_size" @click="del.call(this, $index)" :disabled="model.table.length === 1">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-row type="flex" justify="center">
				<el-button :size="input_size" class="submit" @click="submit">
					提交
				</el-button>
			</el-row>
		</div>
	</div>
</template>
 
<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import { getDateByFormat } from "src/service/date";
	import moment from "moment";
	import { Detail } from "src/modules/oa/packages/member_examine_approve/_works.vue";
	import { Vuex } from "../../../../../types/vuex";

	@Component<Attendance>({
		async created() {
			if (!this.detail) {
				let date = new Date();
				let curDate = date.getDate();
				let curYear = date.getFullYear();
				let curMonth = date.getMonth() + 1;
				let startTime1, endTime1, startTime2, endTime2;
				if (curDate > 24) {
					startTime1 = moment(new Date([curYear, curMonth, 25].join("-")))
						.add(-1, "month")
						.format("YYYY-MM-DD");
					endTime1 = moment(new Date([curYear, curMonth, 24].join("-"))).format("YYYY-MM-DD");
					startTime2 = moment(new Date([curYear, curMonth, 25].join("-"))).format("YYYY-MM-DD");
					endTime2 = moment(new Date([curYear, curMonth, 24].join("-")))
						.add(1, "month")
						.format("YYYY-MM-DD");
				} else {
					startTime1 = moment(new Date([curYear, curMonth, 25].join("-")))
						.add(-2, "month")
						.format("YYYY-MM-DD");
					endTime1 = moment(new Date([curYear, curMonth, 24].join("-")))
						.add(-1, "month")
						.format("YYYY-MM-DD");
					startTime2 = moment(new Date([curYear, curMonth, 25].join("-")))
						.add(-1, "month")
						.format("YYYY-MM-DD");
					endTime2 = moment(new Date([curYear, curMonth, 24].join("-"))).format("YYYY-MM-DD");
				}
				this.$store
					.dispatch("oa/approvalCheckInRecord", {
						startTime: startTime1,
						endTime: endTime1,
						userId: localStorage.UserId
					})
					.then(res => {
						this.model.startTime1 = startTime1;
						this.model.endTime1 = endTime1;
						this.model.checkInRecord1 = res.data;
					});
				setTimeout(() => {
					this.$store
						.dispatch("oa/approvalCheckInRecord", {
							startTime: startTime2,
							endTime: endTime2,
							userId: localStorage.UserId
						})
						.then(res => {
							this.model.startTime2 = startTime2;
							this.model.endTime2 = endTime2;
							this.model.checkInRecord2 = res.data;
							this.getNoSignInquery();
						});
				}, 1);
			}
		},
		filters: {
			checkInReason: function(value) {
				if (!value) return "";
				if (value == 1) return "迟到";
				if (value == 2) return "下班未打卡";
				if (value == 3) return "旷工";
				return value;
			}
		}
	})
	export default class Attendance extends Vue {
		input_size = "small";
		jiabie: any = [];
		model = {
			checkInDate: getDateByFormat("yyyy-MM-dd"),
			startTime1: "",
			startTime2: "",
			checkInRecord1: "",
			endTime1: "",
			endTime2: "",
			checkInRecord2: "",
			table: [
				{
					date: "",
					type: "",
					timeBucket: "",
					state: ""
				}
			],
			type: [
				{
					label: "忘记打卡",
					value: 1
				},
				{
					label: "外出办事",
					value: 2
				}
			],
			timeBucket: [
				{
					label: "上班",
					value: 1
				},
				{
					label: "下班",
					value: 2
				},
				{
					label: "全天",
					value: 3
				}
			]
		};
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

		get dataTable() {
			let dataTable = this.approval_application_detail_info.applicationDetailInfo.checkInDate.split(",").map((item, index) => {
				return {
					checkInDate: item,
					checkInType: this.approval_application_detail_info.applicationDetailInfo.checkInType.split(",")[index],
					reason: (this.approval_application_detail_info.applicationDetailInfo.reason || "").split("|")[index],
					timeSlot: this.approval_application_detail_info.applicationDetailInfo.timeSlot.split(",")[index]
				};
			});
			return dataTable;
		}

		beizhu = "1、此单用于未打卡情况的补充签到；<br/>2、因忘记而未打卡的成员，每人每月可补签7次（含2次上班卡5次下班），须注明未打卡原因；<br/>3、因外出办事而未打卡的成员，不限补签次数，不影响出勤，须注明外出办事地点、外出办事事由；<br/>4、纸质签卡单仅限于指纹无法打卡并且经由人力资源部确认的成员使用，且签卡需在每日9:30前完成，其余成员签卡无效；<br/>5、因设备问题无法打卡的成员请及时联系余晓珊同学；<br/>6、未打卡且不履行签卡义务的成员，按旷工处理。";

		submit() {
			let checkInType: any = [],
				timeSlot: any = [],
				reason: any = [],
				checkInDate: any = [];
			this.model.table.forEach((item: any) => {
				checkInType.push(item.type);
				timeSlot.push(item.timeBucket);
				reason.push(item.state);
				checkInDate.push(getDateByFormat("yyyy-MM-dd", item.date));
			});
			let form_data = {
				applicationType: 1,
				userId: localStorage.UserId,
				departmentId: this.user.department.join(","),
				checkInDate: checkInDate.join(","),
				checkInType: checkInType.join(","),
				timeSlot: timeSlot.join(","),
				reason: reason.join("|")
			};
			this.$dispatch.approval_application(form_data as any).then(res => {
				this.$emit("success", 0);
			});
		}
		add() {
			this.model.table.push({
				date: "",
				type: "",
				timeBucket: "",
				state: ""
			});
		}
		del(index) {
			this.model.table.splice(index, 1);
		}
		change(date: Date) {
			if (date) {
				let count = 0;
				let timestamp = date.getTime();
				this.model.table.forEach((item, index) => {
					timestamp === (!this.model.table[index].date ? this.model.table[index].date : this.model.table[index].date["getTime"]()) && count++;
					if (count > 1) {
						this.model.table[index].date = "";
					}
				});
			}
		}
		noSignInquerysLast = [];
		noSignInquerys = [];
		async getNoSignInquery() {
			this.$store
				.dispatch("oa/attendanceNoSignInquery", {
					userId: this.userId,
					// userId: 'kk',
					startTime: this.model.startTime1,
					endTime: this.model.endTime1
				})
				.then(res => {
					if (res.code === 200) {
						this.noSignInquerysLast = res.data.recordInfoList;
					}
				});
			setTimeout(() => {
				this.$store
					.dispatch("oa/attendanceNoSignInquery", {
						startTime: this.model.startTime2,
						endTime: this.model.endTime2,
						userId: localStorage.UserId
					})
					.then(res => {
						this.noSignInquerys = res.data.recordInfoList;
					});
			}, 1);
		}
	}
</script>

<style lang="scss">
	.attendance {
		width: 1000px;
		.date {
			width: 125px;
		}
		.flex {
			margin: 15px 0 -5px 0;
			display: flex;
			align-items: center;
			.l {
				width: 78px;
			}
		}
		.cell {
			padding: 0 6px !important;
			display: flex;
			justify-content: center;
		}
		.el-icon-circle-plus {
			font-size: 26px;
			cursor: pointer;
			margin: 0 10px 10px 0;
			color: #4e8cee;
			&:hover {
				color: #a6c5f6;
			}
		}
		.submit {
			margin: 20px 0 0 -274px;
		}
		.theadcenter {
			text-align: center;
		}
	}
</style>

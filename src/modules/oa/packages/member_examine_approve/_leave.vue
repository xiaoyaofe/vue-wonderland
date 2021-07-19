<template>
	<div class="leave approve_desc_page">
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
			<!-- 假别 -->
			<el-row type="flex">
				<el-col class="label">假别：</el-col>
				<el-col class="value fixed" v-if="leave_type_map[approval_application_detail_info.applicationDetailInfo.leaveType]">
					{{ leave_type_map[approval_application_detail_info.applicationDetailInfo.leaveType].leaveName }}
					{{ leave_type_map[approval_application_detail_info.applicationDetailInfo.leaveType].children && ` -> ${leave_type_map[approval_application_detail_info.applicationDetailInfo.leaveType].children[approval_application_detail_info.applicationDetailInfo.childrenType].leaveName}` }}
				</el-col>
			</el-row>
			<!-- 请假时间 -->
			<el-row type="flex">
				<el-col class="label">请假时间：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.startTime }} 至 {{ approval_application_detail_info.applicationDetailInfo.endTime }}</el-col>
			</el-row>
			<!-- 请假时长 -->
			<el-row type="flex">
				<el-col class="label">请假时长：</el-col>
				<el-col class="value fixed">{{ timeStr }}</el-col>
			</el-row>
			<!-- 请假事由 -->
			<el-row type="flex">
				<el-col class="label">请假事由：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.reason || "无" }}</el-col>
			</el-row>
			<!-- 交接事项 -->
			<el-row type="flex">
				<el-col class="label">交接事项：</el-col>
				<el-col class="value fixed">{{ approval_application_detail_info.applicationDetailInfo.handover || "无" }}</el-col>
			</el-row>
			<el-row type="flex" v-if="approval_application_detail_info.applicationDetailInfo.annexPath">
				<img :src="require(`src/assets/oa/icon-folder-blue.png`)" style="padding: 0 10px 0 12px" />
				<el-col class="label">
					<a :href="$base + '/file/download?filePath=' + approval_application_detail_info.applicationDetailInfo.annexPath" target="_blank">附件查看</a>
				</el-col>
			</el-row>

			<!-- confirm -->
			<el-row v-if="base.userId === $state.member_info.userid" type="flex" style="padding: 0 24px 0 12px; margin: 25px 0 0 0">
				<el-button :size="input_size" class="full" @click="confirm.call(this, 2)">否决</el-button>
				<el-button :size="input_size" class="full" v-required="confirm">同意</el-button>
			</el-row>
		</div>
		<div v-else>
			<!-- 日期 -->
			<el-row type="flex">
				<el-col class="label">日期：</el-col>
				<el-col class="value fixed">{{ model.applicationDate }}</el-col>
			</el-row>
			<!-- 假别 -->
			<el-row type="flex">
				<el-col class="label">假别：</el-col>
				<el-col class="value">
					<el-select :size="input_size" v-model="model.leaveType" v-required="model.leaveType">
						<el-option v-for="(item, id) in leave_type_map" :key="id" :label="item.leaveName" :value="id" />
					</el-select>
					<el-select v-if="model.leaveType && leave_type_map[model.leaveType].children" :size="input_size" v-model="model.childrenType" v-required="model.childrenType" style="margin-left: 15px">
						<el-option v-for="(item, id) in leave_type_map[model.leaveType].children" :key="id" :label="item.leaveName" :value="id" />
					</el-select>
				</el-col>
			</el-row>
			<el-row type="flex" class="type_desc">
				<span v-if="model.leaveType == 1">
					<div v-if="$state.member_info.availableLeaveInLieu">
						<div style="margin-top: 5px">可用 {{ $hourCalculate($state.member_info.availableLeaveInLieu) }}</div>
					</div>
					<div v-else>可用 0 天</div>
				</span>
				<span v-if="model.leaveType == 2">
					<div v-if="$state.member_info.leaveInfo[leave_type_map[model.leaveType].field]">
						<div v-for="(v, k) in $state.member_info.leaveInfoList" :key="k">
							<div style="margin-top: 5px">可用 {{ $hourCalculate(v[leave_type_map[model.leaveType].field]) }}，到期时间 {{ v.endTime }}</div>
						</div>
					</div>
					<div v-else>可用 0 天</div>
				</span>
				<span v-if="model.leaveType == 4"> 备注： 请休病假需提供区级以上医院的有效医疗处方证明或开具的病假证明至人事行政部备案。身体是革命的本钱，请照顾好自己哦~ </span>
				<span v-else-if="model.leaveType == 5">
					假期时长限制：最多3天（含公休日）<br />
					备注：婚假属于自然日类别假期，需在正式注册登记日起一年内一次性休完，同时成员在提出休假申请时需要提供结婚证明至人事行政部备案。恭喜您与心爱的另一半喜结良缘，祝愿白头偕老、举案齐眉。
				</span>
				<span v-else-if="model.leaveType == 6">
					假期时长限制：最多15天（含公休日、节假日）<br />
					备注：护理假属于自然日类别假期，休假完成后请提交宝贝的出生证明至人事行政部备案。恭喜您荣升为一名父亲，护理假需在宝贝出生的一年以内一次性休完哦~
				</span>
				<span v-else-if="model.leaveType == 7">
					假期时长限制：可用178天（含公休日）<br />
					备注：如难产或者生育多胞胎的，请联系人事行政部为您增加假期。<br />
					产假属于自然日类别假期，休假完成后请提交医疗部门开具的相关医学证明（如宝宝的出生证明）至人事行政部备案。恭喜您即将收获属于您的那份快乐，请休养好身体，祝愿宝宝健康快乐成长。
				</span>
				<span v-else-if="model.leaveType == 8">
					假期时长限制：最多3天（含公休日）<br />
					备注：成员直系亲属（包括父母、岳父母、配偶、子女、祖父母、外祖父母）去世，享有全薪丧假3天（含公休日），丧假属于自然日类别假期。获悉您家中有至亲离世，我们深感沉痛，请您和您的家人节哀，亲人离世一个月内，丧假需一次性请休。
				</span>
				<span v-else-if="model.leaveType == 9">
					假期时长限制：<br />
					①绝育：最多3天<br />
					②节育：最多3天<br />
					③普通流产：最多12天<br />
					④怀孕不满4个月流产：最多15天<br />
					⑤怀孕满4个月流产：最多42天<br />
					备注：成员本人按计划生育规定做绝育及节育手术的可享受3天带薪假期；已婚女成员可以享受一次为期12天的带薪人工流产假，第二次及以后的流产假按病假处理；怀孕不满四个月流产休假时间为15天；怀孕满四个月流产休假时间为42天。<br />
					计划生育假属于自然日类别假期，休假完成后请提交医疗部门开具的相关休假证明至人事行政部备案。
				</span>
				<span v-else-if="model.leaveType == 10">
					假期时长限制：最多0.5天（小于或等于4.5小时算0.5天）<br />
					备注：女员工怀孕期间，可按医疗部门的建议按期进行孕期检查，享受每月1次往返时间不超0.5天的检查假。恭喜您荣升为母亲，在怀孕期间是每个女人一辈子最幸福的时刻，请您照顾好自己和您肚子里的小宝宝。
				</span>
			</el-row>
			<!-- 请假时间 -->
			<el-row type="flex">
				<el-col class="label">请假时间：</el-col>
				<el-col class="value">
					<el-row type="flex" align="middle" class="from-end">
						<el-date-picker :size="input_size" v-model="start" v-required="start" placeholder="选择日期" @change="startDatePickerChange" style="width: 145px"> </el-date-picker>
						<el-select v-if="start && model.leaveType" v-model="period1" v-required="period1" :size="input_size" @change="period1Change" style="width: 105px; margin-left: 10px" ref="period1">
							<el-option v-for="item in period" :key="item.label" :label="item.label" :value="item.value"> </el-option>
						</el-select>
						<div style="text-align: center; width: 36px">至</div>
						<el-date-picker :size="input_size" v-model="end" v-required="end" placeholder="选择日期" @change="endDatePickerChange" style="width: 145px"> </el-date-picker>
						<el-select v-if="end && model.leaveType" v-model="period2" v-required="period2" :size="input_size" @change="period2Change" style="width: 105px; margin-left: 10px" ref="period2">
							<el-option v-for="item in period" :key="item.label" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</el-row>

					<!-- <el-row class="sumsize"> 总计：&nbsp;{{ days }}&nbsp;天&nbsp;{{ mhours }}&nbsp;小时 </el-row> -->
				</el-col>
				<el-col v-show="leaveDaysNumberStr != ''" :span="6">{{ "共计：" + leaveDaysNumberStr }}</el-col>
			</el-row>
			<!-- 请假事由 -->
			<el-row type="flex">
				<el-col class="label">请假事由：</el-col>
				<el-col class="value full">
					<el-input ref="reason" type="textarea" autosize v-model="model.reason" v-required="model.reason"></el-input>
				</el-col>
			</el-row>
			<!-- 交接事项 -->
			<el-row type="flex">
				<el-col class="label">交接事项：</el-col>
				<el-col class="value full">
					<el-input ref="handover" type="textarea" autosize v-model="model.handover" v-required="model.handover"></el-input>
				</el-col>
			</el-row>

			<el-row type="flex" v-if="model.leaveType == 4" style="margin: 8px 0 0 0">
				<el-col>
					<el-upload ref="upload" class="upload-box" action drag multiple :auto-upload="false" :before-upload="() => false" :on-change="on_file_changed">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
				</el-col>
			</el-row>
			<!-- 提交 -->
			<el-row type="flex" style="padding: 0 24px 0 12px">
				<el-button class="full submit" :size="input_size" v-required="submit">提交</el-button>
			</el-row>
		</div>
	</div>
</template>
 
<script lang="ts">
	import { Component, Prop, Vue, Watch } from "vue-property-decorator";
	import { getDateByFormat, getHoursByFormat } from "src/service/date";
	import { OA, UploadFileList } from "types";
	import { Vuex } from "types/vuex";
	import { Detail } from "src/modules/oa/packages/member_examine_approve/_works.vue";
	import moment from "moment";

	@Component
	export default class Leave extends Vue {
		input_size = "small";
		@Prop() detail!: Detail;
		approval_application_detail_info: Vuex.OA.Response.approval_application_detail_info = this.detail && this.detail.approval_application_detail_info;
		approval_detail_info: Vuex.OA.Response.approval_detail_info = this.detail && this.detail.approval_detail_info;
		get user_all() {
			return this.$state.user_all;
		}
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
			return (this.approval_detail_info.approvalDetailInfo.find((item) => item.approvalResult === 3) as Vuex.OA.Interface.APPOVAL_DETAIL_INFO) || ({} as any);
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
						s: d,
					},
				],
				...this.approval_detail_info.approvalDetailInfo.map(({ order, userId, approvalResult }) => {
					const r = {
						label: `${userId}(${m[approvalResult - 1]})`,
						s: f[order] ? "," : d,
					};
					f[order] = true;
					return r;
				}),
			].forEach((item, index, array) => {
				const n = array[index + 1];
				s += item.label + (n ? n.s : "");
			});
			return s;
		}
		get nextManager() {
			return (this.base && this.base.nextApproverId) || "无";
		}
		get leaveDaysNumberStr() {
			if (!this.model.startTime || !this.model.endTime || !this.period1 || !this.period2) return "";
			if (this.model.leaveType != "7" && this.model.leaveType != "16") return "";
			const startTimeDaysAndTimes = this.model.startTime.split(" ");
			const endTimeDaysAndTimes = this.model.endTime.split(" ");
			const dateStart = new Date(startTimeDaysAndTimes[0]).getTime();
			const dateEnd = new Date(endTimeDaysAndTimes[0]).getTime();

			const difValue = (dateEnd - dateStart) / (1000 * 60 * 60 * 24) - 1;
			const startHoursArr = startTimeDaysAndTimes[1].split(":");
			const endHoursArr = endTimeDaysAndTimes[1].split(":");
			let startHours = 18.5 - Number(startHoursArr[0]) - 1.5;
			let endHours = Number(endHoursArr[0]) - 9.5;
			if (+startHoursArr[0] > 12) {
				startHours += 1.5;
			}
			if (+startHoursArr[1] == 30) {
				startHours -= 0.5;
			}
			if (+endHoursArr[0] > 12) {
				endHours -= 1.5;
			}
			if (+endHoursArr[1] == 30) {
				endHours += 0.5;
			}
			const hours = (startHours + endHours) % 7.5;
			const days = difValue + Math.floor((startHours + endHours) / 7.5);
			return ` ${days} 天 ${hours} 小时`;
		}
		changeNextManager(el) {
			if (el.target.classList.contains("el-icon-circle-close")) {
				let name = el.target.getAttribute("name");
				this.nextApproverId.splice(this.nextApproverId.indexOf(name), 1);
			}
		}
		confirm(approvalResult) {
			var data = Object.assign({}, this.base, { approvalResult });
			this.$dispatch.approval_confirm(data).then((data) => {
				if (data.code === 200) {
					this.$emit("success", 0);
					this.$notify.success("操作完成");
					this.$dispatch.approval_wait_info({
						UserId: localStorage.UserId,
					});
					this.$dispatch.approval_completed_info({
						UserId: localStorage.UserId,
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

		get period() {
			let arr: any = [];
			for (let i = 9; i <= 18; i++) {
				if (i === 13) continue;
				if ((Number(this.model.leaveType) === 1 || Number(this.model.leaveType) === 2) && i >= 10 && i <= 12) continue;
				arr.push({
					label: i + ":00",
					value: i,
				});
				arr.push({
					label: i + ":30",
					value: i + 0.5,
				});
			}
			arr.shift();
			return arr;
		}
		public userInfo: Vuex.OA.Response.user = this.$state.member_info;

		start = "";
		@Watch("start")
		startChanged(val) {
			this.period1 = "";
		}
		end = "";
		@Watch("end")
		endChanged(val) {
			this.period2 = "";
		}
		days = 0;
		mhours = 0;
		period1 = "";
		@Watch("period1")
		period1Changed(val) {
			const mm = Math.floor(val) + (val % 1 === 0 ? ":00" : ":30") + ":00";
			this.model.startTime = getDateByFormat("yyyy-MM-dd", this.start as any) + " " + mm;
		}
		period2 = "";
		@Watch("period2")
		period2Changed(val) {
			const mm = Math.floor(val) + (val % 1 === 0 ? ":00" : ":30") + ":00";
			this.model.endTime = getDateByFormat("yyyy-MM-dd", this.end as any) + " " + mm;
		}

		model = {
			/** 申请类型 */
			applicationType: "3",
			/** 申请人	 */
			userId: localStorage.UserId,
			/** 申请日期	 */
			applicationDate: moment().format("YYYY-MM-DD"),
			/** 需求部门id */
			departmentId: this.userInfo.department[0] + "",
			/**  */
			leaveType: "",
			/**  */
			childrenType: "",
			/** */
			startTime: "",
			/** */
			endTime: "",
			/** */
			duration: 0,
			reason: "",
			handover: "",
			fileList: [] as UploadFileList,
		};
		hours() {
			let startDay = (this.start as any).getDate();
			let endDay = (this.end as any).getDate();
			if (startDay && endDay) {
				let { days } = getHoursByFormat((this.end as any).getTime() - (this.start as any).getTime());
				let hours;
				let period1: number = this.period1 as any;
				let period2: number = this.period2 as any;
				if (days === 0) {
					// 同一天
					hours = period2 - period1 - (period1 < 13 && period2 > 13 ? 1.5 : 0);
				} else if (days === 1) {
					// 前后2天
					hours = 18.5 - period1 - (period1 < 13 ? 1.5 : 0);
					hours += period2 - 9.5 - (period2 > 13 ? 1.5 : 0);
				} else {
					hours = 18.5 - period1 - (period1 < 13 ? 1.5 : 0);
					hours += period2 - 9.5 - (period2 > 13 ? 1.5 : 0);
					hours += (days - 1) * 7.5;
				}
				this.days = Math.floor(hours / 7.5);
				this.mhours = hours - this.days * 7.5;
				this.model.duration = hours;
			}
		}
		get timeStr() {
			const days = Math.floor(this.approval_application_detail_info.applicationDetailInfo.duration / 7.5);
			const hours = this.approval_application_detail_info.applicationDetailInfo.duration - days * 7.5;
			if (hours === 0) return ` 总计：  ${days}  天`;

			return ` 总计：  ${days}  天  ${hours}  小时`;
		}
		startDatePickerChange(date: Date) {
			if (this.end) {
				if (this.start > this.end) this.start = "";
				if (this.period1 && this.period2) this.hours();
			} else {
				this.days = 0;
				this.mhours = 0;
			}
		}
		period1Change(value) {
			if (this.period2) {
				if (this.end <= this.start) {
					if (this.period1 >= this.period2) {
						this.period1 = "";
					} else {
						this.hours();
					}
				} else {
					this.hours();
				}
			}
		}
		endDatePickerChange(date: Date) {
			if (this.start) {
				if (this.start > this.end) this.end = "";
				if (this.period1 && this.period2) this.hours();
			} else {
				this.days = 0;
				this.mhours = 0;
			}
		}
		period2Change(value) {
			if (this.period1) {
				if (this.end <= this.start) {
					if (this.period1 >= this.period2) {
						this.period2 = "";
					} else {
						this.hours();
					}
				} else {
					this.hours();
				}
			}
		}
		on_file_changed(file, fileList) {
			this.model.fileList = fileList;
		}
		async submit() {
			const leaveType = Number(this.model.leaveType);
			// if (leaveType === 1 && this.$state.member_info.availableLeaveInLieu < this.model.duration) {
			// 	this.$notify.error("假期不足");
			// } else if (leaveType === 2 && this.leave_type_map && this.$state.member_info.leaveInfo[this.leave_type_map[leaveType].field] < this.model.duration) {
			// 	this.$notify.error("假期不足");
			// } else {
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

			this.$dispatch.approval_application(form_data as any).then((res) => {
				if (res.code === 200) {
					this.$emit("success", 0);
				}
			});
		}
		// }
	}
</script>

<style lang="scss">
	.leave.approve_desc_page {
		.type_desc {
			color: red;
			align-items: flex-start !important;
			margin: 0 0 12px 24px;
			min-height: 0 !important;
		}
		.submit {
			margin: 20px 0;
		}
		.el-icon-circle-close {
			cursor: pointer;
			font-size: 15px;
			position: relative;
			top: 1px;
		}
	}
	.xzry {
		line-height: 30px;
		cursor: pointer;
		padding-left: 8px;
		&.active {
			color: #fff;
			background: #4e8cee;
		}
	}
</style>

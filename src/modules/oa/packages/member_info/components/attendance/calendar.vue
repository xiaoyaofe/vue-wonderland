<template>
	<div class="calendar">
		<el-table :data="tabelData" border align="center" size="mini" @cell-click="query">
			<el-table-column v-for="(v, k) in columns" :key="k" :label="v.label" align="center" :class-name="`item${k>=5 ? ' cur' : ''}`">
				<template slot slot-scope="{ row }">
					<div :class="`wrapper${is_today(row[k]) ? ' cur' : ''} ${isBlue(row[k])?' blue':''}`">
						<span>{{ row[k] }}</span>
						<span
							class="special"
							v-for="(item, index) in $state.MemberInfo.attendance.pageRecord[row[k]]"
							:key="index"
							:style="{
								color: ['迟到', '未打卡', '旷工', '下班未打卡'].includes(item) ? 'red' : 'blue'
							}"
						>
							{{ item }}
						</span>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin: 10px 0 50px 0">
			<div style="font-size: 15px; margin: 0 0 0 16px;">
				查询打卡记录(当天数据会有延迟)
			</div>
			<div v-if="punchRecord && punchRecord.length">
				<div style="font-size: 14px; margin: 5px 0 0 16px;">{{ punchRecordDate }}</div>
				<span v-for="(item, index) in punchRecord" :key="index" :class="'punch-record-item' + (index === 0 ? ' first-child' : index === punchRecord.length - 1 ? ' last-child' : '')">
					{{ item.substr(11) }}
				</span>
			</div>
			<div v-else>
				<div style="font-size: 14px; margin: 5px 0 0 16px;">{{ punchRecordDate }}</div>
				<div style="font-size: 14px; margin: 5px 0 0 16px;">没有任何打卡记录</div>
			</div>
		</div>
	</div>
</template>
 
<script lang="ts">
	import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
	import moment from "moment";

	@Component
	export default class AttendanceCalendar extends Vue {
		@Inject() Index;
		get tabelData() {
			if (this.userId) {
				let Day1 = new Date(this.$store.getters["oa/MemberInfoAttendanceData"].StartDate).getDay() || 7;
				this.startDate = this.$store.getters["oa/MemberInfoAttendanceData"].StartDate;
				let TotalDays = this.$store.getters["oa/MemberInfoAttendanceData"].LastDate - 25 + 1 + 24;
				let FirstLineLen = 7 - Day1 + 1;
				let LeftLineLen = TotalDays - FirstLineLen;
				let TotalLine = Math.ceil(LeftLineLen / 7) + 1;
				let tabelData: any = [];
				let add = 0;
				for (let i = 0; i < TotalLine; i++) {
					let arr: any = [];
					if (!i) {
						for (let n = 1; n <= 7; n++) {
							if (n >= Day1) {
								arr.push(
									moment(new Date(this.$store.getters["oa/MemberInfoAttendanceData"].StartDate))
										.add(add, "day")
										.format("YYYY-MM-DD")
								);
								add++;
							} else {
								arr.push("");
							}
						}
					} else {
						for (let n = 1; n <= 7; n++) {
							if (TotalDays === add) {
								break;
							}
							arr.push(
								moment(new Date(this.$store.getters["oa/MemberInfoAttendanceData"].StartDate))
									.add(add, "day")
									.format("YYYY-MM-DD")
							);
							add++;
						}
					}
					tabelData.push(arr);
				}
				this.punchRecordDate = null;
				this.punchRecord = null;
				return tabelData;
			}
		}
		get userId() {
			return this.Index.userId;
		}
		is_today(date) {
			let delta, is_today;
			if (!this.punchRecordDate) {
				delta = Date.now() - new Date(date).getTime();
				is_today = delta > 0 && delta < 86400000;
				is_today && this.query(date);
			} else {
				return this.punchRecordDate === date;
			}
			return is_today;
		}
		isBlue(date) {
      console.log(date)
			if (this.dates.indexOf(date) !== -1) return true;
			return false;
		}
		columns: {
			label: string;
			prop: string;
		}[] = [
			{ label: "星期一", prop: "monday" },
			{ label: "星期二", prop: "tuesday" },
			{ label: "星期三", prop: "wednesday" },
			{ label: "星期四", prop: "thursday" },
			{ label: "星期五", prop: "friday" },
			{ label: "星期六", prop: "saturday" },
			{ label: "星期日", prop: "sunday" }
		];
		index_map = (() => {
			let map = {};
			this.columns.forEach((element, index) => {
				map[element.label] = index;
			});
			return map;
		})();
		async query(row, column?, cell?, event?) {
			let date;
			if (typeof row === "string") {
				date = row;
			} else {
				let index = this.index_map[column.label];
				date = row[index];
			}
			if (date) {
				let res = await this.$store.dispatch("oa/attendanceQueryPunchRecord", {
					userId: this.userId,
					date
				});
				this.punchRecord = res;
				this.punchRecordDate = date;
			}
		}
		startDate: string = "";

		@Watch("startDate")
		async onstartDateChange(val: string, oldVal: string) {
			let lastday = moment(new Date(this.$store.getters["oa/MemberInfoAttendanceData"].StartDate))
				.add(this.$store.getters["oa/MemberInfoAttendanceData"].LastDate - 1, "day")
				.format("YYYY-MM-DD");
			await this.attendanceQueryByDate(val, lastday);
		}
		dates: any[] = [];
		attendanceQueryByDate(startTime: string, endTime: string) {
			return this.$store.state.$post("/attendance/queryByDate", { startTime, endTime }).then(
				(res: {
					code: number;
					message: string;
					data: {
						dataWeekWorkList: {
							id: number; // 主键ID
							leaveInLieuDate: string; // 休息日日期
							isNewYear: number; // 是否是春节
							times: number; // 工资倍数
							remark: string; // 备注
						}[];
					};
				}) => {
					if (res.code === 200) {
						this.dates = res.data.dataWeekWorkList.map(item => {
							return item.leaveInLieuDate;
						});
					} else {
						this.$store.state.$notify.error(res.message);
					}
				}
			);
		}
		punchRecordDate = null;
		punchRecord = null;
	}
</script>

<style lang="scss">
	.oa .member-info .attendance .calendar {
		.item {
			height: 100px;
			cursor: pointer;
			padding: 0 !important;

				.blue {
					background: #e9f4fa;
				}

			.cell {
				width: 100%;
				height: 100%;
				padding: 0 !important;
			}
			.wrapper {
				display: flex;
				justify-content: center;
				width: 100%;
				height: 100%;
				padding: 0 !important;
				align-items: center;
				flex-direction: column;
				&.cur {
					background: #ffebeb;
				}
			}
		}
		th.item {
			height: 60px;
			.cell {
				line-height: 60px;
			}
		}
		.punch-record-item {
			display: inline-block;
			margin-left: 16px;
			background: #000;
			padding: 0 8px;
			border-radius: 8px;
			color: #fff;
			line-height: 20px;
			margin-top: 10px;
			&.first-child {
				background: #468877;
			}
			&.last-child {
				background: #f89401;
			}
		}
	}
</style>

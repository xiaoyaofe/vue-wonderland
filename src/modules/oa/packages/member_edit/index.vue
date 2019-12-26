<template>
	<el-row type="flex" justify="space-around" class="oa-member-edit">
		<div class="department-list">
			<el-row type="flex">
				<el-select v-if="store.department_list" v-model="selectFilter" multiple filterable :filter-method="departmentSelectFilter" size="mini" style="width:100%;margin: 0 0 10px 0;">
					<el-option v-for="item in filterList" :key="item.key" :label="item.label" :value="item.value" />
				</el-select>
			</el-row>

			<el-tree ref="departmentTree" v-if="store.department_list" node-key="id" :data="store.department_list" :current-node-key="store.currentNodeKey" :props="{ children: 'children', label: 'name' }" :default-expanded-keys="[store.currentNodeKey]" @node-click="nodeClick" @current-change="currentChange">
				<span class="tree-node" slot-scope="{ node }">
					<img class="icon-folder-blue" :src="require(`src/assets/oa/icon-folder-blue.png`)" />
					<span>{{ node.label }}</span>
				</span>
			</el-tree>
			<div v-if="!user_all" class="department-list-cover"></div>
		</div>
		<div v-if="!edit_user" class="user-list">
			<div v-if="user_all.length">
				<el-row type="flex" justify="space-between" style="width:100%; margin: 0 0 10px 0;">
					<el-button type="primary" icon="el-icon-caret-left" size="mini" :style="`padding: 4px 8px; visibility: ${availableLeaveTableData.length ? 'visible' : 'hidden'}`" @click="availableLeaveTableData = []">
						返回
					</el-button>
					<el-button v-if="availableLeaveTableData.length" type="primary" icon="el-icon-download" size="mini" style="padding: 4px 8px;" @click="exportExcel">
						表格下载
					</el-button>
					<el-button v-else type="primary" icon="el-icon-search" size="mini" style="padding: 4px 8px;" @click="queryAnnualVacation">
						年假查询
					</el-button>
				</el-row>
				<div v-show="availableLeaveTableData.length">
					<el-table :data="availableLeaveTableData" border size="small">
						<el-table-column prop="userId" label="ID" width="163"> </el-table-column>
						<el-table-column prop="userId" label="姓名" width="163" :formatter="el_table_column_formatter"> </el-table-column>
						<el-table-column prop="availableAnnualLeave" label="年假可用天数" width="150" :formatter="availableAnnualLeaveFormatter"> </el-table-column>
						<el-table-column prop="endTime" label="年假清空时间" width="163"> </el-table-column>
					</el-table>
				</div>
				<div v-show="!availableLeaveTableData.length">
					<!-- || store.userListFilter || store.userList -->
					<el-table style="width: 721px;" :data="userList" border size="small" row-class-name="user-list-row" header-row-class-name="user-list-header" @cell-mouse-enter="userCellEnter" @cell-mouse-leave="userCellLeave" @cell-dblclick="userCellDbClick">
						<el-table-column prop="name" label="姓名" width="130" />
						<el-table-column prop="alias" label="别名" width="160">
							<template slot slot-scope="{ row }">
								{{ row.alias || "无" }}
							</template>
						</el-table-column>
						<el-table-column prop="department" label="部门" width="190" :formatter="tableDepartmentFormatter" />
						<el-table-column prop="position" label="职位" width="190" :formatter="tablePositionFormatter" />
						<el-table-column prop="more" width="50" header-align="center">
							<template slot="header" slot-scope>
								<i class="el-icon-document"></i>
							</template>
							<template slot slot-scope>
								<el-row type="flex" justify="center">
									<i class="el-icon-more"></i>
								</el-row>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<div v-else-if="edit_user" class="user-detail">
			<!-- <el-row class="user-detail-title">
        编辑成员信息
      </el-row>

      <el-row class="user-detail-operation-bar">
        <el-button size="mini" type="primary" icon="el-icon-success" @click="save">
          保存
        </el-button>
        <el-button @click="edit_user = ''" size="mini" icon="el-icon-error">
          取消
        </el-button>
      </el-row> -->

			<el-row type="flex" align="middle" class="user-detail-user-box">
				<el-col class="user-detail-avatar">
					<img :src="edit_user.avatar || require('src/assets/oa/rg.png')" />
				</el-col>
				<el-col class="user-detail-user">
					<el-row class="user-detail-user-txt">
						<span style="margin-right:10px">姓名：</span>
						{{ edit_user.name }}
					</el-row>
					<el-row class="user-detail-user-txt">
						<span style="margin-right:10px">别名：</span>
						<!-- {{ edit_user.userid }} -->
					</el-row>
				</el-col>
			</el-row>

			<el-row class="user-detail-user-set">
				<member-edit-item>
					<template slot="left">
						工号：
					</template>
					<template slot="right">
						<span v-if="employeeNumberEditing">
							<el-input size="mini" style="width:100px" v-model="edit_user.employeeNumber"></el-input>
						</span>
						<span v-else>{{ edit_user.employeeNumber }}</span>
						<div style="margin: 0 15px">
							<div v-if="!employeeNumberEditing">
								<el-button type="primary" icon="el-icon-edit" size="mini" style="padding: 4px 8px" @click="employeeNumberEditing = true"></el-button>
							</div>

							<div v-else>
								<el-button type="primary" size="mini" style="padding: 4px 8px" @click="confirm">确认</el-button>
								<el-button type="primary" size="mini" style="padding: 4px 8px" @click="cancel">取消</el-button>
							</div>
						</div>
					</template>
				</member-edit-item>
				<member-edit-item>
					<template slot="left">
						成员状态：
					</template>
					<template slot="right">
						<span>{{ userStatusMap[edit_user.userStatus] }}</span>
						<el-dropdown trigger="click" style="margin: 0 15px" placement="right" @command="changeMemberStatus">
							<el-button type="primary" icon="el-icon-edit" size="mini" style="padding: 4px 8px"></el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="(label, index) in userStatusMap" :command="index" :key="index">{{ label }} </el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</member-edit-item>
				<member-edit-item>
					<template slot="left">
						入职日期：
					</template>
					<template slot="right">
						<span>{{ edit_user.entryDate || defaultDate }}</span>
						<div class="enrollment-date-edit-button">
							<el-button type="primary" icon="el-icon-edit" size="mini" style="padding: 4px 8px;margin: 0 15px" @click="willChangeDate.call(this, 'entryDate')"> </el-button>
							<el-date-picker class="enrollment-date-picker" v-model="edit_user.entryDate" type="date" ref="entryDate" value-format="yyyy-MM-dd"> </el-date-picker>
						</div>
					</template>
				</member-edit-item>
				<member-edit-item v-if="edit_user.userStatus >= 2">
					<template slot="left">
						转正日期：
					</template>
					<template slot="right">
						<span>{{ edit_user.correctionDate || defaultDate }}</span>
						<div class="formal-date-edit-button">
							<el-button type="primary" icon="el-icon-edit" size="mini" style="padding: 4px 8px;margin: 0 15px" @click="willChangeDate.call(this, 'correctionDate')"> </el-button>
							<el-date-picker class="formal-date-picker" v-model="edit_user.correctionDate" type="date" ref="correctionDate" value-format="yyyy-MM-dd"> </el-date-picker>
						</div>
					</template>
				</member-edit-item>
				<member-edit-item v-if="edit_user.userStatus === 3">
					<template slot="left">
						离职日期：
					</template>
					<template slot="right">
						<span>{{ edit_user.eparationDate || defaultDate }}</span>
						<div class="resign-date-edit-button">
							<el-button type="primary" icon="el-icon-edit" size="mini" style="padding: 4px 8px;margin: 0 15px" @click="willChangeDate.call(this, 'eparationDate')"> </el-button>
							<el-date-picker class="resign-date-picker" v-model="edit_user.eparationDate" type="date" ref="eparationDate" value-format="yyyy-MM-dd"> </el-date-picker>
						</div>
					</template>
				</member-edit-item>
				<member-edit-item>
					<template slot="left">
						新签合同时间：
					</template>
					<template slot="right">
						<span>{{ edit_user.newContractDate || defaultDate }}</span>
						<div class="resign-date-edit-button">
							<el-button type="primary" icon="el-icon-edit" size="mini" style="padding: 4px 8px;margin: 0 15px" @click="willChangeDate.call(this, 'newContractDate')"> </el-button>
							<el-date-picker class="resign-date-picker" v-model="edit_user.newContractDate" type="date" ref="newContractDate" value-format="yyyy-MM-dd"> </el-date-picker>
						</div>
					</template>
				</member-edit-item>
				<member-edit-item>
					<template slot="left">
						合同到期时间：
					</template>
					<template slot="right">
						<span>{{ edit_user.contractExpirationDate || defaultDate }}</span>
						<div class="resign-date-edit-button">
							<el-button type="primary" icon="el-icon-edit" size="mini" style="padding: 4px 8px;margin: 0 15px" @click="willChangeDate.call(this, 'contractExpirationDate')"> </el-button>
							<el-date-picker class="resign-date-picker" v-model="edit_user.contractExpirationDate" type="date" ref="contractExpirationDate" value-format="yyyy-MM-dd"> </el-date-picker>
						</div>
					</template>
				</member-edit-item>

				<member-edit-item>
					<template slot="left">
						调休：
					</template>
					<template slot="right">
						<div style="flex-direction: row;align-items: center;" class="leave-container" v-if="edit_user && edit_user.leaveInfo">
							<span>{{ $hourCalculate(edit_user.availableLeaveInLieu + extraLieu) }}</span>

							<el-dropdown trigger="click" size="mini" placement="right" :hide-on-click="false">
								<el-button type="primary" icon="el-icon-edit" size="mini" style="padding: 4px 8px; margin-left: 15px;"></el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item style="width:400px">
										<el-slider v-model="extraLieu" :max="50" :min="-Math.ceil(edit_user.availableLeaveInLieu)" show-input class="annual-vacation-slider"></el-slider>
										<br />
										<el-input type="text" placeholder="请输入调休的备注" v-model="extraLieuRemark" maxlength="30" show-word-limit clearable> </el-input>
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
						<div v-else>空</div>
					</template>
				</member-edit-item>

				<member-edit-item>
					<template slot="left">
						年假：
					</template>
					<template slot="right">
						<div class="leave-container" v-if="edit_user && edit_user.leaveDetailInfo.produceDetailInfoList.length">
							<div
								class="leave-container-item"
								v-for="(item, index) in edit_user.leaveDetailInfo.produceDetailInfoList.filter(item => {
									return new Date(item.expireDate) > new Date();
								})"
								:key="item.id"
							>
								<span>{{ $hourCalculate(item.availableLeave + (extraLeave[item.id + "," + index] || 0)) }} （到期时间：{{ item.expireDate }}）</span>
								<el-dropdown trigger="click" size="mini" placement="right" :hide-on-click="false">
									<el-button type="primary" icon="el-icon-edit" size="mini" style="padding: 4px 8px; margin-left: 15px;"></el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item style="width:400px">
											<el-slider v-model="extraLeave[item.id + ',' + index]" :max="50" :min="-Math.ceil(item.availableLeave)" show-input class="annual-vacation-slider"></el-slider>
											<br />
											<el-input type="text" placeholder="请输入年假的备注" v-model="extraLeaveRemark" maxlength="30" show-word-limit clearable> </el-input>
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
						<div v-else>空</div>
					</template>
				</member-edit-item>
			</el-row>

			<el-row class="user-detail-operation-bar">
				<el-button size="mini" type="primary" icon="el-icon-success" @click="save">
					保存
				</el-button>
				<el-button @click="edit_user = ''" size="mini" icon="el-icon-error">
					取消
				</el-button>
			</el-row>
		</div>
	</el-row>
</template>
 
<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import { OA as Const } from "apollo-server/utils/const";
	import { get_parameter_by_name } from "src/utils/fns";
	import { OA, APOLLO } from "types";
	import gql from "graphql-tag";
	import MemberEditItem from "./item/index.vue";
	import { Notification } from "element-ui";
	import { Vuex } from "../../../../../types/vuex";

	let sql = require("src/graphql/oa.gql");
	let departmentIdMap: {
		[key: string]: OA.DEPARTMENT.Department;
	} = {};
	let departmentParentIdMap: {
		[key: string]: {
			departmentId: OA.DEPARTMENT.DepartmentId;
			order: number;
		}[];
	} = {};
	let userMap: {
		[key: string]: OA.USER.User;
	} = {};
	let userListMap: {
		[key: string]: OA.USER.User[];
	} = {};

	@Component<MemberEdit>({
		created() {
			this.getDepartmentList(this.$state.department_list);
		},
		components: {
			"member-edit-item": MemberEditItem
		}
	})
	export default class MemberEdit extends Vue {
		get user_all() {
			return this.$state.user_all;
		}
		defaultDate = "1970-01-01";
		userStatusMap: string[] = ["实习生", "试用期", "正式员工", "离职员工"];
		/** this data store */
		store = {} as {
			accessToken: string;
			department_list: OA.DEPARTMENT.DepartmentTreeDataItem[];
			userList: OA.USER.User[];
			userListFilter: OA.USER.User[];
			currentNodeKey: number;
			treeNodeState: {
				last: number;
				current: number;
			};
		};
		editable_user: boolean = false;
		/** 额外年假天数 */
		extraLeave: any = {};
		extraLieu: any = 0;
		extraLieuRemark: string = "";
		extraLeaveRemark: string = "";
		selectFilter: any[] = [];
		filterList: any[] = [];
		/** 年假（多人） */
		availableLeaveTableData: any[] = [];
		employeeNumberEditing: boolean = false;

		get department_map() {
			return this.$getter.department_map;
		}

		get userList() {
			const ids = this.get_user_list_department_id();
			if (this.currentNode.length && this.user_all.length) {
				const filter = this.user_all.filter((item: any) => {
					let boolean = false;

					try {
						if (ids.includes(item.userid)) {
							boolean = true;
						} else {
							let len = item.department.length;
							for (let index = 0; index < len; index++) {
								let id = item.department[index];
								if (ids.includes(id)) {
									boolean = true;
									break;
								}
							}
						}
					} catch (error) {
						console.error("11111");
					}

					return boolean;
				});
				return filter;
			}
			return [];
		}

		get_user_list_department_id(list?) {
			if (this.selectFilter.length) {
				return (list || this.selectFilter)
					.map(id => {
						if (typeof id === "number") {
							if (this.department_map.parent.hasOwnProperty(id)) {
								return [id].concat(this.get_user_list_department_id(this.department_map.parent[id]).flat());
							} else {
								return id;
							}
						} else {
							return id;
						}
					})
					.flat();
			} else {
				return (list || this.currentNode)
					.map(item => {
						if (item.children) {
							return [item.id].concat(this.get_user_list_department_id(item.children).flat());
						} else {
							return item.id;
						}
					})
					.flat();
			}
		}

		bl1(department_list: OA.DEPARTMENT.DepartmentTreeDataItem[], filterValue, filterList) {
			department_list.forEach(department => {
				if (department.children) {
					if (department.name.indexOf(filterValue) !== -1) {
						filterList.push({
							key: department.id,
							label: department.name,
							value: department.id
						});
					}
					this.bl1(department.children, filterValue, filterList);
				} else {
					if (department.name.indexOf(filterValue) !== -1) {
						filterList.push({
							key: department.id,
							label: department.name,
							value: department.id
						});
					}
				}
			});
		}

		bl2(filterValue, filterList) {
			try {
				for (let name in this.$store.state.oa.userList) {
					let user = this.$store.state.oa.userList[name];
					if (user.name.indexOf(filterValue) !== -1 || user.userid.indexOf(filterValue) !== -1) {
						filterList.push({
							key: user.userid,
							label: user.name,
							value: user.userid
						});
					}
				}
			} catch (error) {
				console.error("22222");
			}
		}

		async queryAnnualVacation() {
			let users = this.userList.map(item => item.userid).join(",");
			let res = await this.$store.dispatch("oa/fetchLeave", {
				action: "leaveInfoList",
				userIds: users
			});
			this.availableLeaveTableData = res.data.leaveInfoList;
		}

		el_table_column_formatter(row, column, cellValue, index) {
			return userMap[cellValue] ? userMap[cellValue].name : cellValue;
		}

		availableAnnualLeaveFormatter(row, column, cellValue, index) {
			return this["$hourCalculate"](row["availableAnnualLeave"]);
		}

		departmentSelectFilter(filterValue) {
			if (filterValue) {
				let filterList = [];
				let userList: OA.USER.User[];
				this.bl1(this.store.department_list as any, filterValue, filterList);
				this.bl2(filterValue, filterList);
				this.filterList = filterList;
			} else {
				this.filterList = [];
			}
		}

		willChangeDate(component) {
			this.$refs[component]["showPicker"]();
		}

		changeMemberStatus(type) {
			this.edit_user.userStatus = type;
		}

		nodeClick(data: OA.DEPARTMENT.DepartmentTreeDataItem, node, com) {
			this.currentNode = [data];
			if (data.children) {
				if (this.store.treeNodeState.last !== this.store.treeNodeState.current) {
					node["expanded"] = !node["expanded"];
					return node;
				}
			}
		}
		getDepartmentIdByOrder(departmentId: number) {
			if (this.department_map.parent.hasOwnProperty(departmentId)) {
				return this.department_map.parent[departmentId].map(({ departmentId }) => {
					let children = this.getDepartmentIdByOrder(departmentId);
					return children === departmentId
						? {
								departmentId
						  }
						: {
								departmentId,
								children
						  };
				});
			} else {
				return departmentId;
			}
		}

		currentChange(data: OA.DEPARTMENT.DepartmentTreeDataItem, node) {
			this.store.treeNodeState.last = this.store.treeNodeState.current;
			this.store.treeNodeState.current = data.id;
		}
		getDepartmentList(res: OA.DEPARTMENT.Department[]) {
			const dataParse = (departmentId): OA.DEPARTMENT.DepartmentTreeDataItem => {
				if (this.department_map.parent.hasOwnProperty(departmentId)) {
					return Object.assign(this.department_map.id[departmentId], {
						children: this.department_map.parent[departmentId].map(function({ departmentId }) {
							return dataParse(departmentId);
						})
					});
				} else {
					return this.department_map.id[departmentId];
				}
			};
			const department_list: any[] = this.department_map.parent[this.department_map.parent[0][0].departmentId]
				.filter((item, index) => index !== 1)
				.map(item => {
					return dataParse(item.departmentId);
				});
			if (department_list.length) {
				this.$set(this.store, "department_list", department_list);
				this.store.currentNodeKey = department_list[0].id;
				this.currentNode = department_list;
				this.store.treeNodeState = {
					last: -1,
					current: this.store.currentNodeKey
				};
			}
		}

		currentNode = [] as any;

		tableDepartmentFormatter(row: OA.USER.User, column, cellValue, index) {
			return this.department_map.id[row.department[0]].name;
		}

		tablePositionFormatter(row: OA.USER.User, column, cellValue, index) {
			return row.position || "无";
		}
		userCellEnter(row, column, cell, event) {
			if (column.property === "more") {
				this.editable_user = true;
				cell.classList.add("user-list-more");
			}
		}
		userCellLeave(row, column, cell, event) {
			if (column.property === "more") {
				this.editable_user = false;
				cell.classList.remove("user-list-more");
			}
		}

		/** 用户信息 */
		user_info: Vuex.OA.Response.user = "" as any;
		/** 编辑状态中的用户信息 */
		edit_user: Vuex.OA.Response.user = "" as any;

		async userCellDbClick(row: OA.USER.User, column, cell, event) {
			if (this.editable_user) {
				const user_info = await this.$dispatch.user({
					UserId: row.userid
				});
				this.user_info = Object.assign({}, user_info);
				this.edit_user = Object.assign({}, user_info);
			}
		}

		tableToExcel = (() => {
			var uri = "data:application/vnd.ms-excel;base64,",
				template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
				base64 = function(s) {
					return window.btoa(unescape(encodeURIComponent(s)));
				},
				format = function(s, c) {
					return s.replace(/{(\w+)}/g, function(m, p) {
						return c[p];
					});
				};
			var dlink = document.createElement("a");
			dlink.id = "dlink";
			dlink.style.display = "none";
			document.body.appendChild(dlink);

			return function(table, name, filename) {
				var ctx = {
					worksheet: name || "Worksheet",
					table: table.innerHTML
				};
				dlink.href = uri + base64(format(template, ctx));
				dlink.download = filename;
				dlink.click();
			};
		})();

		exportExcel() {
			var thead: string = (document.querySelector(".el-table__header thead") as HTMLBodyElement).innerHTML;
			var tbody: string = (document.querySelector(".el-table__body tbody") as HTMLBodyElement).innerHTML;
			var table = document.createElement("table");
			table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`;
			this.tableToExcel(table, false, Date.now() + ".xls");
		}

		async cancel() {
			this.employeeNumberEditing = false;
			this.edit_user.employeeNumber = this.user_info.employeeNumber;
		}

		async confirm() {
			this.employeeNumberEditing = false;
			this.user_info.employeeNumber = this.edit_user.employeeNumber;
		}

		async save() {
			Promise.all(
				Object.keys(this.extraLeave).map(str => {
					let item = str.split(",");
					let id = item[0];
					let index = item[1];
					let extraLeave = this.extraLeave[str];
					return extraLeave
						? new Promise(resolve => {
								this.$store
									.dispatch("oa/update", {
										action: "leave",
										userId: this.edit_user.userid,
										id: id,
										type: 2,
										extraLeaveType: extraLeave > 0 ? 1 : 2,
                    extraLeave: Math.abs(extraLeave),
                    remark:this.extraLeaveRemark
									})
									.then(res => {
										if (res.code === 200) {
											resolve({
												str,
												id,
												msg: res.message
											});
										}
									});
						  })
						: new Promise(resolve => {
								resolve();
						  });
				})
			).then(res => {
				let hasNotification = false;
				for (let i = 0; i < res.length; i++) {
					let item: any = res[i];
					if (item) {
						this.edit_user.leaveDetailInfo.produceDetailInfoList.forEach((info, index, array) => {
							if (info.id == item.id) {
								array[index].availableLeave = array[index].availableLeave + this.extraLeave[item.str];
							}
						});
						this.extraLeave[item.str] = 0;
						if (!hasNotification) {
							Notification.success(item.msg);
							hasNotification = true;
						}
					}
				}
				this.$commit.user({
					UserId: this.edit_user.userid,
					data: this.edit_user
				});
			});

			this.extraLieu &&
				this.$store
					.dispatch("oa/update", {
						action: "leave",

						userId: this.edit_user.userid,
						type: 1,
						extraLeaveType: this.extraLieu > 0 ? 1 : 2,
            extraLeave: Math.abs(this.extraLieu),
              remark:this.extraLieuRemark
					})
					.then(res => {
						if (res.code === 200) {
							this.edit_user["availableLeaveInLieu"] += this.extraLieu;
							this.extraLieu = 0;
						}
					});

			this.$store
				.dispatch("oa/update", {
					action: "user",
					id: this.edit_user.id,
					employeeNumber: this.edit_user["employeeNumber"],
					userStatus: this.edit_user["userStatus"],
					entryDate: this.edit_user.entryDate || this.defaultDate,
					correctionDate: this.edit_user["correctionDate"] || this.defaultDate,
					eparationDate: this.edit_user["eparationDate"] || this.defaultDate,
					newContractDate: this.edit_user["newContractDate"] || this.defaultDate,
					contractExpirationDate: this.edit_user["contractExpirationDate"] || this.defaultDate
				})
				.then(res => {
					if (res.code === 200) {
						this.$commit.user({
							UserId: this.edit_user.userid,
							data: this.edit_user
						});
						Notification.success(res.message);
					} else {
						Notification.error(res.message);
					}
				});
		}
	}
</script>

<style lang="scss">
	$oa_user_management_width: 1200px;
	$department_list_width: 260px;
	$user_list_width: $oa_user_management_width - $department_list_width - 100;
	.oa-member-edit {
		width: $oa_user_management_width;
		.department-list {
			position: relative;
			width: $department_list_width;
			margin-left: -10px;
		}
		.department-list-cover {
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
		}

		.user-list,
		.user-detail {
			width: $user_list_width;
		}

		.user-list-row {
			font-size: 14px;
		}
		.user-list-header {
			font-size: 14px;
			letter-spacing: 4px;
		}
		.user-list-more {
			cursor: pointer;
			color: #fff;
			background: #4a77ac !important;
		}

		/** .user-detail */
		.user-detail-title {
			font-size: 16px;
			margin: 8px 0;
		}
		.user-detail-operation-bar {
			padding: 8px 10px;
			background: #dfe9f5;
		}
		.user-detail-user-box {
			margin: 20px 0 0 10px;
			padding: 0 0 10px 0;
			border-bottom: 1px dashed #e4e6e9;
		}
		.user-detail-avatar {
			width: 60px;
			height: 60px;
			border: 1px solid rgba(0, 0, 0, 0.1);
			img {
				width: 100%;
				height: 100%;
			}
		}
		.user-detail-user {
			width: 400px;
		}
		.user-detail-user-txt {
			font-size: 14px;
			padding: 0 16px;
		}
		.user-detail-user-set {
			margin: 10px 0;
		}
		.enrollment-date-edit-button,
		.formal-date-edit-button,
		.resign-date-edit-button {
			position: relative;
		}
		.enrollment-date-picker,
		.formal-date-picker,
		.resign-date-picker {
			top: -50px;
			left: 60px;
			position: absolute;
			visibility: hidden;
		}
		/** .user-detail */
		.tree-node {
			font-size: 14px;
			// font-family: Arial "Microsoft Yahei";
		}
		.el-tree-node__expand-icon {
			font-size: 18px;
		}
		.el-tree-node__content {
			height: 32px;
		}
		.el-tree-node__content:hover {
			background: #edf1f5 !important;
		}
		.el-tree-node.is-current {
			> .el-tree-node__content {
				background: #4a77ac !important;
				color: #fff;
			}
		}
		.icon-folder-blue {
			padding: 0 10px 0 2px;
		}
		.leave-detail {
			display: flex;
			font-size: 12px;
			color: #a77474;
			margin: -10px 0 40px 50px;
			.leave-detail-item {
				line-height: 28px;
			}
		}
		.leave-container {
			display: flex;
			flex-direction: column;
			.leave-container-item {
				margin: 0 0 8px 0;
				&:last-of-type {
					margin: 0;
				}
			}
		}
		.el-icon-circle-plus-outline,
		.el-icon-remove-outline {
			font-size: 19px;
			cursor: pointer;
			position: relative;
			top: 1px;
		}
	}
	.el-slider[role="slider"] {
		.el-slider__bar {
			background-color: transparent;
		}
	}
</style>

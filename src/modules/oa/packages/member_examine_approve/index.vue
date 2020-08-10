<template>
  <el-row type="flex" class="oa-member-examine-approve">
    <el-col class="examine-approve-list-container">
      <el-input v-model="search_model" class="search-input" :size="input_size" clearable :placeholder="text.search" :disabled="detail.title ? true : false" />
      <div @click="menu_handler.call(this, index)" :class="`item${cur_menu.title === item.title ? ' active' : ''}`" v-for="(item, index) in menu_list" :key="item.title">
        <div v-if="filter_search_model.call(this, item.title + '')">
          <el-button :size="input_size" class="item item-tag" :disabled="detail.title ? true : false">
            {{ item.title }}
          </el-button>
        </div>
      </div>
    </el-col>
    <el-col class="examine-approve-form-container">
      <div class="examine-approve-form-title">
        <el-row type="flex" align="middle" v-if="detail.title">
          <div class="tag" style="margin: 0 10px;">/</div>
          <div class="relative">
            <div class="underline"></div>
            <div class="tag pointer" @click="into_detail.call(this, '')">{{ cur_menu.title }}</div>
          </div>
          <div class="tag" style="margin: 0 10px;">/</div>
          <div class="tag">{{ detail.title }}</div>
        </el-row>
        <el-row type="flex" v-else class="tag">{{ cur_menu.title }}</el-row>
      </div>
      <component v-if="detail.title" :is="detail.component" :detail="detail" @success="into_detail.call(this, '')" />
      <component v-else :is="require(`./${cur_menu.component}.vue`).default" :item_list="item_list" @success="menu_handler" @detail="into_detail" />
    </el-col>
  </el-row>
</template>

 
<script lang="ts">
declare type MenuItem = {
  title: string;
  component: string;
  type?: number;
};
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component<MemberExamineApprove>({
  created() {
    this.get_menu_list();
  }
})
export default class MemberExamineApprove extends Vue {
  static text = {
    zh: {
      /** 标签搜索 */
      search: "标签搜索",
      /** 请休假申请 */
      leave: "请休假申请",
      /** 加班申请 */
      overtime: "加班申请",
      /** 补签申请 */
      attendance: "补签申请",
      /** 入职申请 */
      admission: "入职申请",
      /** 离职申请 */
      dismission: "离职申请",
      /** 出差申请 */
      business: "出差申请",
      /** 人员需求申请 */
      demand: "人员需求申请",
      /** 采购申请 */
      purchase: "采购申请",
      /** 新旧电脑置换 */
      displace: "新旧电脑置换申请",
      /** 名片制作申请 */
      card: "名片制作申请",
      /** 固定资产处置申请表 */
      assets: "固定资产处置申请表",
      /** 用印申请 */
      printed: "用印申请",
      /** 文印资质借用申请 */
      printed_qualification: "文印资质借用申请",
      /** 劳动合同续签申请 */
      labor_contract_renewal: "劳动合同续签申请",
      /** 我的工作 */
      works: "我的工作",
      /** 审批流程配置 */
      configs: "审批流程配置",
      /** 付款申请 */
      pay: "付款申请"
    }
  };
  static menu_items: MenuItem[] = [
    {
      // 补签申请
      title: MemberExamineApprove.text[Vue.prototype.$language].attendance,
      component: "_attendance",
      type: 1
    },
    {
      // 加班申请
      title: MemberExamineApprove.text[Vue.prototype.$language].overtime,
      component: "_overtime",
      type: 2
    },
    {
      // 请休假申请
      title: MemberExamineApprove.text[Vue.prototype.$language].leave,
      component: "_leave",
      type: 3
    },
    {
      // 新员工入职申请
      title: MemberExamineApprove.text[Vue.prototype.$language].admission,
      component: "_admission",
      type: 4
    },
    {
      // 离职申请
      title: MemberExamineApprove.text[Vue.prototype.$language].dismission,
      component: "_dismission",
      type: 5
    },
    {
      // 人员需求申请
      title: MemberExamineApprove.text[Vue.prototype.$language].demand,
      component: "_demand",
      type: 6
    },
    {
      // 出差申请
      title: MemberExamineApprove.text[Vue.prototype.$language].business,
      component: "_business",
      type: 7
    },
    {
      // 采购申请
      title: MemberExamineApprove.text[Vue.prototype.$language].purchase,
      component: "_purchase",
      type: 8
    },
    {
      // 新旧电脑置换
      title: MemberExamineApprove.text[Vue.prototype.$language].displace,
      component: "_displace",
      type: 9
    },
    {
      // 名片制作申请
      title: MemberExamineApprove.text[Vue.prototype.$language].card,
      component: "_card",
      type: 10
    },
    {
      // 固定资产处置申请表
      title: MemberExamineApprove.text[Vue.prototype.$language].assets,
      component: "_assets",
      type: 11
    },
    {
      // 用印申请
      title: MemberExamineApprove.text[Vue.prototype.$language].printed,
      component: "_printed",
      type: 12
    },
    {
      // 文印资质借用申请
      title: MemberExamineApprove.text[Vue.prototype.$language].printed_qualification,
      component: "_printed_qualification",
      type: 13
    },
    {
      // 劳动合同续签申请
      title: MemberExamineApprove.text[Vue.prototype.$language].labor_contract_renewal,
      component: "_labor_contract_renewal",
      type: 14
    },
    {
       // 劳动合同续签申请
      title: MemberExamineApprove.text[Vue.prototype.$language].pay,
      component: "_pay",
      type: 15
    }
  ];
  private input_size = "small";
  private get text() {
    return MemberExamineApprove.text[this.$language];
  }
  private get cur_menu() {
    return this.menu_list[this.menu_index];
  }
  private menu_index = 0;
  private menu_list: MenuItem[] = [];
  private search_model = "";
  private item_list = MemberExamineApprove.menu_items;
  private detail = "";
  private get_menu_list() {
    this.menu_list = [
      {
        title: this.text.works,
        component: "_works"
      },
      ...this.item_list
    ];
    // this.$state.user_permission &&
    //   this.$state.user_permission.permissionLevel >= 15 &&
    //   this.menu_list.push({
    //     title: this.text.configs,
    //     component: "_configs"
    //   });
  }
  private menu_handler(index) {
    this.menu_index = index;
  }
  private filter_search_model(title) {
    return !this.search_model
      .split(" ")
      .map(search => title.includes(search))
      .includes(false);
  }
  private into_detail(detail) {
    this.detail = detail;
  }
}
</script>

<style lang="scss">
.oa-member-examine-approve {
  .examine-approve-list-container {
    flex-shrink: 1;
    .search-input {
      margin: 10px 0;
    }
    .item {
      cursor: pointer;
      float: left;
    }
    .item-tag {
      margin: 5px 8px 5px 0;
      padding: 5px 8px;
    }
  }
  .examine-approve-form-container {
    width: 1000px;
    margin-left: 25px;
    .examine-approve-form-title {
      margin: 11px 0 0 3px;
      .tag {
        font-family: "楷体";
        font-size: 22px;
        font-weight: bold;
        margin: 0;
        padding: 0;
      }
      .underline {
        height: 31px;
        position: absolute;
        z-index: -1;
        border-bottom: 2px groove rgba(156, 156, 156, 0.4);
        width: 92%;
        left: 4%;
      }
    }
  }
}
</style>

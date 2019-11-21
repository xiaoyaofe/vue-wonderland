<template>
  <div class="users-select">
    <el-select :size="size" v-model="value" filterable>
      <el-option v-for="item in $state.user_all" :key="item.userid" :label="item.name" :value="item.userid" />
    </el-select>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator";

@Component
export default class UsersSelect extends Vue {
  @Prop({
    default: "small"
  })
  size!: string;
  value = "";
  @Watch("value")
  changed(val) {
    this.$emit("changed", val);
  }
}
</script>

<style lang="scss">
// .users-select {
// }
</style>

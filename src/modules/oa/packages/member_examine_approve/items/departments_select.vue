<template>
  <div class="departments-select">
    <el-select :size="size" v-model="value" filterable>
      <el-option v-for="department in $state.department_list" :key="department.id" :label="department.name" :value="department.id"></el-option>
    </el-select>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator";

@Component
export default class DepartmentsSelect extends Vue {
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
// .departments-select {
// }
</style>

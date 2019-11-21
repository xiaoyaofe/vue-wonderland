<template>
  <el-row
    class="member-edit-item"
    type="flex"
    align="start"
  >
    <span class="left">
      <slot name="left"></slot>
    </span>
    <slot name="right"></slot>
  </el-row>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
export default class MemberEditItem extends Vue {
  name = 'member-edit-item'
}
</script>
<style lang="scss">
.member-edit-item {
  font-size: 14px;
  margin: 16px 0 16px 50px;
  display: flex;
  align-items: center;
  .left {
    width: 98px;
    margin-right: 10px;
  }
}
</style>

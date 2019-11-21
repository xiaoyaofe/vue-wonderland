<template>
  <div class="system-config">
    <div v-if="child">
      <component
        :is="$store.state.oa.SystemConfig.components[child]"
        @back="child=null"
      />
    </div>
    <div v-else>
      常用配置
      <div class="flex">
        <div
          class="item"
          v-for="component in $store.state.oa.SystemConfig.components"
          :key="component.title"
          @click="child=component.$name"
        >
          <img :src="component.icon" />
          <span>{{component.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component<SystemConfig>({})
export default class SystemConfig extends Vue {
  /** 子组件名称 */
  child = null
}
</script>

<style lang="scss">
.oa .system-config {
  width: 1200px;
  .flex {
    display: flex;
    flex-direction: row;
    margin-top: 16px;
  }
  .item {
    cursor: pointer;
    margin: 0 35px 0 5px;
    width: 72px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    img {
      width: 100%;
      height: 40px;
      margin: 3px 0;
    }
  }
}
</style>

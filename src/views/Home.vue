<template>
  <div class="home">
    <img class="logo" :src="require(`src/assets/logo.jpg`)" />
    <component :is="require(`src/components/HelloWorld.vue`).default" :msg="msg" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  msg = "NAVIGATION PAGE";
}
</script>
<style lang="scss">
.home {
  padding-top: 200px;
  text-align: center;
  .logo {
    width: 200px;
    height: 200px;
  }
}
</style>


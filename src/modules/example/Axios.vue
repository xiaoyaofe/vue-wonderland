<template>

</template>


<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  created() {

    this['$http'].post('/oa/user/userInfo', {
      userId: 'shindousaigo'
    }).then(function ({ data }) {
      console.log(data)
    })

    // this['$http'].get('/oa/leave/allInfo', {
    //   userId: 'shindousaigo'
    // }).then(function () {
    //   console.log(arguments)
    // })


  }
})
</script>

<style lang="scss">
</style>



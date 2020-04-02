<template lang="html">
<div class="">
  <p @click="bla('test')">Test</p>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
// import scheduler from 'node-schedule';
//import viewer from 'viewer.vue';

// @Component({
//   components: {
//     viewer
//   }
// })
export default class App extends Vue {
  bla(text:string) {
    console.log(bla)
  }
}
</script>

<style lang="css" scoped>
</style>

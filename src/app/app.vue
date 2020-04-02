<template lang="html">
<div class="">
  <p>Test</p>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import scheduler from 'node-schedule';
import viewer from '@/viewer';

@Component({
  components: {
    viewer
  }
})
export default class App extends Vue {
}
</script>

<style lang="css" scoped>
</style>

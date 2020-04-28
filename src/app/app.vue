<template lang="html">
  <router-view :key="$route.fullPath"/>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
export default class App extends Vue {

}
</script>

<style lang="css" scoped>
</style>

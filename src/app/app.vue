<template lang="html">
  <div class="wrapper" :id="wrapperId">
    <router-view v-model="wrapperId" :key="$route.fullPath"/>
  </div>
</template>

<script>
export default{
  name: 'app',
  data(){
    return{
      wrapperId: 'wrapper'
    }
  }
}
</script>

<style lang="css" scoped>
</style>

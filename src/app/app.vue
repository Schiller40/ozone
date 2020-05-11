<template lang="html">
  <transition :name="transition.name" :mode="transition.mode">
    <router-view v-model="wrapperId" @setTransition="transition = $event"/>
  </transition>
</template>

<script>
export default{
  name: 'app',
  data(){
    return{
      wrapperId: 'wrapper',
      transition: {
        name: 'ozone-setup-screen',
        mode: ''
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>

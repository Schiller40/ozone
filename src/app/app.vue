<template lang="html">
  <div class="wrapper" :id="wrapperId">
    <transition :name="transition.name" :mode="transition.mode">
      <router-view v-model="wrapperId" @setTransition="transition = $event" :key="$route.fullPath"/>
    </transition>
  </div>
</template>

<script>
export default{
  name: 'app',
  data(){
    return{
      wrapperId: 'wrapper',
      transition: {
        name: '',
        mode: ''
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>

<template lang="html">
  <div class="wrapper" :id="wrapperId">
    <InvalidSlideshow v-if="this.$route.params.slideshowId == undefined || this.$route.params.slideshowId == 'nA'"/>
    <transition :name="transition.name" :mode="transition.mode">
      <router-view v-model="wrapperId" @setTransition="transition = $event" :key="$route.fullPath"/>
    </transition>
  </div>
</template>

<script>
import InvalidSlideshow from '@/subpages/InvalidSlideshow.vue'
export default{
  name: 'viewer',
  components: {
    InvalidSlideshow
  },
  data(){
    return{
      wrapperId: 'wrapper',
      transition: {
        name: '',
        mode: ''
      },

      id: this.$route.params.slideshowId
    }
  },
  mounted(){
  }
}
</script>

<style lang="css" scoped>
.wrapper{
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: black;
}
</style>

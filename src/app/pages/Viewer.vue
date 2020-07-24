<template lang="html">
  <div class="wrapper" :id="wrapperId">
    <transition :name="transition.name" :mode="transition.mode">
      <router-view
        v-model="wrapperId"
        @setTransition="transition = $event"
        @showCurrentSlideshow="$emit('showCurrentSlideshow')"
        :key="$route.params.slideshowid || 'nA'"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import InvalidSlideshow from '@/pages/InvalidSlideshow.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Transition } from '../app.vue'

@Component({
  components: {
    InvalidSlideshow
  },
  name: 'viewer'
})
export default class Viewer extends Vue {
  wrapperId = 'wrapper'
  transition: Transition = {
    name: '',
    mode: ''
  }
  id: string = this.$route.params.slideshowid

  mounted() {
    if (!this.id) {
      this.$emit('showCurrentSlideshow')
    }
    //@ts-ignore
    document.addEventListener('keydown', this.listener)
  }

  beforeDestroy() {
    //@ts-ignore
    document.removeEventListener('keydown', this.listener)
  }

  listener(doc: Document, ev: KeyboardEvent) {
    if (ev.key === 'h') {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="css" scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: black;
}
</style>

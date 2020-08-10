<template lang="html">
  <div>
    <transition :name="transition.name" :mode="transition.mode">
      <router-view
        @setTransition="transition = $event"
        :prioritizedId="
          visualStack[visualStack.length - 1] ? visualStack[visualStack.length - 1].id : undefined
        "
      />
    </transition>
  </div>
</template>

<script lang="ts">
// @showCurrentSlideshow="showPrioritizedSlideshow()"
// :key="$route.params.slideshowId"

import { Vue, Component, Prop } from 'vue-property-decorator'
const { ipcRenderer } = window
interface VisualStackElement {
  id: string
  lastModified: number
}
export interface Transition {
  name: string
  mode?: string
}

@Component({
  components: {}
})
export default class app extends Vue {
  transition: Transition = {
    name: 'ozone-setup-screen',
    mode: ''
  }
  visualStack: VisualStackElement[] = []

  mounted() {
    ipcRenderer.on('addToVisualStack', (_event, id, lastModified) => {
      this.addToVisualStack(id, lastModified)
    })
    ipcRenderer.on('removeFromVisualStack', (_event, id) => {
      this.removeFromVisualStack(id)
    })
  }

  addToVisualStack(id: string, lastModified: number) {
    console.log(id)
    console.log(lastModified)
    // console.log(play);
    if (typeof lastModified !== 'number' || typeof id !== 'string' || !id || id.length != 21) {
      console.log('invalid id provided or priority is NaN')
      return false
    }
    this.visualStack = this.visualStack.filter((vse) => vse.id !== id)
    this.visualStack.push({ id, lastModified })
    this.visualStack = this.visualStack.sort((a, b) => (a.lastModified > b.lastModified ? 1 : -1))
    console.log(`added ${id}`)
    console.log(this.visualStack)
    return true
  }

  removeFromVisualStack(id: string) {
    const len = this.visualStack.length
    this.visualStack = this.visualStack.filter((vse) => vse.id !== id)
    console.log(`removed ${id}`)
    console.log(this.visualStack)
    if (len === this.visualStack.length + 1) return true
    return false
  }
}
</script>

<style lang="css" scoped></style>

<template lang="html">
  <div class="">
    <p>Keine oder invalide Präsentations-ID und/oder Foliennummer angegeben!</p>
    <!-- <router-link class="slideshowlink" :key="s" v-for="s in slideshows" :to="'/viewer/' + s" :s="s">{{
      s
    }}</router-link> -->
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component({
  name: 'invalidSlideshow'
})
export default class InvalidSlideshow extends Vue {
  mounted() {
    this.$emit('showCurrentSlideshow')
  }
}
</script>

<style lang="css" scoped>
p {
  color: white;
}

.slideshowlink {
  color: white;
  display: block;
}
</style>

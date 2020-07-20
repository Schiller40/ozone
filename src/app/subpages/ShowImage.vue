<template>
  <img
    :src="``"
    :alt="src"
    :id="`image-${no - 0 + 1}`"
    class="image"
    v-show="loaded"
    @load="loaded = true"
    draggable="false"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
@Component
export default class ShowImage extends Vue {
  @Prop()
  id: string
  @Prop()
  no: number
  @Prop()
  path: string

  loaded: boolean = false

  mounted() {}
}
</script>

<style></style>

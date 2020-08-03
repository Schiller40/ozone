<template>
  <img
    :src="src"
    :alt="src"
    :id="`image-${no + 1}`"
    class="image"
    v-show="loaded"
    @load="loaded = true"
    draggable="false"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "ShowImage",
})
export default class ShowImage extends Vue {
  @Prop({ default: "error" })
  url: string;
  @Prop()
  no: number;
  @Prop()
  id: string;

  loaded: boolean = false;

  get src(): string {
    return this.url.startsWith("http://") ||
      this.url.startsWith("https://") ||
      this.url.startsWith("data:text/plain")
      ? this.src
      : `http://127.0.0.1:5230/transfer/${this.id}/${this.no}/${this.url}`;
  }
}
</script>

<style></style>

<template>
  <iframe
    class="iframe"
    :id="`iframe-${no + 1}`"
    :src="src"
    allowfullscreen
    allow="autoplay"
  ></iframe>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({
  name: "ShowIframe",
})
export default class ShowIframe extends Vue {
  @Prop()
  no: number;
  @Prop({ default: "" })
  url: string;
  @Prop()
  id: string;

  get src(): string {
    return this.url.startsWith("http://") ||
      this.url.startsWith("https://") ||
      this.url.startsWith("data:text/plain")
      ? this.url
      : `http://127.0.0.1:5230/transfer/${this.id}/${this.no}/${this.url}`;
  }
}
</script>

<style></style>
